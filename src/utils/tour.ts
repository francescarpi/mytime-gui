import Shepherd from "shepherd.js"
import { useSettingsStore } from "@/stores/settings"

export const tour = new Shepherd.Tour({
  useModalOverlay: true,
})

tour.addStep({
  id: "new_task",
  text: "Add your tasks using this form. There are free input texts. External ID is used to add the external reference for the configured integration.",
  arrow: false,
  attachTo: {
    element: "#new_task",
    on: "bottom",
  },
  buttons: [
    {
      text: "Next",
      action: tour.next,
    },
  ],
})

tour.addStep({
  id: "task_table",
  text: "You will see your tasks in this paginated table.",
  arrow: false,
  attachTo: {
    element: "#task_table",
    on: "bottom",
  },
  buttons: [
    {
      text: "Next",
      action: tour.next,
    },
  ],
})

tour.addStep({
  id: "col_shortcut",
  text: "When you have tasks there, you can use your keyboard to reopen tasks faster. Press <b>Alt+Number</b> of your task to open it again.",
  arrow: false,
  attachTo: {
    element: "#col_shortcut",
    on: "bottom",
  },
  buttons: [
    {
      text: "Next",
      action: tour.next,
    },
  ],
})

tour.addStep({
  id: "date_navigation",
  text: "Use these controls to change the date. Go to previous, next or use the calendar. Also, keybinds are available. Press the <b>left key</b> arrow to go previous date, <b>right key</b> to go to next or <b>down key</b> arrow to go to today date.",
  arrow: false,
  attachTo: {
    element: "#date_navigation",
    on: "bottom-end",
  },
  buttons: [
    {
      text: "Next",
      action: tour.next,
    },
  ],
})

tour.addStep({
  id: "view_type",
  text: "Change how your tasks are displayed. Use the <b>chronological</b> view to see all your tasks ordered by date, or use the <b>grouped</b> to group them by project and description. That's usefull when you got a lot similar tasks.",
  arrow: false,
  attachTo: {
    element: "#view_type",
    on: "bottom-end",
  },
  buttons: [
    {
      text: "Next",
      action: tour.next,
    },
  ],
})

tour.addStep({
  id: "summary",
  text: "Look your goal. Here you can see your day, week and month progress. The colors indicate if you have reached the goal.",
  arrow: false,
  attachTo: {
    element: "#summary",
    on: "top",
  },
  buttons: [
    {
      text: "Next",
      action: tour.next,
    },
  ],
})

tour.addStep({
  id: "settings_btn",
  text: "Change your workday hours in the settings. In addition, you will be able to change there your color theme or the integration's config for you external ticketing service.",
  arrow: false,
  attachTo: {
    element: "#settings_btn",
    on: "bottom",
  },
  buttons: [
    {
      text: "Next",
      action: tour.next,
    },
  ],
})

tour.addStep({
  id: "dark_mode",
  text: "Do you like dark mode? Here you can change it.",
  arrow: false,
  attachTo: {
    element: "#dark_mode",
    on: "top",
  },
  buttons: [
    {
      text: "Next",
      action: tour.next,
    },
  ],
})

tour.addStep({
  id: "sync_btn",
  text: "Click here to show the sync window. It allow you to send your tasks to the external ticketing service.",
  arrow: false,
  attachTo: {
    element: "#sync_btn",
    on: "bottom",
  },
  buttons: [
    {
      text: "Next",
      action: tour.next,
    },
  ],
})

tour.addStep({
  id: "task_status",
  text: "This flag indicates you if there are some task running.",
  arrow: false,
  attachTo: {
    element: "#task_status",
    on: "bottom",
  },
  buttons: [
    {
      text: "Next",
      action: tour.next,
    },
  ],
})

tour.addStep({
  id: "search_field",
  text: "Use this input field to search your tasks.",
  arrow: false,
  attachTo: {
    element: "#search_field",
    on: "bottom",
  },
  buttons: [
    {
      text: "Complete",
      action: tour.complete,
    },
  ],
})

tour.on("complete", () => {
  const { markTourCompleted } = useSettingsStore()
  markTourCompleted()
})
