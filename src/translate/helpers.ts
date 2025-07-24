import { VI } from "./VI";

export const translate = (key: string): string => {
  if (key in VI) {
    return VI[key as keyof typeof VI];
  }

  return key;
};
