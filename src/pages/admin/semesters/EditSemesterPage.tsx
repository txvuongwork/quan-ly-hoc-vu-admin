import { useGetSemesterById, useUpdateSemester } from "@/api/semesterApi";
import { ROUTES } from "@/constants";
import { LoadingPage } from "@/pages/LoadingPage";
import { type CreateSemesterSchemaType } from "@/schemas";
import { translate } from "@/translate/helpers";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { SemesterForm } from "./components";
import { convertISOToDateString } from "@/lib/utils";

export const EditSemesterPage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    data: semesterResponse,
    isFetching: isFetchingSemester,
    refetch,
  } = useGetSemesterById(id);
  const { mutateAsync: updateSemester, isPending: isUpdating } =
    useUpdateSemester();

  const semester = semesterResponse?.ok ? semesterResponse.body : undefined;

  const onSubmit = async (data: CreateSemesterSchemaType) => {
    if (!semester) return;

    console.log(data);

    await updateSemester(
      {
        id: semester.id,
        data: {
          semesterCode: data.semesterCode,
          semesterName: data.semesterName,
          startDate: convertISOToDateString(data.startDate),
          endDate: convertISOToDateString(data.endDate),
        },
      },
      {
        onSuccess: (response) => {
          if (response.ok) {
            toast.success("Cập nhật học kỳ thành công");
            navigate(ROUTES.ADMIN.SEMESTERS.ROOT);
          } else {
            toast.error(translate(response.error.message));
          }
        },
      }
    );
  };

  if (isFetchingSemester) {
    return <LoadingPage type="page" />;
  }

  return (
    <SemesterForm
      isLoading={isUpdating}
      onSubmit={onSubmit}
      semester={semester}
      refetch={refetch}
    />
  );
};
