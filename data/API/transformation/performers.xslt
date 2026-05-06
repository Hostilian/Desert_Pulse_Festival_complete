<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:output method="text" encoding="UTF-8"/>
<xsl:param name="page" select="1"/><xsl:param name="pageSize" select="20"/>
<xsl:template name="replace">
  <xsl:param name="text"/><xsl:param name="find"/><xsl:param name="with"/>
  <xsl:choose><xsl:when test="contains($text, $find)"><xsl:value-of select="substring-before($text, $find)"/><xsl:value-of select="$with"/><xsl:call-template name="replace"><xsl:with-param name="text" select="substring-after($text, $find)"/><xsl:with-param name="find" select="$find"/><xsl:with-param name="with" select="$with"/></xsl:call-template></xsl:when><xsl:otherwise><xsl:value-of select="$text"/></xsl:otherwise></xsl:choose>
</xsl:template>
<xsl:template name="json-string">
  <xsl:param name="text"/>
  <xsl:variable name="s1"><xsl:call-template name="replace"><xsl:with-param name="text" select="$text"/><xsl:with-param name="find" select="'\'"/><xsl:with-param name="with" select="'\\'"/></xsl:call-template></xsl:variable>
  <xsl:variable name="s2"><xsl:call-template name="replace"><xsl:with-param name="text" select="$s1"/><xsl:with-param name="find" select="'&quot;'"/><xsl:with-param name="with" select="'\&quot;'"/></xsl:call-template></xsl:variable>
  <xsl:variable name="s3"><xsl:call-template name="replace"><xsl:with-param name="text" select="$s2"/><xsl:with-param name="find" select="'&#10;'"/><xsl:with-param name="with" select="'\n'"/></xsl:call-template></xsl:variable>
  <xsl:variable name="s4"><xsl:call-template name="replace"><xsl:with-param name="text" select="$s3"/><xsl:with-param name="find" select="'&#13;'"/><xsl:with-param name="with" select="'\r'"/></xsl:call-template></xsl:variable>
  <xsl:call-template name="replace"><xsl:with-param name="text" select="$s4"/><xsl:with-param name="find" select="'&#9;'"/><xsl:with-param name="with" select="'\t'"/></xsl:call-template>
</xsl:template>
<xsl:template match="/festival">{
  "items": [<xsl:for-each select="performers/performer[position() &gt; (($page - 1) * $pageSize) and position() &lt;= ($page * $pageSize)]">{
    "id": "<xsl:call-template name="json-string"><xsl:with-param name="text" select="@id"/></xsl:call-template>", "name": "<xsl:call-template name="json-string"><xsl:with-param name="text" select="name"/></xsl:call-template>", "genre": "<xsl:call-template name="json-string"><xsl:with-param name="text" select="genre"/></xsl:call-template>", "country": "<xsl:call-template name="json-string"><xsl:with-param name="text" select="country"/></xsl:call-template>", "bio": "<xsl:call-template name="json-string"><xsl:with-param name="text" select="bio"/></xsl:call-template>"}<xsl:if test="position()!=last()">,</xsl:if></xsl:for-each>],
  "count": <xsl:value-of select="count(performers/performer)"/>, "page": <xsl:value-of select="$page"/>, "pageSize": <xsl:value-of select="$pageSize"/>
}</xsl:template>
</xsl:stylesheet>
