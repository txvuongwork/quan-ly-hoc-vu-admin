import type { EClassStatus, ERegisteredClassStatus } from "@/enums";
import type { TSemester } from "./semester";
import type { TSubject } from "./subject";
import type { TUser } from "./user";

export type TClassSchedule = {
  id: number;
  dayOfWeek: string;
  dayOfWeekValue: number;
  startPeriod: number;
  endPeriod: number;
  timeSlotDisplay: string;
};

export type TClass = {
  id: number;
  classCode: string;
  subject: TSubject;
  semester: TSemester;
  teacher: TUser;
  maxStudents: number;
  minStudents: number;
  startDate: string;
  endDate: string;
  processPercent: number;
  midtermPercent: number;
  finalPercent: number;
  status: EClassStatus;
  createdAt: string;
  schedules: TClassSchedule[];
  enrolledCount: number;
};

export type TRegisteredClass = {
  id: number;
  user: TUser;
  classEntity: TClass;
  enrolledAt: string;
  status: ERegisteredClassStatus;
};
