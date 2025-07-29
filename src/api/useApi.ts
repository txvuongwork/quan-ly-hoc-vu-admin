import axiosInstance, { handleResponse } from "@/config/axios";
import { QUERY_KEYS } from "@/constants";
import type { IResponse, TUser } from "@/types";
import { useQuery } from "@tanstack/react-query";

const userApi = {
  getAllTeachers: (): Promise<IResponse<TUser[]>> =>
    handleResponse(axiosInstance.get("/users/all-teachers")),
};

export const useGetAllTeachers = (enabled: boolean) =>
  useQuery({
    queryKey: [QUERY_KEYS.users, "all-teachers"],
    queryFn: userApi.getAllTeachers,
    staleTime: 0,
    gcTime: 0,
    enabled,
  });
