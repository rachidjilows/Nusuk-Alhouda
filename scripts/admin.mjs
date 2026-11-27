import {
  readdir,
  copyFile,
  writeFile,
  mkdir,
  readFile,
} from "node:fs/promises";
await mkdir("public/admin", { recursive: true });
const dist = "node_modules/decap-cms/dist/";
for (const file of await readdir(dist)) {
  if (/(?:^|\.)cms\.js$|\.wasm$|^cms\.css$|^cms\.js\.LICENSE\.txt$/.test(file))
    await copyFile(dist + file, "public/admin/" + file);
}
const config = JSON.parse(await readFile("cms.json", "utf8"));
config.backend.repo = process.env.CMS_REPO || "agency/nusukalhouda";
config.backend.app_id = process.env.CMS_APP_ID || "configure-gitlab-app";
await writeFile("public/admin/config.yml", JSON.stringify(config, null, 2));
