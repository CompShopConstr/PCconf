import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const axios = require('axios')

export default new Vuex.Store({
  state: {
    cart: [],
    confCart: [],
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
    setProductConf (state, payload) {
      const itemIndex = state.confCart.findIndex(item => item.type === payload.type)
      if (itemIndex !== -1) {
        if (payload.product.id === state.confCart[itemIndex].product.id) {
          state.confCart[itemIndex].quantity++
        } else {
          const product = {
            quantity: 1,
            ...payload
          }
          state.confCart.splice(itemIndex, 1, product)
        }
      } else {
        const product = {
          quantity: 1,
          ...payload
        }
        state.confCart.push(product)
      }
    },
    clearCart (state) {
      state.cart = []
    },
    clearConfCart (state) {
      state.confCart = []
    },
    deleteProduct (state, index) {
      state.cart.splice(index, 1)
    },
    deleteProductConf (state, index) {
      state.confCart.splice(index, 1)
    }
  },
  actions: {
    async setConf (context, payload) {
      var confs = []
      var response = await axios.get('/api/v1configuration/')
      confs = response.data
      confs.push(payload)
      alert(JSON.stringify(payload))
      try {
        var name = payload.name
        var owner = payload.owner
        var items = payload.items
        axios.defaults.withCredentials = true
        axios.defaults.xsrfHeaderName = 'X-CSRFTOKEN'
        axios.defaults.xsrfCookieName = 'csrftoken'
        axios.post('/api/v1configuration/', {
          name: name,
          owner: owner,
          items: items
        })
      } catch (error) {}
    },
    setOrder (context, payload) {
      context.commit('setOrder', payload)
    },
    setProduct (context, payload) {
      context.commit('setProduct', payload)
    },
    setProductConf (context, payload) {
      context.commit('setProductConf', payload)
    },
    deleteProduct (context, payload) {
      context.commit('deleteProduct', payload)
    },
    deleteProductConf (context, payload) {
      context.commit('deleteProductConf', payload)
    },
    clearCart (context, payload) {
      context.commit('clearCart', payload)
    },
    clearConfCart (context, payload) {
      context.commit('clearConfCart', payload)
    }
  },
  getters: {
    getConfsCart (state) {
      return state.confCart
    },
    getCart (state) {
      return state.cart
    },
    getOrders (state) {
      return state.orders
    },
    async getConfs (state) {
      var confs = []
      var response = await axios.get('/api/v1configuration/')
      confs = response.data
      return confs
    }
  }
})
