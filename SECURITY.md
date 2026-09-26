# Security Policy — KeethanKart

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 1.x (Current) | Yes |

## Reporting a Vulnerability

If you discover a security vulnerability within KeethanKart, please report it privately:

1. Open a private security advisory on GitHub, or
2. Reach out to the maintainer via GitHub issues with details and reproduction steps.

## Security Practices

- **Zero Hardcoded Secrets**: Production credentials, Firebase keys, and tokens are stored in environment variables (`.env.local`).
- **Local Data Protection**: The `.agents/` directory containing local memory and keys is strictly git-ignored.
- **Client Resilience**: Popups and cross-tab broadcasts sanitize and validate all payload objects.
