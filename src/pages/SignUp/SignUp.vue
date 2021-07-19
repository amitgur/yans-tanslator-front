<template>
  <div
    class="column justify-center items-center content-center full-width full-height bg-blue-grey-2"
  >
    <div class="column">
      <h3 class="text-center q-mt-xs">Sign Up</h3>
      <q-card square bordered class="q-pa-lg shadow-1">
        <q-card-section>
          <q-form class="q-gutter-md">
            <q-input
              square
              filled
              clearable
              v-model="username"
              type="email"
              label="Email"
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
            <p>Enter password with minimum 4 letters or numbers</p>
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
          </q-form>
        </q-card-section>
        <q-card-actions class="q-px-md">
          <q-btn
            unelevated
            color="light-green-7"
            size="lg"
            class="full-width"
            label="Sign In"
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
      magicWord: null,
    };
  },
  methods: {
    async signUp() {
      if (!this.username || !this.password || !this.name || !this.magicWord) {
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
      if (this.magicWord !== process.env.MAGIC_WORD) {
        this.myDialog("Check again your magic word");
        return;
      }
      // register user
      const user = {
        username: this.username,
        password: this.password,
        name: this.name,
      };
      let response;
      try {
        response = await this.$axios.post("/apiV1/sign_up", user);
        // route to login
        this.myDialog(response.data.msg);
        if (response.data.status === "ok") {
          this.$router.push("/login");
        }
      } catch (err) {
        this.serverError(err);
      }
    },
  },
};
</script>
<style scoped></style>
