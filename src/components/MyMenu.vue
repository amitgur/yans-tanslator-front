<template>
  <div>
    <q-scroll-observer @scroll="onScroll" />
    <q-header elevated>
      <q-toolbar
        id="header-toolbar"
        :style="{
          height: `${headerHight}px`,
          backgroundColor: '#394053',
        }"
      >
        <q-btn
          flat
          color="#fff"
          class="lt-md"
          round
          icon="menu"
          @click="left = !left"
        />
        <q-btn
          v-for="(menuItem, index) in menuList"
          :key="index"
          flat
          @click="clickMenuItem(menuItem)"
          class="q-mr-sm gt-sm english-small text-white text-bold"
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
          <q-icon
            name="person"
            class="q-pa-sm"
            size="sm"
            v-show="isSignIn && user.profile === 'admin'"
            color="white"
          />
        </div>
      </q-toolbar>
    </q-header>

    <!-- mobile menu -->
    <q-drawer overlay v-model="left" side="left" bordered>
      <q-list>
        <template>
          <q-item
            v-for="(menuItem, index) in menuList"
            :key="index"
            clickable
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
      headerHight: 90,
      menuTag: null,
      left: false,
    };
  },
  methods: {
    // change menu height on scroll
    onScroll(info) {
      if (info.position > 50) {
        this.headerHight = 40;
        this.scrollOn = true;
      } else {
        this.headerHight = 90;
        this.scrollOn = false;
      }
    },
    async clickMenuItem(menuItem) {
      // check for new click
      if (this.menuTag === menuItem.tag) {
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
  },
  computed: {
    ...mapState("Auth", ["isSignIn", "user"]),
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
