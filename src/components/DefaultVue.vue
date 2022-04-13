<template>
  <div class="">
    <h3>test</h3>
  </div>
</template>

<script>

// import store from '../store'
// vuexはthis.$store.stateを略して呼べるようにするため
// import { mapState, mapMutations, mapGetters mapActions } from 'vuex'

export default {
  name: 'DefaultVue',
  data: function () {
    return {

    }
  },

  mounted: function () {

  },

  computed: {
    // ...mapState(['']),
    // ...mapGetters(['']),

    classObjA: function () {
      return {
      }
    }
  },

  watch: {
  },

  methods: {
    start () {

    }
  }//  methods
}//  export default
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
