import axiosInstance, { handleResponse } from "@/config/axios";
import { QUERY_KEYS } from "@/constants";
import type { IResponse, TMajor } from "@/types";
import { useQuery } from "@tanstack/react-query";

const majorApi = {
  getAllMajors: ({
    signal,
  }: {
    signal?: AbortSignal;
  }): Promise<IResponse<TMajor[]>> =>
    handleResponse(axiosInstance.get("/majors/all", { signal })),
};

export const useGetAllMajors = (enabled: boolean) =>
  useQuery({
    queryKey: [QUERY_KEYS.majors, "all"],
    queryFn: ({ signal }) => majorApi.getAllMajors({ signal }),
    staleTime: 0,
    enabled,
  });
