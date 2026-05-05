<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="text" encoding="UTF-8"/>
<xsl:template match="/festival">{
  "id": "<xsl:value-of select="@id"/>",
  "name": "<xsl:value-of select="info/name"/>",
  "year": <xsl:value-of select="info/year"/>,
  "edition": <xsl:value-of select="info/edition"/>,
  "location": "<xsl:value-of select="info/location"/>",
  "startDate": "<xsl:value-of select="info/startDate"/>",
  "endDate": "<xsl:value-of select="info/endDate"/>",
  "description": "<xsl:value-of select="info/description"/>",
  "tickets": {"url": "<xsl:value-of select="info/ticketUrl"/>"},
  "links": {"website": "<xsl:value-of select="info/website"/>"}
}</xsl:template>
</xsl:stylesheet>
