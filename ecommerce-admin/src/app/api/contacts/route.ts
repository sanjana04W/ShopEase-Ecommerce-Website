import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function GET() {
    try {
        await connectDB();
        const contacts = await Contact.find().sort({ createdAt: -1 });
        return NextResponse.json({ contacts });
    } catch {
        return NextResponse.json(
            { message: "Failed to fetch contacts" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { id } = await req.json();
        await connectDB();
        await Contact.findByIdAndDelete(id);
        return NextResponse.json({ message: "Contact deleted" });
    } catch {
        return NextResponse.json(
            { message: "Failed to delete contact" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const { fullName, email, phone, subject, message } = await req.json();

        if (!fullName || !email || !subject || !message) {
            return NextResponse.json(
                { message: "Please fill in all required fields" },
                { status: 400 }
            );
        }

        await connectDB();
        await Contact.create({ fullName, email, phone, subject, message });

        return NextResponse.json(
            { message: "Message sent successfully" },
            { status: 201 }
        );
    } catch {
        return NextResponse.json(
            { message: "Failed to send message" },
            { status: 500 }
        );
    }
}