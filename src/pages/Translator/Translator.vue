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
              style="min-width: 380px"
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
            <div class="row justify-between" style="min-width: 380px">
              <!-- language from toggle -->
              <div class="column justify-center">
                <div class="q-pl-xs text-grey-6" style="font-size: 0.8rem">
                  Translate from
                </div>
                <q-btn-toggle
                  v-model="translateFrom"
                  class="language-toggle q-pt-xs"
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
              </div>
              <q-select
                class="q-py-md"
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
                <q-tab
                  class="text-subtitle2"
                  @click="incompleteFilter"
                  :class="noIncompletes ? 'bg-grey-7' : 'bg-blue'"
                >
                  Incomplete
                </q-tab>
              </q-tabs>
            </q-card>
          </div>

          <!-- table content -->
          <div class="q-py-lg">
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
                  @keyup="storeChanges(item)"
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
          <transition name="fade">
            <q-page-sticky
              position="bottom-right"
              v-if="changedDataSize"
              :offset="[18, 18]"
            >
              <q-btn
                class="text-subtitle1 update-button"
                fab
                color="green-5"
                text-color="black"
                :label="scrollDown ? '' : 'Update'"
                icon="update"
                @click="updateTranslation"
                :class="{
                  'q-px-lg': !scrollDown,
                }"
              >
                <transition name="fade">
                  <q-badge
                    rounded
                    color="red"
                    floating
                    v-if="changedDataSize > 1"
                    class="q-px-sm update-button-badge"
                    >{{ changedDataSize }}</q-badge
                  >
                </transition>
              </q-btn>
            </q-page-sticky>
          </transition>
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
      noIncompletes: false,
      currentDatabase: "",
      noDisplayText: "",
      noDisplaySubtitle: "",
    };
  },

  methods: {
    // When EDITTING translation(s),
    // this will update all data and does nothing if no data has been changed
    async updateTranslation() {
      try {
        if (this.changedDataSize > 0) {
          const res = await this.$axios.post(
            "/apiV1/update_translations",
            Object.fromEntries(this.changedData)
          );

          const res2 = await this.$axios.post(
            "/apiV1/update_language_translations",
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
            updateDataObject.translatedText[this.user.languageTo] =
              value.translation;
          }
          // fix allData -> displayData on update
          this.isIncomplete
            ? this.incompleteFilter()
            : this.setDisplayData(this.tab);

          this.changedData.clear();
          this.changedDataSize = this.changedData.size;
        }
      } catch (err) {
        this.serverError(err);
      }
    },

    // This TOGGLES the user's languageFrom and is persistent.
    // This currently works for English and Hebrew only but can be modified
    // by changing the translateFrom options in the button toggle above.
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

    // When page name is passed in,
    // this filters and displays all the data for the specific page
    setDisplayData(filterString) {
      this.incompleteFilter();
      this.displayData = this.allData.filter((e) => e.page === filterString);
      this.isIncomplete = false;
    },

    // When FILTERING translations,
    // this will filter and display ALL translations that are incomplete
    incompleteFilter() {
      this.displayData = this.allData.filter(
        (e) =>
          e.translatedText[this.user.languageTo] === "" ||
          e.translatedText[this.user.languageTo] === undefined
      );
      this.noIncompletes = this.displayData.length === 0;
      this.isIncomplete = true;

      this.noDisplayData();
    },

    // This returns an unmodified string for the languageFrom text value
    currentFromText(key) {
      return this.currentData.find((e) => e.key === key).translatedText[
        this.translateFrom
      ];
    },

    // When UPDATING translations,
    // this will store any changes to identify if there's anything to update.
    // This is NOT persistent.
    storeChanges(item) {
      const key = item.key;
      const page = item.page;
      const changes = item.translatedText[this.user.languageTo];
      const current = this.currentData.find((e) => e.key === key)
        .translatedText[this.user.languageTo];
      if (changes === current) {
        // check and remove from Map
        this.changedData.delete(key);
      } else {
        // add to map
        this.changedData.set(key, { page: page, translation: changes });
      }
      this.changedDataSize = this.changedData.size;
    },

    // Loading animation to show feedback while waiting for match generation
    loadMatches() {
      if (!this.displayData.length) {
        this.isLoading = true;
      }
    },

    // Used for scroll watching for the update button animation
    onTranslatorScroll(info) {
      this.scrollDown = info.direction === "down";
    },

    // When there is no data to display,
    // this shows a message for the user
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
    this.translateFrom = this.user.languageFrom;
    this.currentDatabase = this.user.currentDatabase || this.user.databases[0];
    // Called from "crudMixins.js"
    this.createPage();
  },
};
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.update-button {
  opacity: 0.8;
  transition: all 0.4s;
}

.update-button-badge {
  font-size: 1em;
  min-width: 1.5em;
  height: 1.5em;
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
