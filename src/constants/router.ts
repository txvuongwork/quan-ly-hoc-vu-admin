export const ROUTES = {
  APP: {
    ROOT: "/",
    HOME: "/",
  },
  ADMIN: {
    ROOT: "/admin",
    DASHBOARD: "/admin",
    SUBJECTS: {
      ROOT: "/admin/subjects",
      CREATE: "/admin/subjects/create",
      EDIT: "/admin/subjects/:id",
    },
  },
  TEACHER: {
    ROOT: "/teacher",
    DASHBOARD: "/teacher",
  },
  AUTH: {
    ROOT: "/auth",
    LOGIN: "/auth/login",
  },
};
