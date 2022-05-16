<script>
import Cart from '@/components/Cart'
import Account from '@/components/Account'

export default {
  name: 'App',
  components: {
    Cart,
    Account
  },
  data: () => ({
    snackbar: false,
    auth_dialog: false
  }),
  methods: {
    showSnack () {
      this.snackbar = true
    },
    toggleAuthDialog () {
      this.auth_dialog = !this.auth_dialog
    }
  }
}
</script>

<template>
  <div id="app">
    <v-app>
      <v-app-bar
        app
        color="#d76e00"
        dark
        height="60"
        class="wrapper"
      >
        <v-app-bar-nav-icon to="/">
          <v-icon large>
            mdi-laptop
          </v-icon>
        </v-app-bar-nav-icon>

        <span class="title ml-3 mr-5">Comp <span class="font-weight-light">SHOP</span></span>

        <v-spacer></v-spacer>

        <v-btn text to="/">
          Товары
        </v-btn>

        <Cart :showSnack = "showSnack"/>
        <Account/>

      </v-app-bar>

      <v-content class="router-view">
          <router-view></router-view>
        <v-snackbar
          v-model="snackbar"
          color="#d76e00"
          bottom
          right
        >
          Заказ оформлен!
          <v-btn
            text
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </v-snackbar>
      </v-content>
    </v-app>
  </div>
</template>

<style>
  .wrapper, .router-view {
    padding-left: 11%!important;
    padding-right: 11%!important;
    background-color: #282828;
  }
  html {
    overflow: hidden !important;
  }
</style>
