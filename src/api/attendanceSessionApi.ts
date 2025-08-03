import axiosInstance, { handleResponse } from "@/config/axios";
import { QUERY_KEYS } from "@/constants";
import type { IResponse } from "@/types";
import type {
  TAttendance,
  TAttendanceSession,
} from "@/types/attendance-session";
import { useMutation, useQuery } from "@tanstack/react-query";

const attendanceSessionApi = {
  getAttendanceSessions: (
    classId: number | string | undefined
  ): Promise<IResponse<TAttendanceSession[]>> =>
    handleResponse(
      axiosInstance.get(`/classes/${classId}/attendance-sessions`)
    ),

  createAttendanceSession: (
    classId: number | string
  ): Promise<IResponse<TAttendanceSession>> =>
    handleResponse(
      axiosInstance.post(`/classes/${classId}/attendance-sessions`, {})
    ),

  removeAttendanceSession: (
    sessionId: number | string
  ): Promise<IResponse<void>> =>
    handleResponse(
      axiosInstance.put(`/attendance-sessions/${sessionId}`, {
        isActive: false,
      })
    ),

  getAttendanceSessionDetail: (
    sessionId: number | string | undefined
  ): Promise<IResponse<TAttendance[]>> =>
    handleResponse(
      axiosInstance.get(`/attendance-sessions/${sessionId}/attendances`)
    ),

  checkingAttendance: (
    attendanceCode: number | string
  ): Promise<IResponse<void>> =>
    handleResponse(
      axiosInstance.post(`/attendance/check-in`, {
        attendanceCode,
      })
    ),
};

export const useGetAttendanceSessions = (
  classId: number | string | undefined
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.attendanceSessions, classId],
    queryFn: () => attendanceSessionApi.getAttendanceSessions(classId),
    staleTime: 0,
    gcTime: 0,
    enabled: !!classId,
  });
};

export const useCreateAttendanceSession = () => {
  return useMutation({
    mutationFn: (classId: number | string) =>
      attendanceSessionApi.createAttendanceSession(classId),
  });
};

export const useRemoveAttendanceSession = () => {
  return useMutation({
    mutationFn: (sessionId: number | string) =>
      attendanceSessionApi.removeAttendanceSession(sessionId),
  });
};

export const useGetAttendanceSessionDetail = (
  sessionId: number | string | undefined
) => {
  return useQuery({
    queryKey: [QUERY_KEYS.attendanceSessions, "detail", sessionId],
    queryFn: () => attendanceSessionApi.getAttendanceSessionDetail(sessionId),
    staleTime: 0,
    gcTime: 0,
    enabled: !!sessionId,
  });
};

export const useCheckingAttendance = () => {
  return useMutation({
    mutationFn: (attendanceCode: number | string) =>
      attendanceSessionApi.checkingAttendance(attendanceCode),
  });
};
