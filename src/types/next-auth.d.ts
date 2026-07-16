import "next-auth";
import "next-auth/jwt";

type Role = "ADMIN" | "TEACHER";
type Status = "ACTIVE" | "INACTIVE";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: Role;
      status: Status;
    };
  }

  interface User {
    role: Role;
    status: Status;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    status: Status;
  }
}
