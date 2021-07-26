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
          <div class="q-pa-sm"></div>

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
                  <!-- TODO: This should be the language translating from, not the TEXT -->
                  <div class="text-italic">{{ item.text }}</div>
                </div>
              </div>
              <div class="col-6">
                <q-input
                  outlined
                  class="bg-white"
                  v-model="item.translatedText[user.languageTo]"
                  @keyup="
                    storeChanges(item.key, item.translatedText[user.languageTo])
                  "
                  autogrow
                >
                  <template v-slot:append>
                    <q-avatar>
                      <q-icon name="las la-pen" />
                    </q-avatar>
                  </template>
                </q-input>
              </div>
              <div class="col-2" style="text-align: center">
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
            </div>
          </div>
          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn
              fab
              :color="changedDataSize == 0 ? 'grey-5' : 'accent'"
              text-color="black"
              :label="scrollDown ? '' : 'Update'"
              icon="update"
              @click="updateTranslation"
              class="text-subtitle1 update-button-transition update-button"
              :class="{
                'q-px-lg': !scrollDown,
              }"
            >
              <q-badge
                rounded
                color="red"
                floating
                :class="changedDataSize == 0 ? 'invisible' : ''"
                class="update-button-transition q-px-sm"
                style="font-size: 1em; min-width: 1.5em; height: 1.5em;"
                >{{ changedDataSize }}</q-badge
              >
            </q-btn>
          </q-page-sticky>
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
import { mapState } from "vuex";

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
      currentData: [],
      displayData: [],
      translateText: "",
      searchText: "",
      bandpadLanguagePages,
      changedData: new Map(),
      changedDataSize: 0,
      scrollDown: false,
    };
  },
  methods: {
    pageFilter(filterString) {
      this.displayData = this.allData.filter((e) => e.page === filterString);
    },
    onTranslatorScroll(info) {
      if (info.direction == "down") {
        this.scrollDown = true;
      } else {
        this.scrollDown = false;
      }
    },
    storeChanges(key, changes) {
      //MODIFY ROUTE BASED ON SCHEMA
      // const current = this.currentData.find((item) => item.key === key)
      //   .translatedText[user.languageTo];
      // console.log(current);

      // TODO: monitor last translation changes/when to change last translation
      // should happen in the updateTranslation() call
      // if (changes === current) {
      //   // check and remove from Map
      //   this.changedData.delete(key);
      //   this.changedDataSize = this.changedData.size;
      // } else {
      // add to map
      this.changedData.set(key, changes);
      this.changedDataSize = this.changedData.size;
      // }
    },
    async updateTranslation() {
      if (this.changedDataSize > 0) {
        const obj = Object.fromEntries(this.changedData);
        const res = await this.$axios.post("/apiV1/update_translations", obj);

        this.$q.notify({
          message: "Updated Translations",
          color: "bg-secondary",
        });
        this.changedData.clear();
        this.changedDataSize = this.changedData.size;
      }
    },
  },
  computed: {
    ...mapState("Auth", ["user"]),
  },
  async created() {
    const firstTab = "site";
    this.tab = firstTab;
    console.log(this.user);
    try {
      const res = await this.$axios.get("/apiV1/get_translations");
      this.allData = res.data;

      res.data.forEach((item) => this.currentData.push(item));

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

.update-button-transition {
  transition: all 0.4s;
}

.update-button {
  opacity: 0.8;
}
</style>
