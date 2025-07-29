import { ROUTES } from "@/constants";
import { useCommonData } from "@/hooks/useCommonData";
import { LoadingPage } from "@/pages/LoadingPage";
import { type CreateClassSchemaType } from "@/schemas";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ClassForm } from "./components";
import { useCreateClass } from "@/api/classApi";
import { translate } from "@/translate/helpers";

export const CreateClassPage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const {
    subjects: { data: subjects },
    semesters: { data: semesters },
    teachers: { data: teachers },
    isAnyFetching,
  } = useCommonData(["subjects", "semesters", "teachers"]);

  const { mutateAsync: createClass, isPending: isCreating } = useCreateClass();

  const onSubmit = async (data: CreateClassSchemaType) => {
    await createClass(data, {
      onSuccess: (response) => {
        if (response.ok) {
          toast.success("Tạo lớp học thành công");
          navigate(ROUTES.ADMIN.CLASSES.ROOT);
        } else {
          toast.error(translate(response.error.message));
        }
      },
    });
  };

  if (isAnyFetching) {
    return <LoadingPage type="page" />;
  }

  return (
    <ClassForm
      subjects={subjects}
      semesters={semesters}
      teachers={teachers}
      isLoading={isCreating}
      onSubmit={onSubmit}
    />
  );
};
