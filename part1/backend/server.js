//Motheo Morena u24666981

const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const libxmljs = require("libxmljs2"); // Use libxmljs2 for XSD validation

const app = express();
const PORT = 3000;

const XML_FOLDER = path.resolve(__dirname, "..", "xml");
const XSLT_FOLDER = path.resolve(__dirname, "..", "xslt");
const OUTPUT_FOLDER = path.resolve(__dirname, "transformations");
const SAXON_JAR = path.join(__dirname, "Saxon-HE-10.9.jar");

if (!fs.existsSync(OUTPUT_FOLDER)) fs.mkdirSync(OUTPUT_FOLDER);

app.get("/files", (req, res) => {
    try {
        const xmlFiles = fs.readdirSync(XML_FOLDER).filter(f => f.endsWith('.xml'));
        const xsltFiles = fs.readdirSync(XSLT_FOLDER).filter(f => f.endsWith('.xslt'));
        res.json({
            xml: xmlFiles,
            xslt: xsltFiles
        });
    } catch (err) {
        res.status(500).send("Error reading files: " + err.message);
    }
});

app.get("/transform", (req, res) => {
    // 1. Resolve file names
    const xmlFile = req.query.xml || fs.readdirSync(XML_FOLDER).find(f => f.endsWith(".xml"));
    const xsltFile = req.query.xslt || fs.readdirSync(XSLT_FOLDER).find(f => f.endsWith(".xslt"));

    if (!xmlFile || !xsltFile) return res.status(400).send("No XML or XSLT files found");

    const xmlPath = path.join(XML_FOLDER, xmlFile);
    const xsltPath = path.join(XSLT_FOLDER, xsltFile);
    const xsdPath = path.join(XML_FOLDER, 'campus_services.xsd');
    const outputPath = path.join(OUTPUT_FOLDER, xmlFile.replace(".xml", "_output.html"));

    try {
        // 2. Load files for validation
        const xmlSource = fs.readFileSync(xmlPath, 'utf8');
        const xsdSource = fs.readFileSync(xsdPath, 'utf8');

        const xmlDoc = libxmljs.parseXml(xmlSource);
        const xsdDoc = libxmljs.parseXml(xsdSource);

        // 3. Perform Validation
        if (xmlDoc.validate(xsdDoc)) {
            console.log("Validation Successful. Starting transformation...");

            // 4. Run Saxon Transformation only if valid
            const command = `java -jar "${SAXON_JAR}" -s:"${xmlPath}" -xsl:"${xsltPath}" -o:"${outputPath}"`;

            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error("Saxon error:", stderr);
                    return res.status(500).send("Transformation failed");
                }
                res.sendFile(outputPath);
            });

        } else {
            // Log and return validation errors
            console.error("Validation Errors:", xmlDoc.validationErrors);
            return res.status(400).json({
                message: "XML does not conform to XSD",
                errors: xmlDoc.validationErrors.map(e => e.message)
            });
        }
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).send("Error processing files: " + err.message);
    }
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));