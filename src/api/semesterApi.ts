import axiosInstance, { handleResponse } from "@/config/axios";
import { QUERY_KEYS } from "@/constants";
import type { IListResponse, IResponse, TSemester } from "@/types";
import { useQuery } from "@tanstack/react-query";

type GetSemestersParams = {
  page: number;
  size: number;
};

const semesterApi = {
  getSemesters: (
    params: GetSemestersParams
  ): Promise<IResponse<IListResponse<TSemester>>> =>
    handleResponse(
      axiosInstance.get("/semesters", {
        params: {
          ...params,
          sortBy: "createdAt",
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
