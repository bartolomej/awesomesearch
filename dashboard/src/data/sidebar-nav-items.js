export default function() {
  return [
    {
      title: "Dashboard",
      to: "/overview",
      htmlBefore: '<i class="material-icons">edit</i>',
      htmlAfter: ""
    },
    {
      title: "Create Job",
      htmlBefore: '<i class="material-icons">view_module</i>',
      to: "/job",
    },
    {
      title: "Lists",
      htmlBefore: '<i class="material-icons">table_chart</i>',
      to: "/lists",
    },
  ];
}
