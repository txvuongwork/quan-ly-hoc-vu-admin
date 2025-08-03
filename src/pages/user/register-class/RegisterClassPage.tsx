import {
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui";
import { useState, type FunctionComponent } from "react";
import { RegisteredTab, RegisterTab } from "./components";
import { useCommonData } from "@/hooks/useCommonData";
import { LoadingPage } from "@/pages/LoadingPage";
import type { TSemester } from "@/types";

interface ContentProps {
  semesters: TSemester[];
}

const Content: FunctionComponent<ContentProps> = ({ semesters }) => {
  const [tab, setTab] = useState<"register" | "registered">("register");

  return (
    <Card>
      <CardContent>
        <Tabs
          value={tab}
          onValueChange={(value) => setTab(value as "register" | "registered")}
        >
          <TabsList>
            <TabsTrigger value="register">Đăng ký</TabsTrigger>
            <TabsTrigger value="registered">Đã đăng ký</TabsTrigger>
          </TabsList>

          {tab === "register" && (
            <TabsContent value="register">
              <RegisterTab semesters={semesters} />
            </TabsContent>
          )}

          {tab === "registered" && (
            <TabsContent value="registered">
              <RegisteredTab semesters={semesters} />
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export const RegisterClassPage: FunctionComponent = () => {
  const {
    semesters: { data: semesters },
    isAnyFetching,
  } = useCommonData(["semesters"]);

  if (isAnyFetching) {
    return <LoadingPage type="page" />;
  }

  return <Content semesters={semesters} />;
};
