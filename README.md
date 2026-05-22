# PROJECT: FINAL MINI HAND-IN

  **Name:** Motheo Morena
  **Student Number:** u24666981

### 1. Project Description
 This project implements a full-stack XML processing system for a simulated University of Pretoria information portal.

 The system enables:
  - Storage and management of XML, XSD, and XSLT files
  - Valildation of XML data using XSD schemas
  - Transformations of XML into HTML using XSLT
  - Interactive viewing and editing via a Vue 3 frontend.

  It integrates legacy XML technologies (XML, XSD, XSLT) with a modern Node.js backend and Vue frontend, demonstrating how structured data systems remain relevant in contemporary web applications.

### 2. System Archirecture Overview
  The system follows a three‑layer architecture:

  ## 2.1 Data Layer
    - XML documents (structured data)
    - XSD schemas (validation rules)
    - XSLT stylesheets (presentation logic)

  ## 2.2 Backend Layer (Node.js)
    - RESTful API for file management and transformation
    - XML parsing and validation using libxmljs2
    - Namespace-based auto-matching XML -> XSD -> XSLT
    - File-level CRUD operations
    - Server-side XSLT transformation using Saxon HE

  ## 2.3 Frontend Layer (Vue 3)
    - File management interface/dashboard
    - Monaco Editor for XML editing
    - Transformation preview iframe
    - Manual XSLT override (optional)
    - User feedback via toast messages and confirmation dialogues

  This separation ensures a clean distinction between data, rules, and presentation.
 # 
## 3. Instructions to Run Backend

  ## 3.1 Prerequisites:
    - Node.js installed
    - Java installed (required for Saxon HE)

  ## 3.2 Setup and Run:
    cd backend
    npm install
    node server.js

    Backend URL: http://localhost:3000

  ## 3.4 Backend Responsibilities

    - Manage XML, XSD, XSLT files (CRUD)
    - Valildate XML before transformation
    - Perform namespace-based matching
    - Execute XSLT transformations using Saxon HE
    - Return generated HTML

### 4. Instrcutions to run Frontend:

    ## 4.1 Setup and Run
      cd Frontend
      npm install
      npm run dev

      Frontend URL (default): http://localhost:5173

    ## 4.2 Frontend Features:
      - Upload XML/XSLT/XSD files
      - Edit XML using Monaco Editor
      - Select optinal XSLT (manual override)
      - View transformation results in real transformation_request
      - Manage files (delete, replace, update, filter)

### 5. Transformation Workflow

  The transformation process is fully automated using namespace-based matching

  ## 5.1 Automatic Workflow

    # 1. Client sends information request:
        GET /transform?xml=file.xml

    # 2. Backend:
      - Reads the XML file
      - Extracts the namespace from the root element
      - Locates:
        - Matching XSD (targetNamespace)
        - Matching XSLT (same namespace)

    # 3. XML validation:
      - XML is validated against the matched XSD

    # 4. If validation succeeds:
      - Saxon HE applies XSLT transformation

    # 5. Output:
      - HTML is generated and returned to the frontend


  ## 5.2 Manual Override
    Users may explicitly select an XSLT:
      GET /transform?xml=file.xml&xslt=template.xslt

    - This overrides automatic matching
    - Useful for testing and debugging

  ## 5.3 Key Advantages:
    - Transformation is not dependent on file names or upload order
    - Ensures correct schema + stylesheet pairing

### 6. Explanation of Validation:
  XML validation is enforced before any transformation occurs

  ## 6.1 Validation technology
    Library used: libxmljs2
    Validation standard: XSD (XML Schema Definition)

  ## 6.2 Validation Processing
    1. XML file is loaded by the server
    2. Corresponding XSD is identified (via namespace matching)
    3. XML is validated against the XSD schema

  ## 6.3 Testing Guidelines
    - Modify XML to violate schema rules and attempt transformation
    - Upload multiple XML/XSD/XSLT datasets and verify auto‑matching
    - Override XSLT manually and confirm correct behaviour
    - Delete and re‑upload files to test CRUD stability

  ## 6.4 Validation Outcomes

    # Valid XML
      - Transformation proceeds
      - HTML is generated

    # Invalid XML
      - Transformatio is blocked
      - Server returns:

        {
          "error": "Validation failed",
          "details": "XSD validation errors ..."
        }

      - HTTP Status: 400


