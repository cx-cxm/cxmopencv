<template>
  <div class="">
    <h3 class='centertop'>ready!</h3>
    <v-btn fab x-large @click='start' class='center'>start</v-btn>
      <input type='button' @click='stt' ref='stt' value='start'>
      <input type='button' @click='stp' id='stp' value='stop'>
     <img ref='pica' :src="require('../assets/pica.jpeg')">
      <!--img ref='picb' :src="require('../assets/picb.jpeg')"-->
      <!--img ref='image' -->
      <canvas ref='cana'></canvas>
      <canvas ref='canb'></canvas>
      <canvas ref='canc'></canvas>
      <canvas ref='buffer'></canvas>
      <video muted playsinline ref='video'></video>
  </div>
</template>

<script>

// import store from '../store'
// vuexはthis.$store.stateを略して呼べるようにするため
// import { mapState, mapMutations, mapGetters mapActions } from 'vuex'

// const buffer = this.$refs.buffer.getContext('2d')
// let canvas = document.getElementById('buffer')
// const video = this.$refs.video
// const img = document.getElementById('image')
// const reader = new FileReader()

let w
let h

// let img

const medias =
{
  audio: false,
  video: {
    facingMode: 'environment',
    width: { ideal: 222 }, // 1920
    height: { ideal: 227 } // 1080
    // aspectRatio: {exact: 1.7777777778}
    // facingMode: "user" // フロントカメラにアクセス
  }
}

const mediaDevices = navigator.mediaDevices || ((navigator.mozGetUserMedia || navigator.webkitGetUserMedia)
  ? {
      getUserMedia: function (c) {
        return new Promise(function (resolve, reject) {
          (navigator.mozGetUserMedia ||
        navigator.webkitGetUserMedia).call(navigator, c, resolve, reject)
        })
      }
    }
  : null)

