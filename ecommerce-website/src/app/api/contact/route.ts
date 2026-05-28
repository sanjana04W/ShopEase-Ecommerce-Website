import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Contact from '@/models/Contact';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { fullName, email, phone, subject, message } = body;

    if (!fullName || !email || !phone || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const contact = await Contact.create({ fullName, email, phone, subject, message });
    return NextResponse.json({ success: true, data: contact }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
