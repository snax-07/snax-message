import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { username: string } }) {
  const { username } = params; // Extract 'username' from the URL
  return NextResponse.json({ message: `Hello, ${username}!` });
}
