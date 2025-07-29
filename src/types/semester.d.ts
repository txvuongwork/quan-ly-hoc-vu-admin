import type { ESemesterStatus } from "@/enums/semester";

export type TSemester = {
  id: number;
  semesterName: string;
  year: number;
  semesterNumber: number;
  semesterStart: string;
  semesterEnd: string;
  registrationStart: string;
  registrationEnd: string;
  createdAt: string;
  status: ESemesterStatus;
};
