export default function() {
  return [
    {
      title: "Dashboard",
      to: "/overview",
      htmlBefore: '<i class="material-icons">edit</i>',
      htmlAfter: ""
    },
    {
      title: "Blog Posts",
      htmlBefore: '<i class="material-icons">vertical_split</i>',
      to: "/blog-posts",
    },
    {
      title: "Create Job",
      htmlBefore: '<i class="material-icons">view_module</i>',
      to: "/job",
    },
    {
      title: "Data",
      htmlBefore: '<i class="material-icons">table_chart</i>',
      to: "/data",
    },
  ];
}
