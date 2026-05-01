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
      default: { behavior: "emit" },
      event: {
        id: "",
        row: {
          id: "",
          title: "",
          status: "",
          category: "",
          category_id: "",
          category_name: "",
          description: "",
          language: "",
          level: "",
          estimated_duration: "",
          target_audience: "",
          short_summary: "",
          formateur: "",
          formateur_id: "",
          moodle_course_id: 0,
          created_at: "",
          cover_image: "",
          intro_video: "",
          objectives: [],
          options: {},
          prerequisites: [],
          resources: [],
          learning_outcomes: [],
        },
      },
    },
    {
      name: "publish-change",
      label: { en: "On publish change" },
      default: { behavior: "emit" },
      event: { formation_id: "", status: "" },
    },
  ],
};
