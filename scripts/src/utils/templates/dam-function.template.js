function getAllowedOrigins() {
  const allowedOrigins = [];

  const regionMapping = process.env.REACT_APP_REGION_MAPPING;
  if (regionMapping) {
    try {
      const mapping = JSON.parse(regionMapping);
      Object.keys(mapping).forEach((key) => {
        if (mapping[key]?.JSON_RTE_URL) {
          const url = mapping[key].JSON_RTE_URL;
          try {
            const urlObj = new URL(url);
            allowedOrigins.push(urlObj.origin);
          } catch (e) {
            allowedOrigins.push(url);
          }
        }
      });
    } catch (e) {
      console.error("Error parsing REACT_APP_REGION_MAPPING:", e);
    }
  }

  // Also add REACT_APP_CUSTOM_FIELD_URL if available
  const customFieldUrl = process.env.REACT_APP_CUSTOM_FIELD_URL;
  if (customFieldUrl) {
    try {
      const urlObj = new URL(customFieldUrl);
      allowedOrigins.push(urlObj.origin);
    } catch (e) {
      allowedOrigins.push(customFieldUrl);
    }
  }

  return allowedOrigins;
}

function allowCors(req, res) {
  const allowedOrigins = getAllowedOrigins();
  const origin = req.headers.origin;

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (allowedOrigins.length === 0) {
    res.setHeader("Access-Control-Allow-Credentials", true);
    res.setHeader("Access-Control-Allow-Origin", "*");
  } else {
    return false;
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }

  return true;
}

async function getFile() {
  try {
    const response = await fetch("{{PLUGIN_URL}}");
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    const fileRes = await response.text();
    return fileRes;
  } catch (error) {
    console.error("Error fetching file:", error);
    throw error;
  }
}

export default async function handler(req, res) {
  const corsAllowed = allowCors(req, res);

  if (corsAllowed === false) {
    res.status(403).send("Access denied");
    return;
  }

  try {
    const file = await getFile();
    res.status(200).send(file);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
}
