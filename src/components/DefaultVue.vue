<template>
  <div class="">
    <h3 class='centertop'>ready!</h3>
    <v-btn fab x-large @click='start' class='center'>start</v-btn>
     <img ref='pica' :src="require('../assets/pica.jpeg')">
      <img ref='picb' :src="require('../assets/picb.jpeg')">
      <canvas ref='cana'></canvas>
      <canvas ref='canb'></canvas>
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
      const cv = window.cv
      const templ = cv.imread(this.$refs.pica)
      const src = cv.imread(this.$refs.picb)
      const srcgray = new cv.Mat()
      const templgray = new cv.Mat()
      cv.cvtColor(src, srcgray, cv.COLOR_RGBA2GRAY)
      cv.cvtColor(templ, templgray, cv.COLOR_RGBA2GRAY)

      const akaze = new cv.AKAZE()
      const templkp = new cv.KeyPointVector()
      const templdas = new cv.Mat()
      const templmask = new cv.Mat()
      akaze.detectAndCompute(templgray, templmask, templkp, templdas)
      const templview = new cv.Mat()
      cv.drawKeypoints(templgray, templkp, templview)
      cv.imshow(this.$refs.cana, templview)

      const srckp = new cv.KeyPointVector()
      const srcdas = new cv.Mat()
      const srcmask = new cv.Mat()
      akaze.detectAndCompute(srcgray, srcmask, srckp, srcdas)
      const srcview = new cv.Mat()

      cv.drawKeypoints(srcgray, srckp, srcview)
      cv.imshow(this.$refs.canb, srcview)
      /*
      const matchFeatures = ({ img1, img2, detector, matchFunc }) => {
        const keyPoints1 = detector.detect(img1)
        const keyPoints2 = detector.detect(img2)

        const descriptors1 = detector.compute(img1, keyPoints1)
        const descriptors2 = detector.compute(img2, keyPoints2)

        const matches = matchFunc(descriptors1, descriptors2)

        const bestN = 40
        const bestMatches = matches.sort((match1, match2) => match1.distance - match2.distance).slice(0, bestN)
        return window.cv.drawMatches(
          img1,
          img2,
          keyPoints1,
          keyPoints2,
          bestMatches
        )
      }
      // <img :src="require('../assets/match/ashiato.png')">
      const img1 = window.cv.imread(this.$refs.pica)
      const img2 = window.cv.imread(this.$refs.picb)

      //SIFTで特徴点を抽出
      if (cv.xmodules.xfeatures2d) {
        const siftMatchesImg = matchFeatures({
          img1,
          img2,
          detector: new cv.SIFTDetector({ nFeatures: 2000 }),
          matchFunc: cv.matchFlannBased
        })
        cv.imshowWait('SIFT matches', siftMatchesImg);
      } else {
        console.log('skipping SIFT matches');
      }

      // ORBで特徴点を抽出
      const orbMatchesImg = matchFeatures({
        img1,
        img2,
        detector: new window.cv.ORBDetector(),
        matchFunc: window.cv.matchBruteForceHamming
      })
      console.log(orbMatchesImg)
      window.cv.imshowWait('ORB matches', orbMatchesImg)
    }
    */
    }
  }//  methods
}//  export default
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

body
{
  position: relative;
}

.center{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  -webkit-transform: translateY(-50%) translateX(-50%);
}

.centertop{
  position: absolute;
  top: 0%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  -webkit-transform: translateY(-50%) translateX(-50%);
}

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
