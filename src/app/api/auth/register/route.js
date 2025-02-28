import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  try {
  
    const { name, email, password } = await req.json();

  
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Nome, email e senha são obrigatórios." },
        { status: 400 }
      );
    }

  
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "Usuário com esse email já cadastrado." },
        { status: 409 }
      );
    }

  
    const hashedPassword = await bcrypt.hash(password, 10);

  
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

  
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

  
    return NextResponse.json(
      {
        message: "Usuário registrado com sucesso!",
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email },
      },
      { status: 201 }
    );
  } catch (error) {
  
    console.error("Erro ao registrar usuário:", error);

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "Erro de banco de dados: Conflito de dados únicos." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "Erro ao registrar usuário. Tente novamente mais tarde.", details: error.message },
      { status: 500 }
    );
  }
}
