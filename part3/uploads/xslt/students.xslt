<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet
  version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://u24666981/students"
  exclude-result-prefixes="s"
>

<xsl:template match="/">
  <html>
    <head>
      <title>Student Records</title>

      <style>
        body {
          font-family: Arial, sans-serif;
          background: #0f172a;
          color: #e2e8f0;
          margin: 40px;
        }

        h1 {
          text-align: center;
          color: #38bdf8;
          text-shadow: 0 0 10px rgba(56,189,248,0.6);
          margin-bottom: 30px;
        }

        table {
          width: 80%;
          margin: 0 auto;
          border-collapse: collapse;
          background: #1e293b;
          box-shadow: 0 0 20px rgba(0,0,0,0.5);
          border-radius: 8px;
          overflow: hidden;
        }

        th {
          background: #38bdf8;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 1px;
          padding: 12px;
        }

        td {
          padding: 10px;
          text-align: center;
          border-bottom: 1px solid #334155;
        }

        tr:nth-child(even) {
          background: #1e293b;
        }

        tr:nth-child(odd) {
          background: #0f172a;
        }

        tr:hover {
          background: #334155;
          transition: 0.3s;
        }
      </style>
    </head>

    <body>
      <h1>Student Records</h1>

      <table>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Program</th>
          <th>Year</th>
        </tr>

        <xsl:for-each select="s:students/s:student">
          <tr>
            <td><xsl:value-of select="@id"/></td>
            <td><xsl:value-of select="s:name"/></td>
            <td><xsl:value-of select="s:program"/></td>
            <td><xsl:value-of select="s:year"/></td>
          </tr>
        </xsl:for-each>

      </table>
    </body>
  </html>

</xsl:template>
</xsl:stylesheet>