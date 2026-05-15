# PROJECT: FINAL MINI HAND-IN

  **Name:** Motheo Morena
  **Student Number:** u24666981

## 1. Project Description
  This project implements a complete XML processing, validation, and transformation system for a simulated University of Pretoria information portal.
  The system allows users to manage structured XML data and transform it into human‑readable HTML using XSLT.
  It integrates legacy XML technologies (XML, XSD, XSLT) with a modern Node.js backend and a Vue 3 frontend.
  The system supports multiple XML domains (e.g. Campus Services, Student Records) and automatically selects the correct transformation resources using XML namespaces.

## 2. System Objectives
  The system follows a three‑layer architecture:

  # 2.1 Data Layer
    - XML documents (domain data)
    - XSD schemas (validation rules)
    - XSLT stylesheets (presentation logic)

  # 2.2 Backend Layer (Node.js)
    - RESTful API (Express.js)
    - File-level CRUD operations
    - XML valildation using XSD
    - Namespace-based auto-matching
    - Server-side XSLT transformation using Saxon HE

  # 2.3 Frontend Layer (Vue 3)
    - File management interface
    - Monaco Editor for XML editing
    - Transformation preview iframe
    - Manual XSLT override (optional)
    - User feedback via toast messages and confirmation dialogues

  This separation ensures a clean distinction between data, rules, and presentation.
  
## 3. Domain Model

  # 3.1 UP Campus Services

    Namespace: http://u24666981/campusServices
    
    This domain represents University of Pretoria campus services, including:
      - Academic support
      - Administration
      - Health services
      - Security
      - Transport services

    Multiple XML files (e.g. campus_services.xml, student_administration.xml) share:
      - The same namespace
      - The same XSD
      - The same XSLT

  # 3.2 Student Records Domain

    Namespace: http://u24666981/students

    This domain represents student records and contains:
      - Student ID
      - Name
      - Programme
      - Academic year

  Each domain is processed independently through namespace‑based matching.

## 4. Transformation Workflow

  # 4.1 Namespace-based auto-matching
    When a transformation request is made:

      - The XML file is loaded
      - The namespace is extracted from the root element
      - The backend automatically selects:
        - The XSD whose targetNamespace matches the XML
        - The XSLT that declares the same namespace
      - XML is validated against the matched XSD
      - If valid, the matched XSLT is applied
      - HTML output is generated and returned

    This ensures deterministic and correct transformations, regardless of file names or upload order.

  # 4.2 Manual Override
    For debugging or testing, a specific XSLT may be selected manually:

        /transform?xml=file.xml&xslt=template.xslt

    Manual overrides take precedence over auto‑matching.

## 5. Project Structure

  ├── backend/
  │   ├── transformations/
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

## 6. Backend Instructions

  # 6.1 Backend Dependencies
    The backend dependencies are not included in the submission and are restored via npm install.
      - express – REST API framework
      - multer – Multipart file uploads
      - libxmljs2 – XML parsing and XSD validation
      - cors – Cross‑origin request handling
      - Saxon HE 10.9 – XSLT processor (Java‑based)

  # 6.2.1 General Installation
    npm install
  
  # 6.2.2 Run Backend
      cd backend
      npm install
      node server.js

  Backend runs at:
    http://localhost:3000

  # Responsibilities
    The backend:
      - Manages XML, XSD, and XSLT files
      - Performs validation before transformation
      - Automatically matches transformation resources vis namespaces
      - Executes XSLT transformations server-side
      - Returns generated HTML to the client

## 7. Frontend Instructions

  # 7.1 Frontend Dependencies
    - Vue 3 - Frontend framework
    - Vue router - Client-side routing
    - Monaco Editor (XML editing & live edition)
    - Lucide icons - Icon librray

  # 7.2 Run Frontend
    cd frontend
    npm install
    npm run dev

  Frontend runs at:
    http://localhost:5173

  # Responsibilities
    The frontend provides:
      - FIle manaagement dashboard (filtering by XML/XSLT/XSD)
      - Uplaod interface for all file types
      - Monaco based XML editor with syntax feedback
      - XSLT selection dropdown (manual override)
      - Transformation preview (inline iframe)
      - Dedicated HTML preview page

## 8. REST API Endpoints

  # FILE MANAGEMENT
    List all files:
      GET /files

    List by type:
      GET /files/:type

    Retrieve file:
      GET /files/:type/:name

    Upload File:
      POST /upload/:type

    Replace file:
      PUT /files/:type/:name

    Delete file:
      DELETE /files/:type/:name

    Delete all by type:
      DELETE /files/:type

  # TRANSFORMATION
      GET /transform
      GET /transform?xml=file.xml
      GET /transform?xml=file.xml&xslt=template.xslt
  
  *** NOTE: ***
    The /files endpoints intentionally return raw resources for CRUD and editing.
    XSLT transformation is only performed by the /transform endpoint, which executes Saxon HE server‑side.
    Browsers cannot apply server‑side XSLT directly.

## 9. Testing and Validation
  - XML is always validated before transformation
  - Invalid XML results in:
    - HTTP 400 response
    - Detailed XSD validation errors
  - Transformation does not proceed on validation failure

## 10. Testing Guidelines
  - Modify XML to violate schema rules and attempt transformation
  - Upload multiple XML/XSD/XSLT datasets and verify auto‑matching
  - Override XSLT manually and confirm correct behaviour
  - Delete and re‑upload files to test CRUD stability

## 11. Key Outcomes
  This project demonstrates:
    - Practical use of XML, XSD, and XSLT in a modern system
    - Schema‑driven data integrity enforcement
    - Robust server‑side XML processing
    - Namespace‑aware transformation logic
    - Clean separation of data, rules, and presentation
    - Integration of legacy technologies with modern web frameworks


## 13. Conclusion
  This system illustrates how XML technologies remain relevant when integrated into contemporary architectures. By combining namespace‑driven matching, schema validation, and server‑side XSLT execution, the project simulates a realistic enterprise document transformation pipeline suitable for institutional data systems.
































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