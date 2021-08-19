<template>
  <div
    class="column q-pa-xl justify-center items-center content-center full-width bg-blue-grey-2"
  >
    <div class="column">
      <h3 class="text-center">Sign Up</h3>
      <q-card square bordered class="q-pa-lg shadow-1 signup">
        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              square
              filled
              clearable
              v-model="username"
              type="username"
              label="Username"
              :rules="[(val) => !!val || 'Field is required']"
            />
            <q-input
              square
              filled
              clearable
              v-model="name"
              type="text"
              label="Full Name"
              :rules="[(val) => !!val || 'Field is required']"
            />
            <p class="hint">Enter password with minimum 4 letters or numbers</p>
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
            <q-input
              square
              filled
              clearable
              v-model="secretWord"
              type="text"
              label="Secret Word"
              :rules="[(val) => !!val || 'Field is required']"
            />
          </q-form>
        </q-card-section>
        <q-card-actions class="q-px-md">
          <q-btn
            unelevated
            color="light-green-7"
            size="lg"
            class="full-width"
            label="Sign Up"
            @click="signUp"
          />
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script>
import myMixins from "src/mixins/myMixins";

export default {
  name: "SignUp",
  mixins: [myMixins],
  data() {
    return {
      username: null,
      password: null,
      name: null,
      secretWord: null,
      isPwd: true,
    };
  },
  methods: {
    // Checks all necessary credentials in order to sign up
    async signUp() {
      if (!this.username || !this.password || !this.name || !this.secretWord) {
        this.myDialog("Some of the fields are missing");
        return;
      }

      if (this.password && this.password.length < 4) {
        // too short password
        this.myDialog(
          "Your password should have minimum of 4 letters or numbers"
        );
        return;
      }
      if (
        this.secretWord !== process.env.TRANSLATOR_WORD &&
        this.secretWord !== process.env.ADMIN_WORD
      ) {
        this.myDialog("Check again your secret word");
        return;
      }
      // register user
      const user = {
        username: this.username,
        password: this.password,
        name: this.name,
      };
      if (this.secretWord === process.env.ADMIN_WORD) {
        user.profile = "admin";
      }
      let response;
      try {
        response = await this.$axios.post("/apiV1/sign_up", user);
        // send to login
        this.myDialog(response.data.msg);
        if (response.data.status === "ok") {
          this.autoLogin(user);
        }
      } catch (err) {
        this.serverError(err);
      }
    },

    // Routes to the specific page based on permissions
    async autoLogin(user) {
      try {
        const response = await this.$axios.post("/apiV1/login_user", user);
        // auto-login
        this.$store.dispatch("Auth/signIn", response.data);
        user.profile === "admin"
          ? this.$router.push("/admin")
          : this.$router.push("/translator");
      } catch (err) {
        this.serverError(err);
      }
    },
  },
};
</script>
<style scoped>
.signup {
  min-width: 22em;
}
.hint {
  opacity: 0.5;
}
body {
  margin: 10em;
}
</style>
