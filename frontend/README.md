# VibeOps Frontend

This is the frontend for the VibeOps website, designed to be deployed on Vercel and communicate with the Flask API on Railway.

## Setup Instructions

### 1. Deploy to Vercel

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Deploy the frontend**:
   ```bash
   cd frontend
   vercel
   ```

3. **Follow the prompts**:
   - Link to existing project or create new one
   - Set project name (e.g., `vibeops-frontend`)
   - Confirm deployment

### 2. Configure Domain

1. **In Vercel Dashboard**:
   - Go to your project settings
   - Navigate to "Domains"
   - Add your custom domains:
     - `vibeops.ca`
     - `www.vibeops.ca`

2. **Update DNS Records**:
   - Point both domains to Vercel's servers
   - Vercel will provide the required DNS records

### 3. Update API URL

If your Railway API URL changes, update the `API_BASE_URL` in `index.html`:

```javascript
const API_BASE_URL = 'https://your-new-railway-url.up.railway.app/api';
```

## Features

- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Authentication**: Checks login status and shows appropriate UI
- ✅ **CRUD Operations**: Create, read, update, delete reviews
- ✅ **Real-time Updates**: Automatically refreshes after operations
- ✅ **Error Handling**: Shows user-friendly error messages
- ✅ **Modern UI**: Clean, professional design

## API Endpoints Used

- `GET /api/reviews` - Get all reviews
- `POST /api/reviews` - Create new review
- `PUT /api/reviews/{id}` - Update review
- `DELETE /api/reviews/{id}` - Delete review
- `GET /api/auth/status` - Check authentication status

## Development

To test locally:

1. **Start local server**:
   ```bash
   cd frontend
   python -m http.server 8000
   ```

2. **Update API URL** for local testing:
   ```javascript
   const API_BASE_URL = 'http://localhost:5008/api';
   ```

## Troubleshooting

### CORS Issues
- Ensure your Railway API has CORS enabled
- Check that the API URL is correct in `index.html`

### Authentication Issues
- Make sure the Flask API is running
- Check that cookies are being sent with requests
- Verify the auth endpoints are working

### Domain Issues
- Ensure DNS records are properly configured
- Check Vercel domain settings
- Verify SSL certificates are active

## Next Steps

1. **Add more pages**: Create additional HTML files for other sections
2. **Implement edit modal**: Replace alert with proper edit interface
3. **Add loading states**: Show spinners during API calls
4. **Improve error handling**: More specific error messages
5. **Add pagination**: For large numbers of reviews 