<script>
export default {
  name: 'Configuration',
  data () {
    return {
      confs: []
    }
  },
  async created () {
    this.confs = await this.$store.getters.getConfs
    this.confs = this.confs.filter(conf => conf.owner === '1')
  }
}
</script>

<template>
  <v-row>
    <v-simple-table dense class="order-table">
      <thead>
      <tr>
        <th>Название</th>
        <th>Товары</th>
        <th>Стоимость</th>
      </tr>
      </thead>
      <tbody>
      <tr :key="index" v-for="(conf, index) in this.confs">
        <td>{{conf.name}}</td>
        <td>
          <v-list dense>
            <v-list-item
              dense
              v-for="(item, index) in JSON.parse(conf.items)"
              :key="index"
            >
              <v-list-item-content class="pa-0">
                <v-list-item-title v-text="item.product.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </td>
        <td>
          <v-list dense>
            <v-list-item
              dense
              v-for="(item, index) in JSON.parse(conf.items)"
              :key="index"
            >
              <v-list-item-action class="ma-0">
                {{item.quantity}} x {{item.product.price}} ₽
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </td>
      </tr>
      </tbody>
    </v-simple-table>
  </v-row>
</template>

<style scoped>
.order-table {
  width: 100%;
  margin-top: 16px;
}
</style>
