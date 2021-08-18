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
          </div>
        </div>
        <div class="q-pa-md">
          <q-table :rows="rows" :columns="columns" row-key="name" />
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
      displayData: [],
      currentData: [],
      filteredData: [],
      currentKey: "",
      currentPage: "",
      searchText: "",
      isLoading: false,
      noDisplayText: "",
      noDisplaySubtitle: "",
      columns: [
        {
          name: "username",
          required: true,
          label: "Username",
          align: "left",
          field: (row) => row.username,
          sortable: true,
        },
        {
          name: "name",
          align: "center",
          label: "Name",
          field: "name",
          sortable: true,
        },
        {
          name: "languageFrom",
          label: "Language From",
          field: "languageFrom",
          sortable: true,
        },
        { name: "languageTo", label: "Language To", field: "languageTo" },
      ],
      rows: [],
    };
  },

  methods: {
    // Used for scroll watching
    onTranslatorScroll(info) {
      this.scrollDown = info.direction === "down";
    },
  },

  // Sets the current database and creates a page
  async created() {
    try {
      const res = await this.$axios.get("/apiV1/admin_get_users");
      this.rows = res.data;
      console.log(this.rows);
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
