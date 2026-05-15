# MINI HAND-IN 1 : XML Transformation System (XSD + XSLT + Node.js)

  **Name:** Motheo Morena
  **Student Number:** u24666981

## 1. Project Overview
  This part of the project implements an XML-based document transformation system that validates structured data using XSD and transforms it into HTML using XSLT. Processing is handled server-side using Node.js, simulating a real-world XML transformation pipeline.

  The system is based on a **University of Pretoria Campus Services Information Portal**, where structured service data is transformed into a human-readable web format.

  The project demonstrates separation of concerns between:
    * Data (XML)
    * Schema (XSD)
    * Presentation (XSLT)
    * Processing (Node.js (backend))

## 2. System Objectives
  The system was developed to demonstrate:
    * Structured data modelling using XML
    * Schema enforcement using XSD
    * XML-to-HTML transformation using XSLT
    * Server-side XML processing using Node.js
    * Validation-before-transformation workflow
    * Generation of dynamic HTML output from structured data

## 3. Domain Model: UP Campus Services
  The dataset represents a simplified University of Pretoria campus services directory.

  Each service entry contains:
    * Service metadata (ID, category)
    * Description
    * Contact information
    * Operating hours
    * Location information

  This structure is designed to reflect a real institutional information system where data is hierarchical, reusable, and extensible.

## 4. Project Structure

  ├── backend/
  │   └── transformations/
  │      └── Morena_u24666981_UP_campus_services.html
  │   ├── uploads/
  │   ├── package-lock.json
  │   ├── package.json
  │   ├── SAXON-HE-10.9.jar
  │   └── server.js
  │
  ├── evidence/
  │   ├── generated_output.png
  │   ├── postman_request.png
  │   ├── transformation_request.png
  │   ├── validation_error.png
  │   └── validation_success.xsd
  ├── xml/
  │   ├── Morena_u24666981_UP_campus_services.xml
  │   └── campus_services.xsd
  │
  ├── xslt/
  │   ├── services_list.xslt
  │   └── services_table.xslt
  │
  └── README.md

All files follow the required naming convention including surname and student number.

## 5. XML Data Model
  The XML dataset defines structured campus service information.

  Each `service` element includes:

  * Unique identifier (`id`)
  * Category classification
  * Service name and description
  * Contact details
  * Operating hours

  The structure is designed for:

  * Strict schema validation
  * Reusable transformations
  * Extensibility for additional services

## 6. Schema Validation (XSD)
  The XSD schema enforces data integrity by defining:

    * Required root element: `campusServices`
    * Required attributes:
      * `university`
      * `campus`
      * `lastUpdated` (date type)

    * Required service attributes:
      * `id`
      * `category`
    * Strict type constraints for all fields

  ### Validation Workflow
    1. XML is submitted to the backend
    2. XML is validated against the XSD schema
    3. If valid → transformation proceeds
    4. If invalid → request is rejected with error details

  This ensures only structurally valid data is processed.

## 7. XSLT Transformation Layer
  The XSLT stylesheet (`services_list.xslt`) defines how XML data is rendered into HTML.

  Key features:

    * Iterative rendering using `xsl:for-each`
    * Conditional formatting using `xsl:choose`
      * Example: displays “24 hours” for always-open services

    * Structured HTML table output
    * Basic UP-themed styling for readability

  This enables multiple presentation formats from a single XML source.

## 8. Backend Processing Pipeline
  The backend is implemented using **Node.js (Express)** and performs the full transformation workflow.

  ### Responsibilities:
    * Accept XML and XSLT inputs
    * Validate XML against XSD schema
    * Execute XSLT transformation
    * Return generated HTML response

   * XSLT Processor: Saxon HE (SAXON-HE-10.9.jar)

    * This project uses Saxon HE 10.9 as the XSLT processing engine for server-side transformations.

      It was chosen because:
        - It provides full XSLT 2.0 support, while most built-in browser processors only support XSLT 1.0
        - It is a high-performance, production-grade transformation engine widely used in enterprise XML systems
        - It allows consistent server-side execution, avoiding browser compatibility issues and deprecated XSLT APIs
        - It integrates well with Node.js through command-line execution of Java-based transformations
        - It ensures reliable validation and transformation behaviour across all environments

    By using Saxon HE, the system replicates a realistic XML processing pipeline used in professional document transformation systems.
  
  ### Endpoint:

   `GET /transform`

      Optional parameters:
        * `xml=<filename>`
        * `xslt=<filename>`

  ### Processing Flow:
    1. Request received
    2. XML validation executed
    3. On success → XSLT transformation applied
    4. HTML output returned to client

## 9. Validation and Error Handling
  The system enforces strict validation before transformation.

  * Valid XML → transformation succeeds
  * Invalid XML → HTTP 400 error returned
  * Server logs validation status for debugging

  This ensures robustness and prevents malformed data processing.

## 10. Running the System

  ### Setup
    ```bash
    cd backend
    npm install
    ```

  ### Execution
    ```bash
    node server.js
    ```

  ### Available Endpoints

    * `GET /files` → list available XML/XSLT files
    * `GET /transform` → default transformation
    * `GET /transform?xml=&xslt=` → custom transformation

## 11. Testing and Validation
  To test schema enforcement:

  * Modify XML to violate schema rules (e.g., remove required attributes)
  * Execute transformation request
  * Observe validation failure response
  * Check server logs for validation output

## 12. Key Outcomes
  This project demonstrates:

  * XML-based structured data modelling
  * Schema-driven validation using XSD
  * XSLT-based transformation logic
  * Server-side processing architecture
  * Separation of data, rules, and presentation layers
  * Robust validation-before-processing workflow

## 13. Conclusion
  This system demonstrates how legacy XML technologies remain relevant when integrated into modern backend architectures. By combining XML, XSD, and XSLT with a Node.js processing layer, the project simulates a scalable document transformation pipeline suitable for structured institutional data systems.