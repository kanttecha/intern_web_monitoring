<template>
  <div class="edit-profile-container">
    <h2>Edit Profile</h2>
    <form @submit.prevent="updateProfile">
      <div class="form-group">
        <label for="firstName">First Name:</label>
        <input type="text" id="firstName" v-model="updatedProfile.firstName" required>
      </div>
      <div class="form-group">
        <label for="lastName">Last Name:</label>
        <input type="text" id="lastName" v-model="updatedProfile.lastName" required>
      </div>
      <div class="form-group">
        <label for="telephone">Telephone:</label>
        <input type="tel" id="telephone" v-model="updatedProfile.telephone" required>
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="updatedProfile.email" required>
      </div>
      <button type="submit" class="button-save">Save Changes</button>
      <!-- Display success message if profile was successfully updated -->
      <p v-if="profileUpdated" class="success-message">Profile updated successfully!</p>
    </form>
  </div>
</template>

<script>
import { auth, firestore } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default {
  data() {
    return {
      updatedProfile: {
        firstName: '',
        lastName: '',
        telephone: '',
        email: ''
      },
      profileUpdated: false // Flag to track if profile was successfully updated
    };
  },
  async mounted() {
    // Fetch the current user's profile data to pre-fill the form
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const userDocRef = doc(firestore, 'users', userId);
        const userDocSnapshot = await userDocRef.get();
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          this.updatedProfile = { ...userData };
        } else {
          console.error('User document not found');
        }
      } else {
        console.error('User not authenticated');
      }
    } catch (error) {
      console.error('Error fetching user profile: ', error.message);
    }
  },
  methods: {
    async updateProfile() {
      try {
        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          const userDocRef = doc(firestore, 'users', userId);
          await updateDoc(userDocRef, this.updatedProfile);
          console.log('Profile updated successfully');
          // Optionally, you can navigate back to the profile view after updating
          this.$router.push({ name: 'userprofile' });
          // Set profileUpdated flag to true to show success message
          this.profileUpdated = true;
        } else {
          console.error('User not authenticated');
        }
      } catch (error) {
        console.error('Error updating user profile: ', error.message);
      }
    }
  }
};
</script>

<style>
/* Add your styling here */
.edit-profile-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-weight: bold;
}

input[type="text"],
input[type="tel"],
input[type="email"] {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

button.button-save {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  color: #fff;
  background-color: #28a745;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button.button-save:hover {
  background-color: #218838;
}

.success-message {
  color: green;
  margin-top: 10px;
}
</style>
