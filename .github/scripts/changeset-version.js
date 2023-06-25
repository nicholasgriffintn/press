// ORIGINALLY FROM CLOUDFLARE WRANGLER:
// https://github.com/cloudflare/wrangler2/blob/main/.github/changeset-version.js

const { exec } = require("child_process");

exec("npx changeset version");
exec("pnpm install");
