<script>
const axios = require('axios')

export default {
  name: 'Account',
  data () {
    return {
      name: '',
      email: '',
      password: '',
      dialog: false,
      dialog2: false,
      logOutDialog: false,
      valid: true,
      show: false,
      show2: false,
      show3: false,
      logInSucceed: false,
      logInSucceedSnackbar: false,
      wrongPassword: false,
      user: {
        name: '',
        email: '',
        regEmail: '',
        password: '',
        regPassword: '',
        confirmPassword: ''
      },
      emailRules: [
        v => !!v || 'Введите адрес',
        v => /.+@.+\..+/.test(v) || 'Неверный адрес',
        v => this.logInEmailValidate() || 'Такой e-mail не зарегистрирован'
      ],
      regEmailRules: [
        v => !!v || 'Введите адрес',
        v => /.+@.+\..+/.test(v) || 'Неверный адрес',
        v => !this.checkEmail() || 'Такой адрес уже зарегистрирован'
      ],
      phoneRules: [
        v => !!v || 'Введите номер'
      ],
      passwordRules: [
        v => !!v || 'Введите пароль'
      ],
      regPasswordRules: [
        v => !!v || 'Введите пароль',
        v => v.length >= 8 || 'Пароль должен содержать не менее 8 символов'
      ],
      confirmPasswordRules: [
        v => !!v || 'Введите пароль',
        v => v === this.password || 'Пароли должны совпадать'
      ],
      nameRules: [
        v => !!v || 'Введите имя',
        v => (v && v.length > 2) || 'Имя должно содержать более 2 символов'
      ]
    }
  },
  methods: {
    checkEmail () {
      const userdata = JSON.parse(localStorage.getItem('userdata'))
      for (var i = 0; i < userdata.length; i++) {
        if (userdata[i].email === this.user.regEmail) {
          return true
        }
      }
      return false
    },

    validate () {
      return this.user.email && /.+@.+\..+/.test(this.user.email) && this.user.password
    },

    regValidate () {
      return this.user.name && (this.user.name.length > 2) && this.user.regEmail && /.+@.+\..+/.test(this.user.regEmail) && this.user.password && (this.user.password.length >= 8) && this.user.confirmPassword && (this.user.confirmPassword === this.user.password)
    },

    createUser () {
      var name = this.name
      var email = this.email
      var password = this.password
      // this.$store.dispatch('createUser', userdata)
      axios.defaults.withCredentials = true
      axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
      axios.defaults.xsrfCookieName = 'csrftoken'
      axios.post('/api/v1user/', {
        name: name,
        email: email,
        password: password
      })
      this.dialog2 = false
      this.dialog = false
    },

    async getUsers () {
      try {
        const response = await axios.get('/api/v1user/')
        this.users = JSON.stringify(response.data)
      } catch (error) {}
    },

    logInEmailValidate () {
      try {
        var users = this.users
        for (let i = 0; i < users.length; i++) {
          if (this.user.email === users[i].email) {
            return true
          }
        }
        return false
      } catch (error) {}
    },

    logIn () {
      var users = this.users
      for (let i = 0; i < users.length; i++) {
        if (this.user.email === users[i].email) {
          if (this.user.password === users[i].password) {
            this.logInSucceed = 'true'
            this.$store.dispatch('setUserId', users[i].id)
            this.$store.dispatch('setLoggedIn', true)
            this.dialog = false
            this.logInSucceedSnackbar = true
          } else {
            this.wrongPassword = true
            this.user.password = ''
          }
        }
      }
    },

    logOut () {
      this.logInSucceed = false
      this.logOutDialog = false
      this.$store.dispatch('setLoggedIn', false)
    },

    succeedIcon () {
      if (this.logInSucceed === 'true') {
        return 'mdi-account-check'
      } else {
        return 'mdi-account'
      }
    },

    accountBtnClick () {
      if (this.logInSucceed !== 'true') {
        this.dialog = true
      } else {
        this.logOutDialog = true
      }
    }

  },
  async created () {
    const response = await axios.get('/api/v1user/')
    this.users = response.data
    this.logInSucceed = this.$store.getters.getLoggedIn
  }
}
</script>

