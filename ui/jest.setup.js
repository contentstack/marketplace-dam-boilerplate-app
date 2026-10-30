require("jest-fetch-mock").enableMocks();

// CRA inlines REACT_APP_* at build time; tests set them here.
process.env.REACT_APP_CUSTOM_FIELD_URL = "https://app.example.test";
process.env.REACT_APP_REGION_MAPPING = JSON.stringify({
  EU: { JSON_RTE_URL: "https://eu.example.test" },
});
process.env.REACT_APP_MULTI_CONFIG_LIMIT = "10";
