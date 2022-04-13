<!--youtube 4cam multiangle system -->
<template>
  <div class='big'>
      <v-btn color='info' class='btn' x-large :class="classObjB" @click="pauseVideo" v-if="playingflg">pause</v-btn>
      <v-btn color='info' class='btn' x-large :class="classObjB" @click="playVideo" v-else width='300' height='100' style='background-color:gray;border:none;box-shadow:3px 3px 3px 1px rgba(0, 0, 0, 0.5)'>start</v-btn> <!--background-color:#007bff-->
      <div ref='guide' alt='' :class="classObjC" @mousedown="click" @touchstart="click"></div>

      <!--resize超重要!orientation変わったときもサイズ調整が入る-->
      <!--v-ifはなぜかdivに設定するとvimeo表示されずNGだった-->
      <!--for equipmedia-->
      <div :class="classObjE" class='midfit'><iframe v-if='yobiflg' ref="eq" :src="videoId2" style="position:absolute;top:0;left:0;width:100%;height:100%;" frameborder="0" allowfullscreen referrerpolicy="no-referrer-when-downgrade" ></iframe></div>
      <!--for vimeo-->
      <!--div :class="classObjE" ><iframe v-if='yobiflg' :src="videoId2+'&background=1'" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe></div-->
      <!--for youtube-->
      <div :class="classObjA"  class='midfit'><youtube v-if='!yobiflg' :video-id="videoId" ref="youtube" @playing="playingVideo" @ready='playReady' @cued='cueok' @stop='playStop' :playerVars="playerVars" :fitParent="true" :resize="true"></youtube></div><!---->
      <!--iframe class='youtube' :class="classObjC" ref='youtube' src="https://www.youtube.com/embed/HpdO5Kq3o7Y?controls=0&showinfo=0&autoplay=1&rel=0&playsinline=1&mute=1" frameborder="0"></iframe-->
      <!--iframe width="315" height="560" src="https://www.youtube.com/embed/NpjGOyV9rcE?controls=0&showinfo=0&autoplay=1&rel=0&playsinline=1" frameborder="0"></iframe-->
      <!--iframe width="315" height="560" src="https://www.youtube.com/embed/NpjGOyV9rcE" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe-->
      </div>
</template>

<script>
// import store from '../store'
// vuexはthis.$store.stateを略して呼べるようにするため
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import Vue from 'vue'
// vui-youtubeインストールして利用
import VueYoutube from 'vue-youtube'
import axios from 'axios'

// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getStorage, ref, getDownloadURL } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyDkATegW2dPYo3g2A80joJiuz3zv6_3X0U',
  authDomain: 'multiangle-amongus-20b41.firebaseapp.com',
  projectId: 'multiangle-amongus-20b41',
  storageBucket: 'multiangle-amongus-20b41.appspot.com',
  messagingSenderId: '160019140243',
  appId: '1:160019140243:web:fee6449854a48fbf178766'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

console.log(analytics)

Vue.use(VueYoutube)

