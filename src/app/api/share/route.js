import dbConnect from '@/lib/mongoose';
import SharedKundali from '@/models/SharedKundali';
import { NextResponse } from 'next/server';

function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
    try {
        await dbConnect();
        const body = await req.json();

        // Loop to ensure uniqueness (unlikely collision but good practice)
        let code;
        let exists = true;
        while (exists) {
            code = generateCode();
            exists = await SharedKundali.exists({ code });
        }

        const newShare = await SharedKundali.create({
            code,
            data: body, // The form data
        });

        return NextResponse.json({ success: true, code: newShare.code });
    } catch (error) {
        console.error("Share Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const code = searchParams.get('code');

        if (!code) {
            return NextResponse.json({ success: false, error: 'Code is required' }, { status: 400 });
        }

        await dbConnect();
        const record = await SharedKundali.findOne({ code });

        if (!record) {
            return NextResponse.json({ success: false, error: 'Invalid or expired code' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: record.data });
    } catch (error) {
        console.error("Fetch Share Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
