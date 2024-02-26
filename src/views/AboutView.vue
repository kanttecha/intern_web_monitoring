<template>
  <div>
    <nav>
      <router-link to="/home"> TABLE </router-link> 
      <router-link to="/about"> ADD INFO </router-link>
      <router-link to="/insert"> Map V2 </router-link>
      <router-link to="/hls"> ALL HLS </router-link>
      <router-link to="/panel"> Admin Panel </router-link>
    </nav>
  </div>
  <div>
    <h1>Add Scorecard Information</h1>
    <form @submit.prevent="addScorecard">
      <label for="placeOfWork">Place of Work:</label>
      <input v-model="newScorecard.placeOfWork" type="text" required>

      <label for="latitude">Latitude:</label>
      <input v-model="newScorecard.latitude" type="number" step="any" required>

      <label for="longitude">Longitude:</label>
      <input v-model="newScorecard.longitude" type="number" step="any" required>

      <label for="serialNumber">Serial Number:</label>
      <input v-model="newScorecard.serialNumber" type="text" required>

      <label for="rtspCamera">RTSP Camera:</label>
      <div v-for="(camera, index) in newScorecard.rtspCameras" :key="index">
        <input v-model="camera.value" type="text" required>
        <button type="button" @click="removeCamera(index)">Remove</button>
      </div>

      <button type="button" @click="addCamera">Add Camera</button>

      <label for="responsiblePerson">Responsible Person:</label>
      <input v-model="newScorecard.responsiblePerson" type="text" required>

      <!-- Display the generated URL -->
      <label>URL:</label>
      <p>{{ generatedURL }}</p>

      <button class="addinfo" type="submit">Add Information</button>
    </form>
  </div>
</template>

<script>
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { firestore } from "@/firebase";

export default {
  data() {
    return {
      newScorecard: {
        placeOfWork: "",
        latitude: "",
        longitude: "",
        serialNumber: "",
        rtspCameras: [{ value: '' }],
        responsiblePerson: "",
      },
      generatedURL: "" // Added generatedURL property to store the automatically generated URL
    };
  },
  methods: {
    async addScorecard() {
      const scorecardCollection = collection(firestore, "your_collection");

      // Check if the serialNumber already exists
      const serialNumberQuery = query(scorecardCollection, where("serialNumber", "==", this.newScorecard.serialNumber));
      const existingScorecards = await getDocs(serialNumberQuery);
      
      if (!existingScorecards.empty) {
        console.error("Serial number already exists. Please enter a unique serial number.");
        return; // Exit the method if serial number already exists
      }

      // Generate URL based on the serial number
      this.generatedURL = `http://192.168.1.20:8080/hls/${this.newScorecard.serialNumber}`;

      // Add the generated URL to the newScorecard object
      this.newScorecard.url = this.generatedURL;

      // If serial number is unique, proceed with adding the scorecard
      try {
        await addDoc(scorecardCollection, this.newScorecard);
        console.log("Scorecard information added successfully.");

        // Clear the form after successful submission
        this.newScorecard = {
          placeOfWork: "",
          latitude: "",
          longitude: "",
          serialNumber: "",
          rtspCamera: [],
          responsiblePerson: "",
        };

        // Navigate to the Scorecard page after successful submission
        this.$router.push({ name: 'home' }); // Replace 'Scorecard' with the name of your Scorecard page route
      } catch (error) {
        console.error("Error adding scorecard information:", error);
      }
    },

    addCamera() {
      this.newScorecard.rtspCameras.push({ value: '' }); // Add an empty string as a new camera value
    },

    removeCamera(index) {
      this.newScorecard.rtspCameras.splice(index, 1); // Remove the camera at the specified index
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
