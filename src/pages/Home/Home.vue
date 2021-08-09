<template>
  <q-layout view="lHh lpr lFf">
    <my-menu :menu-list="menuList" language="he" />
    <q-page-container>
      <q-page class="column items-center">
        <section id="top-section">
          <div id="title" class="text-center">
            <h1 id="logo-title" class="hebrew-big text-capitalize">
              Welcome{{ isSignIn ? " " + user.name : "" }}!
            </h1>
            <q-btn
              rounded
              class="q-mt-md q-px-lg"
              size="lg"
              color="blue-5"
              label="start translating"
              @click="goToTranslator"
            />
            <!-- <h4 class="logo-subtitle q-mt-md">Your SubTitle</h4> -->
          </div>
        </section>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import MyMenu from "components/MyMenu";
import myMixins from "src/mixins/myMixins";
import menuList from "pages/menuList";

import { mapState } from "vuex";

export default {
  mixins: [myMixins],
  components: { MyMenu },
  name: "Home",

  data() {
    return {
      scrollOn: false,
      left: false,
      menuList,
    };
  },
  methods: {
    async goToTranslator() {
      let path = "/translator";

      if (!this.isSignIn) {
        path = "/login";
      }

      if (this.user?.profile === "admin") {
        path = "/admin";
      }

      try {
        await this.$router.push(path);
      } catch (err) {
        console.log(err);
      }
    },
  },
  mounted() {},
  computed: {
    ...mapState("Auth", ["user", "isSignIn"]),
  },
  async created() {
    await this.$store.dispatch("Auth/checkSignIn");
  },
};
</script>
<style lang="scss" scoped>
#top-section {
  height: calc(100vh - 90px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
#title {
  #logo-title {
    font-size: 80px;
    letter-spacing: 2px;
    color: $primary;
    font-weight: 700;
    margin: 0;
    text-align: center;
  }
  #logo-subtitle {
    margin: 0;
    color: $primary;
    font-weight: 400;
    font-size: 40px;
    text-align: center;
  }
}

// breakpoint 1024
@media (max-width: $breakpoint-sm-max) {
}

// breakpoint 600
@media (max-width: $breakpoint-xs-max) {
}
</style>
