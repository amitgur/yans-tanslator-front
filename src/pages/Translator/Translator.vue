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

          <!-- tabs -page selector -->
          <div>
            <q-card>
              <q-tabs
                class="bg-primary text-white"
                v-model="tab"
                align="justify"
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
            <div class="row table-header">
              <div class="col-4"><div>Source Language Text</div></div>
              <div class="col-6"><span>Input</span></div>
              <div class="col" style="text-align: right">Details</div>
              <div class="col">Update</div>
            </div>
          </div>

          <!-- table content -->
          <div class="q-pa-md">
            <div
              v-for="item in displayData"
              :key="item.key"
              class="row justify-center items-center q-py-md q-my-sm bg-blue-grey-1"
            >
              <!-- source text -->
              <div class="col-4">
                <div class="q-px-lg q-py-md q-mx-md">
                  <div class="text-italic">{{ item.text }}</div>
                </div>
              </div>
              <div class="col-6">
                <q-input
                  outlined
                  class="bg-white"
                  v-model="item.translatedText.en"
                  autogrow
                >
                  <template v-slot:append>
                    <q-avatar>
                      <q-icon name="las la-pen" />
                    </q-avatar>
                  </template>
                </q-input>
              </div>
              <div class="col-1" style="text-align: center">
                <q-btn class="bg-white" label="details">
                  <q-popup-proxy>
                    <q-banner>
                      <template v-slot:avatar>
                        <q-icon name="info" color="primary" />
                      </template>
                      <div>Description:</div>
                      <hr color="lightgrey" size="0.5" />
                      <div>
                        {{ item.description ? item.description : "-" }}
                      </div>
                      <br />
                      <div>
                        Key:
                        {{ item.key }}
                      </div>
                    </q-banner>
                  </q-popup-proxy>
                </q-btn>
              </div>
              <div class="col-1" style="text-align: center">
                <q-btn color="secondary" text-color="black" label="Update" />
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

<style lang="scss" scoped>
.table-header {
  height: 80px;
  div {
    background-color: #cdd2c6;
    font-size: 14px;
    text-transform: uppercase;
    font-weight: bold;
    height: 100%;
    padding: 0;
    margin: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