<template>
<div>

<v-snackbar
  v-model="logInSucceedSnackbar"
  absolute
  top
  color="success"
>
  <span>Вход выполнен</span>
  <v-icon dark>
    mdi-account-check
  </v-icon>
  <v-btn
    text
    @click="logInSucceedSnackbar = false"
  >
  Закрыть
  </v-btn>
</v-snackbar>

<v-snackbar
  v-model="wrongPassword"
  absolute
  top
  color="error"
>
  <span>Неверный пароль</span>
  <v-icon dark>
    mdi-account-cancel
  </v-icon>
  <v-btn
    text
    @click="wrongPassword = false"
  >
  Закрыть
  </v-btn>
</v-snackbar>

<v-menu
  left
  bottom
  offset-y
>
  <template v-slot:activator="{ on }">
    <v-btn icon class="ml-3 mr-3" v-on="on" @click="accountBtnClick()">
      <v-icon large color="white">
        {{ succeedIcon() }}
      </v-icon>
    </v-btn>
  </template>
  <v-card v-if="logOutDialog" dark v-model="logOutDialog">
    <v-btn block color="#d76e00" text @click="logOut()">
      Выйти
    </v-btn>
  </v-card>
</v-menu>
<v-dialog v-model="dialog" max-width="300px">
    <v-card color="#28282B" elevation="10">
      <v-card-title>
        <span style="color: #d76e00" class="pr-1 headline">Вход</span><span style="color: #626567; cursor: pointer" @click="dialog2 = !dialog2; dialog = !dialog" class="headline">/ Регистрация</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form
            ref="form"
            v-model="valid"
          >
          <v-row>
            <v-col cols="12" style="margin: 0px 1px 1px 1px">
              <v-text-field dark label="E-mail" :rules="emailRules" v-model="user.email" required></v-text-field>
            </v-col>
          </v-row>
          <v-row class="pt-2">
            <v-col cols="12" style="margin: -20px 1px 1px 1px">
              <v-text-field :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'" :type="show3 ? 'text' : 'password'" dark label="Password" :rules="passwordRules" v-model="user.password" required @click:append="show3 = !show3"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
          </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!validate()" block style="margin-bottom: 3px" color="#d76e00" elevation="10" @click="logIn()">Войти</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="dialog2" max-width="300px">
    <v-card color="#28282B" elevation="10">
      <v-card-title>
        <span style="color: #626567; cursor: pointer" @click="dialog2 = !dialog2; dialog = !dialog" class="headline">Вход /</span><span style="color: #d76e00" class="pl-1 headline">Регистрация</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form
            ref="form"
            v-model="valid"
          >
          <v-row>
            <v-col cols="12" style="margin: -20px 1px 1px 1px">
              <v-text-field v-model='name' dark label="Имя" :rules="nameRules" required></v-text-field>
            </v-col>
          </v-row>
          <v-row class="pt-0">
            <v-col cols="12" style="margin: -20px 1px 1px 1px">
              <v-text-field v-model='email' dark label="E-mail" :rules="emailRegRules" required></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" style="margin: -20px 1px 1px 1px">
              <v-text-field v-model="password" :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'" dark label="Пароль" :rules="regPasswordRules" required @click:append="show = !show"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" style="margin: -20px 1px 1px 1px">
              <v-text-field :append-icon="show2 ? 'mdi-eye' : 'mdi-eye-off'" :type="show2 ? 'text' : 'password'" dark label="Повторите пароль" :rules="confirmPasswordRules" v-model="user.confirmPassword" required @click:append="show2 = !show2"></v-text-field>
            </v-col>
          </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn style="margin-bottom: 10px; margin-top: -25px" block color="#d76e00" elevation="10" @click="createUser()">Зарегистрироваться</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>
