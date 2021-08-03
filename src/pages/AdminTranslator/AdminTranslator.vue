<template>
  <q-layout view="lHh lpr lFf">
    <q-scroll-observer @scroll="onTranslatorScroll" />
    <my-menu :menu-list="menuList" language="he" />
    <q-page-container>
      <q-page class="items-center">
        <div class="q-mx-xl q-px-xl q-my-lg">
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

          <!-- tabs-page selector -->
          <div
            :class="{ hidden: searchText !== '' }"
            style="transition: all 0.5s"
          >
            <q-card>
              <q-tabs
                class="bg-primary text-white"
                v-model="tab"
                align="justify"
                inline-label
              >
                <q-tab
                  v-for="page in filterPages"
                  :key="page"
                  :name="page"
                  :label="page"
                  @click="pageFilter(page)"
                >
                  <q-btn-dropdown class="tab-dropdown" size="sm" unelevated>
                    <q-list>
                      <q-item
                        clickable
                        v-close-popup
                        @click="deletePageAllow(page)"
                      >
                        <q-item-section>
                          <q-item-label>Delete </q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item
                        clickable
                        v-close-popup
                        @click="renamePageAllow(page)"
                      >
                        <q-item-section>
                          <q-item-label>Rename</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </q-tab>
              </q-tabs>
            </q-card>
          </div>
          <!-- table content -->
          <div class="q-pt-md">
            <div
              class="row justify-center items-center q-py-xs q-my-sm bg-blue-grey-9 text-white text-bold text-h6"
              style="border-radius: 0.4em"
            >
              <div class="col-3">
                <div class="q-px-lg q-py-md q-mx-md">
                  <div>Key</div>
                </div>
              </div>
              <div class="col-5">
                <div class="q-px-lg q-py-md q-mx-md">Description</div>
              </div>
              <div class="col-2">
                <div class="q-px-lg q-py-md q-mx-md">Already Translated</div>
              </div>
              <div class="col-1" style="text-align: center">Edit</div>
              <div class="col-1">Delete</div>
            </div>
          </div>
          <div
            v-for="item in displayData"
            :key="item.key"
            class="row justify-center items-center q-py-md q-my-sm bg-blue-grey-1"
            style="border-radius: 0.4em"
          >
            <!-- source text -->
            <div class="col-3">
              <div class="q-px-lg q-py-md q-mx-md">
                <div>
                  {{ item.key }}
                </div>
              </div>
            </div>

            <div class="col-5">
              <div class="q-px-lg q-py-md q-mx-md">
                <div class="text-italic">
                  {{ item.description ? item.description : "-" }}
                </div>
              </div>
            </div>
            <div class="col-2">
              <div class="q-px-lg q-py-md q-mx-md">
                <div class="text-italic">
                  {{ Object.keys(item.translatedText).join(", ") }}
                </div>
              </div>
            </div>
            <div class="col-1" style="text-align: center">
              <q-icon
                class="crud-button"
                name="edit"
                rounded
                @click="sendItem(item)"
              />
            </div>
            <div class="col-1">
              <q-icon
                class="crud-button"
                name="delete"
                rounded
                @click="sendDeleteItem(item)"
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
          <q-fab
            color="accent"
            icon="add"
            direction="left"
            class="text-subtitle1 update-button-transition update-button text-bold text-white"
          >
            <q-fab-action
              color="primary"
              @click="addPage = true"
              label="New Page"
              icon="note_add"
            />
            <q-fab-action
              color="secondary"
              @click="addItem = true"
              label="New Item"
              icon="add"
            />
          </q-fab>
        </q-page-sticky>
        <div class="q-ma-xl" style="height:10px"></div>
      </q-page>
    </q-page-container>

    <!-- Dialogs -->
    <q-dialog persistent v-model="addItem"
      ><q-card class="input-fields q-pa-md">
        <q-card-section>
          <div class="text-h6">Add New Item</div>
        </q-card-section>

        <q-card-section class="q-pt-none row justify-between">
          <q-input
            class="col-6"
            outlined
            label="Key"
            @input="addItemChanged"
            v-model="addItemData.key"
            :rules="[
              (val) => !!val || 'Field is required',
              (val) =>
                !allData.find((item) => item.key === val) ||
                'Key already exists',
            ]"
          />
          <q-select
            class="col-5"
            outlined
            label="Page"
            :options="filterPages"
            @input="addItemChanged"
            v-model="addItemData.page"
            :rules="[(val) => !!val || 'Field is required']"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            type="textarea"
            outlined
            label="English Text"
            @input="addItemChanged"
            v-model="addItemData.translatedText.en"
            :rules="[(val) => !!val || 'Field is required']"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            type="textarea"
            outlined
            label="Description"
            v-model="addItemData.description"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            @click="clearAddItem"
            v-close-popup
          />
          <q-btn
            flat
            label="Submit"
            color="accent"
            :disabled="!addItemSubmit"
            v-close-popup
            @click="submitAddItem"
          />
        </q-card-actions> </q-card
    ></q-dialog>
    <q-dialog persistent v-model="editItem"
      ><q-card class="input-fields q-pa-md">
        <q-card-section>
          <div class="text-h6">Edit Item</div>
        </q-card-section>
        <q-card-section class="q-pt-none row justify-between">
          <q-input
            class="col-6"
            outlined
            label="Key"
            v-model="editItemData.key"
            @input="checkChanges()"
            :rules="[
              (val) => !!val || 'Field is required',
              (val) =>
                !allData.find((item) => item.key === val) ||
                'Key already exists',
            ]"
          />
          <q-select
            class="col-5"
            outlined
            label="Page"
            :options="filterPages"
            v-model="editItemData.page"
            @input="checkChanges()"
            :rules="[(val) => !!val || 'Field is required']"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            type="textarea"
            outlined
            label="English Text"
            v-model="editItemData.translatedText.en"
            @input="checkChanges()"
            :rules="[(val) => !!val || 'Field is required']"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            type="textarea"
            outlined
            label="Description"
            v-model="editItemData.description"
            @keyup="checkChanges()"
          />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Submit"
            color="positive"
            v-close-popup
            :disabled="!editItemSubmit"
            @click="submitChanges"
          />
        </q-card-actions> </q-card
    ></q-dialog>
    <q-dialog persistent v-model="deleteItem"
      ><q-card class="input-fields q-pa-md">
        <q-card-section>
          <div class="text-h6">Delete Item</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Are you sure you want to delete?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Delete"
            color="negative"
            v-close-popup
            @click="destroyItem"
          />
        </q-card-actions> </q-card
    ></q-dialog>
    <q-dialog persistent v-model="addPage"
      ><q-card class="q-pa-md input-fields-sm">
        <q-card-section>
          <div class="text-h6">Add Page</div>
        </q-card-section>
        <q-card-section>
          <q-input
            outlined
            label="New Page"
            v-model="addPageData"
            :rules="[
              (val) =>
                !filterPages.find(
                  (e) => e.toLowerCase() === val.toLowerCase()
                ) || 'Page already exists',
            ]"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            v-close-popup
            @click="clearPage"
          />
          <q-btn
            flat
            label="Submit"
            :disabled="
              addPageData === '' ||
                !!filterPages.find(
                  (e) => e.toLowerCase() === addPageData.toLowerCase()
                )
            "
            color="accent"
            v-close-popup
            @click="addNewPage"
          />
        </q-card-actions> </q-card
    ></q-dialog>
    <q-dialog persistent v-model="deletePage"
      ><q-card class="input-fields q-pa-md">
        <q-card-section>
          <div class="text-h6">Delete Page</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Are you sure you want to delete?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Delete"
            color="negative"
            v-close-popup
            @click="destroyPage"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog persistent v-model="deletePageNotAllowed"
      ><q-card class="input-fields q-pa-md">
        <q-card-section>
          <div class="text-h6">Attention</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          This page is not empty. You cannot delete.
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="OK" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog persistent v-model="renamePage"
      ><q-card class="q-pa-md input-fields-sm">
        <q-card-section>
          <div class="text-h6">Rename Page</div>
        </q-card-section>
        <q-card-section>
          <q-input
            outlined
            label="New Page Name"
            v-model="renamePageData"
            :rules="[
              (val) =>
                !filterPages.find(
                  (e) => e.toLowerCase() === val.toLowerCase()
                ) || 'Page already exists',
            ]"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            v-close-popup
            @click="clearPage"
          />
          <q-btn
            flat
            label="Submit"
            :disabled="
              renamePageData === '' ||
                !!filterPages.find(
                  (e) => e.toLowerCase() === renamePageData.toLowerCase()
                )
            "
            color="accent"
            v-close-popup
            @click="changePageName()"
          />
        </q-card-actions> </q-card
    ></q-dialog>
  </q-layout>
