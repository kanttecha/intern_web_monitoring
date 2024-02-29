<template>
  <div class="table-container">
    
    <table>
      <!-- Table Header -->
      <thead>
        <!-- Table Header Rows -->
        <tr>
          <th>Place of Work</th>
          <th>Latitude</th>
          <th>Longitude</th>
          <th>Serial Number</th>
          <th>RTSP Cameras</th>
          <th>Responsible Person</th>
          <th>Action</th> <!-- Edit and Delete buttons columns -->
        </tr>
      </thead>
      <!-- Table Body -->
      <tbody>
        <!-- Loop through displayed data -->
        <tr v-for="(item, index) in displayedData" :key="index">
          <!-- Table Data Cells -->
          <td>{{ item.placeOfWork }}</td>
          <td>{{ item.latitude }}</td>
          <td>{{ item.longitude }}</td>
          <td>{{ item.serialNumber }}</td>
          <td>
            <ul>
              <li v-for="(camera, cameraIndex) in item.rtspCameras" :key="cameraIndex">
                {{ camera.value }}
              </li>
            </ul>
          </td>
          <td>{{ item.responsiblePerson }}</td>
          <td>
            <button v-if="isAuthorizedToEdit" @click="editScorecardItem(item.id)">Edit</button>
            <button v-if="isAuthorizedToDelete" @click="deleteScorecardItem(item.id)">Delete</button>
            
          </td>
        </tr>
      </tbody>
    </table>
    <!-- Pagination and Search -->
    <div class="pagination-search-container">
      <!-- Pagination Controls -->
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      </div>
      <!-- Search Input -->
      <div class="search-container">
        <input v-model="searchQuery" type="text" placeholder="Search...">
      </div>
    </div>
  </div>
</template>

<script>
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { firestore } from "@/firebase";
import store from '@/store';
export default {
  data() {
    return {
      scorecardData: [],
      currentPage: 1,
      itemsPerPage: 5,
      searchQuery: "", // To store the search query
    };
  },
  computed: {
    displayedData() {
      const filteredData = this.scorecardData.filter(item => {
        const searchRegex = new RegExp(this.searchQuery.trim(), "i");
        return (
          searchRegex.test(item.placeOfWork) ||
          searchRegex.test(item.latitude) ||
          searchRegex.test(item.longitude) ||
          searchRegex.test(item.serialNumber) ||
          searchRegex.test(item.responsiblePerson) ||
          item.rtspCameras.some(camera => searchRegex.test(camera.value))
        );
      });

      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return filteredData.slice(startIndex, endIndex);
    },
    totalPages() {
      const filteredData = this.scorecardData.filter(item => {
        const searchRegex = new RegExp(this.searchQuery.trim(), "i");
        return (
          searchRegex.test(item.placeOfWork) ||
          searchRegex.test(item.latitude) ||
          searchRegex.test(item.longitude) ||
          searchRegex.test(item.serialNumber) ||
          searchRegex.test(item.responsiblePerson) ||
          item.rtspCameras.some(camera => searchRegex.test(camera.value))
        );
      });

      return Math.ceil(filteredData.length / this.itemsPerPage);
    },
        isAuthorizedToDelete() {
      const userRole = store.getters.userRole;
      return userRole === 'admin' || userRole === 'web_admin';
    },
    // Check if the user is authorized to edit
    isAuthorizedToEdit() {
      const userRole = store.getters.userRole;
      return userRole === 'admin' || userRole === 'web_admin';
    },
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
    deleteScorecardItem(itemId) {
      this.deletingItemId = itemId;
      if (confirm("Are you sure you want to delete this item?")) {
        this.performDelete(itemId);
      } else {
        this.deletingItemId = null;
      }
    },
    async performDelete(itemId) {
      try {
        const scorecardDocRef = doc(firestore, "your_collection", itemId);
        await deleteDoc(scorecardDocRef);
        this.scorecardData = this.scorecardData.filter((item) => item.id !== itemId);
        console.log("Document successfully deleted!");
      } catch (error) {
        console.error("Error deleting document:", error);
      } finally {
        this.deletingItemId = null;
      }
    },
    editScorecardItem(itemId) {
      this.$router.push({ name: 'edit', params: { id: itemId } });
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
  },
};
</script>

<style>
/* Add your styling here */
.table-container {
  padding-right: 50px; 
  padding-left: 50px;
  padding-top: 20px;
}

table {
  width: 100%;
  border: 1px solid black;
}

th, td {
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

.pagination-search-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.pagination {
  display: flex;
  align-items: center;
}

.pagination button {
  margin-right: 10px;
}

.search-container input {
  margin-left: 10px;
}
</style>
