<template>
  <q-layout view="lHh lpr lFf">
    <q-scroll-observer @scroll="onTranslatorScroll" />
    <my-menu :menu-list="menuList" language="he" />
    <q-page-container>
      <q-page class="items-center">
        <div class="q-mx-xl q-my-lg">
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
          </div>
          <q-table
            :data="userData"
            :columns="columns"
            :pagination.sync="pagination"
            :filter="searchText"
            row-key="username"
            table-header-class="text-white bg-primary"
          >
            <template v-slot:body-cell-edit="props">
              <q-td :props="props">
                <q-btn
                  color="grey"
                  icon-right="edit"
                  size="sm"
                  class="q-pa-xs"
                  flat
                  rounded
                  dense
                  @click="editItem(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </div>
      </q-page>
    </q-page-container>
    <!-- Dialogs -->
    <q-dialog persistent v-model="openEditDialog"
      ><q-card class="input-fields q-pa-md">
        <q-card-section>
          <div class="text-h6">
            Editing
            <span class="text-weight-bold text-accent">{{
              dialogEditItem.username
            }}</span>
          </div>
        </q-card-section>
        <!-- List username -->

        <q-card-section class="q-pt-none">
          <!-- title -->
          <q-select
            outlined
            label="Language To"
            v-model="currentLanguage"
            :options="languageList"
          />
        </q-card-section>
        <q-card-section class="q-pt-none">
          <!-- title -->
          <q-select
            filled
            v-model="currentDatabases"
            multiple
            :options="allDatabases"
            use-chips
            stack-label
            label="Databases"
          />
          <!-- pull all databases from backend somehow -->
        </q-card-section>

        <q-card-actions align="right">
          <!-- handle submit -->
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn
            flat
            label="Submit"
            color="positive"
            v-close-popup
            @click="sendEditItem"
            :disabled="!currentLanguage || !currentDatabases.length"
          />
        </q-card-actions> </q-card
    ></q-dialog>
  </q-layout>
</template>

<script>
import MyMenu from "components/MyMenu";
import menuList from "pages/menuList";
import myMixins from "src/mixins/myMixins";
import crudMixins from "src/mixins/crudMixins";
import inputHandlingMixins from "src/mixins/inputHandlingMixins";
import languageList from "src/pages/languageList";

export default {
  name: "Translator",
  mixins: [myMixins, crudMixins, inputHandlingMixins],
  components: { MyMenu },
  data() {
    return {
      languageList,
      scrollOn: false,
      scrollDown: false,
      menuList,
      searchText: "",
      openEditDialog: false,
      dialogEditItem: {},
      currentLanguage: "",
      currentDatabases: [],
      allDatabases: [],
      pagination: {
        rowsPerPage: 20, // current rows per page being displayed
      },
      columns: [
        {
          name: "name",
          label: "Name",
          field: "name",
          align: "left",
          sortable: true,
        },
        {
          name: "username",
          required: true,
          label: "Username",
          align: "left",
          field: (row) => row.username,
          sortable: true,
        },
        {
          name: "profile",
          label: "Profile",
          field: "profile",
          align: "left",
          sortable: true,
          classes: (row) => (row.profile === "admin" ? "text-accent" : ""),
        },
        {
          name: "languageFrom",
          label: "Language From",
          field: "languageFrom",
          format: (val) => {
            return languageList.find((e) => e.tag === val).label;
          },
          sortable: true,
        },
        {
          name: "languageTo",
          label: "Language To",
          field: "languageTo",
          align: "left",
          sortable: true,
          format: (val) => {
            if (!val.length) {
              return "empty";
            }
            return languageList.find((e) => e.tag === val).label;
          },
          classes: (row) => (!row.languageTo.length ? "text-grey-5" : ""),
        },
        {
          name: "databases",
          label: "Database(s)",
          field: "databases",
          align: "left",
          sortable: true,
          format: (val) => {
            if (!val.length) {
              return "empty";
            }
            return val.join(", ");
          },
          classes: (row) => (!row.databases.length ? "text-grey-5" : ""),
        },
        {
          name: "edit",
          label: "Edit",
          field: "edit",
          align: "center",
        },
      ],
      userData: [],
    };
  },

  methods: {
    // Used for scroll watching
    onTranslatorScroll(info) {
      this.scrollDown = info.direction === "down";
    },

    setLanguageTo() {
      this.currentLanguage = languageList.find(
        (item) => item.tag === this.dialogEditItem.languageTo
      )?.label;
    },

    editItem(row) {
      this.dialogEditItem = row;
      this.openEditDialog = true;
      this.setLanguageTo();
      this.currentDatabases = JSON.parse(
        JSON.stringify(this.dialogEditItem.databases)
      );
    },

    async sendEditItem() {
      if (this.currentLanguage?.tag) {
        this.dialogEditItem.languageTo = this.currentLanguage.tag;
      }
      this.dialogEditItem.databases = this.currentDatabases || [];

      try {
        const res = await this.$axios.post("/apiV1/admin_update_user", {
          username: this.dialogEditItem.username,
          languageTo: this.currentLanguage,
          databases: this.currentDatabases,
        });
      } catch (err) {
        serverError(err);
      }
    },
  },

  // Sets the current database and creates a page
  async created() {
    try {
      const res = await this.$axios.get("/apiV1/admin_get_users");
      this.userData = res.data;
      const res2 = await this.$axios.get("/apiV1/admin_get_databases");
      this.allDatabases = res2.data;
      this.dialogEditItem = res.data[0];
      this.setLanguageTo();
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

.input-fields {
  width: 25em;
}

.input-fields-sm {
  width: 15em;
}
</style>
