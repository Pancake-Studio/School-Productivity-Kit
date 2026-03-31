"use server"

import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

export async function POST(request: Request) {
    const body = await request.json();
    const createUser = await prisma.user.create({
        data: {
            name: body.name,
            email: body.email,
            password: body.password,
        },
    });
    console.log(createUser);

    return Response.json(createUser);
}