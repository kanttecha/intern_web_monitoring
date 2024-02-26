<template>
  <div>
    <nav>

      
    <button v-if="isLoggedIn" @click="logout">Logout</button>
    </nav>

    <router-view/>
  </div>
</template>


<script>
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref } from 'vue';
import { auth } from './firebase'; // Adjust the path to your firebase.js file
import { useRouter } from 'vue-router'; // Import useRouter from vue-router

export default {
  name: 'App',
  setup() {
    const isLoggedIn = ref(false);
    const router = useRouter(); // Get the router instance

    // Check if the user is already logged in
    onAuthStateChanged(auth, (user) => {
      isLoggedIn.value = !!user;
    });

    const logout = async () => {
      try {
        await signOut(auth);
        console.log('User logged out successfully');
        // Redirect to the login page after logout
        router.push({ name: 'login' });
      } catch (error) {
        console.error('Error logging out:', error.message);
      }
    };

    return {
      isLoggedIn,
      logout
    };
  }
};
</script>











<style>

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}



#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}


</style>
