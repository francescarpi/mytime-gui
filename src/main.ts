import { createApp } from "vue";
import { createPinia } from "pinia";
import { Quasar, Dialog, Notify } from "quasar";

import App from "./App.vue";
import router from "./router";

// Import icon libraries
import "@quasar/extras/roboto-font/roboto-font.css";
import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/src/css/index.sass";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(Quasar, {
  plugins: {
    Dialog,
    Notify,
  },
});

app.mount("#app");
