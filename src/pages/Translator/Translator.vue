<template>
  <q-layout view="lHh lpr lFf">
    <q-scroll-observer @scroll="onTranslatorScroll" />
    <my-menu :menu-list="menuList" language="he" />
    <q-page-container>
      <q-page class="items-center">
        <div class="q-mx-xl q-px-xl q-mt-lg">
          <div class="row justify-between">
            <!-- search bar -->
            <q-input
              bottom-slots
              v-model="searchText"
              @keyup="searchFilter"
              label="Search"
              style="min-width: 400px"
            >
              <template v-slot:append>
                <q-icon
                  v-if="searchText"
                  name="cancel"
                  @click.stop="
                    searchText = '';
                    searchFilter();
                  "
                  class="cursor-pointer"
                />
                <q-icon name="search" />
              </template>
            </q-input>
            <div class="row">
              <!-- language from toggle -->
              <q-btn-toggle
                v-model="translateFrom"
                class="language-toggle q-py-lg"
                no-caps
                unelevated
                rounded
                padding="0.2em 1em"
                toggle-color="blue-7"
                color="grey-3"
                text-color="primary"
                :options="[
                  { label: 'English', value: 'en' },
                  { label: 'עברית', value: 'he' },
                ]"
                @click="togglePreferredLanguageFrom"
              />
              <q-select
                class="q-ml-xl q-py-md"
                style="min-width: 200px"
                outlined
                label="Database"
                :options="user.databases"
                v-model="currentDatabase"
                @input="createPage"
              />
            </div>
          </div>

          <!-- tabs-page selector -->
          <div
            :class="{ hidden: searchText !== '' || allData.length === 0 }"
            style="transition: all 0.5s"
          >
            <q-card>
              <q-tabs
                class="bg-primary text-white"
                v-model="tab"
                align="justify"
              >
                <q-tab
                  v-for="page in filteredData"
                  :key="page"
                  :name="page"
                  :label="page"
                  @click="setDisplayData(page)"
                />
                <!-- filter incomplete fields -->
                <q-tab class="bg-blue text-subtitle2" @click="incompleteFilter">
                  Incomplete
                </q-tab>
              </q-tabs>
            </q-card>
          </div>

          <!-- table content -->
          <div class="q-px-md q-py-lg">
            <div
              v-for="item in displayData"
              :key="item.key"
              class="row justify-center items-center q-py-md q-my-sm bg-blue-grey-1"
              style="border-radius: 0.4em"
            >
              <!-- language from text -->
              <div class="col-4">
                <div class="q-px-lg q-py-md q-mx-md">
                  <div class="text-italic">
                    {{ currentFromText(item.key) }}
                  </div>
                </div>
              </div>
              <!-- translation input field -->
              <div class="col-6">
                <q-input
                  outlined
                  color="grey"
                  class="bg-white input-transition"
                  :class="{ 'border-input': changedData.get(item.key) }"
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
                      <div :class="{ hidden: !isIncomplete }">
                        <div>
                          <span style="font-weight: bold">Page:</span>
                          {{ item.page }}
                        </div>
                        <br />
                      </div>
                      <div>
                        <span style="font-weight: bold">Key:</span>
                        {{ item.key }}
                      </div>
                    </q-banner>
                  </q-popup-proxy>
                </q-btn>
              </div>
            </div>
            <div
              :class="{ hidden: displayData.length > 0 }"
              class="q-my-xl q-py-xl justify-center"
            >
              <div class="loader q-ma-none" :class="{ hidden: !isLoading }" />
              <div class="text-h1 text-center text-grey-4 empty-texts">
                {{ noDisplayText }}
                <div class="text-h4 q-pt-sm">{{ noDisplaySubtitle }}</div>
              </div>
            </div>
          </div>
          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn
              fab
              :color="changedDataSize === 0 ? 'grey-5' : 'green'"
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
                :class="{ hidden: changedDataSize === 0 }"
                class="update-button-transition q-px-sm"
                style="font-size: 1em; min-width: 1.5em; height: 1.5em"
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
import menuList from "pages/menuList";
import myMixins from "src/mixins/myMixins";
import crudMixins from "src/mixins/crudMixins";
import inputHandlingMixins from "src/mixins/inputHandlingMixins";
import { mapState } from "vuex";

