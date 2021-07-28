const routes = [
  /***************
   * Login routes
   **************/

  {
    path: "/login",
    component: () => import("pages/Login/Login.vue"),
  },

  /****************
   * Sign Up routes
   ***************/

  {
    path: "/sign-up",
    component: () => import("pages/SignUp/SignUp"),
  },

  /**************
   *  routes
   *************/

  {
    path: "/translator",
    meta: { requiresAuth: true },
    component: () => import("pages/Translator/Translator"),
  },
  {
    path: "/",
    component: () => import("pages/Home/Home.vue"),
  },
  {
    path: "/admin-translator",
    meta: { requiresAuth: true },
    component: () => import("pages/AdminTranslator/AdminTranslator"),
  },
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404.vue"),
  });
}

export default routes;
