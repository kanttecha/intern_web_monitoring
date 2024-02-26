<!-- MapView.vue -->
<template>
  <div>
    <div ref="map" style="height: 500px;"></div>
  </div>
</template>

<script>
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebase';

export default {
  data() {
    return {
      markers: [],
    };
  },
  async mounted() {
    await this.fetchMarkerData();
    this.initMap();
  },
  methods: {
    async fetchMarkerData() {
      const markerCollection = collection(firestore, 'your_collection');
      try {
        const querySnapshot = await getDocs(markerCollection);
        this.markers = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      } catch (error) {
        console.error('Error fetching marker data:', error);
      }
    },
    initMap() {
      // eslint-disable-next-line no-undef
      const map = new google.maps.Map(this.$refs.map, {
        center: { lat: 14, lng: 100 }, // Set your default map center
        zoom: 5, // Adjust the zoom level as needed
      });

      // Add markers to the map
      this.markers.forEach((marker) => {
        const position = { lat: marker.latitude, lng: marker.longitude };
        // eslint-disable-next-line no-undef
        const googleMarker = new google.maps.Marker({
          position,
          map,
          title: marker.placeOfWork,
        });

        // Add click event listener to open URL on marker click
        googleMarker.addListener('click', () => {
          window.open(marker.url, '_blank'); // Open URL in a new tab
        });
      });
    },
  },
};
</script>

<style scoped>
/* Add your styling for the map component if needed */
</style>
