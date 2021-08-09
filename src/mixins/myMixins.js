import extractResponseMessage from "assets/js/extractResponseMessage";

export default {
  methods: {
    frontError(e) {
      const error = typeof e === "string" ? e : JSON.stringify(e, null, 2);
      this.$axios.post("apiV1/log_error", {
        error: error,
      });
    },
    serverError(title, e) {
      let m;
      // in case of one argument, it is the message
      if (!e) {
        e = title;
        title = null;
      }

      m = extractResponseMessage(e);

      this.$q.dialog({
        title: title ? title : "Error",
        html: true,
        message: m,
      });

      console.error(title);
      console.error(e);
      console.error(JSON.stringify(e, null, 2));
    },
    myDialog(title, e) {
      this.$q.dialog({
        title: e ? title : "Attention",
        message: e || title,
      });
    },
    showNotify(msg, pos) {
      this.$q.notify({
        message: msg,
        position: pos ? pos : "bottom",
      });
    },
  },
};
