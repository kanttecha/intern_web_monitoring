<template>
  <div>
    <h2>Edit Scorecard</h2>
    <form @submit.prevent="updateScorecard">
      <label for="placeOfWork">Place of Work:</label>
      <input v-model="editedItem.placeOfWork" type="text" id="placeOfWork" required>

      <label for="latitude">Latitude:</label>
      <input v-model="editedItem.latitude" type="number" step="any" id="latitude" required>

      <label for="longitude">Longitude:</label>
      <input v-model="editedItem.longitude" type="number" step="any" id="longitude" required>

      <label for="serialNumber">Serial Number:</label>
      <input v-model="editedItem.serialNumber" type="text" id="serialNumber" required disabled>

      <label for="rtspCameras">RTSP Cameras:</label>
      <div v-for="(camera, index) in editedItem.rtspCameras" :key="index">
        <input v-model="camera.value" type="text" required>
        <button type="button" @click="removeCamera(index)">Remove</button>
      </div>

      <button type="button" @click="addCamera">Add Camera</button>

      <label for="url">URL:</label>
      <input v-model="editedItem.url" type="url" required>

      <label for="responsiblePerson">Responsible Person:</label>
      <input v-model="editedItem.responsiblePerson" type="text" required>

      <button type="submit">Update</button>
    </form>
  </div>
</template>

<script>
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';

export default {
  data() {
    return {
      editedItem: {
        placeOfWork: '',
        latitude: '',
        longitude: '',
        serialNumber: '',
        rtspCameras: [{ value: '' }],
        url: '',
        responsiblePerson: '',
      },
    };
  },
  async mounted() {
    const itemId = this.$route.params.id;
    await this.fetchScorecardItem(itemId);
  },
  methods: {
    async fetchScorecardItem(itemId) {
      const scorecardDocRef = doc(firestore, 'your_collection', itemId);
      try {
        const docSnapshot = await getDoc(scorecardDocRef);
        if (docSnapshot.exists()) {
          this.editedItem = { id: docSnapshot.id, ...docSnapshot.data() };
        } else {
          console.error('Document does not exist!');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    },
    async updateScorecard() {
      const itemId = this.$route.params.id;
      const scorecardDocRef = doc(firestore, 'your_collection', itemId);

      try {
        // Update the document with the edited data
        await updateDoc(scorecardDocRef, this.editedItem);
        console.log('Document successfully updated!');

        // Redirect back to the home page or another appropriate page
        this.$router.push({ name: 'home' });
      } catch (error) {
        console.error('Error updating document:', error);
        // Handle error or display a message to the user
      }
    },
    addCamera() {
      this.editedItem.rtspCameras.push({ value: '' }); // Add an empty string for a new camera value
    },
    removeCamera(index) {
      this.editedItem.rtspCameras.splice(index, 1); // Remove the camera at the specified index
    },
  },
};
</script>

<style>
/* Add your styling here */
form {
  max-width: 400px;
  margin: auto;
}

label {
  display: block;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 8px;
  margin-bottom: 16px;
}
</style>
