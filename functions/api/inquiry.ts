type Env = {
  TURNSTILE_SECRET: string;
  RESEND_API_KEY: string;
  MAIL_FROM: string;
  INQUIRY_TO?: string;
};
type Context = { request: Request; env: Env };
const result = (status: number) =>
  Response.json(
    { ok: status === 200 },
    { status, headers: { "Cache-Control": "no-store" } },
  );
const clean = (v: unknown, max: number) =>
  typeof v === "string" && v.trim().length > 0 && v.length <= max;
export async function onRequestPost({ request, env }: Context) {
  const origin = new URL(request.url);
  if (request.headers.get("origin") !== origin.origin) return result(403);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return result(415);
  if (!env.TURNSTILE_SECRET || !env.RESEND_API_KEY || !env.MAIL_FROM)
    return result(503);
  const body = await request.text();
  if (body.length > 14000) return result(413);
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    return result(400);
  }
  if (!data || typeof data !== "object") return result(400);
  const { email, name, message, lang, consent, program, requestId } = data,
    token = data["cf-turnstile-response"];
  if (
    !clean(name, 100) ||
    !clean(message, 2500) ||
    !clean(email, 254) ||
    !/^\S+@[^\s@,;]+\.[^\s@,;]+$/.test(email) ||
    /[\r\n,;]/.test(email) ||
    !["ar", "fr"].includes(lang) ||
    consent !== "on" ||
    typeof program !== "string" ||
    !/^[a-z0-9-]{0,100}$/.test(program) ||
    !clean(token, 2048) ||
    typeof requestId !== "string" ||
    !/^[0-9a-f-]{36}$/i.test(requestId)
  )
    return result(400);
  try {
    const verify = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: new URLSearchParams({
          secret: env.TURNSTILE_SECRET,
          response: token,
        }),
      },
    );
    const check = (await verify.json()) as {
      success: boolean;
      hostname: string;
      action: string;
    };
    if (
      !verify.ok ||
      !check.success ||
      check.hostname !== origin.hostname ||
      check.action !== "inquiry"
    )
      return result(403);
    const inbox = env.INQUIRY_TO || "nusuk.alhouda@gmail.com";
    const agency = {
      from: env.MAIL_FROM,
      to: [inbox],
      reply_to: email,
      subject: "Demande de renseignements · nusukalhouda",
      text: [name, email, program || "—", lang, message].join("\n\n"),
    };
    const customer = {
      from: env.MAIL_FROM,
      to: [email],
      reply_to: inbox,
      subject:
        lang === "ar"
          ? "تأكيد استلام استفسارك"
          : "Votre demande chez nusukalhouda",
      text:
        lang === "ar"
          ? "تلقّت وكالة نُسك الهُدى استفسارك وسيتواصل معك فريقنا. هذه الرسالة تأكيد استلام فقط."
          : "L’équipe nusukalhouda a reçu votre demande et vous répondra par e-mail. Ce message confirme la réception de votre demande.",
    };
    const sent = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + env.RESEND_API_KEY,
        "Content-Type": "application/json",
        "Idempotency-Key": "inquiry-" + requestId,
      },
      body: JSON.stringify([agency, customer]),
    });
    return result(sent.ok ? 200 : 502);
  } catch {
    return result(502);
  }
}
