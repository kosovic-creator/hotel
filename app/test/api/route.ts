/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    const test = await prisma.test.findMany();
    return NextResponse.json(test);
}

export async function POST(request: Request) {
    const contentType = request.headers.get('content-type') || '';
    let body: any;

    if (contentType.includes('application/json')) {
        body = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await request.text();
        body = Object.fromEntries(new URLSearchParams(formData));
    } else {
        return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 });
    }

    const noviTest = await prisma.test.create({
        data: body
    });
    return NextResponse.json(noviTest, { status: 201 });
}



