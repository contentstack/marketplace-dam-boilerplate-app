const constants = {
  altText: {
    label: "Alt text",
    placeholder: "Type something...",
  },
  alignment: {
    label: "Alignment",
  },
  caption: {
    label: "Caption",
    placeholder: "Enter a caption",
  },
  embedLink: {
    label: "Embed Link",
    placeholder: "Enter a link",
  },
  newTab: {
    label: "Open link in new tab",
  },
  inlineImage: {
    label: "Inline Asset",
  },
};

const dropdownList = [
  {
    label: "none",
    value: "none",
    type: "select",
  },
  {
    label: "left",
    value: "left",
    type: "select",
  },
  {
    label: "center",
    value: "center",
    type: "select",
  },
  {
    label: "right",
    value: "right",
    type: "select",
  },
];

const constantValues = { constants, dropdownList };

export default constantValues;
