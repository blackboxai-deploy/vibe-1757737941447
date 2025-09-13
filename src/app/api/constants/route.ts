import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    constants: {
      pi: Math.PI,
      e: Math.E
    },
    success: true
  });
}