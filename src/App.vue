<template>
  <v-app>
    <v-main>
      <!--router-view/-->
      <HomeView/>
    </v-main>
  </v-app>
</template>

<script>
import HomeView from './views/HomeView'

export default {
  name: 'App',
  components: {
    HomeView
  },

  data: () => ({
    //
  })
}
</script>
