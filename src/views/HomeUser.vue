<template>
  <div>
    <nav>
  
      <router-link to="/homeuser"> TABLE </router-link> 

     
      <router-link to="/insert"> Map V2 </router-link>
      <router-link to="/hls"> ALL HLS </router-link>

    </nav>
  </div>

  <div>
    <h1>Scorecard Information</h1>
    <table>
      <thead>
        <tr>
          <th>Place of Work</th>
          <th>Latitude</th>
          <th>Longitude</th>
          <th>Serial Number</th>
          <th>RTSP Cameras</th>
          <th>URL</th>
          <th>Responsible Person</th>
          
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in scorecardData" :key="index">
          <td>{{ item.placeOfWork }}</td>
          <td>{{ item.latitude }}</td>
          <td>{{ item.longitude }}</td>
          <td>{{ item.serialNumber }}</td>
          <td>
            <!-- Display RTSP cameras in a list -->
            <ul>
              <li v-for="(camera, cameraIndex) in item.rtspCameras" :key="cameraIndex">
                {{ camera.value }}
              </li>
            </ul>
          </td>
          <td>{{ item.url }}</td>
          <td>{{ item.responsiblePerson }}</td>
        </tr>
      </tbody>
    </table>
  </div>
  
</template>

<script>
import { collection, getDocs,  } from "firebase/firestore";
import { firestore } from "@/firebase";

export default {
  data() {
    return {
      scorecardData: [],
    };
  },
  mounted() {
    this.fetchScorecardData();
  },
  methods: {
    async fetchScorecardData() {
      const scorecardCollection = collection(firestore, "your_collection");

      try {
        const querySnapshot = await getDocs(scorecardCollection);

        this.scorecardData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
      } catch (error) {
        console.error("Error fetching scorecard data:", error);
      }
    },

  },
};
</script>

<style>
/* Add your styling here */
table {
  width: 100%;
  border: 1px solid black;
  margin-top: 20px;
}

th,td {
  border: 1px solid #000000;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 4px;
}
</style>
