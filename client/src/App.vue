<template>
  <title>{{ $appTitle }}</title>

  <div class="p-grid">
    <div class="p-col-1 p-md-3"/> 
    <div class="p-col-10 p-md-6 p-mt-4"><h1>{{ $appTitle }}</h1></div> 
    <div class="p-col-1 p-md-3"/>
    
    <div class="p-col-1 p-md-3"/>
    <div class="p-col-10 p-md-6">
      <img alt="SJI" src="./assets/logo.png" style="max-width:15rem;text-align:center" />
    
      <div class="p-mt-6"> <GoogleLogin v-if="!email"/> <StravaLogin v-if="!!email && !stravaID"/> </div>
    
      <div class="p-mt-6"> <Leaderboard v-bind:userinfo="{email: email, stravaID: stravaID}" /> </div>

    </div>
    <div class="p-col-1 p-md-3"/> 

  </div>

  <Toast position="bottom-right"/>
</template>

<script>
import GoogleLogin from './components/GoogleLogin.vue'
import StravaLogin from './components/StravaLogin.vue'
import Leaderboard from './components/Leaderboard.vue'

import InternalApi from './services/InternalApi.js'

export default {
  name: 'App',
  components: {
    GoogleLogin,
    StravaLogin,
    Leaderboard
  },
  data() {
    return {
      email: null,
      stravaID: null,
    }
  },
  methods: {
    errorToast(summary = "Error!", error) {
      this.$toast.add({severity: "error", summary: summary, detail:'Report the issue at https://sji.one', life: 10000})
      console.error(error)
    },

    async updateUserInfo() {
      InternalApi.getUserInfo()
        .then((userInfoReq) => {
          if(userInfoReq.status != 200) {
            this.errorToast("getUserInfo returned non-200")
            return
          }

          console.log(userInfoReq.data)

          this.email = userInfoReq.data.email
          this.stravaID = userInfoReq.data.stravaID

        })
        .catch((err) => {
          this.errorToast("getUserInfo failed!", err)
          return
        })
    }

  },
  mounted() {

    // Handle information messages TODO: Replace with auth state check (except for failure and incorrect order?)
    const messages = {
      "#google-success": {
        severity: "success",
        message: "Successfully authenticated with Google!"
      },
      "#strava-success": {
        severity: "success",
        message: "Successfully authenticated with Strava!"
      },
      "#google-not-authenticated": {
        severity: "error",
        message: "To authenticate with Strava, first authenticate with Google!"
      },
      "#google-failed": {
        severity: "error",
        message: "Failed to authenticate with Google!"
      },
      "#strava-failed": {
        severity: "error",
        message: "Failed to authenticate with Strava!"
      },
    }

    if(messages[location.hash]){
      const message = messages[location.hash]
      this.$toast.add({severity: message.severity, summary: message.message, detail:'', life: 3000})
    } else {
      this.$toast.add({severity: "info", summary: "Made for SJI by SJI Students", detail:'Find out more at https://sji.one', life: 10000})
    }

    // Check status of authentications & update (async)
    this.updateUserInfo()
  }
}
</script>
