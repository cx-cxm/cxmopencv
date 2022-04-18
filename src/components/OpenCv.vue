<template>
  <div class="">
    <h3 class='centertop'>CMを緑枠ぴったりに合わせてね!</h3>
    <v-btn fab x-large @click='start' class='btn' v-if='btnflg'>start</v-btn>

    <video muted playsinline ref='video' class='video' ></video>
    <video playsinline ref='coke' :src="require('../assets/sizurucomp_640.mp4')" class='center'></video>
    <!--canvas ref='cana'></canvas-->
    <!--canvas ref='canb'></canvas-->
    <canvas ref='canc' class='canc'></canvas>
    <canvas ref='buffer'></canvas>
  </div>
</template>

<script>
// import store from '../store'
// vuexはthis.$store.stateを略して呼べるようにするため
// import { mapState, mapMutations, mapGetters mapActions } from 'vuex'

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
  name: 'OpenCv',
  data: function () {
    return {
      frame: 0,
      templgray: '',
      video: '',
      templ: '',
      h: 0,
      w: 0,
      id: undefined, // cancelAnimationFrame用
      sp: undefined,
      medias: undefined,
      btnflg: true, // clickしたらボタンdisplay:noneにするためのflg
      pica: undefined,
      picb: undefined,
      arr: [], // templ画像用の配列
      time: 0, // trigger発動時間格納用
      time1: 14000, // templ#1検知時のsetTimeout時間
      time2: 1000, // templ#2検知時のsetTimeout時間
      time_def: 30000, // templ検知できなかった場合の保険のsetTimeout時間
      time_def_id: undefined, // clearTimeout用
      matchval: 90,
      pica_src: require('../assets/pica.png'),
      picb_src: require('../assets/picb.png')
    }
  },

  mounted: function () {
    this.video = this.$refs.video
    this.pica = new Image()
    this.picb = new Image()
    this.pica.src = this.pica_src
    this.picb.src = this.picb_src
    this.arr = [this.pica, this.picb]
    this.$refs.coke.style.display = 'none'
    this.sp = navigator.userAgent.match(/iPhone|Android.+Mobile/)

    if (this.sp) { // this.getMobileOS === 'iOS'
      this.medias =
{
  audio: false,
  video: {
    facingMode: 'environment',
    /*
    width: { ideal: 640 }, // 1920
    height: { ideal: 360 }, // 1080
    aspectRatio: { exact: 1.7777777778 } // 1.7777777778
    */
    // ここの入力解像度をマッチングしたい画像解像度と合わせる。カメラ解像度高くても検知性能落ちる!!注意!!
    width: { ideal: 180 }, // iPhoneだとカメラのwidth,heightはスマホ横向きにした時基準。逆になる
    height: { ideal: 320 },
    aspectRatio: { exact: 0.5625 } // 1.7777777778
    // facingMode: "user" // フロントカメラにアクセス
  }
}
    } else {
      this.medias =
{
  audio: false,
  video: {
    facingMode: 'environment',
    width: { ideal: 320 }, // 1920
    height: { ideal: 180 }, // 1080
    aspectRatio: { exact: 1.7777777778 } // 1.7777777778
    // facingMode: "user" // フロントカメラにアクセス
  }
}
    }
  },

  computed: {
    // ...mapState(['']),
    // ...mapGetters(['']),

    classObjA: function () {
      return {
      }
    },
    getMobileOS () {
      const ua = navigator.userAgent
      if (/android/i.test(ua)) {
        return 'Android'
      } else if ((/iPad|iPhone|iPod/.test(ua)) || ((navigator.platform === 'MacIntel') && (navigator.maxTouchPoints > 1))) {
        return 'iOS'
      }
      return 'Other'
    }
  },

  watch: {
  },

  methods: {
    trigger () {
      this.$refs.coke.play()
      // alert('movie start')
    },

    deftrigger () {
      this.detect()
      this.$refs.coke.play()
    },

    /*
    cleartimeout () {
      clearTimeout(this.time_def_id)
    },
    */
    detect (i) {
      cancelAnimationFrame(this.id)
      this.video.srcObject.getVideoTracks().forEach((track) => {
        track.stop()
      })
      this.video.srcObject.getAudioTracks().forEach((track) => {
        track.stop()
      })
      this.$refs.video.style.display = 'none'
      this.$refs.canc.style.display = 'none'
      this.$refs.coke.style.display = ''
      this.$refs.coke.style.width = '320px'
      this.$refs.coke.style.height = '480px'
      if (i === 0) {
        this.time = this.time1
        console.log(this.time1)
      } else if (i === 1) {
        this.time = this.time2
        console.log(this.time2)
      }
      clearTimeout(this.time_def_id)
      setTimeout(this.trigger, this.time)
    },

    successCallback (stream) {
      this.video.srcObject = stream
      const settings = stream.getVideoTracks()[0].getSettings()
      this.$refs.video.width = window.innerWidth * 0.8
      if (this.getMobileOS === 'iOS') {
        /*
        this.$refs.video.width = window.innerWidth * 0.8
        // this.$refs.video.height = window.innerHeight * 0.8
        this.w = settings.width
        this.h = settings.height
        */
        this.h = settings.width
        this.w = settings.height
      } else {
        this.w = settings.width
        this.h = settings.height
      }

      console.log(this.w)
      // w=1536
      // h=2048

      this.$refs.buffer.setAttribute('width', this.w)
      this.$refs.buffer.setAttribute('height', this.h)

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
        const promise = mediaDevices.getUserMedia(this.medias)

        promise.then(this.successCallback)
          .catch(this.errorCallback)
      } else {
        console.log('no mediaDevices!')
      }
    },

    draw () {
      this.id = requestAnimationFrame(this.draw)
      this.frame++
      if (this.frame % 30 !== 0) {
        return
      }
      this.$refs.buffer.getContext('2d').drawImage(this.video, 0, 0, this.w, this.h)
      this.opencv()
    },
    /*
    opencvtemp () {
      const cv = window.cv
      const templ = cv.imread(this.$refs.pica)
      this.templgray = new cv.Mat()
      cv.cvtColor(templ, this.templgray, cv.COLOR_RGBA2GRAY)
    },
    */

    opencv (i) {
      // 特徴点検出
      const cv = window.cv
      for (let i = 0; i < 2; i++) {
        this.templ = cv.imread(this.arr[i])
        console.log(this.time)
        this.templgray = new cv.Mat()
        cv.cvtColor(this.templ, this.templgray, cv.COLOR_RGBA2GRAY)
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
        // const templview = new cv.Mat()
        // cv.drawKeypoints(this.templgray, templkp, templview)
        // cv.imshow(this.$refs.cana, templview)

        const srckp = new cv.KeyPointVector()
        const srcdas = new cv.Mat()
        const srcmask = new cv.Mat()
        akaze.detectAndCompute(srcgray, srcmask, srckp, srcdas)
        // const srcview = new cv.Mat()
        // cv.drawKeypoints(srcgray, srckp, srcview)
        // cv.imshow(this.$refs.canb, srcview)

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
        if (goodmatches.size() > this.matchval) { // 十分な点があるか？
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

          this.detect(i)

          return false
        } else {
          console.log('no try findHomography')
        }

        // ホモグラフィーした点を整理
        if (homo && this.video.srcObject) {
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
      }
    },

    start () {
      this.btnflg = false
      this.$refs.video.play()
      this.$refs.coke.play()
      this.$refs.coke.pause()
      this.capture()
      // this.opencvtemp()
      this.draw()
      this.time_def_id = setTimeout(this.deftrigger, this.time_def)
      this.$refs.video.style.border = '#42b983 1rem solid'

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

.video{
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  -webkit-transform: translateY(-50%) translateX(-50%);
}

.canc{
  position: absolute;
  top: 70%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  -webkit-transform: translateY(-50%) translateX(-50%);
}

.btn{
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  -webkit-transform: translateY(-50%) translateX(-50%);
  z-index: 10;
}

h3 {
  margin: 40px 0 0;
  font-size: 11px;
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
