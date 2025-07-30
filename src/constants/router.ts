export const ROUTES = {
  APP: {
    ROOT: "/",
    HOME: "/",
    REGISTER_CLASS: "/register-class",
  },
  ADMIN: {
    ROOT: "/admin",
    SUBJECTS: {
      ROOT: "/admin/subjects",
      CREATE: "/admin/subjects/create",
      EDIT: "/admin/subjects/:id",
    },
    MAJOR: {
      ROOT: "/admin/majors",
      CREATE: "/admin/majors/create",
      EDIT: "/admin/majors/:id",
    },
    CLASSES: {
      ROOT: "/admin/classes",
      CREATE: "/admin/classes/create",
      EDIT: "/admin/classes/:id",
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
