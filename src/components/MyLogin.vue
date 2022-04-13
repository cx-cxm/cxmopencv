
<template>
  <div>
    <!--コメント入力フォーム表示ボタン色 "#2e8b57"-->
    <!--v-btn
        color='#1fad8f'
        dark
        fab
        fixed
        right
        bottom
        x-large
        @click="showCreateForm"
    >
      <v-icon
      x-large
      color="white darken-2"
    >
      mdi-message-text
    </v-icon>
    </v-btn-->

    <!--ログアウトボタン-->
    <v-btn
        fab
        fixed
        right
        bottom
        small
    >
    <v-icon
      small
      color="gray darken-2"
      @click="logout"
    >
    mdi-logout-variant
    </v-icon>
    </v-btn>

    <!--コメント削除ボタン-->
        <!--v-btn
        fab
        fixed
        left
        bottom
        small
        class='mx-13'
    >
      <v-icon
      small
      color="gray darken-2"
      @click="delflgchg"
    >
    mdi-delete
    </v-icon>
    </v-btn-->

    <!--コメント入力フォーム-->
    <!--v-dialog v-model="displayForm" max-width="500px">
      <v-card>
        <v-container>
          <h2>add comment</h2>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
                v-model="inputComment"
                :rules="commentRules"
                label="comment"
                required
            ></v-text-field>
            <v-btn
                :disabled="!valid"
                @click="addComment"
            >
              ENTER
            </v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog-->

    <!--ユーザー登録入力フォーム-->
    <!--v-dialog v-model="registForm" max-width="500px">
    <v-card>
      <v-container>
          <h2>sign in</h2>
          <v-form ref="registForm" lazy-validation>
            <v-text-field
                v-model="email"
                label='email'
                required
                :rules="mailRules"
            ></v-text-field>
            <v-text-field
                v-model="password"
                label='password'
                required
            ></v-text-field>
            <v-text-field
                v-model="displayName"
                label='displayName'
                required
            ></v-text-field>
            <v-text-field
                v-model="photoURL"
                label='photoURL'
                required
            ></v-text-field>
            <v-btn
                @click="regist"
            >
              regist
            </v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog-->

    <!--ユーザー登録/ログインフォーム-->
    <!--v-dialog v-model="sttForm" max-width="500px">
      <v-card>
        <v-container>
          <h2>sign in / login</h2>
          <v-form ref="sttForm" lazy-validation>
            <v-btn class='mx-3' @click='showRegistForm'>sign in</v-btn>
            <v-btn class='mx-3' @click='showLoginForm'>login</v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog-->

<!--loginフォーム-->
 <v-dialog v-model="loginForm" max-width="500px" persistent>
      <v-card>
        <v-container>
          <h2>log in</h2>
          <v-form ref='loginForm' lazy-validation>
            <v-text-field
                v-model='email'
                label='email'
                required
            ></v-text-field>
            <v-text-field
                v-model='password'
                label='password'
                required
            ></v-text-field>
            <v-btn
                @click='login'
            >
              login
            </v-btn>
          </v-form>
        </v-container>
      </v-card>
    </v-dialog>
  </div>
</template>
<!--script src="https://www.gstatic.com/firebasejs/3.3.0/firebase.js"></script-->

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
// import { initializeApp } from 'firebase/app'
import { /* getFirestore doc, setDoc */ } from 'firebase/firestore'
import { getAuth, /* sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink */ /* createUserWithEmailAndPassword, onAuthStateChanged, updateProfile, */ signInWithEmailAndPassword } from 'firebase/auth'

// import { initializeApp } from 'firebase/app'

// Your web app's Firebase configuration
/*
const firebaseConfig = {
  apiKey: 'AIzaSyAYyrbfJqfLi-4-YK-ZukedZ9QIHW0PBMY',
  authDomain: 'change-url-1c749.firebaseapp.com',
  projectId: 'change-url-1c749',
  storageBucket: 'change-url-1c749.appspot.com',
  messagingSenderId: '726013424830',
  appId: '1:726013424830:web:66972ab00d1bc24d2d5aef'
}

// Initialize Firebase
initializeApp(firebaseConfig)
*/

// const app = initializeApp(firebaseConfig)
// const db = getFirestore(app)
const auth = getAuth()

