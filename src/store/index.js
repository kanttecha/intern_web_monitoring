import { createStore } from 'vuex';

const store = createStore({
  state() {
    return {
      isAuthenticated: false,
      userId: null,
      errorMessage: null
    };
  },
  mutations: {
    setAuthenticated(state, isAuthenticated) {
      state.isAuthenticated = isAuthenticated;
    },
    setUserId(state, userId) {
      state.userId = userId;
    },
    setErrorMessage(state, errorMessage) {
      state.errorMessage = errorMessage;
    }
  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    async register({ commit }, { firstName, lastName, telephone, email, password }) {
      try {
        // Your registration logic here
        // For example, register the user with Firebase and then commit mutations accordingly
        commit('setAuthenticated', true);
        commit('setErrorMessage', null);
      } catch (error) {
        console.error('Error registering user:', error.message);
        commit('setErrorMessage', error.message);
      }
    }
  },
  getters: {
    isAuthenticated: state => state.isAuthenticated,
    userId: state => state.userId,
    errorMessage: state => state.errorMessage
  }
});

export default store;
