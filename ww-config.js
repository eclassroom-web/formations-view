export default {
  editor: {
    label: {
      en: "Formations View",
    },
  },
  properties: {
    formations: {
      label: {
        en: "Formations",
      },
      type: "Array",
      bindable: true,
      defaultValue: [],
    },
  },
  triggerEvents: [
    {
      name: "edit-formation",
      label: { en: "On edit formation" },
      event: { id: "" },
    },
    {
      name: "publish-change",
      label: { en: "On publish change" },
      event: { formation_id: "", status: "" },
    },
  ],
};