export default {
  name: 'DefaultVue',
  data: function () {
    return {
      flgg: 1,
      frame: 0,
      templgray: ''
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
    stt () {
      this.flgg = 0
      this.$refs.video.style.display = 'none'
      // uploadCanvasData()
    },

    stp () {
      const video = this.$refs.video
      this.flgg = 1
      video.style.display = ''
      video.style.width = String(w) / 3 + 'px'
      video.style.height = String(h) / 3 + 'px'
    },

    successCallback (stream) {
      const video = this.$refs.video
      video.srcObject = stream
      const settings = stream.getVideoTracks()[0].getSettings()
      w = settings.width
      h = settings.height
      console.log(w)
      // w=1536
      // h=2048

      this.$refs.buffer.setAttribute('width', w)
      this.$refs.buffer.setAttribute('height', h)
      // this.$refs.image.setAttribute('width', w)
      // this.$refs.image.setAttribute('height', h)

      this.$refs.video.style.display = 'none'
      this.$refs.buffer.style.display = 'none'
      /*
      canvas.width *= devicePixelRatio
      canvas.height *= devicePixelRatio
      canvas.style.width = String(canvas.width / devicePixelRatio) + "px"
      canvas.style.height = String(canvas.height / devicePixelRatio) + "px"
      */
    },
    errorCallback (err) {
      alert(err)
    },

    capture () {
      if (mediaDevices) {
        const promise = mediaDevices.getUserMedia(medias)

        promise.then(this.successCallback)
          .catch(this.errorCallback)
      } else {
        console.log('err')
      }
    },

    draw () {
      const video = this.$refs.video
      requestAnimationFrame(this.draw)
      this.frame++
      if (this.frame % 300 !== 0) {
        return
      }
      this.$refs.buffer.getContext('2d').drawImage(video, 0, 0, w, h)
      // this.$refs.image.src = this.$refs.buffer.toDataURL('image/jpeg')
      // console.log(this.$refs.image)

      // uploadCanvasData()

      // ローカルでファイル生成する場合は以下追加
      // const a = document.createElement('a') // download属性を持ったaタグをクリックするとダウンロードができるので、それをシミュレートする
      // document.body.appendChild(a)
      // a.style = 'display:none'
      // a.href = this.$refs.image.src
      // const day = new Date()
      // a.download = day + '.jpg'
      // a.click()
      // createされた、objUrlを解放
      // window.URL.revokeObjectURL(this.$refs.img.src)
      this.opencv()
    },

    opencvtemp () {
      const cv = window.cv
      const templ = cv.imread(this.$refs.pica)
      this.templgray = new cv.Mat()
      cv.cvtColor(templ, this.templgray, cv.COLOR_RGBA2GRAY)
    },

    opencv () {
      // 特徴点検出
      const cv = window.cv
      // const templ = cv.imread(this.$refs.pica)
      const src = cv.imread(this.$refs.buffer)
      const srcgray = new cv.Mat()
      // const templgray = new cv.Mat()
      cv.cvtColor(src, srcgray, cv.COLOR_RGBA2GRAY)
      // cv.cvtColor(templ, templgray, cv.COLOR_RGBA2GRAY)

      const akaze = new cv.AKAZE()
      const templkp = new cv.KeyPointVector()
      const templdas = new cv.Mat()
      const templmask = new cv.Mat()
      akaze.detectAndCompute(this.templgray, templmask, templkp, templdas)
      const templview = new cv.Mat()
      cv.drawKeypoints(this.templgray, templkp, templview)
      cv.imshow(this.$refs.cana, templview)

      const srckp = new cv.KeyPointVector()
      const srcdas = new cv.Mat()
      const srcmask = new cv.Mat()
      akaze.detectAndCompute(srcgray, srcmask, srckp, srcdas)
      const srcview = new cv.Mat()

      cv.drawKeypoints(srcgray, srckp, srcview)
      cv.imshow(this.$refs.canb, srcview)

      // 類似特徴点検出
      const bf = new cv.BFMatcher()
      const matches = new cv.DMatchVectorVector()
      bf.knnMatch(templdas, srcdas, matches, 2)
      // const arr = []
      const goodmatches = new cv.DMatchVector()

      for (let i = 0; i < matches.size(); ++i) {
        const match = matches.get(i)
        const dMatch1 = match.get(0)
        const dMatch2 = match.get(1)

        if (dMatch1 && dMatch2 && dMatch1.distance <= dMatch2.distance * 0.8) {
          goodmatches.push_back(dMatch1)
        }
      }
      console.log('good_matches : ' + goodmatches.size())
      const imgmatches = new cv.Mat()
      cv.drawMatches(this.templgray, templkp, srcgray, srckp, goodmatches, imgmatches)
      cv.imshow(this.$refs.canc, imgmatches)

      let homo
      // ホモグラフィー
      if (goodmatches.size() > 10) { // 十分な点があるか？
        const srcPoints = []
        const dstPoints = []
        for (let k = 0; k < goodmatches.size(); ++k) {
          srcPoints.push(templkp.get(goodmatches.get(k).queryIdx).pt.x)
          srcPoints.push(templkp.get(goodmatches.get(k).queryIdx).pt.y)
          dstPoints.push(srckp.get(goodmatches.get(k).trainIdx).pt.x)
          dstPoints.push(srckp.get(goodmatches.get(k).trainIdx).pt.y)
        }

        const srcPointsMatArr = cv.matFromArray(srcPoints.length / 2, 1, cv.CV_32FC2, srcPoints)
        const dstPointsMatArr = cv.matFromArray(dstPoints.length / 2, 1, cv.CV_32FC2, dstPoints)
        homo = cv.findHomography(srcPointsMatArr, dstPointsMatArr, cv.RANSAC, 5.0)
        console.log('findHomography done')
      } else {
        console.log('no try findHomography')
      }

      // ホモグラフィーした点を整理
      if (homo) {
        const objCornersMatarr = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, this.templgray.cols - 1, 0, this.templgray.cols - 1, this.templgray.rows - 1, 0, this.templgray.rows - 1])
        const sceneCornersMatarr = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, 0, 0, 0, 0, 0, 0])
        cv.perspectiveTransform(objCornersMatarr, sceneCornersMatarr, homo)
        const corner1 = new cv.Point(sceneCornersMatarr.data32F[0], sceneCornersMatarr.data32F[1])
        const corner2 = new cv.Point(sceneCornersMatarr.data32F[2], sceneCornersMatarr.data32F[3])
        const corner3 = new cv.Point(sceneCornersMatarr.data32F[4], sceneCornersMatarr.data32F[5])
        const corner4 = new cv.Point(sceneCornersMatarr.data32F[6], sceneCornersMatarr.data32F[7])
        console.log(corner1, corner2, corner3, corner4)
      }

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
    },

    start () {
      // draw

      // stt()
      // stp()

      this.$refs.video.play()
      this.capture()
      this.opencvtemp()
      this.draw()

      //
      //
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
