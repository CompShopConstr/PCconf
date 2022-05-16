<script>
export default {
  name: 'Account',
  data () {
    return {
      dialog: false,
      dialog2: false,
      valid: true,
      show: false,
      show2: false,
      show3: false,
      user: {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      },
      emailRules: [
        v => !!v || 'Введите адрес',
        v => /.+@.+\..+/.test(v) || 'Неверный адрес'
      ],
      phoneRules: [
        v => !!v || 'Введите номер',
        v => (v && v.length === 9) || 'Неверный номер'
      ],
      passwordRules: [
        v => !!v || 'Введите пароль',
        v => v.length >= 8 || 'Пароль должен содержать не менее 8 символов'
      ],
      confirmPasswordRules: [
        v => !!v || 'Введите пароль',
        v => v == this.user.password || 'Пароли должны совпадать'
      ],
      nameRules: [
        v => !!v || 'Введите имя',
        v => (v && v.length > 2) || 'Имя должно содержать более 2 символов'
      ]
    }
  }
}
</script>

<template>
<div>
<v-menu
  left
  bottom
  offset-y
>
  <template v-slot:activator="{ on }">
    <v-btn class="ml-3" icon v-on="on" @click="dialog = true">
      <v-icon large>mdi-account</v-icon>
    </v-btn>
  </template>
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
              <v-text-field dark  label="E-mail" :rules="emailRules" v-model="user.email" required></v-text-field>
            </v-col>
          </v-row>
          <v-row class="pt-2">
            <v-col cols="12" style="margin: -20px 1px 1px 1px">
              <v-text-field :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'" :type="show3 ? 'text' : 'password'" dark label="Password" :rules="passwordRules" v-model="user.password" required @click:append="show3 = !show3"></v-text-field>
            </v-col>
          </v-row>
          <v-row>
          <!-- <span style="color: #d76e00; margin: 0px auto -5px; cursor: pointer" class="text-decoration-underline" @click="dialog = !dialog; dialog2 = !dialog2">Регистрация</span> -->
          </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <!-- <v-btn class="mb-3 mr-2" color="#d76e00" elevation="10" @click="dialog = false">Закрыть</v-btn> -->
        <v-btn block class="mb-3" color="#d76e00" elevation="10">Войти</v-btn>
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
              <v-text-field dark label="Имя" :rules="nameRules" v-model="user.name" required></v-text-field>
            </v-col>
          </v-row>
          <v-row class="pt-0">
            <v-col cols="12" style="margin: -20px 1px 1px 1px">
              <v-text-field dark label="E-mail" :rules="emailRules" v-model="user.email" required></v-text-field>
            </v-col>
          </v-row>
          <!-- <v-row> -->
          <!-- <span style="color: #d76e00; margin: 0px auto -5px; cursor: pointer" class="text-decoration-underline" @click="dialog2 = !dialog2; dialog = !dialog">Вход</span> -->
          <!-- </v-row> -->
          <v-row>
            <v-col cols="12" style="margin: -20px 1px 1px 1px">
              <v-text-field  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'" :type="show ? 'text' : 'password'" dark label="Пароль" :rules="passwordRules" v-model="user.password" required @click:append="show = !show"></v-text-field>
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
        <!-- <v-btn class="mb-3 mr-2" color="#d76e00" elevation="10" @click="dialog = false">Закрыть</v-btn> -->
        <v-btn block style="margin-bottom: 10px; margin-top: -25px" color="#d76e00" elevation="10">Зарегистрироваться</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</div>
</template>

</style>

