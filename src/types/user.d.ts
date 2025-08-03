import type { EUserRole } from "@/enums";
import type { TMajor } from "./major";

export type TUser = {
  id: number;
  email: string;
  fullName: string;
  role: EUserRole;
  major: TMajor;
  studentCode: string;
};
