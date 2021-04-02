<template>
    <Button @click="googleLogin()" label="Google Authentication" icon="pi pi-google" iconPos="left" class="p-button-raised" style="background-color:var(--green-400);" />
</template>

<script>
import GoogleApi from '../services/GoogleApi'

export default {
  name: 'GoogleLogin',
  props: {

  },
  methods: {
    googleLogin() {
      // Generate a google login link
      window.location.replace(GoogleApi.generateAuthUrl())
    }
  },
  data() {
    return {
      
    }
  }
}
</script>
