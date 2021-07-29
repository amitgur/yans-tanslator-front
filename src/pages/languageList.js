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

const languageList = [
  {
    type: "label",
    label: "English",
    tag: "en",
  },
  {
    type: "label",
    label: "Hebrew",
    tag: "he",
  },
  {
    type: "label",
    label: "Russian",
    tag: "ru",
  },
  {
    type: "label",
    label: "Arabic",
    tag: "ar",
  },
  {
    type: "label",
    label: "German",
    tag: "de",
  },
  {
    type: "label",
    label: "Chinese",
    tag: "ch",
  },
];

export default languageList;
