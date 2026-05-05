<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="text" encoding="UTF-8"/>
<xsl:param name="id" select="'e1'"/>
<xsl:template match="/festival"><xsl:for-each select="programme/event[@id=$id]">{
  "id": "<xsl:value-of select="@id"/>", "type": "<xsl:value-of select="@type"/>", "title": "<xsl:value-of select="title"/>", "performerId": "<xsl:value-of select="performerId"/>", "venueId": "<xsl:value-of select="venueId"/>", "start": "<xsl:value-of select="start"/>", "end": "<xsl:value-of select="end"/>", "description": "<xsl:value-of select="description"/>"
}</xsl:for-each></xsl:template>
</xsl:stylesheet>
