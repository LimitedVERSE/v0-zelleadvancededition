const { execSync } = require("child_process")

const cwd = "/vercel/share/v0-project"

console.log("[v0] Installing dependencies with bun...")
execSync("bun install", { cwd, stdio: "inherit" })

console.log("[v0] Starting Next.js dev server...")
execSync("bun run dev", { cwd, stdio: "inherit" })
