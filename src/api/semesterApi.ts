import axiosInstance, { handleResponse } from "@/config/axios";
import { QUERY_KEYS } from "@/constants";
import type { ESemesterStatus } from "@/enums";
import type { IListResponse, IResponse, TSemester } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

type GetSemestersParams = {
  page: number;
  size: number;
};

export type TCreateSemesterRequest = {
  semesterCode: string;
  semesterName: string;
  startDate: string;
  endDate: string;
};

const semesterApi = {
  getSemesters: (
    params: GetSemestersParams
  ): Promise<IResponse<IListResponse<TSemester>>> =>
    handleResponse(
      axiosInstance.get("/semesters", {
        params: {
          ...params,
          sortBy: "id",
          sortDirection: "desc",
        },
      })
    ),

  getSemesterById: (
    id: number | string | undefined
  ): Promise<IResponse<TSemester>> =>
    handleResponse(axiosInstance.get(`/semesters/${id}`)),

  getAllSemesters: (): Promise<IResponse<TSemester[]>> =>
    handleResponse(axiosInstance.get("/semesters/all")),

  createSemester: (
    data: TCreateSemesterRequest
  ): Promise<IResponse<TSemester>> =>
    handleResponse(axiosInstance.post("/semesters", data)),

  updateSemester: (
    id: number | string,
    data: TCreateSemesterRequest
  ): Promise<IResponse<TSemester>> =>
    handleResponse(axiosInstance.put(`/semesters/${id}`, data)),

  updateSemesterStatus: (id: number | string, status: ESemesterStatus) =>
    handleResponse(
      axiosInstance.patch(`/semesters/${id}/status`, {
        status,
      })
    ),
};

export const useGetSemesters = (params: GetSemestersParams) =>
  useQuery({
    queryFn: () => semesterApi.getSemesters(params),
    queryKey: [QUERY_KEYS.semesters, params.page, params.size],
    staleTime: 0,
    gcTime: 0,
  });

export const useGetSemesterById = (id: string | number | undefined) =>
  useQuery({
    queryFn: () => semesterApi.getSemesterById(id),
    queryKey: [QUERY_KEYS.semesters, "detail", id],
    staleTime: 0,
    gcTime: 0,
    enabled: !!id,
  });

export const useGetAllSemesters = (enabled: boolean) =>
  useQuery({
    queryFn: semesterApi.getAllSemesters,
    queryKey: [QUERY_KEYS.semesters, "all"],
    staleTime: 0,
    gcTime: 0,
    enabled,
  });

export const useCreateSemester = () =>
  useMutation({
    mutationFn: (data: TCreateSemesterRequest) =>
      semesterApi.createSemester(data),
  });

export const useUpdateSemester = () =>
  useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string;
      data: TCreateSemesterRequest;
    }) => semesterApi.updateSemester(id, data),
  });

export const useUpdateSemesterStatus = () =>
  useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number | string;
      status: ESemesterStatus;
    }) => semesterApi.updateSemesterStatus(id, status),
  });
