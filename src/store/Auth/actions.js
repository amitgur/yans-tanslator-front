export async function signOut({ commit }) {
  return this._vm.$axios
    .post("/apiV1/logout_user")
    .then(async () => {
      commit("setUser", null);
      commit("setIsSignIn", false);
    })
    .catch((e) => {
      console.error(e);
    });
}

export async function signIn({ commit }, user) {
  commit("setUser", user);
  commit("setIsSignIn", true);
  commit("setAuthChecked", true);
}

export async function checkSignIn({ getters, commit }) {
  return new Promise(async (resolve, reject) => {
    let response;
    if (!getters["getAuthChecked"]) {
      commit("setAuthChecked", true);
      // call server for authentication
      try {
        response = await this._vm.$axios.get("/apiV1/get_user");
        commit("setUser", response.data);
        commit("setIsSignIn", true);
        resolve();
      } catch (err) {
        commit("setUser", null);
        commit("setIsSignIn", false);
        resolve();
      }
    } else {
      resolve();
    }
  });
}
