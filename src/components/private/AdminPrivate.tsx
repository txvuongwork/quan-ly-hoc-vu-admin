import { useGetProfile } from "@/api/authenticationApi";
import { ROUTES } from "@/constants";
import { EUserRole } from "@/enums";
import type { FunctionComponent, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

export const AdminPrivate: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const { data: profileResponse } = useGetProfile();

  if (!profileResponse || !profileResponse.ok) {
    return <Navigate to={ROUTES.AUTH.LOGIN} />;
  }

  const { role } = profileResponse.body;

  if (role !== EUserRole.ADMIN) {
    toast.error("Bạn không có quyền truy cập trang này");
    return (
      <Navigate
        to={
          role === EUserRole.STUDENT
            ? ROUTES.APP.HOME
            : ROUTES.TEACHER.DASHBOARD
        }
      />
    );
  }

  return children;
};
