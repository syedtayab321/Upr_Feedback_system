import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as alumniApi from './../../apis/endpoints/alumniEndpoint';

// Async Thunks
export const submitFeedback = createAsyncThunk(
  'alumni/submitFeedback',
  async (feedbackData, { rejectWithValue }) => {
    try {
      return await alumniApi.submitFeedbackApi(feedbackData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFeedbacks = createAsyncThunk(
  'alumni/fetchFeedbacks',
  async (_, { rejectWithValue }) => {
    try {
      return await alumniApi.fetchFeedbacksApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Additional alumni thunks
export const fetchAlumniProfile = createAsyncThunk(
  'alumni/fetchAlumniProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await alumniApi.fetchAlumniProfileApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAlumniProfile = createAsyncThunk(
  'alumni/updateAlumniProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      return await alumniApi.updateAlumniProfileApi(profileData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchAlumniEvents = createAsyncThunk(
  'alumni/fetchAlumniEvents',
  async (_, { rejectWithValue }) => {
    try {
      return await alumniApi.fetchAlumniEventsApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerForEvent = createAsyncThunk(
  'alumni/registerForEvent',
  async (eventId, { rejectWithValue }) => {
    try {
      return await alumniApi.registerForEventApi(eventId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Helper functions for state management
const handlePending = (state) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

const alumniSlice = createSlice({
  name: 'alumni',
  initialState: {
    feedbacks: [],
    profile: null,
    events: [],
    loading: false,
    error: null,
    operations: {
      feedback: {
        loading: false,
        error: null,
      },
      profile: {
        loading: false,
        error: null,
      },
      events: {
        loading: false,
        error: null,
      },
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.operations.feedback.error = null;
      state.operations.profile.error = null;
      state.operations.events.error = null;
    },
    resetAlumniState: (state) => {
      state.feedbacks = [];
      state.profile = null;
      state.events = [];
      state.loading = false;
      state.error = null;
      state.operations.feedback.loading = false;
      state.operations.feedback.error = null;
      state.operations.profile.loading = false;
      state.operations.profile.error = null;
      state.operations.events.loading = false;
      state.operations.events.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit Feedback
      .addCase(submitFeedback.pending, (state) => {
        state.operations.feedback.loading = true;
        state.operations.feedback.error = null;
      })
      .addCase(submitFeedback.fulfilled, (state, action) => {
        state.operations.feedback.loading = false;
        state.feedbacks.push(action.payload);
      })
      .addCase(submitFeedback.rejected, (state, action) => {
        state.operations.feedback.loading = false;
        state.operations.feedback.error = action.payload;
      })
      
      // Fetch Feedbacks
      .addCase(fetchFeedbacks.pending, (state) => {
        state.operations.feedback.loading = true;
        state.operations.feedback.error = null;
      })
      .addCase(fetchFeedbacks.fulfilled, (state, action) => {
        state.operations.feedback.loading = false;
        state.feedbacks = action.payload;
      })
      .addCase(fetchFeedbacks.rejected, (state, action) => {
        state.operations.feedback.loading = false;
        state.operations.feedback.error = action.payload;
      })
      
      // Fetch Alumni Profile
      .addCase(fetchAlumniProfile.pending, (state) => {
        state.operations.profile.loading = true;
        state.operations.profile.error = null;
      })
      .addCase(fetchAlumniProfile.fulfilled, (state, action) => {
        state.operations.profile.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchAlumniProfile.rejected, (state, action) => {
        state.operations.profile.loading = false;
        state.operations.profile.error = action.payload;
      })
      
      // Update Alumni Profile
      .addCase(updateAlumniProfile.pending, (state) => {
        state.operations.profile.loading = true;
        state.operations.profile.error = null;
      })
      .addCase(updateAlumniProfile.fulfilled, (state, action) => {
        state.operations.profile.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateAlumniProfile.rejected, (state, action) => {
        state.operations.profile.loading = false;
        state.operations.profile.error = action.payload;
      })
      
      // Fetch Alumni Events
      .addCase(fetchAlumniEvents.pending, (state) => {
        state.operations.events.loading = true;
        state.operations.events.error = null;
      })
      .addCase(fetchAlumniEvents.fulfilled, (state, action) => {
        state.operations.events.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchAlumniEvents.rejected, (state, action) => {
        state.operations.events.loading = false;
        state.operations.events.error = action.payload;
      })
      
      // Register for Event
      .addCase(registerForEvent.pending, (state) => {
        state.operations.events.loading = true;
        state.operations.events.error = null;
      })
      .addCase(registerForEvent.fulfilled, (state, action) => {
        state.operations.events.loading = false;
        // Update the event registration status
        const eventIndex = state.events.findIndex(event => event.id === action.payload.eventId);
        if (eventIndex !== -1) {
          state.events[eventIndex].registered = true;
        }
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.operations.events.loading = false;
        state.operations.events.error = action.payload;
      });
  }
});

export const { clearError, resetAlumniState } = alumniSlice.actions;
export default alumniSlice.reducer;

// Feedback selectors
export const selectFeedbacks = (state) => state.alumni.feedbacks;
export const selectFeedbacksLoading = (state) => state.alumni.operations.feedback.loading;
export const selectFeedbacksError = (state) => state.alumni.operations.feedback.error;

// Profile selectors
export const selectAlumniProfile = (state) => state.alumni.profile;
export const selectProfileLoading = (state) => state.alumni.operations.profile.loading;
export const selectProfileError = (state) => state.alumni.operations.profile.error;

// Events selectors
export const selectAlumniEvents = (state) => state.alumni.events;
export const selectEventsLoading = (state) => state.alumni.operations.events.loading;
export const selectEventsError = (state) => state.alumni.operations.events.error;

// General selectors
export const selectAlumniLoading = (state) => state.alumni.loading;
export const selectAlumniError = (state) => state.alumni.error;