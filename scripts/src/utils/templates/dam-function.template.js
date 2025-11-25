function allowCors(req, res) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
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
  }
}

async function getFile() {
  try {
    const response = await fetch(
      "{{PLUGIN_URL}}"
    );
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
  allowCors(req, res);

  try {
    const file = await getFile();
    res.status(200).send(file);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
}

