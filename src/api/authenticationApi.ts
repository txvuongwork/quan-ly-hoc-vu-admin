import axiosInstance, { handleResponse } from "@/config/axios";
import { ACCESS_TOKEN_KEY, API_URLS, QUERY_KEYS, ROUTES } from "@/constants";
import { EUserRole } from "@/enums";
import type { LoginSchemaType } from "@/schemas";
import { translate } from "@/translate/helpers";
import type { IResponse, TUser } from "@/types";
import type { TLoginResponse } from "@/types/authentication";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const authenticationApi = {
  login: (data: LoginSchemaType): Promise<IResponse<TLoginResponse>> =>
    handleResponse(axiosInstance.post(API_URLS.LOGIN, data)),
  getProfile: (): Promise<IResponse<TUser>> =>
    handleResponse(axiosInstance.get(API_URLS.GET_PROFILE)),
};

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authenticationApi.login,
    onSuccess(response) {
      if (response.ok) {
        localStorage.setItem(ACCESS_TOKEN_KEY, response.body.token);
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.profile] });
        if (response.body.user.role === EUserRole.ADMIN) {
          navigate(ROUTES.ADMIN.MAJOR.ROOT);
        } else {
          navigate(ROUTES.APP.HOME);
        }
      } else {
        toast.error(translate(response.error.message));
      }
    },
  });
};

export const useGetProfile = () =>
  useQuery({
    queryKey: [QUERY_KEYS.profile],
    queryFn: authenticationApi.getProfile,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
