<template>
  <div class="form-container">
   
    <div class="form-columns">
      <!-- First Column -->
      <div class="form-column">
        <form @submit.prevent="addScorecard">
          <div class="form-group">
            <label for="placeOfWork">Place of Work:</label>
            <input v-model="newScorecard.placeOfWork" type="text" required>
          </div>

          <div class="form-group">
            <label for="latitude">Latitude:</label>
            <input v-model="newScorecard.latitude" type="number" step="any" required>
          </div>

          <div class="form-group">
            <label for="longitude">Longitude:</label>
            <input v-model="newScorecard.longitude" type="number" step="any" required>
          </div>

          <div class="form-group">
            <label for="serialNumber">Serial Number:</label>
            <input v-model="newScorecard.serialNumber" type="text" required>
          </div>

          <div class="form-group">
            <label for="responsiblePerson">Responsible Person:</label>
            <input v-model="newScorecard.responsiblePerson" type="text" required>
          </div>
        </form>
      </div>

      <!-- Second Column -->
      <div class="form-column">
        <form @submit.prevent="addScorecard">
          <div class="form-group" v-for="(camera, index) in newScorecard.rtspCameras" :key="index">
            <label for="rtspCamera">RTSP Camera:</label>
            <input v-model="camera.value" type="text" required>
            <button type="button" @click="removeCamera(index)">Remove</button>
          </div>

         

          <!-- Display the generated URL -->
          <div class="form-group">
           <button type="button" @click="addCamera">Add Camera</button>
          </div>

          <button class="addinfo" type="submit">Add Information</button>
        </form>
      </div>
    </div>
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
      generatedURL: ""
    };
  },
  methods: {
    async addScorecard() {
      const scorecardCollection = collection(firestore, "your_collection");

      const serialNumberQuery = query(scorecardCollection, where("serialNumber", "==", this.newScorecard.serialNumber));
      const existingScorecards = await getDocs(serialNumberQuery);
      
      if (!existingScorecards.empty) {
        console.error("Serial number already exists. Please enter a unique serial number.");
        return;
      }

      this.generatedURL = `http://192.168.1.20:8080/hls/${this.newScorecard.serialNumber}`;
      this.newScorecard.url = this.generatedURL;

      try {
        await addDoc(scorecardCollection, this.newScorecard);
        console.log("Scorecard information added successfully.");

        this.newScorecard = {
          placeOfWork: "",
          latitude: "",
          longitude: "",
          serialNumber: "",
          rtspCamera: [],
          responsiblePerson: "",
        };

        this.$router.push({ name: 'home' });
      } catch (error) {
        console.error("Error adding scorecard information:", error);
      }
    },

    addCamera() {
      this.newScorecard.rtspCameras.push({ value: '' });
    },

    removeCamera(index) {
      this.newScorecard.rtspCameras.splice(index, 1);
    },
  },
};
</script>

<style scoped>
/* Adjusted styling for the form */
.form-container {
  max-width: 800px; /* Adjust as needed */
  margin: auto;
  padding-top: 50px;
}

.form-columns {
  display: flex;
  gap: 20px; /* Adjust the gap between columns */
}

.form-column {
  flex: 1;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 8px; /* Add some spacing between label and input */
}

input {
  width: 100%;
  padding: 10px; /* Increase padding for better appearance */
  border: 1px solid #ccc; /* Add a border */
  border-radius: 5px; /* Add rounded corners */
  transition: border-color 0.3s ease; /* Smooth transition for border color */
}

input:focus {
  outline: none; /* Remove the default focus outline */
  border-color: #66afe9; /* Change border color on focus */
}

.addinfo {
  margin-top: 16px;
  padding: 10px 20px; /* Add padding to the button */
  background-color: #1c782b; /* Set background color */
  color: #fff; /* Set text color */
  border: none; /* Remove border */
  border-radius: 5px; /* Add rounded corners */
  cursor: pointer; /* Add cursor pointer on hover */
  transition: background-color 0.3s ease; /* Smooth transition for background color */
}

.addinfo:hover {
  background-color: #0056b3; /* Change background color on hover */
}
</style>


