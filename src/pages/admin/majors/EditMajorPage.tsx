import { useGetMajorById, useUpdateMajor } from "@/api/majorApi";
import { ROUTES } from "@/constants";
import { LoadingPage } from "@/pages/LoadingPage";
import { type CreateMajorSchemaType } from "@/schemas";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { MajorForm } from "./components";

export const EditMajorPage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { data: majorResponse, isFetching: isFetchingMajor } =
    useGetMajorById(id);
  const { mutateAsync: updateMajor, isPending: isUpdating } = useUpdateMajor();

  const major = majorResponse?.ok ? majorResponse.body : undefined;

  const onSubmit = async (data: CreateMajorSchemaType) => {
    if (!major) return;

    await updateMajor(
      {
        id: major.id,
        data: {
          majorCode: data.majorCode,
          majorName: data.majorName,
          description: data.description,
        },
      },
      {
        onSuccess: (response) => {
          if (response.ok) {
            toast.success("Cập nhật ngành học thành công");
            navigate(ROUTES.ADMIN.MAJOR.ROOT);
          } else {
            toast.error(response.error.message);
          }
        },
      }
    );
  };

  if (isFetchingMajor) return <LoadingPage type="page" />;

  return <MajorForm isLoading={isUpdating} onSubmit={onSubmit} major={major} />;
};
