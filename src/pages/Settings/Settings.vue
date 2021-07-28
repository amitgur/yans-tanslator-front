<template>
  <q-layout view="lHh lpr lFf">
    <my-menu :menu-list="menuList" language="he" />
    <q-page-container>
      <q-page class="column items-center">
        <section id="top-section">
          <div id="title" class="text-center">
            <h1 id="logo-title" class="hebrew-big">Settings</h1>
          </div>
          <div class="languages">
            <h2>Languages</h2>
            <div class="row">
              <div class="col-6">
                <div class="text-h6 q-px-sm">Langauge From</div>
                <q-select
                  filled
                  v-model="languageFrom"
                  :options="languageList.from"
                  class="q-pa-sm"
                  @input="languageUpdated"
                />
              </div>
              <div class="col-6">
                <div class="text-h6 q-px-sm">Langauge To</div>
                <q-select
                  filled
                  v-model="languageTo"
                  :options="languageList.to"
                  class="q-pa-sm"
                  @input="languageUpdated"
                />
              </div>
            </div>
          </div>
          <div class="password">
            <h2>Password</h2>
          </div>
          <div class="privileges">
            <h2>Privileges</h2>
          </div>
        </section>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import MyMenu from "components/MyMenu";
import myMixins from "src/mixins/myMixins";
import menuList from "pages/Settings/menuList";
import languageList from "pages/Settings/languageList";
import { mapState } from "vuex";

export default {
  mixins: [myMixins],
  components: { MyMenu },
  name: "Settings",

  data() {
    return {
      scrollOn: false,
      left: false,
      menuList,
      languageTo: null,
      languageFrom: null,
      languageList,
    };
  },
  computed: {
    ...mapState("Auth", ["user"]),
  },
  methods: {
    async languageUpdated() {
      const updatedLanguages = {
        from: this.languageFrom,
        to: this.languageTo,
        id: this.user.id,
      };
      try {
        const response = await this.$axios.post(
          "/apiV1/update_languages",
          updatedLanguages
        );
      } catch (err) {
        this.serverError(err);
      }
    },
  },
  mounted() {},
  async created() {
    this.languageFrom = this.languageList.from.find(
      (e) => e.tag == this.user.languageFrom
    );
    this.languageTo = this.languageList.to.find(
      (e) => e.tag == this.user.languageTo
    );
  },
};
</script>
<style lang="scss" scoped>
#top-section {
  height: calc(100vh - 90px);
  width: 80vw;
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
