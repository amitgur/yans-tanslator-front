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
              :type="isPwd ? 'password' : 'text'"
              label="Password"
              :rules="[(val) => !!val || 'Field is required']"
            >
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
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
      isPwd: true,
    };
  },
  methods: {
    // Checks for all the necessary credentials to login
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
        if (isAdmin) {
          this.$router.push("/admin");
        } else {
          this.$router.push("/translator");
          if (!this.user.databases.length) {
            this.myDialog(
              "You haven't been approved for any Databases yet. Contact an Admin to get approved."
            );
          }
        }
      } catch (err) {
        this.serverError(err);
      }
    },
  },
  computed: {
    ...mapState("Auth", ["user", "isSignIn"]),
  },

  // Routes to landing page from sign in
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
