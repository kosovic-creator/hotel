
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function DELETE(request: Request) {
    const { id } = await request.json();
    const test = await prisma.test.delete({
        where: {
            id: id
        }
    });
    return NextResponse.json(test);
}
export async function PUT(request: Request) {
    const { id, ...data } = await request.json();
    const test = await prisma.test.update({
        where: {
            id: id
        },
        data: data
    });
    return NextResponse.json(test);
}