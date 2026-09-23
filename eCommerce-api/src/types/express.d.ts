import { type JwtPayload } from 'jsonwebtoken';

export interface User extends JwtPayload {
    id: number;
    email: string;
    username: string;
    name: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
    interface Response {
      sendError(status: number, message: string): this;
    }
  }
}

export {};