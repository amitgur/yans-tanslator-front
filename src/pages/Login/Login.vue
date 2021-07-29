<template>
  <div
    class="column justify-center items-center content-center full-width full-height bg-blue-grey-2"
  >
    <div class="column">
      <h3 class="text-center q-mt-xs">Login</h3>
      <q-card square bordered class="q-pa-lg shadow-1 login">
        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              square
              filled
              clearable
              v-model="username"
              type="text"
              label="Username"
              :rules="[(val) => !!val || 'Field is required']"
            />
            <q-input
              square
              filled
              clearable
              v-model="password"
              type="password"
              label="Password"
              :rules="[(val) => !!val || 'Field is required']"
            />
            <q-toggle v-model="rememberMe" label="Remember Me"></q-toggle>
          </q-form>
        </q-card-section>
        <q-card-actions class="q-px-md">
          <q-btn
            unelevated
            color="light-green-7"
            size="lg"
            class="full-width"
            label="Login"
            @click.prevent="login"
            v-on:keyup.enter.prevent="login"
          />
        </q-card-actions>
      </q-card>
      <q-btn color="primary" to="/sign-up" class="q-mt-sm"
        >Sign up for new users</q-btn
      >
    </div>
  </div>
</template>

<script>
import myMixins from "src/mixins/myMixins";
import { mapState } from "vuex";

export default {
  name: "Login",
  mixins: [myMixins],
  data() {
    return {
      username: null,
      password: null,
      rememberMe: false,
    };
  },
  methods: {
    async login() {
      if (!this.username || !this.password) {
        this.myDialog("Some of the fields are missing");
        return;
      }

      // login user
      const user = {
        username: this.username,
        password: this.password,
        rememberMe: this.rememberMe,
      };
      try {
        const response = await this.$axios.post("/apiV1/login_user", user);
        // route to login
        await this.$store.dispatch("Auth/signIn", response.data);
        const isAdmin = this.$store.getters["Auth/getIsAdmin"];
        isAdmin
          ? this.$router.push("/admin-translator")
          : this.$router.push("/translator");
      } catch (err) {
        this.serverError(err);
      }
    },
  },
  computed: {
    ...mapState("Auth", ["isSignIn"]),
  },
  // mounted() {
  //   window.addEventListener("keyup", (e) => {
  //     if (e.code === "Enter") {
  //       this.login();
  //     }
  //   });
  // },
  created() {
    if (this.isSignIn) {
      this.$router.push("/");
    }
  },
};
</script>

<style scoped>
.login {
  min-width: 20em;
}
</style>
