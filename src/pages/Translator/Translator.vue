<template>
  <q-layout view="lHh lpr lFf">
    <my-menu :menu-list="menuList" language="he" />
    <q-page-container>
      <q-page class="items-center">
        <section id="top-section">
          <h4
            class="q-ml-xl q-mr-xl q-pl-xl q-pr-xl q-pt-none q-mt-xl q-pb-none q-mb-none"
          >
            Translate Pages for ...
          </h4>
          <div class="q-ml-xl q-pl-xl q-mr-xl q-pr-xl q-mt-lg">
            <div class="filters">
              <q-card>
                <q-tabs
                  v-model="tab"
                  class="text-grey"
                  active-color="primary"
                  indicator-color="primary"
                  align="justify"
                >
                  <q-tab name="global" label="Global" />
                  <q-tab name="score" label="Score" />
                  <q-tab name="game" label="Game" />
                  <q-tab name="tour" label="Tour" />
                  <q-tab name="tags" label="Tags" />
                  <q-tab name="tagCategory" label="Tag Categories" />
                </q-tabs>
              </q-card>
              <q-input
                bottom-slots
                v-model="text"
                label="Search"
                :dense="dense"
              >
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
            </div>

            <div class="q-pa-md">
              <div class="row">
                <div class="col-2">
                  Source Language
                </div>
                <div class="col">
                  Key
                </div>
                <div class="col-4">
                  Input
                </div>
                <div class="col-3">
                  Details
                </div>
                <div class="col">
                  Update Translation
                </div>
              </div>
            </div>

            <div class="q-pa-md">
              <div class="row">
                <div class="col-2">
                  English
                </div>
                <div class="col">
                  123456
                </div>
                <div class="col-4">
                  <q-input
                    v-model="text"
                    label="Input"
                    :dense="dense"
                    autogrow
                  />
                </div>
                <div class="col-3">
                  Details
                </div>
                <div class="col" style="text-align: center">
                  <q-btn color="white" text-color="black" label="Update" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import MyMenu from "components/MyMenu";
import menuList from "pages/Translator/menuList";

export default {
  name: "Translator",
  components: { MyMenu },
  data() {
    return {
      scrollOn: false,
      left: false,
      menuList,
      tab: "",
    };
  },
  created() {
    this.tab = "global";
  },
};
</script>

<style lang="sass" scoped>
.row > div
  padding: 10px 15px
  background: #fff
  border-bottom: 1px solid rgba(86, 61, 124, 0.2)
</style>
