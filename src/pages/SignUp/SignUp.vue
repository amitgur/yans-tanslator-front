<template>
  <div
    class="column justify-center items-center content-center full-width full-height bg-blue-grey-2"
  >
    <div class="column">
      <h3 class="text-center q-mt-xs">Sign Up</h3>
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
              type="password"
              label="Password"
              :rules="[(val) => !!val || 'Field is required']"
            />
            <p class="hint">Select language to translate to</p>
            <q-select
              filled
              v-model="languageTo"
              :options="languageList"
              label="Language"
            />
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
import languageList from "pages/SignUp/languageList";

export default {
  name: "SignUp",
  mixins: [myMixins],
  data() {
    return {
      username: null,
      password: null,
      name: null,
      secretWord: null,
      languageTo: languageList[0],
      languageList,
    };
  },
  methods: {
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
        this.secretWord != process.env.TRANSLATOR_WORD &&
        this.secretWord != process.env.ADMIN_WORD
      ) {
        this.myDialog("Check again your secret word");
        return;
      }
      if (!this.languageTo) {
        this.myDialog("Please select a language to translate to");
        return;
      }
      // register user
      const user = {
        username: this.username,
        password: this.password,
        name: this.name,
        languageTo: this.languageTo.tag,
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

    async autoLogin(user) {
      try {
        const response = await this.$axios.post("/apiV1/login_user", user);
        // auto-login
        this.$store.dispatch("Auth/signIn", response.data);
        this.$router.push("/translator");
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
</style>