export default {
  data: () => ({
    // cnt: 0,
    // form入力データ
    // inputComment: '',
    // バリデーション
    valid: true,
    // commentRules: [
    //   v => !!v || 'コメントは必須項目です'
    // ],
    mailRules: [ // 本番用
      // v => (v === 'sphelp1@gmail.com' || v === 'sphelp2@gmail.com') || 'invalid adress'
    ],
    email: '',
    password: '',
    // displayName: '',
    // photoURL: '',
    // コメント入力Formダイアログの表示可否
    // displayForm: false,
    // ユーザー登録ダイアログの表示可否
    // registForm: false,
    // ユーザー登録/ログインダイアログの表示可否
    // sttForm: false,
    loginForm: false
  }),
  computed: {
    ...mapState(['loginflg'])
  },
  mounted: function () {
    this.showLoginForm()
  },
  methods: {
    ...mapMutations(['mu_update']),
    ...mapActions(['update']),
    // コメント追加
    /*
    addComment () {
      const now = new Date()
      this.cnt++
      console.log(this.cnt)
      const user = auth.currentUser
      console.log(user)
      this.displayName = user.displayName
      // this.email = user.email
      this.photoURL = user.photoURL

      // コメントをFirestoreへ登録
      // Add a new document in collection "cities"
      setDoc(doc(db, 'users', Math.random().toString(32).substring(2) + this.cnt), {
        message: this.inputComment,
        avatar: this.photoURL,
        createdAt: now,
        name: this.displayName
      })
      // ダイアログを閉じる
      this.hideCreateForm()
    },
    // Formの初期化
    clear () {
      this.$refs.form.reset()
    },
    // Formダイアログの表示
    showCreateForm () {
      this.displayForm = true
    },
    //
    // Formダイアログの非表示
    hideCreateForm () {
      this.clear()
      this.displayForm = false
    },
    regist () {
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
        // Signed in
          console.log(userCredential.user)
          updateProfile(auth.currentUser, {
            displayName: this.displayName, photoURL: this.photoURL
          }).then(() => {
            console.log('user Profile updated!')
            scrollTo(0, 0) // up用
            this.update({ key: 'loginflg', value: true })
          // ...
          }).catch((error) => {
          // An error occurred
            console.log(error)
          })
          this.hideRegistForm()
        // ...
        })
        .catch((error) => {
          console.log(error.code)
          alert(error.message)
          // ..
        })
    },
    // ユーザー登録/ログインダイアログの表示
    showSttForm () {
      onAuthStateChanged(auth, (user) => {
        // loginしていた場合
        if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // user.uid
        // this.displayName = user.displayName;
        // const email = user.email;
        // const photoURL = user.photoURL;
        // const emailVerified = user.emailVerified;
          this.registForm = false
          this.sttForm = false
          this.update({ key: 'loginflg', value: true })
          // loginしていなかった場合
        } else {
        // User is signed out
          this.sttForm = true
        }
      })
    },
    showRegistForm () {
      this.registForm = true
    },
    // ユーザー登録ダイアログの非表示
    hideRegistForm () {
      this.$refs.registForm.reset()
      this.registForm = false
    },
    */
    logout () {
      if (!confirm('ログアウトしてよろしいですか？')) {
        return
      }
      // auth必要
      auth.signOut()
      this.showLoginForm()
    },
    showLoginForm () {
      this.loginForm = true
    },
    login () {
      /*
      // メールリンクにアクションコードを設定
      const actionCodeSettings = {
        url: window.location.origin,
        handleCodeInApp: true
      }

      // メールリンクの送信
      sendSignInLinkToEmail(auth, this.email, actionCodeSettings)
        .then(() => {
          // ローカルストレージにemail情報を保存
          window.localStorage.setItem('emailForSignIn', this.email)
          console.log(this.email)
        })
        .catch((error) => {
          alert(error)
        })

      if (isSignInWithEmailLink(auth, window.location.href)) {
        let email = window.localStorage.getItem('emailForSignIn')
        if (!email) {
          email = window.prompt('Please provide your email for confirmation')
        }

        signInWithEmailLink(auth, this.email, window.location.href).then((result) => {
          window.localStorage.removeItem('emailForSignIn')
        }).catch((error) => {
          alert(error)
        })
      }
      */

      // e-mail,passでログイン
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
        // Signed in
          scrollTo(0, 0) // up用
          this.hideLoginForm()
          // ...
        })
        .catch((error) => {
          // error.code
          alert(error.message)
        })
    },
    // loginダイアログの非表示
    hideLoginForm () {
      this.$refs.loginForm.reset()
      this.loginForm = false
    },
    delflgchg () {
      this.update({ key: 'delflg', value: false })
    }
  }
}
</script>
<style scoped>

</style>
