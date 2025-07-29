import axiosInstance, { handleResponse } from "@/config/axios";
import { QUERY_KEYS } from "@/constants";
import type { IListResponse, IResponse, TSubject } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

type GetSubjectsParams = {
  page: number;
  size: number;
};

export type TCreateSubjectRequest = {
  subjectCode: string;
  subjectName: string;
  majorId: number;
  credits: number;
  description?: string;
};

const subjectApi = {
  getSubjects: (
    params: GetSubjectsParams
  ): Promise<IResponse<IListResponse<TSubject>>> =>
    handleResponse(
      axiosInstance.get("/subjects", {
        params: {
          ...params,
          sortBy: "createdAt",
          sortDirection: "desc",
        },
      })
    ),

  createSubject: (data: TCreateSubjectRequest) =>
    handleResponse(axiosInstance.post("/subjects", data)),

  getSubjectById: (
    id: number | string | undefined
  ): Promise<IResponse<TSubject>> =>
    handleResponse(axiosInstance.get(`/subjects/${id}`)),

  updateSubject: (
    id: number | string | undefined,
    data: TCreateSubjectRequest
  ) => handleResponse(axiosInstance.put(`/subjects/${id}`, data)),

  getAllSubjects: (): Promise<IResponse<TSubject[]>> =>
    handleResponse(axiosInstance.get("/subjects/all")),

  deleteSubject: (id: number | string) =>
    handleResponse(axiosInstance.delete(`/subjects/${id}`)),
};

export const useGetSubjects = (params: GetSubjectsParams) =>
  useQuery({
    queryFn: () => subjectApi.getSubjects(params),
    queryKey: [QUERY_KEYS.subjects, params.page, params.size],
    staleTime: 0,
    gcTime: 0,
  });

export const useCreateSubject = () =>
  useMutation({
    mutationFn: (data: TCreateSubjectRequest) => subjectApi.createSubject(data),
  });

export const useGetSubjectById = (id: string | number | undefined) =>
  useQuery({
    queryFn: () => subjectApi.getSubjectById(id),
    queryKey: [QUERY_KEYS.subjects, "detail", id],
    staleTime: 0,
    gcTime: 0,
    enabled: !!id,
  });

export const useUpdateSubject = () =>
  useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string | undefined;
      data: TCreateSubjectRequest;
    }) => subjectApi.updateSubject(id, data),
  });

export const useGetAllSubjects = (enabled: boolean) =>
  useQuery({
    queryFn: subjectApi.getAllSubjects,
    queryKey: [QUERY_KEYS.subjects, "all"],
    staleTime: 0,
    gcTime: 0,
    enabled,
  });

export const useDeleteSubject = () =>
  useMutation({
    mutationFn: (id: number | string) => subjectApi.deleteSubject(id),
  });
