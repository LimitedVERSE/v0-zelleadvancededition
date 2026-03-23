#!/bin/bash
set -e

cd /vercel/share/v0-project

echo "Installing dependencies with bun..."
bun install

echo "Starting Next.js dev server..."
bun run dev
