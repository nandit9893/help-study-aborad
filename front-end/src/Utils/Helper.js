const getInitials = (firstName = "", lastName = "", maxLetters = 2) => {console.log(firstName)
  const fullName = `${firstName} ${lastName}`.trim();
  if (!fullName) return "";
  return fullName
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, maxLetters);
};

const operations = [
  { _id: 1, title: "Uppercase", operationDo: "uppercase" },
  { _id: 2, title: "Lowercase", operationDo: "lowercase" },
  { _id: 3, title: "Reverse", operationDo: "reverse" },
  { _id: 4, title: "Word Count", operationDo: "wordcount" }
];

const headerData = [
  {
    _id: 1,
    title: "Operation",
  },
  {
    _id: 2,
    title: "Input",
  },
  {
    _id: 3,
    title: "Output",
  },
  {
    _id: 4,
    title: "Status",
  },
  {
    _id: 5,
    title: "Created At",
  },
]


const formatDateTime = (isoString) => {
  const date = new Date(isoString);

  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12 || 12;

  return `${day} ${month}, ${year} at ${hours}:${minutes} ${ampm}`;
};

export { getInitials, operations, headerData, formatDateTime };
