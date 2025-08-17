# Coolify Domain Routing and SSL Configuration

This guide covers setting up domain routing and SSL certificates for andrewford.co.nz blog deployment on Coolify.

## Overview

The configuration includes:

- **Domain routing** via Traefik reverse proxy
- **SSL certificates** via Let's Encrypt (automatic)
- **Security headers** for production deployment
- **Redirect configuration** for www subdomain

## Prerequisites

- ✅ Coolify server running with Traefik enabled
- ✅ Domain DNS pointing to your Coolify server IP
- ✅ Ports 80 and 443 open on your server
- ✅ Valid domain ownership (for Let's Encrypt)

## DNS Configuration

### Required DNS Records

Configure these DNS records with your domain provider:

```
Type    Name    Value                   TTL
A       @       YOUR_COOLIFY_SERVER_IP  300
A       www     YOUR_COOLIFY_SERVER_IP  300
CNAME   *       andrewford.co.nz        300
```

### Verification

Test DNS propagation before proceeding:

```bash
# Check A record
dig @8.8.8.8 andrewford.co.nz A

# Check www subdomain
dig @8.8.8.8 www.andrewford.co.nz A

# Expected result: Both should return your Coolify server IP
```

## Coolify Dashboard Configuration

### 1. Domain Setup

1. **Navigate to your application** in Coolify dashboard
2. **Go to Domains section**
3. **Add Primary Domain**:
   - Domain: `andrewford.co.nz`
   - Generate Certificate: ✅ Enabled
   - Certificate Type: `Let's Encrypt`
4. **Add WWW Redirect**:
   - Domain: `www.andrewford.co.nz`
   - Redirect to: `andrewford.co.nz`
   - Generate Certificate: ✅ Enabled

### 2. SSL Certificate Configuration

The SSL configuration is already included in the `coolify.yaml` via Traefik labels:

```yaml
labels:
  - "traefik.http.routers.andrewford-blog.tls=true"
  - "traefik.http.routers.andrewford-blog.tls.certresolver=letsencrypt"
```

### 3. Security Headers Configuration

Enhanced security headers are configured in `coolify.yaml`:

```yaml
labels:
  # Security headers
  - "traefik.http.middlewares.security-headers.headers.customresponseheaders.X-Content-Type-Options=nosniff"
  - "traefik.http.middlewares.security-headers.headers.customresponseheaders.X-Frame-Options=DENY"
  - "traefik.http.middlewares.security-headers.headers.customresponseheaders.X-XSS-Protection=1; mode=block"
  - "traefik.http.middlewares.security-headers.headers.customresponseheaders.Strict-Transport-Security=max-age=31536000; includeSubDomains"
```

## Advanced Traefik Configuration

### Custom Traefik Rules (Optional)

If you need custom routing rules, create a `traefik-config.yaml`:

```yaml
# Additional Traefik configuration for advanced routing
http:
  routers:
    andrewford-blog-secure:
      rule: "Host(`andrewford.co.nz`)"
      service: andrewford-blog
      tls:
        certResolver: letsencrypt
      middlewares:
        - security-headers
        - compression

    www-redirect:
      rule: "Host(`www.andrewford.co.nz`)"
      service: andrewford-blog
      middlewares:
        - www-to-non-www-redirect

  services:
    andrewford-blog:
      loadBalancer:
        servers:
          - url: "http://app:3000"
        healthCheck:
          path: "/health"
          interval: "30s"
          timeout: "10s"

  middlewares:
    security-headers:
      headers:
        customResponseHeaders:
          X-Content-Type-Options: "nosniff"
          X-Frame-Options: "DENY"
          X-XSS-Protection: "1; mode=block"
          Strict-Transport-Security: "max-age=31536000; includeSubDomains"

    compression:
      compress: {}

    www-to-non-www-redirect:
      redirectRegex:
        regex: "^https://www\\.(.+)"
        replacement: "https://${1}"
        permanent: true
```

## SSL Certificate Management

### Automatic Renewal

Let's Encrypt certificates are automatically renewed by Coolify/Traefik:

- **Certificate lifetime**: 90 days
- **Auto-renewal**: 30 days before expiry
- **Renewal process**: Automatic (no manual intervention)

### Certificate Verification

After deployment, verify SSL configuration:

```bash
# Check SSL certificate
openssl s_client -connect andrewford.co.nz:443 -servername andrewford.co.nz

# Check certificate expiry
curl -vI https://andrewford.co.nz 2>&1 | grep -i expire

# Test SSL grade (optional)
curl -s "https://api.ssllabs.com/api/v3/analyze?host=andrewford.co.nz" | jq .
```

### Certificate Troubleshooting

Common SSL issues and solutions:

| Issue                            | Cause                   | Solution                                  |
| -------------------------------- | ----------------------- | ----------------------------------------- |
| Certificate not issued           | DNS not propagated      | Wait for DNS propagation (up to 48 hours) |
| "Certificate transparency" error | Rate limiting           | Wait 1 hour and redeploy                  |
| Mixed content warnings           | HTTP resources on HTTPS | Update all URLs to HTTPS                  |
| Certificate expired              | Renewal failed          | Check Coolify logs and redeploy           |

## Security Configuration

### HTTP Security Headers

The following security headers are automatically configured:

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
```

### CORS Configuration

CORS is handled by the Express.js application with these settings:

```javascript
const corsOptions = {
  origin: ["https://andrewford.co.nz"],
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
```

## Performance Optimization

### Gzip Compression

Enable compression in Coolify:

1. **Go to your application settings**
2. **Enable "Compression" middleware**
3. **Configure compression for**:
   - `text/html`
   - `text/css`
   - `application/javascript`
   - `application/json`

### CDN Integration (Optional)

For enhanced performance, consider CloudFlare integration:

1. **Add domain to CloudFlare**
2. **Set DNS to "Proxied" (orange cloud)**
3. **Configure CloudFlare settings**:
   - SSL/TLS: Full (strict)
   - Always Use HTTPS: On
   - Auto Minify: CSS, JavaScript, HTML
   - Brotli compression: On

## Monitoring and Health Checks

### Health Check Endpoint

The application includes a health check endpoint:

```
GET https://andrewford.co.nz/health

Response:
{
  "status": "healthy",
  "timestamp": "2024-01-17T10:00:00.000Z",
  "environment": "production"
}
```

### Uptime Monitoring

Configure uptime monitoring in Coolify:

1. **Go to Monitoring section**
2. **Add health check**:
   - URL: `https://andrewford.co.nz/health`
   - Interval: 60 seconds
   - Timeout: 10 seconds
   - Expected status: 200

## Testing and Validation

### Pre-deployment Checklist

- [ ] DNS records configured correctly
- [ ] Domain pointing to Coolify server
- [ ] Ports 80/443 open on server
- [ ] Coolify domain configuration complete
- [ ] SSL certificate requested

### Post-deployment Validation

Test these URLs after deployment:

1. **Main domain**: https://andrewford.co.nz
2. **WWW redirect**: https://www.andrewford.co.nz → https://andrewford.co.nz
3. **SSL certificate**: Valid and trusted
4. **Health check**: https://andrewford.co.nz/health
5. **API endpoints**:
   - https://andrewford.co.nz/api/lastplayed
   - https://andrewford.co.nz/api/latestUploads
   - https://andrewford.co.nz/api/chatrag (POST)

### SSL Testing Tools

Use these tools to validate SSL configuration:

- **SSL Labs**: https://www.ssllabs.com/ssltest/
- **SSL Checker**: https://www.sslshopper.com/ssl-checker.html
- **Security Headers**: https://securityheaders.com/

## Troubleshooting

### Common Domain Issues

| Issue             | Cause                          | Solution                              |
| ----------------- | ------------------------------ | ------------------------------------- |
| 404 Not Found     | Traefik routing not configured | Check domain configuration in Coolify |
| SSL warnings      | Mixed content                  | Ensure all resources use HTTPS        |
| Redirect loops    | Misconfigured redirects        | Check www redirect configuration      |
| DNS not resolving | DNS propagation delay          | Wait 24-48 hours for full propagation |

### Logs and Debugging

Check these logs for domain/SSL issues:

```bash
# Coolify application logs
docker logs <coolify-app-container>

# Traefik logs
docker logs <traefik-container>

# Let's Encrypt certificate logs
docker logs <letsencrypt-container>
```

## Next Steps

After completing domain and SSL configuration:

1. ✅ Verify domain resolves to your server
2. ✅ Confirm SSL certificate is issued and valid
3. ✅ Test all domain redirects work correctly
4. ✅ Validate security headers are present
5. ✅ Proceed to health checks and monitoring setup (Task 4.4)
