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
        <label for="newPassword">New Password:</label>
        <div class="password-input">
          <input :type="passwordFieldType" id="newPassword" v-model="updatedProfile.newPassword">
          <button type="button" @click="togglePasswordVisibility">
            {{ showPassword ? 'Hide' : 'Show' }} Password
          </button>
        </div>
      </div>
      
      <button type="submit" class="button-save">Save Changes</button>
      <!-- Display success message if profile was successfully updated -->
      <p v-if="profileUpdated" class="success-message">Profile updated successfully!</p>
    </form>
  </div>
</template>

<script>
import { auth, firestore } from '@/firebase';
import { getDocs, collection ,updateDoc} from 'firebase/firestore'; // Remove unused imports
import { updatePassword } from 'firebase/auth';
export default {
  data() {
    return {
      updatedProfile: {
        firstName: '',
        lastName: '',
        telephone: '',
        email: '',
        newPassword: '' // New password field
      },
      profileUpdated: false, // Flag to track if profile was successfully updated
      showPassword: false, // Flag to track whether password is visible or not
    };
  },
  async mounted() {
    try {
      // Get the current authenticated user
      const user = auth.currentUser;
      if (user) {
        // Use the UID from Firebase Auth
        const uid = user.uid;
        console.log(uid);
        
        // Fetch the user document based on the UID
        const usersCollectionRef = collection(firestore, 'users');
        const querySnapshot = await getDocs(usersCollectionRef);
        
        querySnapshot.forEach(doc => {
          const userData = doc.data();
          if (userData.userId === uid) {
            // User document found, update the component state with user data
            this.updatedProfile = { ...userData };
          }
        });
        
        if (!this.updatedProfile) {
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
      console.log('User ID:', userId); // Log the user ID

      // Fetch the user document based on the userId field
      const usersCollectionRef = collection(firestore, 'users');
      const querySnapshot = await getDocs(usersCollectionRef);
      
      querySnapshot.forEach(doc => {
        const userData = doc.data();
        if (userData.userId === userId) {
          // Document found, update the profile
          const userDocRef = doc.ref;
          console.log('Document ID:', userDocRef.id); // Log the document ID
          
          // Remove newPassword field before updating Firestore document
          const { newPassword, ...profileData } = this.updatedProfile;

          // Update the user profile without newPassword
          updateDoc(userDocRef, profileData).then(() => {
            console.log('Profile updated successfully');
            
            // Change password if newPassword field is not empty
            if (newPassword !== '') {
              // Update password in Firebase Authentication
              updatePassword(user, newPassword).then(() => {
                console.log('Password updated successfully');
              }).catch(error => {
                console.error('Error updating password:', error.message);
              });
            }
            
            // Optionally, you can navigate back to the profile view after updating
            this.$router.push({ name: 'profile' });
            // Set profileUpdated flag to true to show success message
            this.profileUpdated = true;
          }).catch(error => {
            console.error('Error updating user profile:', error.message);
          });
        }
      });
    } else {
      console.error('User not authenticated');
    }
  } catch (error) {
    console.error('Error updating user profile:', error.message);
  }
},


    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    }
  },
  computed: {
    passwordFieldType() {
      return this.showPassword ? 'text' : 'password';
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
input[type="email"],
input[type="password"] {
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