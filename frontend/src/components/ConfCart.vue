<script>
const axios = require('axios')

export default {
  name: 'ConfCart',
  data () {
    return {
      dialog: false,
      valid: false,
      snackbar: false,
      name: '',
      nameRules: [
        v => !!v || 'Заполните поле'
      ]
    }
  },
  computed: {
    items () {
      return this.$store.getters.getConfsCart
    },
    totalPrice () {
      return this.items.reduce((sum, item) => (item.quantity * item.product.price) + sum, 0)
    }
  },
  methods: {
    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
    },
    confAdd () {
      this.validate()
      this.$nextTick(() => {
        if (this.valid) {
          this.saveToDB()
          this.snackbar = true
          this.dialog = false
        }
      })
    },
    deleteItem (index) {
      this.$store.dispatch('deleteProductConf', index)
    },
    async saveToDB () {
      const confs = await this.$store.getters.getConfs

      const conf = {
        name: this.name,
        owner: 1,
        items: this.items
      }

      confs.push(conf)

      var name = this.name
      var items = JSON.stringify(this.items)

      try {
        axios.defaults.withCredentials = true
        axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
        axios.defaults.xsrfCookieName = 'csrftoken'
        axios.post('/api/v1configuration/', {
          name: name,
          owner: '1',
          items: items
        })
      } catch (error) {}

      this.clearConfCart()
      this.reset()
    },
    clearConfCart () {
      this.$store.dispatch('clearConfCart')
    }
  }
}
</script>

<template>
<div>
  <v-menu
    left
    bottom
    :close-on-content-click="false"
    offset-y
  >
    <template v-slot:activator="{ on }">
      <v-btn class="ml-3 mr-3" icon v-on="on">
        <v-badge
          color="red"
          :content="items.length"
          :value="items.length"
          overlap
        >
          <v-icon large>mdi-desktop-tower</v-icon>
        </v-badge>
      </v-btn>
    </template>
    <v-card v-if="items.length" dark>
      <v-list subheader>
        <v-subheader>Конфигуратор</v-subheader>

        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="()=>{}"
        >
          <v-list-item-avatar>
            <v-img
              :src="item.product.image"
              :contain="true"
            ></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-text="item.product.name"></v-list-item-title>
          </v-list-item-content>

          <v-list-item-action class="ml-7">
            <div class="cart-price">
              <div class="text-input">
                <v-text-field v-model="item.quantity" hide-details type="number"></v-text-field>
              </div>
              <div> x {{item.product.price}} ₽</div>
              <div>
                <v-btn class="ml-3" icon @click="deleteItem(index)">
                  <v-icon>mdi-close-circle</v-icon>
                </v-btn>
              </div>
            </div>
          </v-list-item-action>
        </v-list-item>
      </v-list>
      <v-divider></v-divider>
      <v-card-text class="d-flex">
        <span class="subtitle-1 font-regular mt-1"> Итого: {{totalPrice}} ₽</span>
        <v-spacer></v-spacer>
        <v-btn color="#d76e00" class="text-capitalize" @click="dialog = true" dark>Сохранить</v-btn>
      </v-card-text>
    </v-card>
    <v-card v-else dark>
      <v-card-text>
        Конфигуратор пуст!
      </v-card-text>
    </v-card>
  </v-menu>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card dark>
      <v-card-title>
        <span class="headline">Сохранение конфигурации</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form
            ref="form"
            v-model="valid"
          >
          <v-row>
          <v-text-field label="Название" :rules="nameRules" v-model="name" required></v-text-field>
          </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn dark color="#d76e00" @click="dialog = false">Закрыть</v-btn>
        <v-btn dark color="#d76e00" @click="confAdd()">Сохранить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-snackbar
    v-model="snackbar"
    color="#d76e00"
    bottom
  >
  Конфигурация сохранена!
    <v-btn
      text
      @click="snackbar = false"
    >
      Закрыть
    </v-btn>
  </v-snackbar>
</div>
</template>

<style scoped>
  .text-input {
    width: 40px;
  }

  .cart-price {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
  }

  .cart-price > div {
    align-self: center;
  }

  .cart-price > div:last-child {
    justify-self: end;
  }
</style>
