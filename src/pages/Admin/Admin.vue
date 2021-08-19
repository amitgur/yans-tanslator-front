<template>
  <q-layout view="lHh lpr lFf">
    <q-scroll-observer @scroll="onTranslatorScroll" />
    <my-menu :menu-list="menuList" language="he" />
    <q-page-container>
      <q-page class="items-center">
        <div class="q-mx-xl q-px-xl q-my-lg">
          <div class="row justify-between">
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
                  v-for="page in filteredData"
                  :key="page"
                  :name="page"
                  :label="page"
                  @click="setDisplayData(page)"
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
            <div class="loader q-ma-none" :class="{ hidden: !isLoading }" />
            <div class="text-h1 text-center text-grey-4 empty-texts">
              {{ noDisplayText }}
              <div class="text-h4">{{ noDisplaySubtitle }}</div>
            </div>
          </div>
        </div>
        <div class="indicator" :class="{ hidden: !!filteredData.length }">
          <q-icon name="arrow_downward" />
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
        <div class="q-ma-xl" style="height: 10px"></div>
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
            :options="filteredData"
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
            :options="filteredData"
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
                !filteredData.find(
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
                !!filteredData.find(
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
          <div class="row justify-between items-center">
            <div class="text-h6">
              Rename Page
            </div>
            <q-icon name="warning" color="warning" class="rename-page-warning">
              <q-tooltip
                max-width="21em"
                anchor="bottom left"
                :offset="[78, 10]"
                class="bg-amber"
              >
                <span style="font-weight: 900; font-size: 1rem;"
                  >Attention:</span
                >
                <span style="font-size: 1rem">
                  Renaming a page requires changing the page name manually at
                  projects where it is used
                </span>
              </q-tooltip>
            </q-icon>
          </div>
        </q-card-section>
        <q-card-section>
          <q-input
            outlined
            label="New Page Name"
            v-model="renamePageData"
            :rules="[
              (val) =>
                !filteredData.find(
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
                !!filteredData.find(
                  (e) => e.toLowerCase() === renamePageData.toLowerCase()
                )
            "
            color="accent"
            v-close-popup
            @click="changePageName()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
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
      displayData: [],
      currentData: [],
      filteredData: [],
      currentKey: "",
      currentPage: "",
      currentDatabase: "",
      searchText: "",
      isLoading: false,
      noDisplayText: "",
      noDisplaySubtitle: "",

      editItem: false,
      editItemData: { translatedText: { en: "" } },
      editItemSubmit: false,
      deleteItem: false,
      deleteItemKey: "",
      deleteItemPage: "",
      addNewItemPage: "",
      addPage: false,
      addPageData: "",
      addItem: false,
      addItemData: {
        key: null,
        translatedText: {
          en: null,
        },
        description: "",
        page: null,
      },
      addItemSubmit: false,
      deletePage: false,
      deletePageData: "",
      deletePageNotAllowed: false,
      renamePage: false,
      renamePageData: "",
    };
  },

  methods: {
    // Send data edit to backend
    async submitChanges() {
      const sendData = {
        currentKey: this.currentKey,
        currentPage: this.currentPage,
        data: this.editItemData,
      };

      let res;
      try {
        res = await this.$axios.post("/apiV1/admin_edit_translation", sendData);
        res = await this.$axios.post(
          "/apiV1/admin_edit_language_translation",
          sendData
        );

        this.updateOneFromArray(this.allData, this.currentKey);
        this.updateOneFromArray(this.currentData, this.currentKey);
        this.setDisplayData(this.tab);
      } catch (err) {
        this.serverError(err);
      }

      this.$q.notify({
        message: "Translation Updated",
      });
    },

    // Deleting entire item from database
    // This is permanent
    async destroyItem() {
      try {
        const res = await this.$axios.delete(
          "/apiV1/admin_delete_translation",
          { data: { key: this.deleteItemKey } }
        );
        const res2 = await this.$axios.delete(
          "/apiV1/admin_delete_language_translation",
          { data: { key: this.deleteItemKey, page: this.deleteItemPage } }
        );

        this.deleteOneFromArray(this.allData, this.deleteItemKey);
        this.deleteOneFromArray(this.currentData, this.deleteItemKey);
        this.setDisplayData(this.tab);

        this.$q.notify({
          message: "Translation Deleted",
        });
      } catch (err) {
        this.serverError(err);
      }
    },

    // Sending new translation item to backend
    async submitAddItem() {
      try {
        const res = await this.$axios.post(
          "/apiV1/admin_new_translation",
          this.addItemData
        );

        const res2 = await this.$axios.post(
          "/apiV1/admin_new_language_translation",
          this.addItemData
        );

        this.allData.push(this.addItemData);
        this.currentData.push(this.addItemData);
        this.setDisplayData(this.tab);

        this.clearAddItem();
        this.showNotify("Translation Added");
      } catch (err) {
        this.serverError(err);
      }
    },

    // creates new page filter
    async addNewPage() {
      this.addPageData = this.addPageData.toLowerCase();
      try {
        this.filteredData.push(this.addPageData);
        const res = await this.$axios.post("/apiV1/add_page", {
          name: this.addPageData,
        });
        const res2 = await this.$axios.post("/apiV1/admin_add_language_page", {
          page: this.addPageData,
        });

        if (this.filteredData.length === 1) {
          this.tab = this.addPageData;
        }
        this.setDisplayData(this.tab);
        this.clearPage();
      } catch (err) {
        this.clearPage();
        this.serverError(err);
      }
    },

    // Deletes page filter
    // Only allowed if page filter has no entries
    async destroyPage() {
      if (this.deletePage) {
        try {
          const i = this.filteredData.indexOf(this.deletePageData);
          this.filteredData.splice(i, 1);
          this.tab = this.filteredData[0];
          this.setDisplayData(this.tab);
          const res = await this.$axios.delete("/apiV1/delete_page", {
            data: { name: this.deletePageData },
          });
          const res2 = await this.$axios.delete(
            "/apiV1/admin_delete_language_page",
            {
              data: { page: this.deletePageData },
            }
          );

          this.noDisplayData();
          this.clearPage();
        } catch (err) {
          this.serverError(err);
        }
      }
    },

    // Renames page and all translations in page
    async changePageName() {
      try {
        const i = this.filteredData.indexOf(this.deletePageData);
        this.filteredData.splice(i, 1, this.renamePageData);
        this.tab = this.renamePageData;
        this.setDisplayData(this.tab);

        const res = await this.$axios.post("/apiV1/update_page", {
          oldName: this.deletePageData,
          newName: this.renamePageData,
        });

        // Also changes all pages for all translations in page
        const res2 = await this.$axios.post("/apiV1/admin_update_page", {
          oldPageName: this.deletePageData,
          newPageName: this.renamePageData,
        });

        const res3 = await this.$axios.post(
          "/apiV1/admin_update_language_page",
          {
            oldName: this.deletePageData,
            newName: this.renamePageData,
          }
        );

        this.fixPageData(this.allData);
        this.fixPageData(this.currentData);
        this.setDisplayData(this.tab);
        this.clearPage();
      } catch (err) {
        this.serverError(err);
      }
    },

    // Passes in the current page and displays all the data for the specific page
    setDisplayData(filterString) {
      this.displayData = this.allData.filter((e) => e.page === filterString);
      this.noDisplayData();
    },

    // Used for scroll watching
    onTranslatorScroll(info) {
      this.scrollDown = info.direction === "down";
    },

    // Add new item with all fields filled
    addItemChanged() {
      // Check if all three fields are filled and switch bool
      this.addItemSubmit =
        this.addItemData.key &&
        this.addItemData.translatedText.en &&
        this.addItemData.page &&
        !this.allData.find((item) => item.key === this.addItemData.key);
    },

    // Clears data from input field upon adding new items
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

    // Clears data from input field in each page component
    clearPage() {
      this.addPageData = "";
      this.renamePageData = "";
      this.deletePageData = "";
    },

    // Change boolean value to let user rename the page
    renamePageAllow(page) {
      this.renamePage = true;
      this.deletePageData = page;
    },

    // Updating front end data
    deleteOneFromArray(arrData, key) {
      const i = arrData.findIndex((e) => e.key === key);
      arrData.splice(i, 1);
    },

    // Updating front end data
    updateOneFromArray(arrData, key) {
      const item = arrData.find((e) => e.key === key);
      item.page = this.editItemData.page;
      item.key = this.editItemData.key;
      item.description = this.editItemData.description;
      item.translatedText[
        this.user.languageFrom
      ] = this.editItemData.translatedText[this.user.languageFrom];
    },

    // If the page is empty, allow user to delete
    deletePageAllow(page) {
      const checkData = this.allData.filter((e) => e.page === page);
      this.deletePageData = page;
      if (!checkData.length) {
        this.deletePage = true;
      } else {
        this.deletePageNotAllowed = true;
      }
    },

    // Updates frontend page data during rename
    fixPageData(arrData) {
      arrData.forEach((item) => {
        if (item.page === this.deletePageData) item.page = this.renamePageData;
      });
    },

    // Loading animation to show feedback while waiting for match generation
    loadMatches() {
      if (!this.displayData.length) {
        this.isLoading = true;
      }
    },

    // Gets the item by key in order to edit
    sendItem(item) {
      this.editItem = true;
      this.currentKey = item.key;
      this.currentPage = item.page;
      this.editItemData = JSON.parse(JSON.stringify(item));
    },

    // Gets the item by key in order to delete
    sendDeleteItem(item) {
      this.deleteItem = true;
      this.deleteItemKey = item.key;
      this.deleteItemPage = item.page;
    },

    // Check if currentData has changed in input fields
    checkChanges() {
      const current = JSON.stringify(
        this.currentData.find((item) => item.key === this.editItemData.key)
      );
      const changed = JSON.stringify(this.editItemData);

      this.editItemSubmit = current !== changed;
    },

    // When there is no data to display, this shows a welcome screen with instructions to begin
    noDisplayData() {
      let text = "";
      let subtitle = "";
      if (!this.filteredData.length) {
        text = "Welcome!";
        subtitle = "Add a new page to get started";
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

  // Sets the current database and creates a page
  async created() {
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

.indicator {
  position: fixed;
  right: 18px;
  bottom: 70px;
  font-size: 56px;
  color: lightgray;
  animation: wake-up 7s linear, indicate 1.2s infinite;
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

.rename-page-warning {
  padding: 0.1em 0.2em 0.3em 0.2em;
  border-radius: 100%;
  transition: all 0.2s;
  &:hover {
    background-color: rgb(244, 244, 244);
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

@keyframes indicate {
  0% {
    bottom: 70px;
  }
  50% {
    bottom: 85px;
  }
  100% {
    bottom: 70px;
  }
}

@keyframes wake-up {
  0% {
    display: block;
    color: white;
  }
  75% {
    color: white;
  }
  100% {
    color: lightgray;
  }
}
</style>
