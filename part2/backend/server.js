//Motheo Morena u24666981

const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const libxmljs = require("libxmljs2"); // Use libxmljs2 for XSD validation
const xml2js = require("xml2js");
const multer = require("multer")

const app = express();
const PORT = 3000;

// Paths
const XML_FOLDER = path.resolve(__dirname, "..", "xml");
const XSLT_FOLDER = path.resolve(__dirname, "..", "xslt");
const OUTPUT_FOLDER = path.resolve(__dirname, "transformations");
const SAXON_JAR = path.join(__dirname, "Saxon-HE-10.9.jar");

if (!fs.existsSync(OUTPUT_FOLDER)) fs.mkdirSync(OUTPUT_FOLDER);

//Multer Config (XML)
const xmlStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, XML_FOLDER);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const uploadXML = multer({ storage: xmlStorage });

//Multer Config (XSLT)
const xsltStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, XSLT_FOLDER);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const uploadXSLT = multer({ storage: xsltStorage });

//Load XML -> JS -> back to XML
const parser = new xml2js.Parser({
    explicitArray: true,
    ignoreAttrs: false,
    tagNameProcessors: [xml2js.processors.stripPrefix]
});

const builder = new xml2js.Builder({
    renderOpts: { pretty: true }
});

//Root
app.get("/", (req, res) => {
    res.send("Welcome");
});

//List all the files
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


// *************************************************** XML CRUD ************************************************************************

    /* ================================================= CREATE =========================================================== */
        //Upload an XML
        app.post("/xml", uploadXML.single("file"), (req, res) => {
            if (!req.file) {
                return res.status(400).json({ message: "No XML file uploaded" });
            }

            res.json({
                message: "XML file uploaded successfully",
                file: req.file.originalname
            });
        });

        //Create a new Service
        app.post("/xml/service", express.json(), (req, res) => {
            const xmlPath = path.join(XML_FOLDER, "Morena_u24666981_UP_campus_services.xml");

            const xml = fs.readFileSync(xmlPath, "utf8");

            parser.parseString(xml, (err, result) => {
                if (err) return res.status(500).send(err.message);

                const root = result.campusServices;
                if (!root) {
                    return res.status(500).json({ message: "Invalid XML structure" });
                }

                let services = root.service || [];

                if (!Array.isArray(services)) {
                    services = [services];
                }

                services = services.filter(s => s && s.$ && s.$.id);

                // Prevent duplicates
                if (services.some(s => s?.$?.id === req.body.id)) {
                    return res.status(400).json({ message: "Service ID already exists" });
                }

                const defaultHours = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
                    .map(day => ({
                        $: { name: day },
                        opens: ["08:00:00"],
                        closes: ["16:00:00"]
                    }));

                const newService = {
                    $: {
                        id: req.body.id,
                        category: req.body.category
                    },
                    name: [req.body.name],
                    location: [req.body.location],
                    contact: [{
                        email: [req.body.email],
                        phone: [req.body.phone]
                    }],
                    hours: [{
                        day: defaultHours
                    }],
                    description: [req.body.description],
                    tags: [{
                        tag: req.body.tags || []
                    }]
                };

                services.push(newService);
                root.service = services;

                const updatedXml = builder.buildObject(result);
                fs.writeFileSync(xmlPath, updatedXml);

                res.json({
                    message: "Service created successfully",
                    service: newService
                });
            });
        });

    /* ======================================================== GET ========================================================= */
        app.get("/xml", (req, res) => {
            const files = fs.readdirSync(XML_FOLDER).filter(f => f.endsWith(".xml"));
            res.json(files);
        });

        //GET service by ID
        app.get("/xml/service/:id", (req, res) => {
            const xmlPath = path.join(XML_FOLDER, "Morena_u24666981_UP_campus_services.xml");

            const xml = fs.readFileSync(xmlPath, "utf8");

            parser.parseString(xml, (err, result) => {
                if (err) return res.status(500).send(err.message);

                let services = result.campusServices.service || [];
                if (!Array.isArray(services)) services = [services];

                const service = services.find(s => s.$.id === req.params.id);

                if (!service) {
                    return res.status(404).json({ message: "Service not found" });
                }

                res.json(service);
            });
        });

    /* ======================================================= UPDATE ============================================ */
        //Replace an XML file
        app.put("/xml/:filename", uploadXML.single("file"), (req, res) => {
            const oldPath = path.join(XML_FOLDER, req.params.filename);

            if (!fs.existsSync(oldPath)) {
                return res.status(404).json({ message: "XML file not found" });
            }

            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }

            fs.unlinkSync(oldPath);

            const newPath = path.join(XML_FOLDER, req.file.originalname);
            fs.renameSync(req.file.path, newPath);

            res.json({
                message: "XML replaced successfully",
                file: req.file.originalname
            });
        });
    
        //UPDATE service by ID
        app.patch("/xml/service/:id", express.json(), (req, res) => {
            const xmlPath = path.join(XML_FOLDER, "Morena_u24666981_UP_campus_services.xml");

            const xml = fs.readFileSync(xmlPath, "utf8");

            parser.parseString(xml, (err, result) => {
                if (err) return res.status(500).send(err.message);

                let services = result.campusServices.service || [];

                if (!Array.isArray(services)) {
                    services = [services];
                }

                const index = services.findIndex(s => s?.$?.id === req.params.id);

                if (index === -1) {
                    return res.status(404).json({ message: "Service not found" });
                }

                const { name, location } = req.body || {};

                if (name) services[index].name = [name];
                if (location) services[index].location = [location];

                result.campusServices.service = services;

                const updatedXml = builder.buildObject(result);
                fs.writeFileSync(xmlPath, updatedXml);

                res.json({ message: "Service updated successfully" });
            });
        });

    /* ==================================================== DELETE ========================================================= */    
        //Delete an entire XML file
        app.delete("/xml/:filename", (req, res) => {
            const filePath = path.join(XML_FOLDER, req.params.filename);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ message: "XML file not found" });
            }

            fs.unlinkSync(filePath);

            res.json({ message: "XML file deleted successfully" });
        });
    
        //DELETE service by ID
        app.delete("/xml/service/:id", (req, res) => {
            const xmlPath = path.join(XML_FOLDER, "Morena_u24666981_UP_campus_services.xml");

            const xml = fs.readFileSync(xmlPath, "utf8");

            parser.parseString(xml, (err, result) => {
                if (err) return res.status(500).send(err.message);

                let services = result.campusServices.service || [];

                const filtered = services.filter(s => s.$.id !== req.params.id);

                if (filtered.length === services.length) {
                    return res.status(404).json({ message: "Service not found" });
                }

                result.campusServices.service = filtered;

                const updatedXml = builder.buildObject(result);
                fs.writeFileSync(xmlPath, updatedXml);

                res.json({ message: "Service deleted successfully" });
            });
        });

