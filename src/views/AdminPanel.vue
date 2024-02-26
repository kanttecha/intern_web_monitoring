<template>
  <div>
    <nav>
      <router-link to="/home">TABLE</router-link>
      <router-link to="/about">ADD INFO</router-link>
      <router-link to="/insert">Map V2</router-link>
      <router-link to="/hls">ALL HLS</router-link>
      <router-link to="/panel">Admin Panel</router-link>
    </nav>
  </div>
  <div>
    <h2>Admin Panel</h2>
    <table>
      <thead>
        <tr>
          <th>Email</th>
          <th>Role</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(user, index) in users" :key="index">
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
          <td>
            <button v-if="user.role !== 'admin'" @click="makeAdmin(user.id)">Make Admin</button>
            <button v-else @click="removeAdmin(user.id)">Remove Admin</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>


<script>
import { ref } from 'vue';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';

export default {
  setup() {
    const users = ref([]);

    const fetchUsers = async () => {
      const usersCollection = collection(firestore, 'users');
      const querySnapshot = await getDocs(usersCollection);
      users.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    };

    const makeAdmin = async (userId) => {
      try {
        const userDoc = doc(firestore, 'users', userId);
        await updateDoc(userDoc, { role: 'admin' });
        await fetchUsers(); // Refresh user list after role change
        console.log('User role updated to admin');
      } catch (error) {
        console.error('Error updating user role: ', error);
      }
    };

    const removeAdmin = async (userId) => {
      try {
        const userDoc = doc(firestore, 'users', userId);
        await updateDoc(userDoc, { role: 'user' });
        await fetchUsers(); // Refresh user list after role change
        console.log('User role updated to user');
      } catch (error) {
        console.error('Error updating user role: ', error);
      }
    };

    fetchUsers(); // Fetch users when component is mounted

    return {
      users,
      makeAdmin,
      removeAdmin
    };
  }
};
</script>


<style>
/* Add your styling here */
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

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

li {
  margin-bottom: 4px;
}
</style>
