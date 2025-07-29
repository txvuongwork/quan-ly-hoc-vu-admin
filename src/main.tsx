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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    },
  },
});

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
            path: ROUTES.ADMIN.SUBJECTS.ROOT,
            children: [
              {
                index: true,
                element: (
                  <AdminPrivate>
                    <Pages.SubjectsPage />
                  </AdminPrivate>
                ),
              },
              {
                path: ROUTES.ADMIN.SUBJECTS.CREATE,
                element: (
                  <AdminPrivate>
                    <Pages.CreateSubjectPage />
                  </AdminPrivate>
                ),
              },
              {
                path: ROUTES.ADMIN.SUBJECTS.EDIT,
                element: (
                  <AdminPrivate>
                    <Pages.EditSubjectPage />
                  </AdminPrivate>
                ),
              },
            ],
          },
          {
            path: ROUTES.ADMIN.MAJOR.ROOT,
            children: [
              {
                index: true,
                element: (
                  <AdminPrivate>
                    <Pages.MajorsPage />
                  </AdminPrivate>
                ),
              },
              {
                path: ROUTES.ADMIN.MAJOR.CREATE,
                element: (
                  <AdminPrivate>
                    <Pages.CreateMajorPage />
                  </AdminPrivate>
                ),
              },
              {
                path: ROUTES.ADMIN.MAJOR.EDIT,
                element: (
                  <AdminPrivate>
                    <Pages.EditMajorPage />
                  </AdminPrivate>
                ),
              },
            ],
          },
          {
            path: ROUTES.ADMIN.CLASSES.ROOT,
            children: [
              {
                index: true,
                element: (
                  <AdminPrivate>
                    <Pages.ClassesPage />
                  </AdminPrivate>
                ),
              },
              {
                path: ROUTES.ADMIN.CLASSES.CREATE,
                element: (
                  <AdminPrivate>
                    <Pages.CreateClassPage />
                  </AdminPrivate>
                ),
              },
              {
                path: ROUTES.ADMIN.CLASSES.EDIT,
                element: (
                  <AdminPrivate>
                    <Pages.EditClassPage />
                  </AdminPrivate>
                ),
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
