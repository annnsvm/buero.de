import { UserWithoutPassword } from "../../user/types/user-response.type";

declare global {
  namespace Express {
    interface Request {
      user?: UserWithoutPassword;
    }
  }
}
