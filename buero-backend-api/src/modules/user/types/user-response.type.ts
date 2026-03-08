import { User } from "src/generated/prisma/client";


export type UserWithoutPassword = Omit<User, "passwordHash">;