export default {
  data: function () {
    return {
      cam1: '',
      cam2: '',
      cam3: '',
      cam4: '',
      cam5: '',
      cam21: '',
      cam22: '',
      cam23: '',
      cam24: '',
      cam25: '',
      videoId: '',
      videoId2: '',
      size: '',
      orient: false,
      playingflg: false,
      readyflg: 0,
      playerVars: {
        autoplay: 0,
        color: 'red',
        controls: 0,
        iv_load_policy: 3,
        fs: 0, // 0:全画面表示ボタンなし
        playsinline: 1,
        showinfo: 0,
        rel: 0,
        enablejsapi: 1,
        modestbranding: 1
      },
      sp: ''
    }
  },
  methods: {
    // this.$store.commit('xxxx')`をthis.xxx()`で呼べるようにする
    ...mapMutations(['mu_update']),
    ...mapActions(['update']),

    setFillHeight () {
      const vh = window.innerHeight * 0.01
      this.update({ key: 'vsize', value: this.vsize })
      document.documentElement.style.setProperty('--vh', `${vh}px`)
      if (Math.abs(window.orientation) === 90) {
        // ここに回転させた時の処理
        this.orient = true
        if (window.innerWidth / window.innerHeight < 1.77) {
          this.orient = false
          console.log('tablet')
        }
        console.log('回転')
      } else {
        // ここに元に戻した時の処理
        this.orient = false
      }
    },

    setparam (c) {
      this.update({ key: 'cam', value: c })
    },

    click (e) {
      const gdWidth = this.$refs.guide.getBoundingClientRect().width
      const gdHeight = this.$refs.guide.getBoundingClientRect().height

      if (this.sp) {
        const spXoffset = e.changedTouches[0].clientX - window.pageXOffset - this.$refs.guide.getBoundingClientRect().left
        const spYoffset = e.changedTouches[0].clientY - window.pageYOffset - this.$refs.guide.getBoundingClientRect().top

        if (spXoffset < gdWidth / 2 && spYoffset < gdHeight / 2) {
          this.setparam(1)
        } else if (spXoffset > gdWidth / 2 && spYoffset < gdHeight / 2) {
          this.setparam(2)
        } else if (spXoffset < gdWidth / 2 && spYoffset > gdHeight / 2) {
          this.setparam(3)
        } else if (spXoffset > gdWidth / 2 && spYoffset > gdHeight / 2) {
          this.setparam(4)
        }
      // pc
      } else {
        const pcX = e.offsetX
        const pcY = e.offsetY
        if (pcX < gdWidth / 2 && pcY < gdHeight / 2) {
          this.setparam(1)
        } else if (pcX > gdWidth / 2 && pcY < gdHeight / 2) {
          this.setparam(2)
        } else if (pcX < gdWidth / 2 && pcY > gdHeight / 2) {
          this.setparam(3)
        } else if (pcX > gdWidth / 2 && pcY > gdHeight / 2) {
          this.setparam(4)
        }
      }
    },

    seek (num) {
      this.player.getCurrentTime().then((time) => {
        console.log('time_android:' + time, num)
        this.player.seekTo(time - num, true)
        if (time === 0) {
          console.log('time:0')
          this.playStop()
          /*
          this.player.mute() // mute 処理
          this.player.playVideo()
          */
        }
      }).catch(err => alert(err))
    },

    delay () {
      // androidなら時間offset入れる。youtube配信の設定をDVR可能にするのを忘れずに
      if (this.getMobileOS === 'Android') {
        this.seek(this.android_dly, 'Android')
      // テスト用。iosなら時間offset入れる。youtube配信の設定をDVR可能にするのを忘れずに
      } else if (this.getMobileOS === 'iOS') {
        // this.seek(this.ios_dly, 'iOS')
      } else {
        // this.seek(this.pc_dly, 'pc')
      }
    },

    playVideo () { // startボタン押したときの再生処理
      this.playingflg = true
      this.update({ key: 'startflg', value: true })
      this.update({ key: 'pauseflg', value: false })
      this.update({ key: 'camflg', value: false })
    },
    pauseVideo () { // 停止処理
      this.player.pauseVideo()
      this.playingflg = false
      console.log('pause')
    },
    playingVideo () {
      console.log('play start!')
    },
    playReady () {
      console.log('ready!')
      this.readyflg = 1
    },
    playStop () {
      console.log('stop')
      this.player.stopVideo()
    },
    cueok () {
      console.log('cue!')
      this.player.mute() // mute 処理
      this.player.playVideo()
      // setTimeout(this.player.playVideo, 500)
      setTimeout(this.delay, 2000)
      // this.update({ key: 'youtubeplayingflg', value: true })
    }
  }, //  methods

  computed: {
    ...mapState(['camflg', 'videoid', 'pauseflg', 'startflg', 'cam', 'yobiflg', 'vsize', 'vplayflg', 'youtubeplayingflg']),
    ...mapGetters(['getcam', 'getvplayflg', 'getyoutubeplayingflg']),

    classObjC: function () {
      return {
        // classObjCの値はthis.pauseflgがtrueならnotpointになり、falseなら空欄になる
        // notpoint styleはHome.vueで定義されている.画面click可否の設定
        notexist: this.camflg, // 最初falseでcamボタン押したらtrue。不必要なときに消すの超重要！他の要素がちゃんとclickイベントに反応するように！
        guide: this.orient,
        guide_tate: !this.orient
      }
    },

    classObjB: function () {
      return {
        notlook: this.startflg
      }
    },

    classObjA: function () {
      return {
        notlook: this.pauseflg,
        notpoint: true,
        youtube: this.orient,
        youtube_tate: !this.orient
      }
    },

    classObjE: function () {
      return {
        notpoint: true,
        youtube: this.orient,
        youtube_tate: !this.orient
      }
    },

    player () {
      return this.$refs.youtube.player
    },
    eqplayer () {
      return this.$refs.eq.player
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

  mounted: function () {
    this.sp = navigator.userAgent.match(/iPhone|Android.+Mobile/)
    window.addEventListener('resize', this.setFillHeight)
    this.setFillHeight()

    const storage = getStorage()
    getDownloadURL(ref(storage, 'url.json')).then(url => {
      // 取得したURLにGETリクエストを投げる
      return axios.get(url)
    }).then(response => {
      // 返ってきたresponseのdataプロパティにjsonファイルの中身が格納されている
      const data = response.data
      console.log(data)
      this.cam1 = data.cam1_url
      this.cam2 = data.cam2_url
      this.cam3 = data.cam3_url
      this.cam4 = data.cam4_url
      this.cam5 = data.multi_url
      this.cam21 = data.cam1_url_sub
      this.cam22 = data.cam2_url_sub
      this.cam23 = data.cam3_url_sub
      this.cam24 = data.cam4_url_sub
      this.cam25 = data.multi_url_sub
      this.videoId = this.cam5
      this.videoId2 = this.cam25
      this.android_dly = data.android_dly
      this.ios_dly = data.ios_dly
      this.pc_dly = data.pc_dly
    })

    /*
    this.size = `${window.innerHeight * 0.01}px`
    console.log(this.size)
    this.update({ key: 'vsize', value: this.size })
        window.addEventListener(
      'resize',
      this.handleOrientationChange // ここにfunctionを記述するとうまく動かなかった。関数はmethodに。
    )
    */
    // this.orient = window.matchMedia('(orientation: landscape)').matches
    // console.log(this.orient)
    /*
    window.addEventListener('resize', function () {
      if (Math.abs(window.orientation) === 90) {
        this.$refs.guide.style.border = 'solid 1px red'
        alert('aaa')
        // ここに回転させた時の処理
        this.orient = true
        console.log('回転')
      } else {
        // ここに元に戻した時の処理
        // this.orient = false
      }
    })
    */

    /*
    window.addEventListener('orientationchange', function () {
      if (Math.abs(window.orientation) === 90) {
        // ここに回転させた時の処理
        this.$refs.guide.style.border = 'solid 1px red'
        this.orient = true
        console.log('回転')
      } else {
        // ここに元に戻した時の処理
        this.orient = false
      }
    })
  */
  },

  watch: {
    getcam (num, old) {
      console.log('watch', num)

      if (num === 1) {
        this.videoId = this.cam1
        this.videoId2 = this.cam21
        this.update({ key: 'camflg', value: true })
      } else if (num === 2) {
        this.videoId = this.cam2
        this.videoId2 = this.cam22
        this.update({ key: 'camflg', value: true })
      } else if (num === 3) {
        this.videoId = this.cam3
        this.videoId2 = this.cam23
        this.update({ key: 'camflg', value: true })
      } else if (num === 4) {
        this.videoId = this.cam4
        this.videoId2 = this.cam24
        this.update({ key: 'camflg', value: true })
      } else if (num === 5) {
        this.videoId = this.cam5
        this.videoId2 = this.cam25
        this.update({ key: 'camflg', value: false })
      }
    },
    getvplayflg (flg, old) {
      if (flg === true && this.yobiflg === false) {
        console.log('youtube_play')
        this.player.mute()
        this.player.playVideo()
        this.playingflg = true
        this.update({ key: 'startflg', value: true })
        this.update({ key: 'pauseflg', value: false })
        this.update({ key: 'camflg', value: false })
        this.update({ key: 'vplayflg', value: false })
      } else if (flg === true && this.yobiflg === true) {
        console.log('eq_play')
        /*
        this.eqplayer.accessor.play()
        this.playingflg = true
        this.update({ key: 'startflg', value: true })
        this.update({ key: 'pauseflg', value: false })
        this.update({ key: 'camflg', value: false })
        this.update({ key: 'vplayflg', value: false })
        */
      }
    },
    getyoutubeplayingflg (flg, old) { //
    }
  }
}//  export default

</script>
<style>

/*
body {
  min-height: 100vh;
  min-height: -webkit-fill-available;
}

html {
  height: -webkit-fill-available;
}
*/
/*    width: 78vw;
    height: calc(78vw * 0.5625); */

/*
インライン要素は、その下にほんの少しだけスペースを確保します。この現象は親の要素が「display: block;」でブロック要素の時に見られます。
解決にはいくつかの方法があります。
親要素のfont-size or line-heightを「0」にするミニサイズのリセット用のCSSを適用する。
中に配置されるインライン要素に「vertical-align: middle;」を適用する。※「vertical-align: bottom;」でも機能します。
中に配置される要素に「display: block;」を適用する。
*/

.big{
font-size: 0;
}

.youtube{
    position:absolute;
    width: calc((var(--vh, 1vh) * 100) / 0.5625);
    min-height: 100vh; /* カスタムプロパティ未対応ブラウザ用のフォールバック */
    min-height: calc(var(--vh, 1vh) * 100);
    transform-origin:center;
    top:0vh;
    left:50vw;
    transform: translateX(-50%) translateY(0%);
    /* border: 5px solid red; */
    z-index:10;
    }

.youtube_tate{
    position:absolute;
    width: 100vw;
    height: calc(100vw * 0.5625);
    transform-origin:center;
    top:50vh;
    left:50vw;
    transform: translateX(-50%) translateY(-50%);
    /* border: 5px solid blue; */
    z-index:10;
    }

.guide{
    position:absolute;
    width: calc((var(--vh, 1vh) * 100) / 0.5625);
    min-height: 100vh; /* カスタムプロパティ未対応ブラウザ用のフォールバック */
    min-height: calc(var(--vh, 1vh) * 100);
    transform-origin:center;
    top:0vh;
    left:50vw;
    transform: translateX(-50%) translateY(0%);
    /*border: 1px solid black;*/
    z-index:10001; /*３番目のレイヤー。必要なとき以外は消してOK*/
    }

.guide_tate{
    position:absolute;
    width: 100vw;
    height: calc(100vw * 0.5625);
    transform-origin:center;
    top:50vh;
    left:50vw;
    transform: translateX(-50%) translateY(-50%);
    /*border: 1px solid black;*/
    z-index:10001; /*３番目のレイヤー。必要なとき以外は消してOK*/
    }

.btn{
    position:absolute;
    width:20vw;
    /* height: calc(75vw * 0.5625); */
    transform-origin:center;
    top:50vh;
    left:50vw;
    transform: translateX(-50%) translateY(-50%);
    border: 1px solid black;
    z-index:10010; /*一番上のレイヤー*/
    }

.notpoint
{
pointer-events: none;
}

.notlook
{
visibility: hidden;
}

.notexist
{
display: none;
}

.midfit{
  display: flex;
  justify-content: center;
  align-items: center;
}
/*
.yohaku{
       margin : 0px ;
     padding : 0px ;
     border : 0px;
}
*/
</style>
