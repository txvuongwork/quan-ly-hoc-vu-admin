import { useGetSubjectById, useUpdateSubject } from "@/api/subjectApi";
import { ROUTES } from "@/constants";
import { useCommonData } from "@/hooks/useCommonData";
import { LoadingPage } from "@/pages/LoadingPage";
import { type CreateSubjectSchemaType } from "@/schemas";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { SubjectForm } from "./components";

export const EditSubjectPage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const {
    majors: { data: majors },
    isAnyFetching,
  } = useCommonData(["majors"]);
  const { data: subjectResponse, isFetching: isLoadingSubject } =
    useGetSubjectById(id);
  const { mutateAsync: updateSubject, isPending: isUpdating } =
    useUpdateSubject();

  const subject = subjectResponse?.ok ? subjectResponse.body : undefined;

  const onSubmit = async (data: CreateSubjectSchemaType) => {
    if (!subject) return;

    await updateSubject(
      {
        id: subject.id,
        data: {
          subjectCode: data.subjectCode,
          subjectName: data.subjectName,
          majorId: Number(data.majorId),
          credits: Number(data.credits),
          description: data.description,
        },
      },
      {
        onSuccess: (response) => {
          if (response.ok) {
            toast.success("Cập nhật môn học thành công");
            navigate(ROUTES.ADMIN.SUBJECTS.ROOT);
          } else {
            toast.error(response.error.message);
          }
        },
      }
    );
  };

  if (isAnyFetching || isLoadingSubject) {
    return <LoadingPage type="page" />;
  }

  return (
    <SubjectForm
      majors={majors}
      isLoading={isUpdating}
      onSubmit={onSubmit}
      subject={subject}
    />
  );
};
