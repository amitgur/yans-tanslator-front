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

          <!-- tabs -page selector -->
          <div>
            <q-card>
              <q-tabs
                class="bg-primary text-white"
                v-model="tab"
                align="justify"
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
          <div class="q-pa-md">
            <div class="row table-header">
              <div class="col-4"><div>Source Language Text</div></div>
              <div class="col-6"><span>Input</span></div>
              <div class="col" style="text-align: right">Details</div>
              <div class="col">Update</div>
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
                    <q-banner class="q-pa-lg">
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
          <q-btn
            color="white"
            text-color="black"
            label="Update"
            @click="updateTranslation"
            :class="{
              'text-subtitle1': true,
              'q-px-md': true,
              'q-py-xs': true,
              'update-button': !scrollOn,
              'update-button-scroll': scrollOn,
            }"
          >
            <q-badge rounded color="red" floating>{{
              changedDataSize
            }}</q-badge>
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
    updateTranslation() {},
  },
  async created() {
    const firstTab = "site";
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
