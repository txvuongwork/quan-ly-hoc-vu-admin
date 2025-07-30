export const DAYS_OF_WEEK = [
  { value: 1, label: "Thứ 2" },
  { value: 2, label: "Thứ 3" },
  { value: 3, label: "Thứ 4" },
  { value: 4, label: "Thứ 5" },
  { value: 5, label: "Thứ 6" },
  { value: 6, label: "Thứ 7" },
  { value: 7, label: "Chủ nhật" },
] as const;

export const PERIODS = [
  { value: 1, label: "Tiết 1 (7:00 - 7:50)" },
  { value: 2, label: "Tiết 2 (8:00 - 8:50)" },
  { value: 3, label: "Tiết 3 (9:00 - 9:50)" },
  { value: 4, label: "Tiết 4 (10:00 - 10:50)" },
  { value: 5, label: "Tiết 5 (11:00 - 11:50)" },
  { value: 6, label: "Tiết 6 (13:00 - 13:50)" },
  { value: 7, label: "Tiết 7 (14:00 - 14:50)" },
  { value: 8, label: "Tiết 8 (15:00 - 15:50)" },
  { value: 9, label: "Tiết 9 (16:00 - 16:50)" },
  { value: 10, label: "Tiết 10 (17:00 - 17:50)" },
] as const;

export const getDayLabel = (dayOfWeek: number): string => {
  const day = DAYS_OF_WEEK.find((d) => d.value === dayOfWeek);
  return day?.label || `Thứ ${dayOfWeek}`;
};

export const getPeriodLabel = (period: number): string => {
  const periodData = PERIODS.find((p) => p.value === period);
  return periodData?.label || `Tiết ${period}`;
};
