# Environment Configuration Instructions

## Create .env.local file

Create a file named `.env.local` in the root directory (d:\Nextjs\smoker-app-web\) with the following content:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Important Notes

- This file is gitignored and won't be committed to version control
- Change the URL if your backend runs on a different port
- The NEXT_PUBLIC_ prefix makes this variable available in the browser

## Alternative Configuration

If your backend runs on a different URL, update accordingly:

```
# For production
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api

# For different local port
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```
