/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src/app/data/words.json");

export async function GET() {
  const fileContents = await fs.readFile(filePath, "utf-8");
  const words = JSON.parse(fileContents);
  return NextResponse.json(words);
}

export async function POST(request: NextRequest) {
  const newWord = await request.json();
  const fileContents = await fs.readFile(filePath, "utf-8");
  const words = JSON.parse(fileContents);

  newWord.id = words.length ? Math.max(...words.map((w: any) => w.id)) + 1 : 1;
  words.push(newWord);

  await fs.writeFile(filePath, JSON.stringify(words, null, 2), "utf-8");
  return NextResponse.json(newWord, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const updatedWord = await request.json();
  const fileContents = await fs.readFile(filePath, "utf-8");
  let words = JSON.parse(fileContents);

  words = words.map((w: any) => (w.id === updatedWord.id ? updatedWord : w));
  await fs.writeFile(filePath, JSON.stringify(words, null, 2), "utf-8");
  return NextResponse.json(updatedWord, { status: 200 });
}
