<template>
  <div class="home">
    <!--img alt="Vue logo" src="../assets/logo.png"-->
    <!--HelloWorld msg="Welcome to Your Vue.js App"/-->
    <DefaultVue/>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import DefaultVue from '@/components/DefaultVue.vue'

export default {
  name: 'HomeView',
  components: {
    // HelloWorld
    DefaultVue
  }
}
</script>
