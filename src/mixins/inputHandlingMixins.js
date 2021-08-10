import extractResponseMessage from "assets/js/extractResponseMessage";

export default {
  methods: {
    // filter display data by searched keyword
    // checks: page, key, text from, and text to
    searchFilter() {
      const s = this.searchText.toLowerCase();

      // default to tab if search is empty
      if (s === "") {
        this.setDisplayData(this.tab);
        this.noDisplayData();
        return;
      }
      // search page, key, and translatedText.
      this.displayData = this.allData.filter(
        (e) =>
          e.page.toLowerCase() === s ||
          e.key.toLowerCase() === s ||
          e.translatedText[this.user.languageTo]?.toLowerCase() === s ||
          e.translatedText[this.user.languageFrom]?.toLowerCase() === s ||
          e.page.toLowerCase().includes(s) ||
          e.key.toLowerCase().includes(s) ||
          e.translatedText[this.user.languageTo]?.toLowerCase().includes(s) ||
          e.translatedText[this.user.languageFrom]?.toLowerCase().includes(s)
      );

      this.noDisplayData();
    },
  },
};
