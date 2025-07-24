import { MainLayout } from "@/components/layout";
import { AdminPrivate } from "@/components/private";
import { Toaster } from "@/components/ui";
import { ROUTES } from "@/constants";
import "@/index.css";
import * as Pages from "@/pages";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: ROUTES.APP.ROOT,
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Pages.DashboardPage />,
      },
      {
        path: ROUTES.ADMIN.ROOT,
        children: [
          {
            index: true,
            element: (
              <AdminPrivate>
                <Pages.AdminDashboardPage />
              </AdminPrivate>
            ),
          },
          {
            path: ROUTES.ADMIN.SUBJECTS.ROOT,
            children: [
              {
                index: true,
                element: <Pages.SubjectsPage />,
              },
              {
                path: ROUTES.ADMIN.SUBJECTS.CREATE,
                element: <Pages.CreateSubjectPage />,
              },
            ],
          },
        ],
      },
    ],
  },
  {
    path: ROUTES.AUTH.ROOT,
    children: [
      {
        path: ROUTES.AUTH.LOGIN,
        element: <Pages.LoginPage />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster richColors />
    </QueryClientProvider>
  </StrictMode>
);
