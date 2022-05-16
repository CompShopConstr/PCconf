<script>
export default {
  name: 'Products',
  data () {
    return {
      selectedComponent: 'motherboards',
      showFilters: false,
      list: [
        { text: 'Материнские платы', icon: 'mdi-chart-tree', value: 'motherboards' },
        { text: 'Процессоры', icon: 'mdi-memory', value: 'processors' },
        { text: 'ОЗУ', icon: 'mdi-alpha-r-box', value: 'ram' },
        { text: 'Жесткие диски', icon: 'mdi-harddisk', value: 'rom' },
        { text: 'Видеокарты', icon: 'mdi-expansion-card', value: 'videocards' },
        { text: 'Мониторы', icon: 'mdi-monitor', value: 'monitors' },
        { text: 'Компьютерные мыши', icon: 'mdi-mouse-variant', value: 'mouses' },
        { text: 'Клавиатуры', icon: 'mdi-keyboard', value: 'keyboards' }
      ],
      items: {},
      filters: {}
    }
  },
  computed: {
    cartComponents () {
      return this.$store.getters.getCart
    },
    filteredItems () {
      const items = Object.assign({}, this.items)
      const processorIndex = this.cartComponents.findIndex(item => item.type === 'processors')
      const motherboardIndex = this.cartComponents.findIndex(item => item.type === 'motherboards')
      const ramIndex = this.cartComponents.findIndex(item => item.type === 'ram')

      if (processorIndex !== -1) {
        const processor = this.cartComponents[processorIndex].product

        items.motherboards = items.motherboards.filter(item => item.socket === processor.socket)
        this.filters.Processors = processor.socket
      } else {
        delete this.filters.Processors
      }

      if (motherboardIndex !== -1) {
        const motherboard = this.cartComponents[motherboardIndex].product

        items.processors = items.processors.filter(item => item.socket === motherboard.socket)
        items.ram = items.ram.filter(item => item.memoryType === motherboard.memoryType)
        this.filters.Motherboard = motherboard.socket
        this.filters.Ram = motherboard.memoryType
      } else {
        delete this.filters.Motherboard
        delete this.filters.Ram
      }

      if (ramIndex !== -1) {
        const ram = this.cartComponents[ramIndex].product

        items.motherboards = items.motherboards.filter(item => item.memoryType === ram.memoryType)
        this.filters.Ram = ram.memoryType
      }

      return items
    }
  },
  async mounted () {
    await this.loadData()
  },
  methods: {
    async loadData () {
      try {
        this.items = (await import('../server/components')).default
      } catch {
        console.log('Load error')
      }
    },
    addToCart (product) {
      this.$store.dispatch('setProduct', {
        product,
        type: this.selectedComponent
      })
    }
  }
}
</script>

<template>
  <v-row>
    <div v-show="false">{{filteredItems}}</div>
    <v-col cols="12" sm="12" md="4" lg="3" xl="3">
      <v-card color="#212121" elevation="10" class="mt-4">
        <v-list color="#212121">
          <v-subheader class="pb-2 title">Комплектующие</v-subheader>
          <v-list-item-group v-model="selectedComponent" color="#d76e00">
            <v-list-item
              v-for="(item, i) in list"
              :key="i"
              :value="item.value"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon" color="white"></v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title class="components-text" v-text="item.text" text-color="white"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
          <v-list-group
            v-if="Object.keys(filters).length"
            v-model="showFilters"
            no-action
            color="#d76e00"
            prepend-icon="mdi-filter"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title style="color: white">Фильтры</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item class="pl-4" v-for="(filter, key) in filters">
              <v-list-item-content>
                <v-list-item-title style="color: white">{{key}}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-chip
                  color="#d76e00"
                  text-color="white"
                >
                  {{filter.toUpperCase()}}
                </v-chip>
                </v-list-item-action>
            </v-list-item>
          </v-list-group>
        </v-list>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="8" lg="9" xl="9" class="mt-7 pt-2 product-container">
      <v-row>
        <v-col :key="item.id" v-for="item in filteredItems[selectedComponent]" cols="12" sm="12" md="6" lg="4" xl="3" class="pa-1">
          <v-card height="500" color="#212121">
            <div>
            <v-img style="margin: auto; padding-top: 100px"
              :src="require('../' + item.image)"
              max-width="220"
              max-height="220"
              contain
            ></v-img>
            </div>

            <v-card-title class="card-title">
              {{item.name}}
            </v-card-title>

            <v-card-subtitle style="color: white">
              {{item.description}}
            </v-card-subtitle>

            <v-card-actions class="card-actions">
          <span class="title font-weight-light pl-2">
            {{item.price}} ₽
          </span>

              <v-spacer></v-spacer>
              <v-btn
                color = "white"
                class="pt-1 pr-2"
                icon
                x-large
                @click="addToCart(item)"
              >
                <v-icon right="true" color="#d76e00" large>mdi-cart</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<style scoped>
>>>.theme--light.v-icon {
  color: white
  }

  .card-actions {
    position: absolute !important;
    bottom: 0;
    width: 100%;
    color: white
  }

  .product-container {
    height: calc(100vh - 80px);
    overflow-x: auto
  }

  .product-container::-webkit-scrollbar {
    width: 3px
  }
  .product-container::-webkit-scrollbar-thumb {
    background: #d76e00;
  }
  .product-container::-webkit-scrollbar-thumb:hover {
    background: #d76e00;
  }

  .components-text {
    color: white;
  }

  .title {
    color: white;
}

  .card-title {
    color: white;
}
</style>
