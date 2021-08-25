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
    translate: "Vertaal",
  },
  {
    type: "label",
    label: "Albanian",
    tag: "sq",
    translate: "Përkthe",
  },
  {
    type: "label",
    label: "Arabic",
    tag: "ar",
    translate: "ترجمة",
  },
  {
    type: "label",
    label: "Armenian",
    tag: "hy",
    translate: "Թարգմանել",
  },
  {
    type: "label",
    label: "Basque",
    tag: "eu",
    translate: "Itzuli",
  },
  {
    type: "label",
    label: "Bengali",
    tag: "bn",
    translate: "অনুবাদ করা",
  },
  {
    type: "label",
    label: "Bulgarian",
    tag: "bg",
    translate: "Превод",
  },
  {
    type: "label",
    label: "Catalan",
    tag: "ca",
    translate: "Tradueix",
  },
  {
    type: "label",
    label: "Cambodian",
    tag: "km",
    translate: "បកប្រែ",
  },
  {
    type: "label",
    label: "Chinese",
    tag: "ch",
    translate: "翻译",
  },
  {
    type: "label",
    label: "Croatian",
    tag: "hr",
    translate: "Prevedi",
  },
  {
    type: "label",
    label: "Czech",
    tag: "cr",
    translate: "přeložit",
  },
  {
    type: "label",
    label: "Danish",
    tag: "da",
    translate: "Oversætte",
  },
  {
    type: "label",
    label: "Dutch",
    tag: "nl",
    translate: "Vertalen",
  },
  {
    type: "label",
    label: "English",
    tag: "en",
    translate: "Translate",
  },
  {
    type: "label",
    label: "Estonian",
    tag: "et",
    translate: "Tõlgi",
  },
  {
    type: "label",
    label: "Fijian",
    tag: "fj",
    translate: "Vakadewataka",
  },
  {
    type: "label",
    label: "Finnish",
    tag: "fi",
    translate: "Kääntää",
  },
  {
    type: "label",
    label: "French",
    tag: "fr",
    translate: "Traduire",
  },
  {
    type: "label",
    label: "Georgian",
    tag: "ka",
    translate: "თარგმნეთ",
  },
  {
    type: "label",
    label: "German",
    tag: "de",
    translate: "Übersetzen",
  },
  {
    type: "label",
    label: "Greek",
    tag: "el",
    translate: "Μεταφράζω",
  },
  {
    type: "label",
    label: "Gujarati",
    tag: "gu",
    translate: "અનુવાદ કરો",
  },
  {
    type: "label",
    label: "Hebrew",
    tag: "he",
    translate: "לתרגם",
  },
  {
    type: "label",
    label: "Hindi",
    tag: "hi",
    translate: "अनुवाद करना",
  },
  {
    type: "label",
    label: "Hungarian",
    tag: "hu",
    translate: "fordít",
  },
  {
    type: "label",
    label: "Icelandic",
    tag: "is",
    translate: "Þýða",
  },
  {
    type: "label",
    label: "Indonesian",
    tag: "id",
    translate: "Menerjemahkan",
  },
  {
    type: "label",
    label: "Irish",
    tag: "ga",
    translate: "Aistrigh",
  },
  {
    type: "label",
    label: "Italian",
    tag: "it",
    translate: "Tradurre",
  },
  {
    type: "label",
    label: "Japanese",
    tag: "ja",
    translate: "翻訳",
  },
  {
    type: "label",
    label: "Javanese",
    tag: "jw",
    translate: "Nerjemahake",
  },
  {
    type: "label",
    label: "Korean",
    tag: "ko",
    translate: "번역하다",
  },
  {
    type: "label",
    label: "Latin",
    tag: "la",
    translate: "transferendum",
  },
  {
    type: "label",
    label: "Latvian",
    tag: "lv",
    translate: "Tulkot",
  },
  {
    type: "label",
    label: "Lithuanian",
    tag: "lt",
    translate: "Versti",
  },
  {
    type: "label",
    label: "Macedonian",
    tag: "mk",
    translate: "Преведи",
  },
  {
    type: "label",
    label: "Malay",
    tag: "ms",
    translate: "Terjemahkan",
  },
  {
    type: "label",
    label: "Malayalam",
    tag: "ml",
    translate: "വിവർത്തനം ചെയ്യുക",
  },
  {
    type: "label",
    label: "Maltese",
    tag: "mt",
    translate: "Ittraduċi",
  },
  {
    type: "label",
    label: "Maori",
    tag: "mi",
    translate: "Whakamaori",
  },
  {
    type: "label",
    label: "Marathi",
    tag: "mr",
    translate: "भाषांतर करा",
  },
  {
    type: "label",
    label: "Mongolian",
    tag: "mn",
    translate: "Орчуулах",
  },
  {
    type: "label",
    label: "Nepali",
    tag: "ne",
    translate: "अनुवाद गर्नुहोस्",
  },
  {
    type: "label",
    label: "Norwegian",
    tag: "no",
    translate: "Oversette",
  },
  {
    type: "label",
    label: "Persian",
    tag: "fa",
    translate: "ترجمه کردن",
  },
  {
    type: "label",
    label: "Polish",
    tag: "pl",
    translate: "Tłumaczyć",
  },
  {
    type: "label",
    label: "Portuguese",
    tag: "pt",
    translate: "Traduzir",
  },
  {
    type: "label",
    label: "Punjabi",
    tag: "pa",
    translate: "ਅਨੁਵਾਦ",
  },
  {
    type: "label",
    label: "Romanian",
    tag: "ro",
    translate: "Traduceți",
  },
  {
    type: "label",
    label: "Russian",
    tag: "ru",
    translate: "Перевести",
  },
  {
    type: "label",
    label: "Samoan",
    tag: "sm",
    translate: "Faʻaliliu",
  },
  {
    type: "label",
    label: "Serbian",
    tag: "sr",
    translate: "превести",
  },
  {
    type: "label",
    label: "Slovak",
    tag: "sk",
    translate: "Preložiť",
  },
  {
    type: "label",
    label: "Slovenian",
    tag: "sl",
    translate: "",
  },
  {
    type: "label",
    label: "Spanish",
    tag: "es",
    translate: "Prevesti",
  },
  {
    type: "label",
    label: "Swahili",
    tag: "sw",
    translate: "Tafsiri",
  },
  {
    type: "label",
    label: "Swedish",
    tag: "sv",
    translate: "Översätt",
  },
  {
    type: "label",
    label: "Tamil",
    tag: "ta",
    translate: "மொழிபெயர்",
  },
  {
    type: "label",
    label: "Tatar",
    tag: "tt",
    translate: "Тәрҗемә итү",
  },
  {
    type: "label",
    label: "Telugu",
    tag: "te",
    translate: "అనువదించు",
  },
  {
    type: "label",
    label: "Thai",
    tag: "th",
    translate: "แปลภาษา",
  },
  {
    type: "label",
    label: "Tonga",
    tag: "to",
    translate: "Liliu lea",
  },
  {
    type: "label",
    label: "Turkish",
    tag: "tr",
    translate: "Çevirmek",
  },
  {
    type: "label",
    label: "Ukrainian",
    tag: "uk",
    translate: "Перекладіть",
  },
  {
    type: "label",
    label: "Urdu",
    tag: "ur",
    translate: "ترجمہ کریں",
  },
  {
    type: "label",
    label: "Uzbek",
    tag: "uz",
    translate: "Tarjima qiling",
  },
  {
    type: "label",
    label: "Vietnamese",
    tag: "vi",
    translate: "Phiên dịch",
  },
  {
    type: "label",
    label: "Welsh",
    tag: "cy",
    translate: "Cyfieithwch",
  },
  {
    type: "label",
    label: "Xhosa",
    tag: "xh",
    translate: "Guqula",
  },
];

export default languageList;
