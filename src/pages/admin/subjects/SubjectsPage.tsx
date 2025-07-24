import { ROUTES } from "@/constants";
import type { FunctionComponent } from "react";
import { Link } from "react-router-dom";

export const SubjectsPage: FunctionComponent = () => {
  return (
    <div>
      <Link to={ROUTES.ADMIN.SUBJECTS.CREATE}>Create</Link>
    </div>
  );
};
