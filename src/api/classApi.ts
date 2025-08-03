import axiosInstance, { handleResponse } from "@/config/axios";
import { QUERY_KEYS } from "@/constants";
import type { EClassStatus } from "@/enums";
import type { CreateClassSchemaType } from "@/schemas";
import type { IListResponse, IResponse, TUser } from "@/types";
import type { TClass } from "@/types/class";
import { useMutation, useQuery } from "@tanstack/react-query";

type GetClassesParams = {
  page: number;
  size: number;
  semesterId?: string;
};

const classApi = {
  getClasses: (
    params: GetClassesParams
  ): Promise<IResponse<IListResponse<TClass>>> =>
    handleResponse(
      axiosInstance.get("/classes", {
        params: {
          ...params,
          sortBy: "createdAt",
          sortDirection: "desc",
          semesterId: params.semesterId || undefined,
        },
      })
    ),

  createClass: (data: CreateClassSchemaType) =>
    handleResponse(axiosInstance.post("/classes", data)),

  updateClass: (id: number, data: CreateClassSchemaType) =>
    handleResponse(axiosInstance.put(`/classes/${id}`, data)),

  getById: (id: number | string | undefined): Promise<IResponse<TClass>> =>
    handleResponse(axiosInstance.get(`/classes/${id}`)),

  updateStatus: (id: number, data: { status: EClassStatus }) =>
    handleResponse(axiosInstance.put(`/classes/${id}/status`, data)),

  getAvailableForRegister: (semesterId: string): Promise<IResponse<TClass[]>> =>
    handleResponse(
      axiosInstance.get("/classes/available-for-registration", {
        params: {
          semesterId: semesterId || undefined,
        },
      })
    ),

  getRegisteredClasses: (semesterId: string): Promise<IResponse<TClass[]>> =>
    handleResponse(
      axiosInstance.get("/classes/enrolled", {
        params: {
          semesterId: semesterId || undefined,
        },
      })
    ),

  registerClass: (classId: number) =>
    handleResponse(axiosInstance.post(`/enrollments/register`, { classId })),

  cancelClass: (enrollmentId: number) =>
    handleResponse(axiosInstance.delete(`/enrollments/${enrollmentId}`)),

  getClassesbySemesterAndStatus: (
    semesterId: string
  ): Promise<IResponse<TClass[]>> =>
    handleResponse(
      axiosInstance.get("/classes/student", {
        params: {
          semesterId,
        },
      })
    ),

  getClassesbyTeacher: (semesterId: string): Promise<IResponse<TClass[]>> =>
    handleResponse(
      axiosInstance.get("/classes/teacher", {
        params: {
          semesterId,
        },
      })
    ),

  getStudentsByClassId: (
    classId: number | string | undefined
  ): Promise<IResponse<TUser[]>> =>
    handleResponse(axiosInstance.get(`/classes/${classId}/students`)),
};

export const useGetClasses = (params: GetClassesParams) =>
  useQuery({
    queryKey: [
      QUERY_KEYS.classes,
      "list",
      params.page,
      params.size,
      params.semesterId,
    ],
    queryFn: () => classApi.getClasses(params),
    staleTime: 0,
    gcTime: 0,
  });

export const useCreateClass = () =>
  useMutation({
    mutationFn: classApi.createClass,
  });

export const useUpdateClass = () =>
  useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreateClassSchemaType }) =>
      classApi.updateClass(id, data),
  });

export const useGetClassById = (id: number | string | undefined) =>
  useQuery({
    queryKey: [QUERY_KEYS.classes, "detail", id],
    queryFn: () => classApi.getById(id),
    staleTime: 0,
    gcTime: 0,
    enabled: !!id,
  });

export const useUpdateStatus = () =>
  useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { status: EClassStatus };
    }) => classApi.updateStatus(id, data),
  });

export const useGetAvailableForRegister = (semesterId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.classes, "available-for-register", semesterId],
    queryFn: () => classApi.getAvailableForRegister(semesterId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
  });

export const useGetRegisteredClasses = (semesterId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.classes, "registered-classes", semesterId],
    queryFn: () => classApi.getRegisteredClasses(semesterId),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
  });

export const useRegisterClass = () =>
  useMutation({
    mutationFn: classApi.registerClass,
  });

export const useCancelClass = () =>
  useMutation({
    mutationFn: classApi.cancelClass,
  });

export const useGetClassesbySemesterAndStatus = (semesterId: string) =>
  useQuery({
    queryKey: [
      QUERY_KEYS.classes,
      "classes-by-semester-and-status",
      semesterId,
    ],
    queryFn: () => classApi.getClassesbySemesterAndStatus(semesterId),
    staleTime: 0,
    gcTime: 0,
  });

export const useGetClassesbyTeacher = (semesterId: string) =>
  useQuery({
    queryKey: [QUERY_KEYS.classes, "classes-by-teacher", semesterId],
    queryFn: () => classApi.getClassesbyTeacher(semesterId),
    staleTime: 0,
    gcTime: 0,
  });

export const useGetStudentsByClassId = (classId: number | string | undefined) =>
  useQuery({
    queryKey: [QUERY_KEYS.classes, "students-by-class-id", classId],
    queryFn: () => classApi.getStudentsByClassId(classId),
    staleTime: 0,
    gcTime: 0,
    enabled: !!classId,
  });
