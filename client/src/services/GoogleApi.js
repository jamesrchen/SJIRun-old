export default {
  generateAuthUrl() {
    // Google's OAuth 2.0 endpoint for requesting an access token
    const oauth2Endpoint = 'https://accounts.google.com/o/oauth2/v2/auth';

    // Parameters to pass to OAuth 2.0 endpoint.
    const params = {
      'client_id': import.meta.env.VITE_GOOGLE_CLIENT_ID,
      'redirect_uri': `${import.meta.env.VITE_SERVER_URL}/callback/google`,
      'response_type': 'code',
      'scope': 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
      'include_granted_scopes': 'true',
      'state': 'pass-through value'
    };

    const searchParams = new URLSearchParams(params);

    return oauth2Endpoint + '?' + searchParams.toString();
  }
}