import { defineStore } from "pinia";

export const useProfile = defineStore('profile', {
    state: () => {
        return {
          profileId: null
        }    
    },
    getters: {
        getId: (state) => state.profileId
    },
    actions: {
        setProfile(profileId) {
            this.profileId = profileId;
        },
        unsetProfile() {
            this.profileId = null;
        }
    },
    persist: {
        storage: persistedState.sessionStorage,
    }
})