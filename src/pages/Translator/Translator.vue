<template>
  <q-layout view="lHh lpr lFf">
    <q-scroll-observer @scroll="onTranslatorScroll" />
    <my-menu :menu-list="menuList" language="he" />
    <q-page-container>
      <q-page class="items-center">
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
                  v-for="page in bandpadLanguagePages"
                  :key="page"
                  :name="page"
                  :label="page"
                  @click="pageFilter(page)"
                />
              </q-tabs>
            </q-card>
          </div>

          <!-- table header -->
          <div class="q-px-md q-pt-xl q-pb-sm">
            <div class="row text-bold">
              <div class="col-4">Source Language Text</div>
              <div class="col-6">Input</div>
              <div class="col text-right q-pr-lg">Details</div>
            </div>
          </div>

          <!-- table content -->
          <div class="q-px-md">
            <div
              v-for="item in displayData"
              :key="item.key"
              class="row justify-center items-center q-py-md q-my-sm bg-blue-grey-1"
              style="border-radius: 0.4em"
            >
              <div class="col-4 q-px-md">
                {{ item.text }}
              </div>
              <div class="col-6">
                <q-input
                  class="text-body1"
                  v-model="item.translatedText.en"
                  autogrow
                  @keydown="storeChanges(item.key, item.translatedText.en)"
                  bg-color="white"
                  outlined
                />
              </div>
              <div class="col text-right q-pr-lg">
                <q-btn round color="accent" icon="info">
                  <q-popup-proxy>
                    <q-banner class="q-pa-lg">
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
            </div>
          </div>
          <q-btn
            :color="changedDataSize == 0 ? 'grey' : 'positive'"
            text-color="black"
            label="Update"
            @click="updateTranslation"
            :class="{
              'text-subtitle1': true,
              'q-px-md': true,
              'q-py-xs': true,
              'update-button': !scrollOn,
              'update-button-scroll': scrollOn,
              'button-transition': true,
            }"
          >
            <q-badge
              rounded
              color="red"
              floating
              :class="changedDataSize == 0 ? 'invisible' : ''"
              class="button-transition"
              >{{ changedDataSize }}</q-badge
            >
          </q-btn>
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
      changedData: new Map(),
      changedDataSize: 0,
    };
  },
  methods: {
    pageFilter(filterString) {
      this.displayData = this.allData.filter((e) => e.page === filterString);
    },
    onTranslatorScroll(info) {
      if (info.position > 50) {
        this.scrollOn = true;
      } else {
        this.scrollOn = false;
      }
    },
    storeChanges(key, changes) {
      this.changedData.set(key, changes);
      this.changedDataSize = this.changedData.size;
    },
    async updateTranslation() {
      const obj = Object.fromEntries(this.changedData);
      const res = await this.$axios.post("/apiV1/update_translations", obj);
      console.log(res);
    },
  },
  async created() {
    const firstTab = "site";
    this.tab = firstTab;
    try {
      const res = await this.$axios.get("/apiV1/get_translations");
      this.allData = res.data;
      this.pageFilter(firstTab);
    } catch (err) {
      this.serverError(err);
    }
  },
};
</script>

<style lang="scss" scoped>
.update-button {
  position: fixed;
  top: 7em;
  right: 2em;
  transition: top 0.5s;
}

.update-button-scroll {
  position: fixed;
  top: 4em;
  right: 2em;
  transition: top 0.6s;
}
.button-transition {
  transition: all 0.3s;
}
</style>
