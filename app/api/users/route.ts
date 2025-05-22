
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma'

export async function GET() {
  const todos = await prisma.user.findMany();
  return NextResponse.json(todos);
}
export async function POST(request: NextRequest) {
  try {
    const {  email, password, role } = await request.json();
    const newTodo = await prisma.user.create({
      data: {
        email,
        password,
        role,
      },
    });
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Greška u kreiranju korisnika." },
      { status: 500 }
    );
  }
}