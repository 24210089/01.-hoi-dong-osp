// src/services/lookupService.js

import api from "./api";

const lookupService = {
  // Journey Stages
  getJourneyStages: async () => {
    try {
      const response = await api.get("/lookup/journey-stages");
      return response;
    } catch (error) {
      throw error;
    }
  },

  createJourneyStage: async (data) => {
    try {
      const response = await api.post("/lookup/journey-stages", data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateJourneyStage: async (id, data) => {
    try {
      const response = await api.put(`/lookup/journey-stages/${id}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteJourneyStage: async (id) => {
    try {
      const response = await api.delete(`/lookup/journey-stages/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Sister Statuses
  getSisterStatuses: async () => {
    try {
      const response = await api.get("/lookup/sister-statuses");
      return response;
    } catch (error) {
      throw error;
    }
  },

  createSisterStatus: async (data) => {
    try {
      const response = await api.post("/lookup/sister-statuses", data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateSisterStatus: async (id, data) => {
    try {
      const response = await api.put(`/lookup/sister-statuses/${id}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteSisterStatus: async (id) => {
    try {
      const response = await api.delete(`/lookup/sister-statuses/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // User Roles
  getUserRoles: async () => {
    try {
      const response = await api.get("/lookup/user-roles");
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default lookupService;
