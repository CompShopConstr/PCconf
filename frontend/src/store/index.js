import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cart: [],
    orders: JSON.parse(localStorage.getItem('orders')) || []
  },
  mutations: {
    setOrder (state, payload) {
      state.orders.push(payload)
    },
    setProduct (state, payload) {
      const itemIndex = state.cart.findIndex(item => item.type === payload.type)

      if (itemIndex !== -1) {
        if (payload.product.id === state.cart[itemIndex].product.id) {
          state.cart[itemIndex].quantity++
        } else {
          const product = {
            quantity: 1,
            ...payload
          }
          state.cart.splice(itemIndex, 1, product)
        }
      } else {
        const product = {
          quantity: 1,
          ...payload
        }
        state.cart.push(product)
      }
    },
    clearCart (state) {
      state.cart = []
    },
    deleteProduct (state, index) {
      state.cart.splice(index, 1)
    }
  },
  actions: {
    setOrder (context, payload) {
      context.commit('setOrder', payload)
    },
    setProduct (context, payload) {
      context.commit('setProduct', payload)
    },
    deleteProduct (context, payload) {
      context.commit('deleteProduct', payload)
    },
    clearCart (context, payload) {
      context.commit('clearCart', payload)
    }
  },
  getters: {
    getCart (state) {
      return state.cart
    },
    getOrders (state) {
      return state.orders
    }
  }
})
