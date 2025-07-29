import { useCreateSubject } from "@/api/subjectApi";
import { ROUTES } from "@/constants";
import { useCommonData } from "@/hooks/useCommonData";
import { LoadingPage } from "@/pages/LoadingPage";
import { type CreateSubjectSchemaType } from "@/schemas";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { SubjectForm } from "./components";

export const CreateSubjectPage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const {
    majors: { data: majors },
    isAnyFetching,
  } = useCommonData(["majors"]);
  const { mutateAsync: createSubject, isPending: isCreating } =
    useCreateSubject();

  const onSubmit = async (data: CreateSubjectSchemaType) => {
    await createSubject(
      {
        subjectCode: data.subjectCode,
        subjectName: data.subjectName,
        majorId: Number(data.majorId),
        credits: Number(data.credits),
        description: data.description,
      },
      {
        onSuccess: (response) => {
          if (response.ok) {
            toast.success("Tạo môn học thành công");
            navigate(ROUTES.ADMIN.SUBJECTS.ROOT);
          } else {
            toast.error(response.error.message);
          }
        },
      }
    );
  };

  if (isAnyFetching) {
    return <LoadingPage type="page" />;
  }

  return (
    <SubjectForm majors={majors} isLoading={isCreating} onSubmit={onSubmit} />
  );
};
