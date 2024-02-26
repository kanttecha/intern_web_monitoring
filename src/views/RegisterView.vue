<template>
  <div class="register-container">
    <h2>Register</h2>
    <div class="error-box" v-if="errorMessage">{{ errorMessage }}</div>
    <div class="input-group">
      <input v-model="firstName" type="text" placeholder="First Name" required>
    </div>
    <div class="input-group">
      <input v-model="lastName" type="text" placeholder="Last Name" required>
    </div>
    <div class="input-group">
      <input v-model="telephone" type="tel" placeholder="Telephone Number" required>
    </div>
    <div class="input-group">
      <input v-model="email" type="email" placeholder="Email" required>
    </div>
    <div class="input-group">
      <input v-model="password" type="password" placeholder="Password" required>
    </div>
    <button class="buttonregister" @click="register">Register</button>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore';
import { auth, firestore } from '@/firebase';

export default {
  data() {
    return {
      firstName: '',
      lastName: '',
      telephone: '',
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
    async register() {
      try {
        // Register user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const userId = userCredential.user.uid;

        // Add user to Firestore with default user role
        const usersCollection = collection(firestore, 'users');
        await addDoc(usersCollection, { userId, firstName: this.firstName, lastName: this.lastName, telephone: this.telephone, email: this.email, role: 'user' });

        console.log('User registered successfully with ID: ', userId);

        // Clear form fields after successful registration
        this.firstName = '';
        this.lastName = '';
        this.telephone = '';
        this.email = '';
        this.password = '';

        // Redirect to homeuser page after successful registration
        this.$router.push({ name: 'homeuser' });
      } catch (error) {
        console.error('Error registering user: ', error.message);
        // Set error message
        this.errorMessage = error.message;
      }
    }
  }
};
</script>


<style>
/* Add your styling here */
.register-container {
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

.buttonregister {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.buttonregister:hover {
  background-color: #0056b3;
}

.error-box {
  background-color: #ffcccc;
  color: #ff0000;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
}
</style>
