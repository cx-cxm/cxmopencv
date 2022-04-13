<template>
  <div>
    <p>redirect & gtm control page</p>
    <div class='center'>
     <label for="url" class='label'>url:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
     <input type="text" id="url" name="url" ref='url' required size="45" style='border-style: solid'/>
     <br>
     <br>
     <label for="category" class='label'>category:&nbsp;</label>
     <input type="text" id="category" name="category" ref='category' required size="45" style='border-style: solid'/>
     <br>
     <br>
     <label for="action" class='label'>action:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
     <input type="text" id="action" name="action" ref='action' required size="45" style='border-style: solid'/>
     <br>
     <br>
     <label for="label" class='label'>label:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</label>
     <input type="text" id="label" name="label" ref='label' required size="45" style='border-style: solid'/>
     <br>
     <br>
     <br>
     <v-btn fab x-large @click='urlset'>set</v-btn>
    </div>
  </div>
</template>

<script>
// import store from '../store'
// vuexはthis.$store.stateを略して呼べるようにするため
import { mapState, /* mapMutations, */ mapGetters /* mapActions */ } from 'vuex'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs, doc, setDoc/* query, orderBy, limit, onSnapshot, */ /* doc, deleteDoc */ } from 'firebase/firestore'

// onSnapshot
const firebaseConfig = {
  apiKey: 'AIzaSyAYyrbfJqfLi-4-YK-ZukedZ9QIHW0PBMY',
  authDomain: 'change-url-1c749.firebaseapp.com',
  projectId: 'change-url-1c749',
  storageBucket: 'change-url-1c749.appspot.com',
  messagingSenderId: '726013424830',
  appId: '1:726013424830:web:66972ab00d1bc24d2d5aef'
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default {
  data: function () {
    return {
      results: [
        {
          url: ''
        }
      ]
    }
  },

  mounted: function () {
    this.init()
  },

  computed: {
    ...mapState(['']),
    ...mapGetters(['']),

    classObjA: function () {
      return {
      }
    }
  },

  watch: {
  },

  methods: {
    async init () {
      const querySnapshot = await getDocs(collection(db, 'users'))
      querySnapshot.forEach((doc) => {
        console.log(doc.id, ' => ', doc.data().url)
        this.$refs.url.value = doc.data().url
        this.$refs.category.value = doc.data().category
        this.$refs.action.value = doc.data().action
        this.$refs.label.value = doc.data().label
      })
    },
    async urlset () {
      // add or update a new document in collection "users"
      await setDoc(doc(db, 'users', '5bNp5i9veTylVyZROhuJ'), {
        url: this.$refs.url.value,
        category: this.$refs.category.value,
        action: this.$refs.action.value,
        label: this.$refs.label.value
      }).then(
        alert('done!!')
      )
    }
  }//  methods
}//  export default
</script>
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

.label{
    position:absolute;
    transform-origin:center;
    left:0%;
    transform: translateX(-100%);
    }

.btn{
    position:absolute;
    width:20vw;
    height: calc(75vw * 0.5625);
    transform-origin:center;
    top:80%;
    left:50%;
    transform: translateX(-50%) translateY(-50%);
    border: 1px solid black;
    z-index:100;
    }

.notpoint
{
pointer-events: none;
}

.notlook
{
visibility: hidden;
}

.bgcolor
{
background: rgb(255, 255, 255);
}

.chgline
{
/*↓半角文字でも改行されるために必要!! */
word-break: break-all;
/*
word-wrap: break-word;
overflow-wrap: break-word;
*/
}

</style>
