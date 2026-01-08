import { NextResponse } from "next/server";
import Panchangam from "@/models/Panchangam";
import dbConnect from "@/lib/mongoose";

export async function GET() {
  try {
    await dbConnect();
    const panchangams = await Panchangam.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: panchangams });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { nameOfWork, date, month, year, time, paksha, tithi, description } = body;
    console.log(body);

    if (!nameOfWork || !date || !month || !year) {
      return NextResponse.json({ success: false, error: "Required fields missing" });
    }

    const panchangam = await Panchangam.create({
      nameOfWork,
      date,
      month,
      year,
      time,
      paksha,
      tithi,
      description,
    });

    return NextResponse.json({ success: true, data: panchangam });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { _id, nameOfWork, date, month, year, time, paksha, tithi, description } = body;

    if (!_id) {
      return NextResponse.json({ success: false, error: "ID is required for update" });
    }

    const updatedPanchangam = await Panchangam.findByIdAndUpdate(
      _id,
      { nameOfWork, date, month, year, time, paksha, tithi, description, updatedAt: Date.now() },
      { new: true }
    );

    return NextResponse.json({ success: true, data: updatedPanchangam });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: "ID is required for deletion" });
    }

    await Panchangam.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