## 7. Project Structure

  ├── backend/
  │   ├── transformations/
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
  │   ├── xml-and-xslt-mismatch.png
  │   ├── missing-child-element.png
  │   └── validation_success.xsd
  │
  ├── frontend/
  │   ├── vscode/
  │   ├── public/
  │   ├──src/
  │   │  ├── components/
  │   │  │    ├── Basecard.vue
  │   │  │    ├── Confirm.vue
  │   │  │    ├── Message.vue
  │   │  │    ├── NavBar.vue
  │   │  │    └── UploadCard.vue
  │   │  │
  │   │  ├── pages/
  │   │  │    ├── Files.vue
  │   │  │    ├── HtmlPreview.vue
  │   │  │    ├── NotFound.vue
  │   │  │    ├── Upload.vue
  │   │  │    └── viewFile.vue
  │   │  │
  │   │  ├── plugins/
  │   │  │    └── ui.js
  │   │  │
  │   │  ├── router/
  │   │  │    └── index.js
  │   │  │
  │   │  ├── App.vue
  │   │  └──  main.js
  │   │
  │   ├── gitignore
  │   ├── index.html
  │   ├── jsconfig.json
  │   ├── package-lock.json
  │   ├── package.json
  │   └── vite.config.js
  │
  ├── uploads/
  │   ├── xml/
  │   ├── xsd/
  │   └── xslt/
  │
  ├── package-lock.json
  ├── package.json
  └── README.md

All files follow the required naming convention including surname and student number.

## 8. Key Outcomes
  This project demonstrates:
    - Real-world XML processing pipeline
    - Schema-driven validation
    - Server-side XSLT transformations (XSLT 2.0)
    - Namespace-aware automation
    - Full-stack integration (Node.js + Vue 3)
    - Clean separation of system layer

## 13. Conclusion
This system shows how XML technologies can be effectively integrated into modern architectures. By combining schema validation, namespace matching, and server-side XSLT transformations, the project simulates a realistic enterprise document processing system suitable for structured institutional data.































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
        npm install multer
        npm install libxmljs2
        npm install xml2js
        npm install cors

        cd frontend
        npm install
        npm install monaco-editor
        npm install lucide-vue-next
    ```

  ### Execution
    ```bash
        node server.js
    ```

  ### Server Runs at
    http://localhost:3000

  ### Available Endpoints

    # GET /
      - Check if server is Running
    
    # GET /files
      - Returns all XML and XSLT files

    ## XML CRUD

      # FILE - LEVEL 
        * Upload XML file
          # POST /xml

          Postman Instructions:
            1. Go to Body -> form-data
            2. Add key:
              - key: file
              - Type: file
              - Select an .xml file

            Expected Response:
              {
                "message": "XML file uploaded successfully",
                "file": "filename.xml"
              }

        * DELETE XML file
          # DELETE /xml/:filename

          Example in Postman:
            - DELETE /xml/example.xml

        * Replace XML File
          # PUT /xml/:filename

          Postman Instructions:
            1. Go to Body -> form-data
            2. Add File Field:
              - Key: file
              - Type: file
              - Value: Select new  XML file
      
      # SERVICE (DATA - LEVEL)
        * CREATE Service:
          # POST /xml/service

          Example Body (JSON in Postman):
            {
              "id": "UP007",
              "category": "IT",
              "name": "IT Help Desk",
              "location": "IT Building",
              "description": "Provides technical support",
              "email": "it@up.ac.za",
              "phone": "012-420-0000",
              "tags": ["IT", "Support"]
            }
      
      * READ Service
        # GET /xml/service/:id

          Example (Postman):
          - GET /xml/service/UP001

        -  Returns a single service object

      * UPDATE Service
        # PATCH /xml/service/:id

          Example Body (JSON Postman):
            {
              "name": "Updated Service Name",
              "location": "New Location"
            }

      * DELETE Service
        # DELETE /xml/service/:id

        - Deletes the service by id

    ## XSLT CRUD

      * Upload / Replace XSLT (Create)
        # POST /xslt
        
        - NOTE: If an XSLT already exists, server returns a warning:
          {
            "warning": true,
            "message": "This will delete and replace the existing XSLT file.",
            "requiresConfirmation": true
          }

         - To confirm replacement:
            #  POST /xslt?confirm=true

        - NOTE: Postman expects multipart/form-data rather than a JSON body.

      * GET XSLT file
        # GET /xslt
          - Returns the available XSLT file

      * UPDATE XSLT
        # PUT /xslt/:filename
          - Replaces a specific XSLT file
      
    ## TRANSFORMATION 

      # GET /transform

      - Optional Query Parameters:
        # GET /transform?xml=filename.xml&xslt=filename.xslt
        
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