// ***************************************** XSLT CRUD *************************************************************
    app.post("/xslt", uploadXSLT.single("file"), (req, res) => {
        const confirm = req.query.confirm === "true";

        const files = fs.readdirSync(XSLT_FOLDER);

        if (files.length > 0 && !confirm) {
            return res.status(409).json({
                warning: true,
                message: "This will delete and replace the existing XSLT file.",
                requiresConfirmation: true
            });
        }

        // delete old file
        files.forEach(f => fs.unlinkSync(path.join(XSLT_FOLDER, f)));

        fs.renameSync(
            req.file.path,
            path.join(XSLT_FOLDER, req.file.originalname)
        );

        res.json({ message: "XSLT replaced successfully" });
    });

    app.get("/xslt", (req, res) => {
        const files = fs.readdirSync(XSLT_FOLDER).filter(f => f.endsWith(".xslt"));
        res.json(files);
    });

    app.put("/xslt/:filename", uploadXSLT.single("file"), (req, res) => {
        const oldPath = path.join(XSLT_FOLDER, req.params.filename);

        if (!fs.existsSync(oldPath)) {
            return res.status(404).json({ message: "XSLT file not found" });
        }

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        fs.unlinkSync(oldPath);

        const newPath = path.join(XSLT_FOLDER, req.file.originalname);
        fs.renameSync(req.file.path, newPath);

        res.json({
            message: "XSLT updated successfully",
            file: req.file.originalname
        });
    });

//Transformation
app.get("/transform", (req, res) => {
    // 1. Resolve file names
    const xmlFile = req.query.xml || fs.readdirSync(XML_FOLDER).find(f => f.endsWith(".xml"));
    const xsltFile = req.query.xslt || fs.readdirSync(XSLT_FOLDER).find(f => f.endsWith(".xslt"));

    if (!xmlFile) return res.status(400).send("No XML file was found");
    if (!xsltFile) return res.status(400).send("No XSLT file was found");    

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