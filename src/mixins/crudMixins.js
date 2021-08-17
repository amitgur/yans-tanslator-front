export default {
  methods: {
    // When creating a new page, set the current DB to display the current data
    async createPage() {
      try {
        const db = await this.$axios.post("/apiV1/set_current_db", {
          id: this.user.id,
          currentDB: this.currentDatabase,
        });

        // setting page tab values from backend
        const pages = await this.$axios.get("/apiV1/get_pages");
        this.filteredData = pages.data.map(function(item) {
          return item.name;
        });
        const firstTab = this.filteredData[0];
        this.tab = firstTab;

        // grabbing translations from backend and parsing editItemData
        const res = await this.$axios.get("/apiV1/get_translations");
        this.allData = res.data;

        if (!!this.allData.length) {
          this.editItemData = JSON.parse(JSON.stringify(this.allData[0]));
          this.currentKey = this.editItemData.key;
        }

        this.noDisplayData();

        // deep clone of data for change tracking
        this.currentData.splice(0, this.currentData.length);
        this.allData.forEach((item) => {
          const clone = JSON.parse(JSON.stringify(item));
          this.currentData.push(clone);
        });

        // filter for first load
        this.setDisplayData(firstTab);
      } catch (err) {
        this.noDisplayData();
        this.serverError(err);
      }
    },
  },
};
