const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const root = path.join(__dirname, "..");
const buildDir = path.join(root, "build");

const COPY_ITEMS = [
  "index.js",
  "package.json",
  "package-lock.json",
  "routes",
  "models",
  "utils",
  "data",
];

function rimraf(dir) {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

rimraf(buildDir);
fs.mkdirSync(buildDir, { recursive: true });

for (const item of COPY_ITEMS) {
  const src = path.join(root, item);
  if (!fs.existsSync(src)) continue;
  const dest = path.join(buildDir, item);
  fs.cpSync(src, dest, { recursive: true });
}

fs.mkdirSync(path.join(buildDir, "uploads"), { recursive: true });

fs.writeFileSync(
  path.join(buildDir, "Dockerfile"),
  `FROM node:20-alpine
WORKDIR /app
COPY . .
EXPOSE 4000
ENV NODE_ENV=production
CMD ["node", "index.js"]
`,
);

console.log("Installing production dependencies in build/...");
execSync("npm ci --omit=dev", { cwd: buildDir, stdio: "inherit" });
console.log("build/ ready for deploy (uploads excluded).");
