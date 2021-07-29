import Vue from "vue";
import VueRouter from "vue-router";
import routes from "./routes";

Vue.use(VueRouter);

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function({ store }) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE,
  });

  // check authentication
  Router.beforeEach(async (to, from, next) => {
    if (to.matched.some((route) => route.meta.requiresAuth)) {
      // init user for the first time
      await store.dispatch("Auth/checkSignIn");
      const isSignIn = store.getters["Auth/getIsSignIn"];
      // route by user
      if (isSignIn) {
        next();
      } else {
        next("/login");
      }
    } else if (to.matched.some((route) => route.meta.requiresAdminAuth)) {
      // init user for the first time
      await store.dispatch("Auth/checkSignIn");
      const isAdmin = store.getters["Auth/getIsAdmin"];
      // route by user
      if (isAdmin) {
        next();
      } else {
        next("/login");
      }
    } else {
      // user was init
      next();
    }
  });
  return Router;
}
