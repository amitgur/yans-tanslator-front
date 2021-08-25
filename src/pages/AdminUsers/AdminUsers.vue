<template>
  <q-layout view="lHh lpr lFf">
    <q-scroll-observer />
    <my-menu :menu-list="menuList" language="he" />
    <q-page-container>
      <q-page class="items-center">
        <div class="q-mx-xl q-my-lg">
          <div class="row justify-between">
            <q-input
              bottom-slots
              v-model="searchText"
              label="Search"
              style="min-width: 400px"
            >
              <template v-slot:append>
                <q-icon
                  v-if="searchText"
                  name="cancel"
                  @click.stop="searchText = ''"
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
            <template v-slot:body-cell-databases="props">
              <q-td
                :props="props"
                :class="props.row.languageTo == '' ? newUserColor : ''"
              >
                <span
                  v-if="props.row.databases.length === 0"
                  class="q-pl-sm text-grey-6"
                  >empty</span
                >
                <!-- 
                  Set database colors below
                  To add a new color for a new database copy and add the following line and modify COLOR and INDEX

                    'bg-COLOR-1 text-COLOR': db === allDatabases[INDEX],

                  COLOR should be the same value for both bg and text using Quasar's color list
                    https://quasar.dev/style/color-palette#color-list
                  INDEX should be the next number in the sequence
                -->
                <span
                  v-for="db in props.row.databases"
                  :key="db"
                  class="database-name"
                  :class="{
                    'bg-orange-1 text-orange': db === allDatabases[0],
                    'bg-purple-1 text-purple': db === allDatabases[1],
                    'bg-green-1 text-green': db === allDatabases[2],
                    'bg-blue-1 text-blue': db === allDatabases[3],
                    'bg-pink-1 text-pink': db === allDatabases[4],
                    'bg-cyan-1 text-cyan': db === allDatabases[5],
                  }"
                  >{{ db }}</span
                >
              </q-td>
            </template>
            <template v-slot:body-cell-edit="props">
              <q-td
                :props="props"
                :class="props.row.languageTo == '' ? newUserColor : ''"
              >
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
            <template v-slot:body-cell="props">
              <q-td
                :props="props"
                :class="props.row.languageTo == '' ? newUserColor : ''"
              >
                {{ props.value }}
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
import languageList from "src/pages/languageList";

export default {
  name: "Translator",
  mixins: [myMixins, crudMixins],
  components: { MyMenu },
  data() {
    return {
      languageList,
      menuList,
      newUserColor: "bg-light-blue-1",
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
          format: (val) => {
            return val.charAt(0).toUpperCase() + val.slice(1);
          },
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
          classes: (row) => (!row.languageTo ? "text-grey-6" : ""),
        },
        {
          name: "databases",
          label: "Database(s)",
          field: "databases",
          align: "left",
          sortable: true,
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
    // When EDITTING a user,
    // this will return the entire language object for the dialog
    setLanguageTo() {
      this.currentLanguage = languageList.find(
        (item) => item.tag === this.dialogEditItem.languageTo
      );
    },

    // When EDITTING a user,
    // this will set the current update data for a given user
    editItem(row) {
      this.dialogEditItem = row;
      this.openEditDialog = true;
      this.setLanguageTo();
      this.currentDatabases = JSON.parse(
        JSON.stringify(this.dialogEditItem.databases)
      );
    },

    // When EDITTING a user,
    // this will update the data
    async sendEditItem() {
      // Data to be seen in the dialog
      this.dialogEditItem.languageTo = this.currentLanguage.tag;
      this.dialogEditItem.databases = this.currentDatabases.sort();

      try {
        const res = await this.$axios.post("/apiV1/admin_update_user", {
          username: this.dialogEditItem.username,
          languageTo: this.currentLanguage,
          databases: this.currentDatabases,
        });
        this.sortNewUsers();
      } catch (err) {
        serverError(err);
      }
    },

    sortNewUsers() {
      this.userData.sort((a, b) => {
        if (!a.languageTo && b.languageTo) {
          return -1;
        }
        if (a.languageTo && !b.languageTo) {
          return 1;
        }
        return 0;
      });
    },
  },
  async created() {
    try {
      const res = await this.$axios.get("/apiV1/admin_get_users");
      this.userData = res.data;

      this.sortNewUsers();

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
.input-fields {
  width: 25em;
}

.database-name {
  padding: 0.25em 0.6em;
  margin: 0 0.15em;
  border-radius: 1em;
  background: rgba(128, 128, 128, 0.1);
  color: grey;
}
</style>
