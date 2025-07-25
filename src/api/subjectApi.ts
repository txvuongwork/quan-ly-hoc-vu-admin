import axiosInstance, { handleResponse } from "@/config/axios";
import { QUERY_KEYS } from "@/constants";
import type { IListResponse, IResponse, TSubject } from "@/types";
import { useQuery } from "@tanstack/react-query";

type GetSubjectsParams = {
  page: number;
  size: number;
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
};

export const useGetSubjects = (params: GetSubjectsParams) =>
  useQuery({
    queryFn: () => subjectApi.getSubjects(params),
    queryKey: [QUERY_KEYS.subjects, params.page, params.size],
    staleTime: 0,
    gcTime: 0,
  });