</template>

<script>
import MyMenu from "components/MyMenu";
import menuList from "pages/menuList";
import myMixins from "src/mixins/myMixins";

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
      displayData: [],
      currentData: [],
      searchText: "",
      filterPages: [],

      scrollDown: false,
      editItem: false,
      editItemData: { translatedText: { en: "" } },
      editItemSubmit: false,
      deleteItem: false,
      deleteItemKey: "",
      addNewItemPage: "",
      currentKey: "",
      addPage: false,
      addPageData: "",
      addItem: false,
      addItemData: {},
      addItemSubmit: false,
      deletePage: false,
      deletePageData: "",
      deletePageNotAllowed: false,
      renamePage: false,
      renamePageData: "",
    };
  },

  methods: {
    pageFilter(filterString) {
      this.displayData = this.allData.filter((e) => e.page === filterString);
      this.noMatches();
    },
    addItemChanged() {
      // check if all three fields are filled and switch bool
      this.addItemSubmit =
        this.addItemData.key &&
        this.addItemData.translatedText.en &&
        this.addItemData.page &&
        !this.allData.find((item) => item.key === this.addItemData.key);
    },
    clearAddItem() {
      this.addItemData = {
        key: null,
        translatedText: {
          en: null,
        },
        description: "",
        page: null,
      };
      this.addItemSubmit = false;
    },
    clearPage() {
      this.addPageData = "";
      this.renamePageData = "";
      this.deletePageData = "";
    },
    async submitAddItem() {
      try {
        const res = await this.$axios.post(
          "/apiV1/admin_new_translation",
          this.addItemData
        );
        this.allData.push(this.addItemData);
        this.currentData.push(this.addItemData);
        this.pageFilter(this.tab);

        this.clearAddItem();
      } catch (err) {
        this.serverError(err);
        return;
      }
    },
    deleteOneFromArray(arrData, key) {
      const i = arrData.findIndex((e) => e.key === key);
      console.log(i);
      arrData.splice(i, 1);
    },
    async destroyItem() {
      try {
        const res = await this.$axios.delete(
          "/apiV1/admin_delete_translation",
          { data: { key: this.deleteItemKey } }
        );

        this.deleteOneFromArray(this.allData, this.deleteItemKey);
        this.deleteOneFromArray(this.currentData, this.deleteItemKey);
        this.pageFilter(this.tab);

        this.$q.notify({
          message: "Translation Deleted",
        });
      } catch (err) {
        this.serverError(err);
        return;
      }
    },
    async addNewPage() {
      try {
        this.filterPages.push(this.addPageData);
        const res = await this.$axios.post("/apiV1/update_pages", {
          newPages: this.filterPages,
        });
        this.clearPage();
      } catch (err) {
        this.clearPage();
        this.serverError(err);
        return;
      }
    },
    deletePageAllow(page) {
      const checkData = this.allData.filter((e) => e.page === page);
      this.deletePageData = page;
      if (!checkData.length) {
        this.deletePage = true;
      } else {
        this.deletePageNotAllowed = true;
      }
    },
    async destroyPage() {
      if (this.deletePage) {
        try {
          const i = this.filterPages.indexOf(this.deletePageData);
          this.filterPages.splice(i, 1);
          this.tab = this.filterPages[0];
          this.pageFilter(this.tab);

          const res = await this.$axios.post("/apiV1/update_pages", {
            newPages: this.filterPages,
          });
          this.clearPage();
        } catch (err) {
          this.serverError(err);
          return;
        }
      }
    },
    renamePageAllow(page) {
      this.renamePage = true;
      this.deletePageData = page;
    },
    async changePageName() {
      try {
        const i = this.filterPages.indexOf(this.deletePageData);
        this.filterPages.splice(i, 1, this.renamePageData);
        this.tab = this.filterPages[0];
        this.pageFilter(this.tab);

        const res = await this.$axios.post("/apiV1/update_pages", {
          newPages: this.filterPages,
        });

        // Also change all pages for all translation in page
        const res2 = await this.$axios.post("/apiV1/admin_update_page_name", {
          oldPageName: this.deletePageData,
          newPageName: this.renamePageData,
        });

        this.clearPage();
      } catch (err) {
        this.serverError(err);
        return;
      }
    },

    searchFilter() {
      const s = this.searchText.toLowerCase();
      // default to tab if search is empty
      if (s === "") {
        this.pageFilter(this.tab);
        return;
      }
      // search page, key, and translatedText.

      this.displayData = this.allData.filter(
        (e) =>
          e.page.toLowerCase() === s ||
          e.key.toLowerCase() === s ||
          e.translatedText[this.user.languageTo]?.toLowerCase() === s ||
          e.translatedText[this.user.languageFrom]?.toLowerCase() === s ||
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
      this.scrollDown = info.direction === "down";
    },
    async submitChanges() {
      const sendData = {
        currentKey: this.currentKey,
        data: this.editItemData,
      };

      let res;
      try {
        res = await this.$axios.post("/apiV1/admin_edit_translation", sendData);
      } catch (err) {
        this.serverError(err);
        return;
      }

      // fix currentData and allData on update
      this.fixData(this.currentData);
      this.fixData(this.allData);

      this.$q.notify({
        message: "Translation Updated",
      });
    },
    fixData(arrData) {
      const updateDataObject = this.arrData.find(
        (item) => item.key === this.currentKey
      );
      Object.assign(
        updateDataObject,
        JSON.parse(JSON.stringify(this.editItemData))
      );
    },
    noMatches() {
      if (!this.displayData.length) {
        this.$refs["loader"].classList.add("hidden");
        this.$refs["no-matches"].classList.remove("hidden");
      }
    },
    loadMatches() {
      if (!this.displayData.length) {
        this.$refs["loader"].classList.remove("hidden");
        this.$refs["no-matches"].classList.add("hidden");
      }
    },
    sendItem(item) {
      this.editItem = true;
      this.currentKey = item.key;
      this.editItemData = JSON.parse(JSON.stringify(item));
    },
    sendDeleteItem(item) {
      this.deleteItem = true;
      this.deleteItemKey = item.key;
    },
    checkChanges() {
      const current = JSON.stringify(
        this.currentData.find((item) => item.key === this.editItemData.key)
      );
      const changed = JSON.stringify(this.editItemData);
      console.log(
        !this.allData.find((item) => item.key === this.editItemData.key) &&
          current !== changed
      );
      this.editItemSubmit = current !== changed;
    },
  },
  computed: {
    ...mapState("Auth", ["user"]),
  },
  async created() {
    let firstTab;
    this.addItemData = {
      key: null,
      translatedText: {
        en: null,
      },
      description: "",
      page: null,
    };
    try {
      const pages = await this.$axios.get("/apiV1/get_pages");
      this.filterPages = pages.data.list;
      firstTab = this.filterPages[0];
      this.tab = firstTab;

      const res = await this.$axios.get("/apiV1/get_translations");
      this.allData = res.data;
      this.editItemData = JSON.parse(JSON.stringify(this.allData[0]));
      this.currentKey = this.editItemData.key;

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

.input-fields {
  width: 25em;
}

.input-fields-sm {
  width: 15em;
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
