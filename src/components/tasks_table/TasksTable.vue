<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue"
import { storeToRefs } from "pinia"
import { useTasksStore } from "@/stores/tasks"
import { dayOfTheWeek } from "@/utils/dates"
import { pagination } from "@/constants/tables"
import { useNavigation } from "./navigation"
import { useClipboard } from "./clipboard"
import { useColumns } from "./columns"

import TableViewType from "@/components/TableViewType.vue"
import Actions from "./Actions.vue"
import GroupedActions from "./GroupedActions.vue"
import DateNavigation from "./DateNavigation.vue"
import ChildrenTasks from "./ChildrenTasks.vue"
import Reported from "./Reported.vue"

const table = ref()
const emit = defineEmits(["click-column"])
const { listenKeyDown } = useNavigation()
const { copyToClipboard } = useClipboard()
const tasksStore = useTasksStore()
const { refresh } = tasksStore
const { tasks, filterDate, isSearchEnabled, searchResult } = storeToRefs(tasksStore)
const { getColumns } = useColumns()

let interval: number | null = null

onMounted(() => {
  refresh()

  interval = window.setInterval(() => {
    refresh()
  }, 30000)

  window.addEventListener("keydown", listenKeyDown)
})

onBeforeUnmount(() => {
  if (interval) {
    clearInterval(interval)
  }
  window.removeEventListener("keydown", listenKeyDown)
})

const firstPage = () => {
  table.value.firstPage()
}
</script>

<template>
  <q-table
    title="Tasks"
    :rows="tasks"
    :columns="getColumns()"
    :pagination="pagination"
    row-key="id"
    bordered
    flat
    wrap-cells
    ref="table">
    <template #top-left="">
      <div class="col-2 q-table__title items-center">
        <p v-if="isSearchEnabled">{{ searchResult.length }} tasks found</p>
        <span v-else>Tasks of day {{ filterDate }} ({{ dayOfTheWeek(new Date(filterDate)) }})</span>
      </div>
    </template>
    <template #top-right>
      <DateNavigation />
      <TableViewType class="q-ml-md" />
    </template>
    <template #header-cell-shortcut>
      <q-th>
        <q-icon name="keyboard_command_key">
          <q-tooltip>Press Alt+number to open task</q-tooltip>
        </q-icon>
      </q-th>
    </template>
    <template #body-cell-project="props">
      <q-td :props="props">
        <div class="row no-wrap items-center">
          {{ props.row.project }}
          <q-btn icon="arrow_upward" size="xs" round flat @click="emit('click-column', 'project', props.row.project)" />
          <q-btn icon="file_copy" size="xs" round flat @click="copyToClipboard(props.row.project)" />
        </div>
      </q-td>
    </template>
    <template #body-cell-description="props">
      <q-td :props="props">
        <div class="row no-wrap items-center">
          {{ props.row.desc }}
          <q-btn
            icon="arrow_upward"
            size="xs"
            round
            flat
            @click="emit('click-column', 'description', props.row.desc)" />
          <q-btn icon="file_copy" size="xs" round flat @click="copyToClipboard(props.row.desc)" />
        </div>
      </q-td>
    </template>
    <template #body-cell-external_id="props">
      <q-td :props="props">
        <div class="row no-wrap items-center">
          {{ props.row.external_id }}
          <q-btn
            icon="arrow_upward"
            size="xs"
            round
            flat
            v-if="props.row.external_id"
            @click="emit('click-column', 'external_id', props.row.external_id)" />
          <q-btn
            icon="file_copy"
            size="xs"
            round
            flat
            v-if="props.row.external_id"
            @click="copyToClipboard(props.row.external_id)" />
        </div>
      </q-td>
    </template>
    <template #body-cell-reported="props">
      <q-td :props="props">
        <Reported :task="props.row" />
      </q-td>
    </template>
    <template #body-cell-actions="props">
      <q-td :props="props">
        <Actions :task="props.row" @created="firstPage" />
      </q-td>
    </template>
    <template #body-cell-tasks="props">
      <q-td :props="props">
        <ChildrenTasks :task="props.row" />
      </q-td>
    </template>
    <template #body-cell-actions_grouped="props">
      <q-td :props="props">
        <GroupedActions :task="props.row" @created="firstPage" />
      </q-td>
    </template>
  </q-table>
</template>
