import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as adminApi from './../../apis/endpoints/adminEndpoint';

// Helper function to handle pending state
const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

// Helper function to handle rejected state
const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload || action.error.message;
};

// Async Thunks
export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await adminApi.fetchUsersApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  'admin/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      return await adminApi.createUserApi(userData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'admin/updateUser',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await adminApi.updateUserApi({ id, data });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      return await adminApi.deleteUserApi(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchActivities = createAsyncThunk(
  'admin/fetchActivities',
  async (_, { rejectWithValue }) => {
    try {
      return await adminApi.fetchActivitiesApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFeedbacks = createAsyncThunk(
  'admin/fetchFeedbacks',
  async (_, { rejectWithValue }) => {
    try {
      return await adminApi.fetchFeedbacksApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchChats = createAsyncThunk(
  'admin/fetchChats',
  async (_, { rejectWithValue }) => {
    try {
      return await adminApi.fetchChatsApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const moderateChat = createAsyncThunk(
  'admin/moderateChat',
  async (id, { rejectWithValue }) => {
    try {
      return await adminApi.moderateChatApi(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const generateReport = createAsyncThunk(
  'admin/generateReport',
  async (params, { rejectWithValue }) => {
    try {
      return await adminApi.generateReportApi(params);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchQuestionnaires = createAsyncThunk(
  'admin/fetchQuestionnaires',
  async (_, { rejectWithValue }) => {
    try {
      return await adminApi.fetchQuestionnairesApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createQuestionnaire = createAsyncThunk(
  'admin/createQuestionnaire',
  async (data, { rejectWithValue }) => {
    try {
      return await adminApi.createQuestionnaireApi(data);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateQuestionnaire = createAsyncThunk(
  'admin/updateQuestionnaire',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await adminApi.updateQuestionnaireApi({ id, data });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    users: [],
    activities: [],
    feedbacks: [],
    chats: [],
    questionnaires: [],
    report: null,
    loading: false,
    error: null,
    // More specific loading states
    operations: {
      user: {
        loading: false,
        error: null,
      },
      questionnaire: {
        loading: false,
        error: null,
      },
    },
  },
  reducers: {
    // Clear errors
    clearError: (state) => {
      state.error = null;
      state.operations.user.error = null;
      state.operations.questionnaire.error = null;
    },
    // Clear report data
    clearReport: (state) => {
      state.report = null;
    },
    // Reset state (useful for logout)
    resetAdminState: (state) => {
      state.users = [];
      state.activities = [];
      state.feedbacks = [];
      state.chats = [];
      state.questionnaires = [];
      state.report = null;
      state.loading = false;
      state.error = null;
      state.operations.user.loading = false;
      state.operations.user.error = null;
      state.operations.questionnaire.loading = false;
      state.operations.questionnaire.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Users
      .addCase(fetchUsers.pending, handlePending)
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, handleRejected)
      
      .addCase(createUser.pending, (state) => {
        state.operations.user.loading = true;
        state.operations.user.error = null;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.operations.user.loading = false;
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.operations.user.loading = false;
        state.operations.user.error = action.payload;
      })
      
      .addCase(updateUser.pending, (state) => {
        state.operations.user.loading = true;
        state.operations.user.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.operations.user.loading = false;
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) state.users[index] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.operations.user.loading = false;
        state.operations.user.error = action.payload;
      })
      
      .addCase(deleteUser.pending, (state) => {
        state.operations.user.loading = true;
        state.operations.user.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.operations.user.loading = false;
        state.users = state.users.filter(u => u.id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.operations.user.loading = false;
        state.operations.user.error = action.payload;
      })
      
      // Activities
      .addCase(fetchActivities.pending, handlePending)
      .addCase(fetchActivities.fulfilled, (state, action) => {
        state.loading = false;
        state.activities = action.payload;
      })
      .addCase(fetchActivities.rejected, handleRejected)
      
      // Feedbacks
      .addCase(fetchFeedbacks.pending, handlePending)
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload;
      })
      .addCase(fetchFeedbacks.rejected, handleRejected)
      
      // Chats
      .addCase(fetchChats.pending, handlePending)
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, handleRejected)
      
      .addCase(moderateChat.fulfilled, (state, action) => {
        const index = state.chats.findIndex(c => c.id === action.payload);
        if (index !== -1) state.chats[index].isModerated = true;
      })
      
      // Reports
      .addCase(generateReport.pending, handlePending)
      .addCase(generateReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(generateReport.rejected, handleRejected)
      
      // Questionnaires
      .addCase(fetchQuestionnaires.pending, (state) => {
        state.operations.questionnaire.loading = true;
        state.operations.questionnaire.error = null;
      })
      .addCase(fetchQuestionnaires.fulfilled, (state, action) => {
        state.operations.questionnaire.loading = false;
        state.questionnaires = action.payload;
      })
      .addCase(fetchQuestionnaires.rejected, (state, action) => {
        state.operations.questionnaire.loading = false;
        state.operations.questionnaire.error = action.payload;
      })
      
      .addCase(createQuestionnaire.pending, (state) => {
        state.operations.questionnaire.loading = true;
        state.operations.questionnaire.error = null;
      })
      .addCase(createQuestionnaire.fulfilled, (state, action) => {
        state.operations.questionnaire.loading = false;
        state.questionnaires.push(action.payload);
      })
      .addCase(createQuestionnaire.rejected, (state, action) => {
        state.operations.questionnaire.loading = false;
        state.operations.questionnaire.error = action.payload;
      })
      
      .addCase(updateQuestionnaire.pending, (state) => {
        state.operations.questionnaire.loading = true;
        state.operations.questionnaire.error = null;
      })
      .addCase(updateQuestionnaire.fulfilled, (state, action) => {
        state.operations.questionnaire.loading = false;
        const index = state.questionnaires.findIndex(q => q.id === action.payload.id);
        if (index !== -1) state.questionnaires[index] = action.payload;
      })
      .addCase(updateQuestionnaire.rejected, (state, action) => {
        state.operations.questionnaire.loading = false;
        state.operations.questionnaire.error = action.payload;
      });
  },
});

export const { clearError, clearReport, resetAdminState } = adminSlice.actions;
export default adminSlice.reducer;
// Users selectors
export const selectUsers = (state) => state.admin.users;
export const selectUsersLoading = (state) => state.admin.operations.user.loading;
export const selectUsersError = (state) => state.admin.operations.user.error;

// Activities selectors
export const selectActivities = (state) => state.admin.activities;
export const selectActivitiesLoading = (state) => state.admin.loading;

// Feedbacks selectors
export const selectFeedbacks = (state) => state.admin.feedbacks;
export const selectFeedbacksLoading = (state) => state.admin.loading;

// Chats selectors
export const selectChats = (state) => state.admin.chats;
export const selectChatsLoading = (state) => state.admin.loading;

// Reports selectors
export const selectReport = (state) => state.admin.report;
export const selectReportLoading = (state) => state.admin.loading;

// Questionnaires selectors
export const selectQuestionnaires = (state) => state.admin.questionnaires;
export const selectQuestionnairesLoading = (state) => state.admin.operations.questionnaire.loading;
export const selectQuestionnairesError = (state) => state.admin.operations.questionnaire.error;

// General selectors
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminError = (state) => state.admin.error;