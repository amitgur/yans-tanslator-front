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
              type="email"
              label="Email"
              :rules="[
                (val) => !!val || 'Field is required',
                this.validateEmail,
              ]"
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
            <q-input
              square
              filled
              clearable
              v-model="magicWord"
              type="text"
              label="Magic Word"
              :rules="[(val) => !!val || 'Field is required']"
            />
            <q-select
              filled
              v-model="languageTo"
              :options="languageList"
              label="Language"
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
import emailRegex from "email-regex";

export default {
  name: "SignUp",
  mixins: [myMixins],
  data() {
    return {
      username: null,
      password: null,
      name: null,
      magicWord: null,
      languageTo: null,
      languageList,
    };
  },
  methods: {
    validateEmail(val) {
      return !!emailRegex().test(val) || "Not a valid Email";
    },

    async signUp() {
      if (!this.username || !this.password || !this.name || !this.magicWord) {
        this.myDialog("Some of the fields are missing");
        return;
      }
      if (!emailRegex().test(this.username)) {
        // not a valid email
        this.myDialog("Please enter a valid Email");
        return;
      }
      if (this.password && this.password.length < 4) {
        // too short password
        this.myDialog(
          "Your password should have minimum of 4 letters or numbers"
        );
        return;
      }
      if (this.magicWord !== process.env.MAGIC_WORD) {
        this.myDialog("Check again your magic word");
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
      let response;
      try {
        response = await this.$axios.post("/apiV1/sign_up", user);
        // route to login
        this.myDialog(response.data.msg);
        if (response.data.status === "ok") {
          this.login(user);
        }
      } catch (err) {
        this.serverError(err);
      }
    },

    async login(user) {
      try {
        const response = await this.$axios.post("/apiV1/login_user", user);
        // route to login
        this.$store.dispatch("Auth/signIn", response.data);
        this.$router.push("/");
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
