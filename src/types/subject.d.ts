import type { TMajor } from "./major";

export type TSubject = {
  id: number;
  subjectCode: string;
  subjectName: string;
  credits: number;
  description: string;
  major: TMajor;
  createdAt: string;
};
