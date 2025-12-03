import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Absolute path to your public JSON file
const filePath = path.join(process.cwd(), "public", "data", "panchang.json");

// Ensure the JSON file exists
function ensureFile() {
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, "{}");
  }
}

// Safe JSON reader
function readJSON() {
  ensureFile();
  try {
    const content = fs.readFileSync(filePath, "utf8") || "{}";
    return JSON.parse(content);
  } catch {
    // In case of corrupted JSON, reset file
    fs.writeFileSync(filePath, "{}");
    return {};
  }
}

// Safe JSON writer
function writeJSON(data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
}

export async function GET() {
  try {
    const data = readJSON();
    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { year, month, data } = body;

    if (!year || !month) {
      return NextResponse.json({
        success: false,
        error: "Year and month are required.",
      });
    }

    const file = readJSON();

    if (!file[year]) file[year] = {};
    if (!file[year][month]) file[year][month] = {};

    file[year][month] = {
      ...file[year][month],
      ...data,
    };

    writeJSON(file);

    return NextResponse.json({
      success: true,
      message: "Panchang updated successfully",
      data: file[year][month],
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
