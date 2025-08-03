import type { ESemesterStatus } from "@/enums/semester";

export type TSemester = {
  id: number;
  semesterCode: string;
  semesterName: string;
  startDate: string;
  endDate: string;
  status: ESemesterStatus;
  createdAt: string;
  updatedAt: string;
};
