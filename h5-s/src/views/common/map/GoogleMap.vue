<template>
  <div>
    <gmap-map
      :center="center"
      :zoom="5"
      class="g-view"
    >
      <gmap-marker
        v-for="(m, index) in markers"
        :key="index"
        :position="m.position"
        @click="center=m.position"
      />
      <gmap-polyline :path="path" :options="options" :editable="false" />
    </gmap-map>

    <van-image class="upload" width="7vh" @click="upload" :src="require('@/assets/map/upload.png')" />
  </div>
</template>

<script>
import { getEntity } from '@/api/entity'
// import { loadGmapApi, GmapMap, GmapMarker } from 'vue2-google-maps'

// loadGmapApi({ key: 'AIzaSyBk4nadwBtmy_HffERqKVQBMWs-BOdnFzo' })

export default {
  name: 'GoogleMap',
  // components: {
  //   GmapMap, GmapMarker
  // },
  data () {
    return {
      // default to Montreal to keep it simple
      // change this to whatever makes sense
      center: { lat: 13.75, lng: 100.51 },
      markers: [{
        // position: { lat: 13.75, lng: 100.51 }
      }],
      data: [],
      places: [],
      currentPlace: null,
      order: null,
      entity: null,
      subEntity: null,
      options: {
        strokeColor: '#006400'
      }
    }
  },
  created() {
    this.entity = getEntity('Order')
    this.subEntity = getEntity('IotData')
  },
  mounted() {
    this.geolocate()
    this.entity.method.mine({state: 2}).then(res => {
      this.order = res.data[0]
    })
  },
  computed: {
    path () {
      const path = []
      this.data.forEach(item => {
        path.push({
          lat: item.latitude,
          lng: item.longitude
        })
      })
      return path
    }
  },
  watch: {
    order() {
      // 指定查看订单一个订单
      this.subEntity.method.getOrderIotData(this.order.id).then(res => {
        if (res.data) {
          this.data = res.data
        }
      })
    }
  },
  methods: {
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        }
        // this.markers.push({ position: { lat: 24.95, lng: 102.75 }})
        this.center = marker
        this.currentPlace = null
      }
    },
    geolocate: function() {
      navigator.geolocation.getCurrentPosition(position => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        }
        console.log(this.center)
      })
    },
    upload () {
      this.$router.push({name: 'Upload'})
    }
  }
}
</script>

<style lang="scss" scoped>
  .upload {
    position: absolute;
    bottom: 15vh;
    left: 10vw;
    background: white;
    box-shadow: 2px 2px 10px 0px gray;
    // border-radius: 55px;
  }
  .g-view {
    width: 100%;
    height: calc(100vh - 50px);

    >>> a {
      display: none !important;
    }
    >>> .gm-style-cc {
      display: none !important;
    }
  }
</style>
