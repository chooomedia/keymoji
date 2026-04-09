# Environment Variables - Best Practices

This document describes how to manage environment variables in Keymoji.

## File Structure

### `.env.example` (Versioned)

-   **Purpose:** Template file showing all available environment variables
-   **Status:** Committed to Git
-   **Content:** Placeholder values only (no real secrets)

### `.env.local` (Not Versioned)

-   **Purpose:** Local development configuration
-   **Status:** Ignored by Git (`.gitignore`)
-   **Content:** Your actual secret values for local development
-   **Priority:** Highest (overrides all other files)

### `.env` (Optional, Not Versioned)

-   **Purpose:** Shared defaults for the team (optional)
-   **Status:** Ignored by Git (`.gitignore`)
-   **Priority:** Medium

### `.env.development` / `.env.production` (Optional, Not Versioned)

-   **Purpose:** Environment-specific overrides
-   **Status:** Ignored by Git (`.gitignore`)
-   **Priority:** Medium-high

## Loading Priority

The environment loader uses the following priority (highest first):

1. `.env.local` - Highest priority (local overrides)
2. `.env.development` / `.env.production` - Environment-specific
3. `.env` - Shared defaults
4. `.env.example` - Fallback template (with warning)

## Setup Instructions

### For Local Development

1. **Copy the template:**

    ```bash
    cp .env.example .env.local
    ```

2. **Fill in your values:**

    ```bash
    # Edit .env.local with your actual values
    nano .env.local
    ```

3. **Generate tokens (if needed):**

    ```bash
    npm run generate:token:dev
    ```

4. **Restart your dev server:**
    ```bash
    npm run dev
    ```

### For Production

Set environment variables in your deployment platform:

-   **Vercel:** Project Settings → Environment Variables
-   **Other platforms:** Follow their documentation

## Available Variables

### `VITE_N8N_APERTUS_TOKEN`

**Description:** Token for authenticating with the Apertus n8n webhook

**Required:** Yes (for Apertus AI provider)

**Generate:**

```bash
npm run generate:token:dev   # For development
npm run generate:token:prod  # For production
```

**Usage in code:**

```javascript
const token = import.meta.env.VITE_N8N_APERTUS_TOKEN;
```

**Production Setup:**

-   Set in Vercel Environment Variables as `VITE_N8N_APERTUS_TOKEN`
-   Environment: Production, Preview, Development

### Optional Variables

**⚠️ Security Note:** These URLs should be set via environment variables and never committed to public repositories.

-   `VITE_API_URL` - API base URL (optional, has fallback default)
-   `VITE_N8N_URL` - n8n webhook base URL (optional, has fallback default)
-   `PORT` - Development server port (default: `8080`)
-   `HOST` - Development server host (default: `localhost`)

**Best Practice:** Always set `VITE_N8N_URL` in production via Vercel Environment Variables to avoid exposing internal endpoints.

## Webpack Configuration

The project uses Webpack with custom environment variable handling:

-   **Frontend variables:** Must be prefixed with `VITE_` to be available via `import.meta.env.*`
-   **Backend variables:** Available via `process.env.*`
-   **Loading:** Handled by `webpack/utils/environment.js`
-   **Injection:** Via `webpack/utils/plugins.js` using `DefinePlugin`

## Best Practices

### ✅ DO

-   Use `.env.local` for local development secrets
-   Keep `.env.example` up-to-date with all available variables
-   Use descriptive variable names with clear documentation
-   Generate secure tokens (64+ characters)
-   Set production variables in your deployment platform

### ❌ DON'T

-   Commit `.env.local` or `.env` to Git
-   Share secrets via email or chat
-   Use the same token for development and production
-   Hardcode secrets in source code
-   Use weak or predictable tokens

## Troubleshooting

### Variables not available in frontend

**Problem:** `import.meta.env.VITE_*` is `undefined`

**Solutions:**

1. Ensure variable starts with `VITE_` prefix
2. Check that variable is in `.env.local`
3. Restart dev server (`npm run dev`)
4. Check Webpack build output for warnings

### Token not working

**Problem:** Apertus webhook rejects requests

**Solutions:**

1. Verify token in `.env.local` matches token in n8n workflow
2. Regenerate token: `npm run generate:token:dev`
3. Update n8n workflow "Set Expected Token" node
4. Check browser console for warnings

### Development vs Production

**Problem:** Different behavior in development vs production

**Solutions:**

1. Check that `.env.local` is not used in production builds
2. Verify production variables are set in Vercel
3. Use environment-specific files (`.env.development`, `.env.production`)
4. Check Webpack mode (development vs production)

## Security Notes

-   **Never commit secrets:** All `.env` files except `.env.example` are in `.gitignore`
-   **Rotate tokens regularly:** Especially if exposed or compromised
-   **Use different tokens:** Separate tokens for development and production
-   **Validate tokens:** Ensure tokens meet security requirements (64+ characters)
-   **Review access:** Regularly review who has access to production tokens

## Related Files

-   `webpack/utils/environment.js` - Environment loader
-   `webpack/utils/plugins.js` - Variable injection
-   `src/config/api.js` - API configuration
-   `src/utils/storyModeAI.js` - Uses `VITE_N8N_APERTUS_TOKEN`
-   `tests/test-n8n-webhook.sh` - Reads token from `.env.local`

## Additional Resources

-   [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
-   [Webpack Environment Variables](https://webpack.js.org/guides/environment-variables/)
-   [dotenv Documentation](https://github.com/motdotla/dotenv)

---

**Last Updated:** 2025-11-07  
**Maintained by:** Christopher Matt
