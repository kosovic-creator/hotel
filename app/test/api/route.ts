import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    const test = await prisma.test.findMany();
    return NextResponse.json(test);
}

export async function POST(request: Request) {

    const body = await request.json();
    const noviTest = await prisma.test.create({
        data: body
    });
    return NextResponse.json(noviTest, { status: 201 });
}



