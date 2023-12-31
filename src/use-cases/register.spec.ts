import { expect, describe, it } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe("Register Use Case", () => {
  it("should be able to register", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "Fulano",
      email: "fulano@prisma.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should hash user password upon registration", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const { user } = await registerUseCase.execute({
      name: "Fulano",
      email: "fulano@prisma.com",
      password: "123456",
    });
    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );
    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not be able to register with same email", async () => {
    const usersRepository = new InMemoryUsersRepository();
    const registerUseCase = new RegisterUseCase(usersRepository);

    const email = "fulano@prisma.com";

    const { user } = await registerUseCase.execute({
      name: "Fulano",
      email,
      password: "123456",
    });

    expect(() =>
      registerUseCase.execute({
        name: "Fulano",
        email,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );
    expect(isPasswordCorrectlyHashed).toBe(true);
  });
});
