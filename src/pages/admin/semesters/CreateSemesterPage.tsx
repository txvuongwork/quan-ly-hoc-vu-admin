import { useCreateSemester } from "@/api/semesterApi";
import { ROUTES } from "@/constants";
import { type CreateSemesterSchemaType } from "@/schemas";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SemesterForm } from "./components";
import { translate } from "@/translate/helpers";
import { convertISOToDateString } from "@/lib/utils";

export const CreateSemesterPage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { mutateAsync: createSemester, isPending: isCreating } =
    useCreateSemester();

  const onSubmit = async (data: CreateSemesterSchemaType) => {
    await createSemester(
      {
        semesterCode: data.semesterCode,
        semesterName: data.semesterName,
        startDate: convertISOToDateString(data.startDate),
        endDate: convertISOToDateString(data.endDate),
      },
      {
        onSuccess: (response) => {
          if (response.ok) {
            toast.success("Tạo học kỳ thành công");
            navigate(ROUTES.ADMIN.SEMESTERS.ROOT);
          } else {
            toast.error(translate(response.error.message));
          }
        },
      }
    );
  };

  return <SemesterForm isLoading={isCreating} onSubmit={onSubmit} />;
};
