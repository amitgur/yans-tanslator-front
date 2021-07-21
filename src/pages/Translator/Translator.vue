<template>
  <q-layout view="lHh lpr lFf">
    <my-menu :menu-list="menuList" language="he" />
    <q-page-container>
      <q-page class="items-center">
        <section id="top-section">
          <h4
            class="q-ml-xl q-mr-xl q-pl-xl q-pr-xl q-pt-none q-mt-xl q-pb-none q-mb-none"
          >
            Translate Pages for ...
          </h4>
          <div class="q-ml-xl q-pl-xl q-mr-xl q-pr-xl q-mt-lg">
            <div class="filters">
              <q-card>
                <q-tabs
                  v-model="tab"
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="justify"
                  keep-alive
                >
                  <q-tab
                    name="jukebox"
                    label="jukebox"
                    @click="filter('jukebox')"
                  />
                  <q-tab name="site" label="site" @click="filter('site')" />
                  <q-tab name="error" label="error" @click="filter('error')" />
                  <q-tab
                    name="phonegap"
                    label="phonegap"
                    @click="filter('phonegap')"
                  />
                  <q-tab
                    name="recorder"
                    label="recorder"
                    @click="filter('recorder')"
                  />
                  <q-tab
                    name="passport"
                    label="passport"
                    @click="filter('passport')"
                  />
                  <q-tab
                    name="profile"
                    label="profile"
                    @click="filter('profile')"
                  />
                  <q-tab name="sign" label="sign" @click="filter('sign')" />
                  <q-tab name="idm" label="idm" @click="filter('idm')" />
                </q-tabs>
              </q-card>
              <q-input bottom-slots v-model="searchText" label="Search">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <div class="row">
                <div class="col-4">
                  Source Language Text
                </div>
                <div class="col-6">
                  Input
                </div>
                <div class="col" style="text-align: right">
                  Details
                </div>
                <div class="col">
                  Update Translation
                </div>
              </div>
            </div>

            <div class="q-pa-md">
              <div v-for="item in displayData" :key="item.key" class="row">
                <div class="col-4">
                  {{ item.text }}
                </div>
                <div class="col-6">
                  <q-input
                    class="text-body1"
                    v-model="item.translatedText.en"
                    autogrow
                  />
                </div>
                <div class="col" style="text-align: right">
                  <q-btn round color="accent" icon="info">
                    <q-popup-proxy>
                      <q-banner>
                        <template v-slot:avatar>
                          <q-icon name="info" color="primary" />
                        </template>
                        <div class="text-h5">
                          Description:
                        </div>
                        <hr color="lightgrey" size="0.5" />
                        <div class="text-h6">
                          {{ item.description ? item.description : "-" }}
                        </div>
                        <br />
                        <div class="text-h6">
                          Key:
                          {{ item.key }}
                        </div>
                      </q-banner>
                    </q-popup-proxy>
                  </q-btn>
                </div>
                <div class="col" style="text-align: center">
                  <q-btn color="white" text-color="black" label="Update" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import MyMenu from "components/MyMenu";
import menuList from "pages/Translator/menuList";
import myMixins from "src/mixins/myMixins";

export default {
  name: "Translator",
  mixins: [myMixins],
  components: { MyMenu },
  data() {
    return {
      scrollOn: false,
      left: false,
      menuList,
      tab: "",
      allData: [],
      displayData: [],
      translateText: "",
      searchText: "",
    };
  },
  async created() {
    const firstTab = "jukebox";
    this.tab = firstTab;
    try {
      const res = await this.$axios.get("/apiV1/get_translates");
      this.allData = res.data;
      this.filter(firstTab);
    } catch (err) {
      this.serverError(err);
    }
  },
  methods: {
    filter(filterString) {
      this.displayData = this.allData.filter((e) => e.page == filterString);
      console.log(this.displayData);
    },
  },
};
</script>

<style lang="sass" scoped>
.row > div
  padding: 10px 15px
  background: #fff
  border-bottom: 1px solid rgba(86, 61, 124, 0.2)
</style>
