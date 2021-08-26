/************************************************
 * This file holds configuration for the top menu
 * There are two types of object items:
 * hash - id tag in the front page, clicking this item will scroll to that section in the page.
 {
    type: "hash", // type is hash
    label: "Top", // label in the top menu
    tag: "top-section", // id to scroll to
  },
 * link - this menu item will push a new route to the router.
 {
    type: "link", // type is link
    label: "link 1", // label in the top menu
    link: "/link1", // new route
  },
 ******************************/

const menuList = [
  { type: "link", label: "Home", link: "/", profile: "translator" },
  {
    type: "link",
    label: "Translate",
    link: "/translator",
    profile: "translator",
  },
  { type: "link", label: "Home", link: "/", profile: "admin" },
  {
    type: "link",
    label: "Translations",
    link: "/admin",
    profile: "admin",
  },
  {
    type: "link",
    label: "Users",
    link: "/users",
    profile: "admin",
  },
];

export default menuList;
