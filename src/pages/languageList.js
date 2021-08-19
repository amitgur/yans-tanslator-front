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
    label: "Afrikaans",
    tag: "af",
  },
  {
    type: "label",
    label: "Albanian",
    tag: "sq",
  },
  {
    type: "label",
    label: "Arabic",
    tag: "ar",
  },
  {
    type: "label",
    label: "Armenian",
    tag: "hy",
  },
  {
    type: "label",
    label: "Basque",
    tag: "eu",
  },
  {
    type: "label",
    label: "Bengali",
    tag: "bn",
  },
  {
    type: "label",
    label: "Bulgarian",
    tag: "bg",
  },
  {
    type: "label",
    label: "Catalan",
    tag: "ca",
  },
  {
    type: "label",
    label: "Cambodian",
    tag: "km",
  },
  {
    type: "label",
    label: "Chinese",
    tag: "ch",
  },
  {
    type: "label",
    label: "Croatian",
    tag: "hr",
  },
  {
    type: "label",
    label: "Czech",
    tag: "cr",
  },
  {
    type: "label",
    label: "Danish",
    tag: "da",
  },
  {
    type: "label",
    label: "Dutch",
    tag: "nl",
  },
  {
    type: "label",
    label: "English",
    tag: "en",
  },
  {
    type: "label",
    label: "Estonian",
    tag: "et",
  },
  {
    type: "label",
    label: "Fiji",
    tag: "fj",
  },
  {
    type: "label",
    label: "Finnish",
    tag: "fi",
  },
  {
    type: "label",
    label: "French",
    tag: "fr",
  },
  {
    type: "label",
    label: "Georgian",
    tag: "ka",
  },
  {
    type: "label",
    label: "German",
    tag: "de",
  },
  {
    type: "label",
    label: "Greek",
    tag: "el",
  },
  {
    type: "label",
    label: "Gujarati",
    tag: "gu",
  },
  {
    type: "label",
    label: "Hebrew",
    tag: "he",
  },
  {
    type: "label",
    label: "Hindi",
    tag: "hi",
  },
  {
    type: "label",
    label: "Hungarian",
    tag: "hu",
  },
  {
    type: "label",
    label: "Icelandic",
    tag: "is",
  },
  {
    type: "label",
    label: "Indonesian",
    tag: "id",
  },
  {
    type: "label",
    label: "Irish",
    tag: "ga",
  },
  {
    type: "label",
    label: "Italian",
    tag: "it",
  },
  {
    type: "label",
    label: "Japanese",
    tag: "ja",
  },
  {
    type: "label",
    label: "Javanese",
    tag: "jw",
  },
  {
    type: "label",
    label: "Korean",
    tag: "ko",
  },
  {
    type: "label",
    label: "Latin",
    tag: "la",
  },
  {
    type: "label",
    label: "Latvian",
    tag: "lv",
  },
  {
    type: "label",
    label: "Lithuanian",
    tag: "lt",
  },
  {
    type: "label",
    label: "Macedonian",
    tag: "mk",
  },
  {
    type: "label",
    label: "Malay",
    tag: "ms",
  },
  {
    type: "label",
    label: "Malayalam",
    tag: "ml",
  },
  {
    type: "label",
    label: "Maltese",
    tag: "mt",
  },
  {
    type: "label",
    label: "Maori",
    tag: "mi",
  },
  {
    type: "label",
    label: "Marathi",
    tag: "mr",
  },
  {
    type: "label",
    label: "Mongolian",
    tag: "mn",
  },
  {
    type: "label",
    label: "Nepali",
    tag: "ne",
  },
  {
    type: "label",
    label: "Norwegian",
    tag: "no",
  },
  {
    type: "label",
    label: "Persian",
    tag: "fa",
  },
  {
    type: "label",
    label: "Polish",
    tag: "pl",
  },
  {
    type: "label",
    label: "Portuguese",
    tag: "pt",
  },
  {
    type: "label",
    label: "Punjabi",
    tag: "pa",
  },
  {
    type: "label",
    label: "Quechua",
    tag: "qu",
  },
  {
    type: "label",
    label: "Romanian",
    tag: "ro",
  },
  {
    type: "label",
    label: "Russian",
    tag: "ru",
  },
  {
    type: "label",
    label: "Samoan",
    tag: "sm",
  },
  {
    type: "label",
    label: "Serbian",
    tag: "sr",
  },
  {
    type: "label",
    label: "Slovak",
    tag: "sk",
  },
  {
    type: "label",
    label: "Slovenian",
    tag: "sl",
  },
  {
    type: "label",
    label: "Spanish",
    tag: "es",
  },
  {
    type: "label",
    label: "Swahili",
    tag: "sw",
  },
  {
    type: "label",
    label: "Swedish",
    tag: "sv",
  },
  {
    type: "label",
    label: "Tamil",
    tag: "ta",
  },
  {
    type: "label",
    label: "Tatar",
    tag: "tt",
  },
  {
    type: "label",
    label: "Telugu",
    tag: "te",
  },
  {
    type: "label",
    label: "Thai",
    tag: "th",
  },
  {
    type: "label",
    label: "Tibetan",
    tag: "bo",
  },
  {
    type: "label",
    label: "Tonga",
    tag: "to",
  },
  {
    type: "label",
    label: "Turkish",
    tag: "tr",
  },
  {
    type: "label",
    label: "Ukrainian",
    tag: "uk",
  },
  {
    type: "label",
    label: "Urdu",
    tag: "ur",
  },
  {
    type: "label",
    label: "Uzbek",
    tag: "uz",
  },
  {
    type: "label",
    label: "Vietnamese",
    tag: "vi",
  },
  {
    type: "label",
    label: "Welsh",
    tag: "cy",
  },
  {
    type: "label",
    label: "Xhosa",
    tag: "xh",
  },
];

export default languageList;
