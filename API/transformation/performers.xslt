<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="text" encoding="UTF-8"/>
<xsl:param name="page" select="1"/><xsl:param name="pageSize" select="20"/>
<xsl:template match="/festival">{
  "items": [<xsl:for-each select="performers/performer[position() &gt; (($page - 1) * $pageSize) and position() &lt;= ($page * $pageSize)]">{
    "id": "<xsl:value-of select="@id"/>", "name": "<xsl:value-of select="name"/>", "genre": "<xsl:value-of select="genre"/>", "country": "<xsl:value-of select="country"/>", "bio": "<xsl:value-of select="bio"/>"}<xsl:if test="position()!=last()">,</xsl:if></xsl:for-each>],
  "count": <xsl:value-of select="count(performers/performer)"/>, "page": <xsl:value-of select="$page"/>, "pageSize": <xsl:value-of select="$pageSize"/>
}</xsl:template>
</xsl:stylesheet>
