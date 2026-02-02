## Security Checklist

### Input Validation
- All user inputs validated and sanitized (Zod schemas preferred)
- No direct interpolation into SQL (parameterized queries only)
- File uploads validated (type, size, content)

### Injection Prevention
- SQLi: No raw SQL unless parameterized
- XSS: Avoid `dangerouslySetInnerHTML`; if used, sanitize HTML
- Command injection: No user input in shell commands

### Authorization
- AuthZ checks on every request/action touching protected data
- Principle of least privilege enforced
- Admin routes/actions properly protected

### Sensitive Data
- No secrets/PII in logs, responses, or client state
- Env var usage correct (`NEXT_PUBLIC_*` only for safe public values)
- Tokens/keys not exposed in URLs or error messages

### Attack Vectors
- Rate limiting on auth endpoints
- CSRF protection where needed
- Proper CORS configuration
