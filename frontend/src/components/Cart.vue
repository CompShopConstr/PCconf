<script>
export default {
  name: 'Cart',
  props: ['showSnack'],
  data () {
    return {
      dialog: false,
      valid: true,
      snackbar: false,
      user: {
        firstName: '',
        secondName: '',
        phone: '',
        email: '',
        comment: '',
        promo: ''
      },
      nameRules: [
        v => !!v || 'Заполните поле',
        v => (v && v.length > 2) || 'Имя должно содержать более 2 символов'
      ],
      emailRules: [
        v => !!v || 'Введите адрес',
        v => /.+@.+\..+/.test(v) || 'Неверный адрес'
      ],
      phoneRules: [
        v => !!v || 'Введите номер',
        v => (v && v.length === 9) || 'Неверный номер'
      ]
    }
  },
  computed: {
    items () {
      return this.$store.getters.getCart
    },
    totalPrice () {
      return this.items.reduce((sum, item) => (item.quantity * item.product.price) + sum, 0)
    },
    promotion () {
      if (this.user.promo === '1111') {
        return 500
      }
      return 0
    }
  },
  methods: {
    validate () {
      this.$refs.form.validate()
    },
    reset () {
      this.$refs.form.reset()
    },
    checkout () {
      this.validate()
      this.$nextTick(() => {
        if (this.valid) {
          this.saveToLocalstorage()
          this.clearCart()
          this.reset()
          this.showSnack()
          this.dialog = false
        }
      })
    },
    deleteItem (index) {
      this.$store.dispatch('deleteProduct', index)
    },
    saveToLocalstorage () {
      const orders = JSON.parse(localStorage.getItem('orders')) || []

      const order = {
        items: this.items,
        price: this.totalPrice,
        pay: this.totalPrice - this.promotion,
        user: Object.assign({}, this.user),
        date: new Date().toISOString().split('T')[0]
      }

      orders.push(order)

      this.$store.dispatch('setOrder', order)

      localStorage.setItem('orders', JSON.stringify(orders))
    },
    clearCart () {
      this.$store.dispatch('clearCart')
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
      <v-btn class="ml-6" icon v-on="on">
        <v-badge
          color="red"
          :content="items.length"
          :value="items.length"
          overlap
        >
          <v-icon large>mdi-cart</v-icon>
        </v-badge>
      </v-btn>
    </template>
    <v-card v-if="items.length" dark>
      <v-list subheader>
        <v-subheader>Корзина</v-subheader>

        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          @click="()=>{}"
        >
          <v-list-item-avatar>
            <v-img
              :src="require('../' + item.product.image)"
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
        <v-btn color="#d76e00" class="text-capitalize" @click="dialog = true" dark>Купить</v-btn>
      </v-card-text>
    </v-card>
    <v-card v-else dark>
      <v-card-text>
        Корзина пуста!
      </v-card-text>
    </v-card>
  </v-menu>
  <v-dialog v-model="dialog" max-width="600px">
    <v-card dark>
      <v-card-title>
        <span class="headline">Оформление заказа</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form
            ref="form"
            v-model="valid"
          >
          <v-row>
            <v-col cols="6" class="pa-1">
              <v-text-field label="Имя*" :rules="nameRules" v-model="user.firstName" required></v-text-field>
            </v-col>
            <v-col cols="6" class="pa-1">
              <v-text-field label="Фамилия*" :rules="nameRules" v-model="user.secondName" required></v-text-field>
            </v-col>
            <v-col cols="6" class="pa-1">
              <v-text-field
                label="Телефон*"
                persistent-hint
                :rules="phoneRules"
                required
                v-model="user.phone"
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="pa-1">
              <v-text-field label="E-mail*" :rules="emailRules" v-model="user.email" required></v-text-field>
            </v-col>
            <v-col cols="12" class="pa-1">
              <v-textarea label="Комментарий" v-model="user.comment"></v-textarea>
            </v-col>
            <v-col cols="12" class="pa-1">
              <v-text-field label="Промокод" v-model="user.promo"></v-text-field>
            </v-col>
          </v-row>
          </v-form>
        </v-container>

        <v-row>
          <v-col cols="12" class="subtitle-1 py-0 text-right font-weight-black">Итого: {{totalPrice}} ₽</v-col>
          <v-col cols="12" class="subtitle-1 py-0 text-right font-weight-black">Скидка: {{promotion}} ₽</v-col>
          <v-col cols="12" class="subtitle-1 py-0 text-right font-weight-black">К оплате: {{totalPrice - promotion}} ₽</v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <small class="caption ml-3">*обязательное поле</small>
        <v-spacer></v-spacer>
        <v-btn dark color="#d76e00" @click="dialog = false">Закрыть</v-btn>
        <v-btn dark color="#d76e00"@click="checkout()">Оплатить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
