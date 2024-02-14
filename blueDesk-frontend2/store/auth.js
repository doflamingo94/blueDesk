import { defineStore } from "pinia";

export const useAuthStore = defineStore('auth', {
    state: () => {
        return {
          isAuthenticated: false,
          userId: null,
          userRole: null  
        }    
    },
    getters: {
        isLoggedIn: (state) => state.isAuthenticated,
        getId: (state) => state.userId,
        getRole: (state) => state.userRole
    },
    actions: {
        login(userId, userRole) {
            this.isAuthenticated = true;
            this.userId = userId;
            this.userRole = userRole;
        },
        logout() {
            this.isAuthenticated = false;
            this.userId = null;
            this.userRole = null;
        }
    },
    persist: {
        storage: persistedState.sessionStorage,
    }
})