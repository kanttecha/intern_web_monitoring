<template>
  <div class="admin-panel">
    
    
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Name</th>
          <th>Role</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in paginatedUsersFiltered" :key="index">
          <td>{{ user.email }}</td>
          <td>{{ user.firstName }} {{ user.lastName }}</td>
          <td>
            <select v-model="user.selectedRole">
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="web_admin">Admin Web</option>
            </select>
          </td>
          <td>
            <button @click="confirmRoleChange(user)">Change Role</button>
            <button @click="confirmDeleteUser(user.id, user.userId)">Delete User</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pagination">
      <button @click="prevPage" :disabled="currentPage === 1">Prev</button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
      
    <div class="search-container">
        <input type="text" v-model="searchQuery" placeholder="Search by email or name">
    </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/firebase'; // Assuming your Firebase configuration file
import { collection, getDocs } from 'firebase/firestore';
import { deleteDoc } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

export default {
  setup() {
    const users = ref([]);
    const pageSize = ref(10);
    const currentPage = ref(1);
    const searchQuery = ref('');

    const fetchUsers = async () => {
      try {
        const usersCollectionRef = collection(firestore, 'users');
        const querySnapshot = await getDocs(usersCollectionRef);
        const auth = getAuth();
        const user = auth.currentUser;
        const uid = user.uid;

        // Filter out the currently logged-in user from the list
        users.value = querySnapshot.docs
          .filter(doc => doc.data().userId !== uid) // Exclude the logged-in user
          .map(doc => ({
            id: doc.id,
            userId: doc.data().userId,
            email: doc.data().email,
            firstName: doc.data().firstName,
            lastName: doc.data().lastName,
            selectedRole: doc.data().role,
          }));
      } catch (error) {
        console.error('Error fetching users:', error);
        // Handle errors appropriately
      }
    };

    const confirmRoleChange = (user) => {
      if (confirm(`Are you sure you want to change ${user.email}'s role to ${user.selectedRole}?`)) {
        changeRole(user);
      }
    };

    const changeRole = async (user) => {
      try {
        const userDoc = doc(firestore, 'users', user.id);
        await updateDoc(userDoc, { role: user.selectedRole });
        await fetchUsers(); // Refresh user list after role change
        console.log(`User role updated to ${user.selectedRole}`);
      } catch (error) {
        console.error('Error updating user role:', error);
        // Handle errors appropriately, e.g., display an error message to the user
      }
    };

    const confirmDeleteUser = async (documentId, userId) => {
      console.log('Deleting user with documentId:', documentId, 'and userId:', userId);
      if (confirm(`Are you sure you want to permanently delete this user's account? This action cannot be undone.`)) {
        try {
          // Send DELETE request to server to delete user
          const response = await fetch(`http://192.168.1.20:3000/deleteUsers/${userId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error('Failed to delete user');
          }
          // Delete the user document from Firestore
          const userDocRef = doc(firestore, 'users', documentId);
          await deleteDoc(userDocRef);

          // Refresh user list after deletion
          fetchUsers();

          console.log(`User with ID ${userId} deleted successfully.`);
        } catch (error) {
          console.error('Error deleting user:', error);
          // Handle errors appropriately, e.g., display an error message to the user
        }
      }
    };

    const paginatedUsers = computed(() => {
      const startIndex = (currentPage.value - 1) * pageSize.value;
      const endIndex = currentPage.value * pageSize.value;
      return users.value.slice(startIndex, endIndex);
    });

    const totalPages = computed(() => Math.ceil(users.value.length / pageSize.value));

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
      }
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
      }
    };

    const paginatedUsersFiltered = computed(() => {
      return paginatedUsers.value.filter(user =>
        user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    fetchUsers(); // Fetch users when component is mounted

    return {
      users,
      confirmRoleChange,
      confirmDeleteUser,
      paginatedUsersFiltered,
      totalPages,
      currentPage,
      nextPage,
      prevPage,
      searchQuery,
    };
  },
};
</script>

<style>
/* Add your styling here */
.admin-panel {
  margin: 0 auto;
  max-width: 800px; /* Adjust the maximum width as needed */
  padding-top: 20px;
}

table {
  width: 100%;
  border: 1px solid black;
  margin-top: 20px;
}

th, td {
  border: 1px solid #000000;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}

.pagination button {
  margin: 0 5px;
}
.search-container input {
  margin-left: 50px;
}
</style>
