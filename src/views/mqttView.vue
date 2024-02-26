<template>
  <div>
    <p v-if="latitude !== null">Latitude: {{ latitude }}</p>
    <p v-if="longitude !== null">Longitude: {{ longitude }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      latitude: null,
      longitude: null
    }
  },
  mounted() {
    // Subscribe to MQTT topic
    this.$mqtt.subscribe('gps/position')

    // Handle received messages from MQTT broker
    this.$mqtt.on('message', (topic, message) => {
      if (topic === 'gps/position') {
        const { latitude, longitude } = JSON.parse(message)
        this.latitude = latitude
        this.longitude = longitude
      }
    })
  }
}
</script>
