<template>
  <div class="login-container">
    <h2>Login</h2>
    <div class="input-group">
      <input v-model="email" type="email" placeholder="Email" required>
    </div>
    <div class="input-group">
      <input v-model="password" type="password" placeholder="Password" required>
    </div>
    <button class="buttonlogin" @click="login">Login</button>
    
    <!-- Error notification container -->
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
  <div class="register-link">
    <router-link :to="{ name: 'register' }">Don't have an account? Register here</router-link>
  </div>
</template>


<script>
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, firestore } from '@/firebase';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '' // Added errorMessage property
    };
  },
  methods: {
    async login() {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, this.email, this.password);
        console.log('User logged in successfully', userCredential.user);

        // Console log the UID from Firebase Authentication
        console.log('User UID:', userCredential.user.uid);

        localStorage.setItem('isAuthenticated', true);
        // Fetch user role from Firestore
        const usersCollection = collection(firestore, 'users');
        const userQuery = query(usersCollection, where('userId', '==', userCredential.user.uid));
        const querySnapshot = await getDocs(userQuery);

        // Inside the login method after fetching user role from Firestore
        if (!querySnapshot.empty) {
          const user = querySnapshot.docs[0].data();
          const role = user.role;
          console.log('User role:', role);
          
          // Dispatch login action with userRole
          this.$store.dispatch('login', { userCredential, userRole: role });

          // Store user role in local storage
          localStorage.setItem('userRole', role);

          // Redirect to home page
          this.$router.push({ name: 'home' });
        } else {
          console.error('User data not found in Firestore');
        }
      } catch (error) {
        console.error('Login error:', error.message);
        this.errorMessage = error.message; // Set errorMessage property
      }
    }
  }
};
</script>


<style>
/* Add your styling here */
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.input-group {
  margin-bottom: 20px;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.buttonlogin {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.buttonlogin:hover {
  background-color: #0056b3;
}

.register-link {
  text-align: center;
}

.error-message {
  background-color: #ffcccc;
  color: #ff0000;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
}
</style>

