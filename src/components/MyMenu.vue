<template>
  <div>
    <q-scroll-observer @scroll="onScroll" />
    <q-header elevated>
      <q-toolbar
        id="header-toolbar"
        :style="{
          height: `${headerHeight}px`,
          backgroundColor: '#394053',
          padding: '0 2em',
        }"
      >
        <q-btn
          flat
          color="#fff"
          class="lt-md"
          round
          icon="menu"
          @click="left = !left"
          v-show="isSignIn"
        />
        <q-btn
          v-for="(menuItem, index) in menuList"
          :key="index"
          v-show="showMenuItemByUser(menuItem.profile)"
          flat
          @click="clickMenuItem(menuItem)"
          class="q-mr-sm gt-sm english-small text-bold"
          :class="menuItem.link === currentItem ? 'text-blue-2' : 'text-white'"
          ><span
            class="english-small"
            style="font-size: 20px; font-weight: 400"
            >{{ menuItem.label }}</span
          ></q-btn
        >

        <q-space />
        <div>
          <q-btn
            class="q-mx-sm"
            to="/sign-up"
            label="SIGN UP"
            v-show="!isSignIn"
            :class="{
              'menu-button': !scrollOn,
              'menu-button-scroll': scrollOn,
            }"
            color="green-6"
          />
          <q-btn
            class="q-mx-sm"
            to="/login"
            label="LOGIN"
            v-show="!isSignIn"
            :class="{
              'menu-button': !scrollOn,
              'menu-button-scroll': scrollOn,
            }"
            color="primary"
          />
          <q-btn
            outline
            class="q-mx-sm"
            @click="logout"
            label="LOGOUT"
            v-show="isSignIn"
            :class="{
              'menu-button': !scrollOn,
              'menu-button-scroll': scrollOn,
            }"
            color="white"
          />
          <!-- TODO: add dropdown here for user logout/settings? -->

          <!-- <q-icon
            name="person"
            class="q-pa-sm"
            size="sm"
            v-show="isSignIn && user.profile === 'translator'"
            color="white"
          />
          <q-icon
            name="supervisor_account"
            class="q-pa-sm"
            size="sm"
            v-show="isSignIn && user.profile === 'admin'"
            color="white"
          /> -->
        </div>
      </q-toolbar>
    </q-header>

    <!-- mobile menu -->
    <q-drawer overlay v-model="left" side="left" bordered>
      <q-list>
        <template>
          <q-item
            v-for="(menuItem, index) in menuList"
            v-show="showMenuItemByUser(menuItem.profile)"
            :key="index"
            clickable
            :class="
              menuItem.link === currentItem ? 'text-blue-8' : 'text-black'
            "
            @click="clickMenuItem(menuItem)"
            v-ripple
          >
            <q-item-section>
              {{ menuItem.label }}
            </q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-drawer>
  </div>
</template>

<script>
import { scroll } from "quasar";
import { mapState } from "vuex";
const { getScrollTarget, setScrollPosition } = scroll;

export default {
  name: "MyMenu",
  props: ["menuList"],
  data() {
    return {
      scrollOn: false,
      headerHeight: 90,
      menuTag: null,
      left: false,
      currentItem: "",
    };
  },
  methods: {
    // change menu height on scroll
    onScroll(info) {
      if (info.position > 50) {
        this.headerHeight = 40;
        this.scrollOn = true;
      } else {
        this.headerHeight = 90;
        this.scrollOn = false;
      }
    },
    async clickMenuItem(menuItem) {
      // check current path
      if (this.$route.path == menuItem.link) {
        return;
      }

      if (this.menuTag === menuItem.tag) {
        // check for new click
        return;
      } else {
        this.menuTag = menuItem.tag;
      }

      if (
        // hash trigger scroll to element
        menuItem.type === "hash"
      ) {
        this.scrollToElement(menuItem.tag);
      } else {
        // link
        try {
          this.currentItem = this.$router.currentRoute.path;
          await this.$router.push(menuItem.link);
        } catch (err) {
          console.error(err);
        }
      }
    },
    scrollToElement(refId) {
      this.left = false;
      const ele = document.getElementById(refId); // You need to get your element here
      const target = getScrollTarget(ele);
      const offset = ele.offsetTop;
      const duration = 1000;
      setScrollPosition(target, offset, duration);
    },
    logout() {
      this.$store.dispatch("Auth/signOut");
      this.$router.push("/");
    },
    showMenuItemByUser(profile) {
      return profile === this.user?.profile;
    },
  },
  computed: {
    ...mapState("Auth", ["isSignIn", "user"]),
  },
  created() {
    this.currentItem = this.$router.currentRoute.path;
  },
};
</script>
<style lang="scss" scoped>
#header-toolbar {
  transition: height 0.5s;
}

.menu-button-scroll {
  width: 100px;
  height: 34px;
  margin-left: auto;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.5s;
}

.menu-button {
  width: 140px;
  height: 60px;
  margin-left: auto;
  font-size: 17px;
  cursor: pointer;
  transition: all 0.5s;
}

.small-menu-button-scroll {
  margin-left: auto;
  cursor: pointer;
  transition: all 0.5s;
  height: 30px;
  width: 30px;
  font-size: 1.2em;
}

.small-menu-button {
  margin-left: auto;
  cursor: pointer;
  transition: all 0.5s;
  height: 40px;
  width: 40px;
  font-size: 1.7em;
}

.icon-button {
  transition: all 0.5s;
  border-radius: 50%;
  &:hover {
    background-color: rgba(255, 255, 255, 0.15);
  }
}
</style>
