import axiosInstance, { handleResponse } from "@/config/axios";
import { QUERY_KEYS } from "@/constants";
import type { TValidateSchema } from "@/pages/admin/classes/components";
import type { CreateClassSchemaType } from "@/schemas";
import type { IListResponse, IResponse } from "@/types";
import type { TClass } from "@/types/class";
import { useMutation, useQuery } from "@tanstack/react-query";

type GetClassesParams = {
  page: number;
  size: number;
};

const classApi = {
  getClasses: (
    params: GetClassesParams
  ): Promise<IResponse<IListResponse<TClass>>> =>
    handleResponse(
      axiosInstance.get("/classes", {
        params: { ...params, sortBy: "createdAt", sortDirection: "desc" },
      })
    ),

  createClass: (data: CreateClassSchemaType) =>
    handleResponse(axiosInstance.post("/classes", data)),

  updateClass: (id: number, data: CreateClassSchemaType) =>
    handleResponse(axiosInstance.put(`/classes/${id}`, data)),

  getById: (id: number | string | undefined): Promise<IResponse<TClass>> =>
    handleResponse(axiosInstance.get(`/classes/${id}`)),

  updateStatus: (id: number, data: TValidateSchema) =>
    handleResponse(axiosInstance.put(`/classes/${id}/status`, data)),
};

export const useGetClasses = (params: GetClassesParams) =>
  useQuery({
    queryKey: [QUERY_KEYS.classes, "list", params.page, params.size],
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
    mutationFn: ({ id, data }: { id: number; data: { status: string } }) =>
      classApi.updateStatus(id, data),
  });