export default {
  name: "Translator",
  mixins: [myMixins, crudMixins, inputHandlingMixins],
  components: { MyMenu },
  data() {
    return {
      scrollOn: false,
      scrollDown: false,
      menuList,
      tab: "",
      allData: [],
      currentData: [],
      displayData: [],
      filteredData: [],
      changedData: new Map(),
      changedDataSize: 0,
      searchText: "",
      translateFrom: "",

      isLoading: false,
      isIncomplete: false,
      currentDatabase: "",
      noDisplayText: "",
      noDisplaySubtitle: "",
    };
  },

  methods: {
    // Handling sending updated translations to back end, checks this.changedData
    async updateTranslation() {
      try {
        if (this.changedDataSize > 0) {
          const res = await this.$axios.post(
            "/apiV1/update_translations",
            Object.fromEntries(this.changedData)
          );

          this.$q.notify({
            message: "Updated Translations",
          });
          // fix currentData on update
          for (const [key, value] of this.changedData) {
            const updateDataObject = this.currentData.find(
              (item) => item.key === key
            );
            updateDataObject.translatedText[this.user.languageTo] = value;
          }

          this.changedData.clear();
          this.changedDataSize = this.changedData.size;
        }
      } catch (err) {
        this.serverError(err);
      }
    },

    // handle changing from language
    async togglePreferredLanguageFrom() {
      try {
        const res = await this.$axios.post("/apiV1/update_language", {
          id: this.user.id,
          from: this.translateFrom,
        });
      } catch (err) {
        this.serverError(err);
      }
    },

    // Takes a page name and sets displayData
    setDisplayData(filterString) {
      this.displayData = this.allData.filter((e) => e.page === filterString);
      this.isIncomplete = false;
    },

    // Filters through displayData and displays incomplete
    incompleteFilter() {
      this.displayData = this.allData.filter(
        (e) =>
          e.translatedText[this.user.languageTo] === "" ||
          e.translatedText[this.user.languageTo] === undefined
      );
      this.isIncomplete = true;

      this.noDisplayData();
    },

    // returns unmodified languageFrom text value
    currentFromText(key) {
      return this.currentData.find((e) => e.key === key).translatedText[
        this.translateFrom
      ];
    },

    // takes current key and input text changes and tracks them.
    // if changes, return to original state, item is removed from tracking.
    storeChanges(key, changes) {
      const current = this.currentData.find((item) => item.key === key)
        .translatedText[this.user.languageTo];
      if (changes === current) {
        // check and remove from Map
        this.changedData.delete(key);
        this.changedDataSize = this.changedData.size;
      } else {
        // add to map
        this.changedData.set(key, changes);
        this.changedDataSize = this.changedData.size;
      }
    },

    // Loading animation to show feedback while waiting for match generation
    loadMatches() {
      if (!this.displayData.length) {
        this.isLoading = true;
      }
    },

    // used for scroll watching
    onTranslatorScroll(info) {
      this.scrollDown = info.direction === "down";
    },

    noDisplayData() {
      let text = "";
      let subtitle = "";
      if (!this.filteredData.length) {
        text = "Nothing to Translate";
        subtitle = "Admin hasn't set any translations here";
      } else if (this.searchText !== "") {
        text = "No Matches";
      } else if (!this.displayData.length) {
        text = "Empty";
      }

      this.noDisplayText = text;
      this.noDisplaySubtitle = subtitle;
    },
  },
  computed: {
    ...mapState("Auth", ["user"]),
  },
  async created() {
    // window.onbeforeunload = function() {
    //   return "";
    // };
    this.translateFrom = this.user.languageFrom;
    this.currentDatabase = this.user.currentDatabase || this.user.databases[0];
    this.createPage();
  },
};
</script>

<style lang="scss" scoped>
.class-red {
  background-color: yellow;
}
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

.input-transition {
  transition: all 0.4s ease;
}

.border-input {
  box-shadow: 0 0 0 0.25em rgba(0, 128, 0, 0.3);
  border-radius: 0.3em;
}

.loader {
  border: 0.5em solid #f3f3f3; /* Light grey */
  border-top: 0.5em solid #6d7c87; /* Blue */
  border-radius: 50%;
  width: 4em;
  height: 4em;
  margin: auto;
  animation: spin 1.6s cubic-bezier(0.72, 0.2, 0.2, 0.77) infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
