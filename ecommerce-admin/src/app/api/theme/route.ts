import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Theme } from '@/models/Theme';

export async function GET() {
  try {
    await connectDB();
    const themes = await Theme.find({});
    return NextResponse.json(themes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { mode, background, foreground, primary, primaryHover, cardBg, cardBorder, glassBg, glassBorder } = body;

    const theme = await Theme.findOneAndUpdate(
      { mode },
      { background, foreground, primary, primaryHover, cardBg, cardBorder, glassBg, glassBorder, updatedAt: Date.now() },
      { new: true, upsert: true }
    );

    return NextResponse.json(theme);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
