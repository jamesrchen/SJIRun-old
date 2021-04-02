export default {
  generateAuthUrl() {
    return `https://www.strava.com/oauth/authorize?client_id=${import.meta.env.VITE_STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${import.meta.env.VITE_SERVER_URL}/callback/strava&approval_prompt=force&scope=read,activity:read_all`;
  }
}