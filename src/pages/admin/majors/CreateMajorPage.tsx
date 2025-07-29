import { useCreateMajor } from "@/api/majorApi";
import { ROUTES } from "@/constants";
import { type CreateMajorSchemaType } from "@/schemas";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { MajorForm } from "./components";

export const CreateMajorPage: React.FunctionComponent = () => {
  const navigate = useNavigate();
  const { mutateAsync: createMajor, isPending: isCreating } = useCreateMajor();

  const onSubmit = async (data: CreateMajorSchemaType) => {
    await createMajor(
      {
        majorCode: data.majorCode,
        majorName: data.majorName,
        description: data.description,
      },
      {
        onSuccess: (response) => {
          if (response.ok) {
            toast.success("Tạo ngành học thành công");
            navigate(ROUTES.ADMIN.MAJOR.ROOT);
          } else {
            toast.error(response.error.message);
          }
        },
      }
    );
  };

  return <MajorForm isLoading={isCreating} onSubmit={onSubmit} />;
};
