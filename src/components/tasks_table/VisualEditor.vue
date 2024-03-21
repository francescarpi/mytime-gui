<script setup lang="ts">
import { ref } from "vue"

const showVisualEditor = ref(false)

const open = () => (showVisualEditor.value = true)
</script>

<template>
  <div>
    <q-btn icon="visibility" class="q-mx-md" size="sm" label="Visual Editor" rounded @click="open" />
    <q-dialog v-model="showVisualEditor" full-width>
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Visual Editor</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <div class="">Content</div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
