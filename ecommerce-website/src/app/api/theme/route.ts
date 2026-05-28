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
