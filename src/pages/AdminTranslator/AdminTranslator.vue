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
            @keyup="searchFilter"
            label="Search"
            style="max-width: 400px"
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

          <!-- tabs -page selector -->
          <div
            :class="{ hidden: searchText != '' }"
            style="transition: all 0.5s"
          >
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
          <!-- table content -->
          <div class="q-pt-md">
            <div
              class="row justify-center items-center q-py-xs q-my-sm bg-blue-grey-9 text-white text-bold text-h6"
              style="border-radius: 0.4em"
            >
              <div class="col-2">
                <div class="q-px-lg q-py-md q-mx-md">
                  <div>
                    Key
                  </div>
                </div>
              </div>
              <div class="col-4 ">
                <div class="q-px-lg q-py-md q-mx-md">
                  English Text
                </div>
              </div>
              <div class="col-4 ">
                <div class="q-px-lg q-py-md q-mx-md">
                  Description
                </div>
              </div>
              <div class="col-1" style="text-align: center">
                Edit
              </div>
              <div class="col-1">
                Delete
              </div>
            </div>
          </div>
          <div
            v-for="item in displayData"
            :key="item.key"
            class="row justify-center items-center q-py-md q-my-sm bg-blue-grey-1"
            style="border-radius: 0.4em"
          >
            <!-- source text -->
            <div class="col-2">
              <div class="q-px-lg q-py-md q-mx-md">
                <div>
                  {{ item.key }}
                </div>
              </div>
            </div>
            <div class="col-4 ">
              <div class="q-px-lg q-py-md q-mx-md">
                <div class="text-italic">
                  {{ item.translatedText.en }}
                </div>
              </div>
            </div>
            <div class="col-4 ">
              <div class="q-px-lg q-py-md q-mx-md">
                <div class="text-italic">
                  {{ item.description ? item.description : "-" }}
                </div>
              </div>
            </div>
            <div class="col-1" style="text-align: center">
              <!-- <q-btn class="bg-white crud-button" rounded icon="edit"> </q-btn> -->
              <q-icon
                class="crud-button"
                name="edit"
                rounded
                @click="editItem = true"
              />
            </div>
            <div class="col-1">
              <q-icon
                class="crud-button"
                name="delete"
                rounded
                @click="deleteItem = true"
              />
            </div>
          </div>
          <div
            :class="{ hidden: displayData.length > 0 }"
            class="q-my-xl q-py-xl justify-center"
          >
            <div ref="loader" class="loader q-ma-none" />
            <div
              ref="no-matches"
              class="text-h1 text-center text-grey-4 hidden"
            >
              No Matches
            </div>
          </div>
        </div>
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn
            fab
            color="accent"
            icon="add"
            @click="composeItem = true"
            class="text-subtitle1 update-button-transition update-button text-bold text-white"
          >
          </q-btn>
        </q-page-sticky>
        <q-dialog v-model="composeItem"
          ><q-card>
            <q-card-section>
              <div class="text-h6">Alert</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              wow1
            </q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions> </q-card
        ></q-dialog>
        <q-dialog v-model="editItem"
          ><q-card>
            <q-card-section>
              <div class="text-h6">Alert</div>
            </q-card-section>

            <q-card-section class="q-pt-none"> wow2</q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions> </q-card
        ></q-dialog>
        <q-dialog v-model="deleteItem"
          ><q-card>
            <q-card-section>
              <div class="text-h6">Alert</div>
            </q-card-section>

            <q-card-section class="q-pt-none"> wow3</q-card-section>

            <q-card-actions align="right">
              <q-btn flat label="OK" color="primary" v-close-popup />
            </q-card-actions> </q-card
        ></q-dialog>
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
      searchText: "",
      bandpadLanguagePages,
      scrollDown: false,
      composeItem: false,
      editItem: false,
      deleteItem: false,
    };
  },

  methods: {
    pageFilter(filterString) {
      this.displayData = this.allData.filter((e) => e.page === filterString);
    },
    searchFilter() {
      const s = this.searchText.toLowerCase();
      // default to tab if search is empty
      if (s == "") {
        this.pageFilter(this.tab);
        return;
      }
      // search page, key, and translatedText.

      this.displayData = this.allData.filter(
        (e) =>
          e.page.toLowerCase() == s ||
          e.key.toLowerCase() == s ||
          e.translatedText[this.user.languageTo]?.toLowerCase() == s ||
          e.translatedText[this.user.languageFrom]?.toLowerCase() == s ||
          e.page.toLowerCase().includes(s) ||
          e.key.toLowerCase().includes(s) ||
          e.translatedText[this.user.languageTo]?.toLowerCase().includes(s) ||
          e.translatedText[this.user.languageFrom]?.toLowerCase().includes(s)
      );

      // loading animation
      // this.loadMatches();

      // no match output
      this.noMatches();
    },
    onTranslatorScroll(info) {
      if (info.direction == "down") {
        this.scrollDown = true;
      } else {
        this.scrollDown = false;
      }
    },
    async compose() {
      console.log("test");
    },
    noMatches() {
      if (this.displayData.length == 0) {
        this.$refs["loader"].classList.add("hidden");
        this.$refs["no-matches"].classList.remove("hidden");
      }
    },
    loadMatches() {
      if (this.displayData.length == 0) {
        this.$refs["loader"].classList.remove("hidden");
        this.$refs["no-matches"].classList.add("hidden");
      }
    },
  },
  computed: {
    ...mapState("Auth", ["user"]),
  },
  async created() {
    const firstTab = "site";
    this.tab = firstTab;
    try {
      const res = await this.$axios.get("/apiV1/get_translations");
      this.allData = res.data;

      this.allData.forEach((item) => {
        const clone = JSON.parse(JSON.stringify(item));
        this.currentData.push(clone);
      });

      this.pageFilter(firstTab);
    } catch (err) {
      this.serverError(err);
    }
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

.crud-button {
  margin-left: auto;
  cursor: pointer;
  height: 50px;
  width: 50px;
  font-size: 1.7em;
  transition: all 0.5s;
  border-radius: 50%;
  color: rgb(114, 114, 114);
  &:hover {
    color: black;
    background-color: rgba(0, 0, 0, 0.1);
  }
  &:active {
    background-color: rgba(128, 128, 128, 0.7);
  }
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
