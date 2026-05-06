# Security Policy

## Supported Scope

This repository publishes a static site and static JSON data for the Desert Pulse Festival coursework project. Security support covers the current default branch content.

## Reporting a Vulnerability

If you find a security issue, open a private report with:

- A clear description of the issue and impact.
- Steps to reproduce.
- A suggested fix if available.

Do not publish exploit details before a fix is available.

## Disclosure Expectations

- Initial triage target: within 5 business days.
- Remediation target for moderate/high issues: within 30 days where feasible.

## Security Baseline

- Content Security Policy and referrer policy are applied in page metadata.
- Build validation includes schema checks and test execution in CI.
- Third-party social preview assets are self-hosted under `web/assets/`.
