import { useGetClassById, useUpdateClass } from "@/api/classApi";
import { ROUTES } from "@/constants";
import { useCommonData } from "@/hooks/useCommonData";
import { LoadingPage } from "@/pages/LoadingPage";
import { type CreateClassSchemaType } from "@/schemas";
import React from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ClassForm } from "./components";
import { translate } from "@/translate/helpers";

export const EditClassPage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const {
    subjects: { data: subjects },
    semesters: { data: semesters },
    teachers: { data: teachers },
    isAnyFetching,
  } = useCommonData(["subjects", "semesters", "teachers"]);

  const { data: classResponse, isFetching: isFetchingClass } =
    useGetClassById(id);
  const { mutateAsync: updateClass, isPending: isUpdating } = useUpdateClass();

  const classData = classResponse?.ok ? classResponse.body : undefined;

  const onSubmit = async (data: CreateClassSchemaType) => {
    if (!classData) return;

    await updateClass(
      {
        id: classData.id,
        data,
      },
      {
        onSuccess: (response) => {
          if (response.ok) {
            toast.success("Cập nhật lớp học thành công");
            navigate(ROUTES.ADMIN.CLASSES.ROOT);
          } else {
            toast.error(translate(response.error.message));
          }
        },
      }
    );
  };

  if (isAnyFetching || isFetchingClass) {
    return <LoadingPage type="page" />;
  }

  if (!classData) {
    toast.error("Lớp học không tồn tại");
    return <Navigate to={ROUTES.ADMIN.CLASSES.ROOT} />;
  }

  return (
    <ClassForm
      subjects={subjects}
      semesters={semesters}
      teachers={teachers}
      isLoading={isUpdating}
      onSubmit={onSubmit}
      classData={classData}
    />
  );
};
