import { prisma } from "@/lib/prisma";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

export async function register(req: FastifyRequest, rep: FastifyReply) {
  const registerBodySchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
  });

  const { name, email, password } = registerBodySchema.parse(req.body);

  await prisma.user.create({
    data: {
      name,
      email,
      password_hash: password,
    },
  });

  return rep.status(201).send();
}
