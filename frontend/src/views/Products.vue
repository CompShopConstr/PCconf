<script>
export default {
  name: 'Products',
  data () {
    return {
      selectedComponent: 'motherboards',
      showFilters: false,
      itemsLoaded: false,
      priceRange: [0, 100000],
      maxPrice: 0,
      minPrice: 0,
      applyFilters: true,
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
    }

  },
  async mounted () {
    await this.loadData()
  },
  methods: {
    async loadData () {
      try {
        this.items = (await import('../server/components')).default
        this.itemsLoaded = true
      } catch (error) {
        console.log(error)
      }
    },
    addToCart (product) {
      this.$store.dispatch('setProduct', {
        product,
        type: this.selectedComponent
      })
    },
    filteredItems () {
      const items = Object.assign({}, this.items)
      const processorIndex = this.cartComponents.findIndex(item => item.type === 'processors')
      const motherboardIndex = this.cartComponents.findIndex(item => item.type === 'motherboards')
      const ramIndex = this.cartComponents.findIndex(item => item.type === 'ram')

      if (processorIndex !== -1) {
        const processor = this.cartComponents[processorIndex].product
        if (this.applyFilters) {
          items.motherboards = items.motherboards.filter(item => item.socket === processor.socket)
        }
        this.filters.Processors = processor.socket
      } else {
        delete this.filters.Processors
      }

      if (motherboardIndex !== -1) {
        const motherboard = this.cartComponents[motherboardIndex].product
        if (this.applyFilters) {
          items.processors = items.processors.filter(item => item.socket === motherboard.socket)
          items.ram = items.ram.filter(item => item.memoryType === motherboard.memoryType)
        }
        this.filters.Motherboard = motherboard.socket
        this.filters.Ram = motherboard.memoryType
      } else {
        delete this.filters.Motherboard
        delete this.filters.Ram
      }

      if (ramIndex !== -1) {
        const ram = this.cartComponents[ramIndex].product
        if (this.applyFilters) {
          items.motherboards = items.motherboards.filter(item => item.memoryType === ram.memoryType)
        }
        this.filters.Ram = ram.memoryType
      }

      if (this.itemsLoaded) {
        items.keyboards = items.keyboards.filter(item => this.priceRange[0] <= item.price)
        items.keyboards = items.keyboards.filter(item => this.priceRange[1] >= item.price)

        items.monitors = items.monitors.filter(item => this.priceRange[0] <= item.price)
        items.monitors = items.monitors.filter(item => this.priceRange[1] >= item.price)

        items.motherboards = items.motherboards.filter(item => this.priceRange[0] <= item.price)
        items.motherboards = items.motherboards.filter(item => this.priceRange[1] >= item.price)

        items.mouses = items.mouses.filter(item => this.priceRange[0] <= item.price)
        items.mouses = items.mouses.filter(item => this.priceRange[1] >= item.price)

        items.processors = items.processors.filter(item => this.priceRange[0] <= item.price)
        items.processors = items.processors.filter(item => this.priceRange[1] >= item.price)

        items.ram = items.ram.filter(item => this.priceRange[0] <= item.price)
        items.ram = items.ram.filter(item => this.priceRange[1] >= item.price)

        items.rom = items.rom.filter(item => this.priceRange[0] <= item.price)
        items.rom = items.rom.filter(item => this.priceRange[1] >= item.price)

        items.videocards = items.videocards.filter(item => this.priceRange[0] <= item.price)
        items.videocards = items.videocards.filter(item => this.priceRange[1] >= item.price)
      }

      return items
    }
  },
  watch: {
    selectedComponent (newComponent) {
      try {
        var max = 0
        var item = this.items[newComponent][0]
        var min = item.price
        for (let i = 0; i < this.items[newComponent].length; i++) {
          item = this.items[newComponent][i]
          var price = item.price
          if (price < min) { min = price }
          if (price > max) { max = price }
        }
        this.priceRange = [min, max]
        this.maxPrice = max
        this.minPrice = min
      } catch (e) {}
    }
  }
}
</script>

<template>
  <v-row>
    <div v-show="false">{{filteredItems()}}</div>
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
        </v-list>
      </v-card>
      <v-card color="#212121" elevation="10" class="mt-5">
          <v-list-group
            class="pt-2 pb-2"
            no-action
            color="#d76e00"
            prepend-icon="mdi-filter"
          >
            <template v-slot:activator>
              <v-subheader style="margin-left: -17px; margin-right: 100px" class="title">Фильтры</v-subheader>
              <!-- <v-list-item-content>
                <v-list-item-title style="color: white">Фильтры</v-list-item-title>
              </v-list-item-content> -->
            </template>
            <v-checkbox class='ml-5 mr-5' v-model='applyFilters' color='#d76e00' dark label='Скрыть несовместимые'>
            </v-checkbox>
            <v-range-slider
              thumb-label
              @change="filteredItems()"
              :thumb-size="43"
              v-model="priceRange"
              class="ml-5 mr-5"
              dark
              color="#d76e00"
              :max="this.maxPrice"
              :min="this.minPrice"
              step="100"
              label="Цена"
              track-color="#582d00"
            ></v-range-slider>
            <v-list-item class="pl-4" v-for="(filter, key) in filters">
              <v-list-item-content>
                <v-list-item-title style="color: white">{{key}}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-chip
                  color="#d76e00"
                  dark
                >
                  {{filter.toUpperCase()}}
                </v-chip>
                </v-list-item-action>
            </v-list-item>
          </v-list-group>
      </v-card>
    </v-col>
    <v-col cols="12" sm="12" md="8" lg="9" xl="9" class="mt-7 pt-2 product-container">
      <v-row>
        <v-col :key="item.id" v-for="item in filteredItems()[selectedComponent]" cols="12" sm="12" md="6" lg="4" xl="3" class="pa-1">
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
                color="white"
                icon
                x-large
              >
                <v-icon color="#d76e00" large>mdi-desktop-tower</v-icon>
              </v-btn>
              <v-btn
                color = "white"
                class="pt-1 pr-2"
                icon
                x-large
                @click="addToCart(item)"
              >
                <v-icon color="#d76e00" class="" large>mdi-cart</v-icon>
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
