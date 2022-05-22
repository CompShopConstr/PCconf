import Vue from 'vue'
import Vuex from 'vuex'
import { User } from '../api/user'


Vue.use(Vuex)
export const ADD_USER = 'ADD_USER'
export const REMOVE_USER = 'REMOVE_USER'
export const SET_USERS = 'SET_USERS'

const state = {
  users: []
}


const getters = {
  users: state => state.users
}


const mutations = {
  // Добавляем заметку в список
  [ADD_USER] (state, user) {
    state.users = [user, ...state.users]
  },
  [REMOVE_USER] (state, { id }) {
    state.users = state.users.filter(user => {
      return user.id !== id
    })
  },

  [SET_USERS] (state, { users }) {
    state.users = users
  }
}

const actions = {
  createUser ({ commit }, userData) {
    User.create(userData).then(user => {
      commit(ADD_USER, user)
    })
  },
  deleteUser ({ commit }, user) {
    User.delete(user).then(response => {
      commit(REMOVE_USER, user)
    })
  },
  getUsers ({ commit }) {
    User.list().then(users => {
      commit(SET_USERS, { users })
    })
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations
})
