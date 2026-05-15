<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:cs="http://u24666981/campusServices"
    exclude-result-prefixes="cs">
    <!-- Motheo Morena u24666981 -->

    <xsl:output method="html" indent="yes" encoding="UTF-8"/>

    <xsl:template match="/">
        <html>
            <head>
                <title>UP Campus Services</title>
                <style>
                    :root {
                        --up-blue: #004B87;
                        --up-orange: #F37021;
                        --up-green: #ADC08D; /* Pale Avocado */
                        --light-bg: #f9f9f9;
                    }

                    body { 
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                        background-color: var(--light-bg);
                        color: #333;
                        margin: 40px;
                    }

                    h1 { 
                        color: var(--up-blue); 
                        border-bottom: 3px solid var(--up-orange);
                        padding-bottom: 10px;
                        display: inline-block;
                    }

                    .container { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }

                    table { border-collapse: collapse; width: 100%; margin-top: 20px; background: white; }
                    
                    th { 
                        background-color: var(--up-blue); 
                        color: white; 
                        padding: 12px; 
                        text-align: left; 
                        text-transform: uppercase;
                        font-size: 0.85rem;
                    }

                    td { 
                        border-bottom: 1px solid #eee; 
                        padding: 15px; 
                        vertical-align: top; 
                        line-height: 1.5;
                    }

                    tr:hover { background-color: #e2e2e2; }

                    .id-badge {
                        background: var(--up-green);
                        color: #2c3e50;
                        padding: 2px 8px;
                        border-radius: 4px;
                        font-weight: bold;
                        font-size: 0.8rem;
                    }

                    .category-tag {
                        color: var(--up-orange);
                        font-weight: 600;
                        font-size: 0.8rem;
                        display: block;
                        margin-bottom: 5px;
                    }

                    .service-name { font-weight: bold; color: var(--up-blue); font-size: 1.1rem; }
                    
                    .contact-info, .hours-info { font-size: 0.9rem; min-width: 180px; }
                    
                    .day-row { display: flex; justify-content: space-between; border-bottom: 1px dashed #eee; padding: 2px 0; }
                    .day-name { font-weight: 600; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Campus Services: <xsl:value-of select="cs:campusServices/@campus"/></h1>
                    <table>
                        <tr>
                            <th>Service</th>
                            <th>Location</th>
                            <th>Contact</th>
                            <th>Operating Hours</th>
                            <th>Description</th>
                        </tr>
                        <xsl:for-each select="//cs:service">
                            <tr>
                                <td>
                                    <span class="category-tag"><xsl:value-of select="@category"/></span>
                                    <div class="service-name"><xsl:value-of select="cs:name"/></div>
                                    <span class="id-badge"><xsl:value-of select="@id"/></span>
                                </td>
                                <td><xsl:value-of select="cs:location"/></td>
                                <td class="contact-info">
                                    <strong>Email:</strong><br/> <xsl:value-of select="cs:contact/cs:email"/><br/>
                                    <strong>Phone:</strong><br/> <xsl:value-of select="cs:contact/cs:phone"/>
                                </td>
                                <td class="hours-info">
                                    <xsl:for-each select="cs:hours/cs:day">
                                        <div class="day-row">
                                            <span class="day-name"><xsl:value-of select="@name"/></span>
                                            <span>
                                                <xsl:choose>
                                                    <xsl:when test="cs:opens = '00:00:00' and cs:closes = '23:59:00'">
                                                        24 hours
                                                    </xsl:when>
                                                    <xsl:otherwise>
                                                        <xsl:value-of select="substring(cs:opens, 1, 5)"/> - 
                                                        <xsl:value-of select="substring(cs:closes, 1, 5)"/>
                                                    </xsl:otherwise>
                                                </xsl:choose>
                                            </span>
                                        </div>
                                    </xsl:for-each>
                                </td>
                                <td style="font-size: 0.9rem; color: #555;">
                                    <xsl:value-of select="cs:description"/>
                                </td>
                            </tr>
                        </xsl:for-each>
                    </table>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>