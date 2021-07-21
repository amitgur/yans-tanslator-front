<template>
  <q-layout view="lHh lpr lFf">
    <my-menu :menu-list="menuList" language="he" />
    <q-page-container>
      <q-page class="items-center">
        <!-- tab section -->

        <div class="q-mx-xl q-px-xl q-mt-lg">
          <q-input
            bottom-slots
            v-model="searchText"
            label="Search"
            style="max-width: 400px"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>

          <!-- tabs -->
          <div>
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
                  @click="pageFilter('jukebox')"
                />
                <q-tab name="site" label="site" @click="pageFilter('site')" />
                <q-tab
                  name="error"
                  label="error"
                  @click="pageFilter('error')"
                />
                <q-tab
                  name="phonegap"
                  label="phonegap"
                  @click="pageFilter('phonegap')"
                />
                <q-tab
                  name="recorder"
                  label="recorder"
                  @click="pageFilter('recorder')"
                />
                <q-tab
                  name="passport"
                  label="passport"
                  @click="pageFilter('passport')"
                />
                <q-tab
                  name="profile"
                  label="profile"
                  @click="pageFilter('profile')"
                />
                <q-tab name="sign" label="sign" @click="pageFilter('sign')" />
                <q-tab name="idm" label="idm" @click="pageFilter('idm')" />
              </q-tabs>
            </q-card>
          </div>

          <!-- table header -->
          <div class="q-pa-md">
            <div class="row">
              <div class="col-4">Source Language Text</div>
              <div class="col-6">Input</div>
              <div class="col" style="text-align: right">Details</div>
              <div class="col">Update Translation</div>
            </div>
          </div>

          <!-- table content -->
          <div class="q-pa-md">
            <div
              v-for="item in displayData"
              :key="item.key"
              class="row justify-center items-center q-py-md q-my-sm bg-blue-grey-1"
            >
              <div class="col-4">
                {{ item.text }}
              </div>
              <div class="col-6">
                <q-input
                  outlined
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
                      <div class="text-h5">Description:</div>
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
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import MyMenu from "components/MyMenu";
import menuList from "pages/Translator/menuList";
import myMixins from "src/mixins/myMixins";
import bandpadLanguagePages from "pages/languagePages";

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
      bandpadLanguagePages,
    };
  },
  methods: {
    pageFilter(filterString) {
      this.displayData = this.allData.filter((e) => e.page === filterString);
      console.log(this.displayData);
    },
  },
  async created() {
    const firstTab = "jukebox";
    this.tab = firstTab;
    try {
      const res = await this.$axios.get("/apiV1/get_translates");
      this.allData = res.data;
      this.pageFilter(firstTab);
    } catch (err) {
      this.serverError(err);
    }
  },
};
</script>

<style lang="scss" scoped></style>
