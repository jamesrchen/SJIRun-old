<template>
  <h2>Leaderboard ({{sort.name}})</h2>
  <h4 v-if="this.userinfo.email">Logged in as: {{ this.userinfo.email }}</h4>
  <h4 v-if="this.userinfo.stravaID">Strava: <a v-bind:href="'https://www.strava.com/athletes/'+this.userinfo.stravaID">Profile</a></h4>
  <SelectButton :options="sortOptions" v-model="sort" optionLabel="name" class="p-mt-2"> <!-- Different way to organise data -->
    <template #option="slotProps">
      <i :class="slotProps.option.icon" class="p-mr-1"></i>
      {{slotProps.option.name}}
    </template>
  </SelectButton>
  <DataTable :value="students" class="p-mt-2">
      <Column field="rank" header="#" headerStyle="width:5em"></Column>
      <Column field="name" header="Name" headerStyle="width:20em"></Column>
      <Column field="classroom" header="Class"></Column>
      <Column field="distance" header="Distance (m)"></Column>
  </DataTable>
</template>

<script>
import InternalApi from '../services/InternalApi'

export default {
  name: 'Leaderboard',
  props: {
      userinfo: Object
  },
  data() {
    return {
      students: null,
      value: true,
      sortOptions: [
        {icon: "pi pi-arrow-down", name: 'Descending', val: "desc"},
				{icon: "pi pi-arrow-up", name: 'Ascending', val: "asc"},
      ],
      sort: {icon: "pi pi-arrow-down", name: 'Descending', val: "desc"}
    }
  },
  watch: {
    sort: {
      handler: 'loadLeaderboard' // Load leaderboard to reflect changes in sorting
    },
  },
  methods: {
    async loadLeaderboard() {
      // Get Leaderboard
      const leaderboard = (await InternalApi.getLeaderboard(this.sort.val)).data
      console.log(leaderboard)
      this.students = []
      for(let i = 0; i < leaderboard.length; i++) {
        this.students.push({
          "rank": leaderboard[i].rank,
          "name": leaderboard[i].full_name.split(" ").map(word => word[0].toUpperCase()+word.slice(1).toLowerCase()).join(" ") + (leaderboard[i].you == true? " (You)" : ""),
          "classroom": leaderboard[i].classroom,
          "distance": leaderboard[i].distance 
        })
      }
    }
  },
  mounted() {
    this.students = [
      {
          "rank": null,
          "name": "There's probably an error if you are seeing this",
          "classroom": "File a bug report:",
          "distance": "https://sji.one",
      }
    ]

    this.loadLeaderboard() // Load leaderboard on mount

    this.sortOptions.push({icon: "pi pi-user", name: 'You', val: 'you'}) // TODO: Check if logged in... somehow
  },
}
</script>
