import type { TUser } from "./user";

export type TLoginResponse = {
  token: string;
  tokenType: string;
  user: TUser;
};
