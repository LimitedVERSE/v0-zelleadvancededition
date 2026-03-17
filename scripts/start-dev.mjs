import { execSync } from "child_process"

console.log("[v0] Installing dependencies...")
execSync("bun install", { cwd: "/vercel/share/v0-project", stdio: "inherit" })

console.log("[v0] Starting Next.js dev server...")
execSync("bun run dev", { cwd: "/vercel/share/v0-project", stdio: "inherit" })
