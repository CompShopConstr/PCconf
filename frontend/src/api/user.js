import { HTTP } from './common'
export const User = {
  create (config) {
    return HTTP.post('/v1user/', config).then(response => {
      return response.data

    })
  },
  delete (user) {
    return HTTP.delete('/v1user/${user.id}/')
  },
  list () {
    return HTTP.get('/v1user/').then(response => {
      return response.data
    })
  }
}
