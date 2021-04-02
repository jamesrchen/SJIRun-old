<template>
    <Button @click="stravaLogin()" label="Strava Authentication" icon="pi pi-map" iconPos="left" class="p-button-raised" style="background-color:var(--orange-500);" />
</template>

<script>
import StravaApi from '../services/StravaApi'

export default {
  name: 'StravaLogin',
  props: {

  },
  methods: {
    stravaLogin() {
      // Generate a google login link
      window.location.replace(StravaApi.generateAuthUrl())
    }
  },
  data() {
    return {
      
    }
  }
}
</script>
