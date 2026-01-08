import { NextResponse } from "next/server";
import Panchangam from "@/models/Panchangam";
import dbConnect from "@/lib/mongoose";

export async function GET(req) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const nameOfWork = searchParams.get('nameOfWork');

        let query = {};
        if (nameOfWork) {
            // Case-insensitive search
            query.nameOfWork = { $regex: new RegExp(`^${nameOfWork}$`, 'i') };
        }

        const panchangams = await Panchangam.find(query).sort({ date: 1 });
        return NextResponse.json({ success: true, data: panchangams });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
