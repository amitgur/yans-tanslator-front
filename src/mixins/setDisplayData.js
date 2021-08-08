export default {
  methods: {
    setDisplayData(filterString) {
      this.displayData = this.allData.filter((e) => e.page === filterString);
    },
  },
};
