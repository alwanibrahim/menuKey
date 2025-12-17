#!/usr/bin/env bun
import { spawn } from "bun";
import { readdirSync } from "fs";
import { join } from "path";

const BASE = `${process.env.HOME}/menuKey/data`;
const BAT = "/usr/bin/batcat";

// ambil menu otomatis dari folder data
function getMenus(): string[] {
  return readdirSync(BASE)
    .filter(f => f.endsWith(".txt") && !f.startsWith("."))
    .map(f => f.replace(".txt", ""))
    .sort();
}

function showMenu(menus: string[]) {
  console.clear();
  console.log("===== MENU KEY =====");
  menus.forEach((m, i) => {
    console.log(`${i + 1}. ${m}`);
  });
  console.log("====================");
  process.stdout.write("Pilih menu: ");
}

async function readInput(): Promise<string> {
  const reader = Bun.stdin.stream().getReader();
  const { value } = await reader.read();
  reader.releaseLock();
  return new TextDecoder().decode(value).trim();
}

async function run() {
  const menus = getMenus();
  if (menus.length === 0) {
    console.log("Folder data kosong.");
    return;
  }

  showMenu(menus);
  const input = await readInput();

  const index = Number(input);
  let choice: string | undefined;

  if (!Number.isNaN(index)) {
    choice = menus[index - 1];
  } else {
    choice = input;
  }

  if (!choice || !menus.includes(choice)) {
    console.log("Menu tidak dikenal");
    return;
  }

  const file = join(BASE, `${choice}.txt`);
  spawn([BAT, file], { stdio: ["inherit", "inherit", "inherit"] });
}

run();
