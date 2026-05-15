// Motheo Morena u24666981

const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const libxmljs = require("libxmljs2");
const multer = require("multer");
const cors = require("cors");

const app = express();

/* ========================== CORS ========================== */

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type"]
}));

/* ========================== CONSTANTS ========================== */

const PORT = 3000;
const UPLOAD_BASE = path.resolve(__dirname, "..", "uploads");

const XML_FOLDER = path.join(UPLOAD_BASE, "xml");
const XSLT_FOLDER = path.join(UPLOAD_BASE, "xslt");
const XSD_FOLDER = path.join(UPLOAD_BASE, "xsd");
const OUTPUT_FOLDER = path.join(__dirname, "transformations");
const SAXON_JAR = path.join(__dirname, "Saxon-HE-10.9.jar");

/* ========================== INIT DIRS ========================== */

[XML_FOLDER, XSLT_FOLDER, XSD_FOLDER, OUTPUT_FOLDER].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/* ========================== MULTER UPLOADER ========================== */

const createUploader = (folder, allowedExts) => {
  const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, folder),
    filename: (_, file, cb) => cb(null, file.originalname)
  });

  return multer({
    storage,
    fileFilter: (_, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (allowedExts.includes(ext)) cb(null, true);
      else cb(new Error(`Invalid file type: ${ext}`));
    }
  });
};

const uploadMap = {
  xml: createUploader(XML_FOLDER, [".xml"]),
  xslt: createUploader(XSLT_FOLDER, [".xsl", ".xslt"]),
  xsd: createUploader(XSD_FOLDER, [".xsd"])
};

/* ========================== HELPERS ========================== */

const getFolderByType = type =>
  ({ xml: XML_FOLDER, xslt: XSLT_FOLDER, xsd: XSD_FOLDER }[type] || null);

// Extract namespace from XML root element
const getXmlNamespace = (xmlPath) => {
  const xml = fs.readFileSync(xmlPath, "utf8");
  const doc = libxmljs.parseXml(xml);
  return doc.root()?.namespace()?.href() || null;
};

// Extract namespaces declared in XSLT (xmlns:*)
const getXsltTargetNamespace = (xsltPath) => {
  const content = fs.readFileSync(xsltPath, "utf8");
  const doc = libxmljs.parseXml(content);

  const root = doc.root();
  if (!root) return [];

  const namespaces = root.namespaces();

  return namespaces.map(ns => ns.href()).filter(Boolean);
};

// Find XSLT matching XML namespace
const findMatchingXslt = (xmlNamespace) => {
  const xsltFiles = fs.readdirSync(XSLT_FOLDER);

  for (const file of xsltFiles) {
    const xsltPath = path.join(XSLT_FOLDER, file);
    const namespaces = getXsltTargetNamespace(xsltPath);

    if (namespaces.includes(xmlNamespace)) {
      return file;
    }
  }

  return null;
};

// Find first XSD matching namespace
const findMatchingXsd = (xmlNamespace) => {
  const xsdFiles = fs.readdirSync(XSD_FOLDER);

  for (const file of xsdFiles) {
    const xsdPath = path.join(XSD_FOLDER, file);
    const content = fs.readFileSync(xsdPath, "utf8");

    if (content.includes(`targetNamespace="${xmlNamespace}"`)) {
      return file;
    }
  }
  return null;
};

/* ========================== ROUTES ========================== */

app.get("/", (_, res) => res.send("Server running"));

/* ---------- UPLOAD ---------- */

app.post("/upload/:type", (req, res) => {
  const upload = uploadMap[req.params.type];
  if (!upload) return res.status(400).json({ message: "Invalid type" });

  upload.single("file")(req, res, err => {
    if (err) return res.status(400).json({ message: err.message });

    res.json({
      message: `${req.params.type.toUpperCase()} uploaded successfully`,
      file: req.file.filename
    });
  });
});

/* ---------- READ ---------- */

app.get("/files", (_, res) => {
  res.json({
    xml: fs.readdirSync(XML_FOLDER),
    xslt: fs.readdirSync(XSLT_FOLDER),
    xsd: fs.readdirSync(XSD_FOLDER)
  });
});

app.get("/files/:type", (req, res) => {
  const folder = getFolderByType(req.params.type);
  if (!folder) return res.status(400).json({ message: "Invalid type" });

  res.json(fs.readdirSync(folder));
});

