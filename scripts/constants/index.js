const constants = {
  CS_REGIONS: [
    {
      name: "AWS North America",
      value: ""
    },
    {
      name: "AWS Europe",
      value: "eu"
    },
    {
      name: "Azure North America",
      value: "azure-na"
    },
    {
      name: "Azure Europe",
      value: "azure-eu"
    },
    {
      name: "GCP North America",
      value: "gcp-na"
    }
  ],
  AUTHENTICATORS: [
    {
      name: "Authenticator App",
      value: "authenticator-app"
    },
    {
      name: "SMS",
      value: "sms"
    }
  ],
  BASE_URLS: [{
    region: "",
    url: "https://api.contentstack.io"
  },
{
    region: "eu",
    url: "https://eu-api.contentstack.com"
  },
{
    region: "azure-na",
    url: "https://azure-na-api.contentstack.com"
  },
{
    region: "azure-eu",
    url: "https://azure-eu-api.contentstack.com"
  },
{
    region: "gcp-na",
    url: "https://gcp-na-api.contentstack.com"
  },
]
};

module.exports = constants;