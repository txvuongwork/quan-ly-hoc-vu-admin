import axiosInstance, { handleResponse } from "@/config/axios";
import { QUERY_KEYS } from "@/constants";
import type { IListResponse, IResponse, TMajor } from "@/types";
import { useMutation, useQuery } from "@tanstack/react-query";

type GetMajorsParams = {
  page: number;
  size: number;
};

export type TCreateMajorRequest = {
  majorCode: string;
  majorName: string;
  description?: string;
};

const majorApi = {
  getAllMajors: ({
    signal,
  }: {
    signal?: AbortSignal;
  }): Promise<IResponse<TMajor[]>> =>
    handleResponse(axiosInstance.get("/majors/all", { signal })),

  getMajors: (
    params: GetMajorsParams
  ): Promise<IResponse<IListResponse<TMajor>>> =>
    handleResponse(
      axiosInstance.get("/majors", {
        params: {
          ...params,
          sortBy: "createdAt",
          sortDirection: "desc",
        },
      })
    ),

  createMajor: (data: TCreateMajorRequest) =>
    handleResponse(axiosInstance.post("/majors", data)),

  getMajorById: (id: number | string | undefined): Promise<IResponse<TMajor>> =>
    handleResponse(axiosInstance.get(`/majors/${id}`)),

  updateMajor: (id: number | string | undefined, data: TCreateMajorRequest) =>
    handleResponse(axiosInstance.put(`/majors/${id}`, data)),

  deleteMajor: (id: number) =>
    handleResponse(axiosInstance.delete(`/majors/${id}`)),
};

export const useGetAllMajors = (enabled: boolean) =>
  useQuery({
    queryKey: [QUERY_KEYS.majors, "all"],
    queryFn: ({ signal }) => majorApi.getAllMajors({ signal }),
    staleTime: 0,
    enabled,
  });

export const useGetMajors = (params: GetMajorsParams) =>
  useQuery({
    queryFn: () => majorApi.getMajors(params),
    queryKey: [QUERY_KEYS.majors, params.page, params.size],
    staleTime: 0,
    gcTime: 0,
  });

export const useCreateMajor = () =>
  useMutation({
    mutationFn: (data: TCreateMajorRequest) => majorApi.createMajor(data),
  });

export const useGetMajorById = (id: string | number | undefined) =>
  useQuery({
    queryFn: () => majorApi.getMajorById(id),
    queryKey: [QUERY_KEYS.majors, "detail", id],
    staleTime: 0,
    gcTime: 0,
    enabled: !!id,
  });

export const useUpdateMajor = () =>
  useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string | undefined;
      data: TCreateMajorRequest;
    }) => majorApi.updateMajor(id, data),
  });

export const useDeleteMajor = () =>
  useMutation({
    mutationFn: (id: number) => majorApi.deleteMajor(id),
  });