app.get("/files/:type/:name", (req, res) => {
  const folder = getFolderByType(req.params.type)
  if (!folder) return res.status(400).send("Invalid type")

  const fileName = req.params.name
  const filePath = path.join(folder, fileName)

  if (!fs.existsSync(filePath)) {
    return res.status(404).send("File not found")
  }

  // Detect browser navigation
  const acceptHeader = req.headers.accept || ""
  const isBrowserRequest =
    acceptHeader.includes("text/html") &&
    !acceptHeader.includes("application/json")

  // Redirect ONLY browser navigations for XML
  if (req.params.type === "xml" && isBrowserRequest) {
    console.log("Browser detected → redirecting to /transform")
    return res.redirect(302, `/transform?xml=${encodeURIComponent(fileName)}`)
  }

  // Default: return raw file for API / Vue / Postman
  res.type("text/plain").send(fs.readFileSync(filePath, "utf8"))
})

/* ---------- UPDATE ---------- */

app.put("/files/:type/:name", (req, res) => {
  const upload = uploadMap[req.params.type];
  const folder = getFolderByType(req.params.type);

  if (!upload || !folder) return res.status(400).send("Invalid type");

  const target = path.join(folder, req.params.name);
  if (!fs.existsSync(target)) return res.status(404).send("File not found");

  upload.single("file")(req, res, err => {
    if (err) return res.status(400).json({ message: err.message });
    res.json({ message: "File updated successfully" });
  });
});

/* ---------- DELETE ---------- */

app.delete("/files/:type/:name", (req, res) => {
  const folder = getFolderByType(req.params.type);
  if (!folder) return res.status(400).send("Invalid type");

  const filePath = path.join(folder, req.params.name);
  if (!fs.existsSync(filePath)) return res.status(404).send("File not found");

  fs.unlinkSync(filePath);
  res.json({ message: "File deleted" });
});

app.delete("/files/:type", (req, res) => {
  const folder = getFolderByType(req.params.type);
  if (!folder) return res.status(400).send("Invalid type");

  fs.readdirSync(folder).forEach(f =>
    fs.unlinkSync(path.join(folder, f))
  );

  res.json({ message: `All ${req.params.type} files deleted` });
});

/* ---------- TRANSFORM ---------- */

app.get("/transform", (req, res) => {
  try {
    // XML
      const xmlFile =
        req.query.xml || fs.readdirSync(XML_FOLDER)[0];

      if (!xmlFile) {
        return res.status(400).send("No XML file found");
      }

      const xmlPath = path.join(XML_FOLDER, xmlFile);

      const xmlNamespace =
        getXmlNamespace(xmlPath);

      if (!xmlNamespace) {
        return res.status(400).send(
          "XML has no namespace"
        );
    }

    // XSLT
      const xsltFile = req.query.xslt
        ? req.query.xslt
        : findMatchingXslt(xmlNamespace);

      if (!xsltFile) {
        return res.status(400).send(
          `No matching XSLT found for namespace: ${xmlNamespace}`
        );
      }

      const xsltPath =
        path.join(XSLT_FOLDER, xsltFile);

    // EXTRA VALIDATION
      const xsltNamespace =
        getXsltTargetNamespace(xsltPath);

      if (!xsltNamespace.includes(xmlNamespace)) {
        return res.status(400).json({
          message:
            "XSLT namespace does not match XML namespace",

          xmlNamespace,
          xsltNamespace
        });
      }

    // XSD
      const xsdFile = req.query.xsd
        ? req.query.xsd
        : findMatchingXsd(xmlNamespace);

      if (!xsdFile) {
        return res.status(400).send(
          `No matching XSD found for namespace: ${xmlNamespace}`
        );
      }

      const xsdPath =
        path.join(XSD_FOLDER, xsdFile);

    // Validate XML
      const xmlDoc = libxmljs.parseXml(
        fs.readFileSync(xmlPath, "utf8")
      );

      const xsdDoc = libxmljs.parseXml(
        fs.readFileSync(xsdPath, "utf8")
      );

      const valid = xmlDoc.validate(xsdDoc);

      if (!valid) {
        return res.status(400).json({
          message:
            "XML does not conform to XSD",

          errors:
            xmlDoc.validationErrors.map(
              e => e.message
            )
        });
      }

    // Output
      const outputPath = path.join(
        OUTPUT_FOLDER,
        xmlFile.replace(".xml", "_output.html")
      );

      console.log("\n============== TRANSFORM ==============");
      console.log("XML :", xmlFile);
      console.log("XSLT :", xsltFile);
      console.log("XSD :", xsdFile);
      console.log("XML Namespace :", xmlNamespace);

    // Transform
      const cmd =
        `java -jar "${SAXON_JAR}" ` +
        `-s:"${xmlPath}" ` +
        `-xsl:"${xsltPath}" ` +
        `-o:"${outputPath}"`;

      exec(cmd, err => {

        if (err) {

          console.error(err);

          return res.status(500).json({
            message: "Transformation failed"
          });
        }

        res.sendFile(outputPath);
      });

  }

  catch (err) {
    console.error(err);

    res.status(500).json({
      message: err.message
    });
  }
});

/* ========================== START ========================== */

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);