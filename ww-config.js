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
          categoryId: "",
          categoryName: "",
          description: "",
          language: "",
          level: "",
          duration: "",
          targetAudience: "",
          shortSummary: "",
          formateurId: "",
          coverImage: "",
          introVideo: "",
          moodleCourseId: 0,
          createdAt: "",
          objectives: [],
          options: {},
          prerequisites: [],
          resources: [],
          learningOutcomes: [],
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
