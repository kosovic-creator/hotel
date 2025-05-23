/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// CREATE
export async function POST(request: NextRequest) {
  const body = await request.json();
  const novaSoba = await prisma.sobe.create({
    data: body,
  });
  return NextResponse.json(novaSoba);
}

// READ (svi todo)
export async function GET() {
  const soba = await prisma.sobe.findMany();
  return NextResponse.json(soba);
}
