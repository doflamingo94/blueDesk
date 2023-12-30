import { defineStore } from "pinia";

export const useProfile = defineStore('profile', {
    state: () => {
        return {
          profileId: null,
          annonceId: null,
          status: null
        }    
    },
    getters: {
        getProfileId: (state) => state.profileId,
        getAnnonceId: (state) => state.annonceId,
        getStatus: (state) => state.status
    },
    actions: {
        setProfile(profileId) {
            this.profileId = profileId;
        },
        setAnnonce(annonceId) {
            this.annonceId = annonceId;
        },
        setStatus(status) {
            this.status = status;
        },
        unsetProfile() {
            this.profileId = null;
        },
        unsetAnnonce() {
            this.annonceId = null;
        },
        unsetStatus() {
            this.status = null;
        }
    },
    persist: {
        storage: persistedState.sessionStorage,
    }
})