export default {
  methods: {
    // When a Translator or Admin uses the search bar,
    // this filters the display data.
    // Checks: page, key, text from, and text to
    searchFilter() {
      const s = this.searchText.toLowerCase();

      // default to tab if search is empty
      if (s === "") {
        this.setDisplayData(this.tab);
        this.noDisplayData();
        return;
      }
      // search page, key, and translatedText
      this.displayData = this.allData.filter(
        (e) =>
          e.page.toLowerCase().includes(s) ||
          e.key.toLowerCase().includes(s) ||
          e.translatedText[this.user.languageTo]?.toLowerCase().includes(s) ||
          e.translatedText[this.user.languageFrom]?.toLowerCase().includes(s)
      );

      this.noDisplayData();
    },
  },
};
