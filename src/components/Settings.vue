<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useSettingsStore } from "@/stores/settings";
import { integrations, getIntegration } from "@/utils/settings";

import type { Settings, Option } from "@/types/settings";
import type { Ref } from "vue";

const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);
const { save } = settingsStore;

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(["close"]);

const beforeClose = () => {
  emit("close");
};

const integration: Ref<Option> = ref(integrations[0]);
const integration_token: Ref<string> = ref("");
const integration_url: Ref<string> = ref("");

const beforeShow = () => {
  const set: Settings = settings.value as Settings;
  integration.value = getIntegration(set.integration);
  integration_url.value = set.integration_url;
  integration_token.value = set.integration_token;
};

const saveHandler = () => {
  save(
    integration.value?.value || "",
    integration_url.value || "",
    integration_token.value || "",
  ).then(() => {
    beforeClose();
  });
};
</script>

<template>
  <q-dialog
    :model-value="props.show"
    @before-hide="beforeClose"
    @before-show="beforeShow"
  >
    <q-card>
      <q-card-section class="row items-center q-pb-none" style="width: 300px">
        <div class="text-h6">Settings</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <q-select
          filled
          label="Integration"
          v-model="integration"
          :options="integrations"
        />
        <q-input filled label="URL" v-model="integration_url" />
        <q-input filled label="Token" v-model="integration_token" type="password" />
      </q-card-section>

      <q-card-section class="row q-gutter-md justify-end">
        <q-btn color="primary" @click="saveHandler">Save</q-btn>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
