<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="text" encoding="UTF-8"/>
<xsl:param name="day" select="''"/>
<xsl:param name="venueId" select="''"/>
<xsl:param name="performerId" select="''"/>
<xsl:param name="page" select="1"/>
<xsl:param name="pageSize" select="20"/>
<xsl:template match="/festival">{
  "items": [<xsl:for-each select="programme/event[(not($day) or substring(start,1,10)=$day) and (not($venueId) or venueId=$venueId) and (not($performerId) or performerId=$performerId)][position() &gt; (($page - 1) * $pageSize) and position() &lt;= ($page * $pageSize)]">{
    "id": "<xsl:value-of select="@id"/>", "type": "<xsl:value-of select="@type"/>", "title": "<xsl:value-of select="title"/>", "performerId": "<xsl:value-of select="performerId"/>", "venueId": "<xsl:value-of select="venueId"/>", "start": "<xsl:value-of select="start"/>", "end": "<xsl:value-of select="end"/>", "description": "<xsl:value-of select="description"/>"}<xsl:if test="position()!=last()">,</xsl:if></xsl:for-each>],
  "count": <xsl:value-of select="count(programme/event[(not($day) or substring(start,1,10)=$day) and (not($venueId) or venueId=$venueId) and (not($performerId) or performerId=$performerId)])"/>, "page": <xsl:value-of select="$page"/>, "pageSize": <xsl:value-of select="$pageSize"/>
}</xsl:template>
</xsl:stylesheet>
