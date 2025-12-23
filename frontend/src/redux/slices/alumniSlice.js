import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as alumniApi from './../../apis/endpoints/alumniEndpoint';

export const submitFeedback = createAsyncThunk(
  'alumni/submitFeedback',
  async (feedbackData) => {
    return await alumniApi.submitFeedbackApi(feedbackData);
  }
);

export const fetchQuestionnaires = createAsyncThunk(
  'alumni/fetchQuestionnaires',
  async (_, { rejectWithValue }) => {
    try {
      return await alumniApi.fetchQuestionnairesApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFeedbacks = createAsyncThunk(
  'alumni/fetchFeedbacks',
  async () => {
    return await alumniApi.fetchFeedbacksApi();
  }
);

export const fetchAlumniProfile = createAsyncThunk(
  'alumni/fetchAlumniProfile',
  async () => {
    return await alumniApi.fetchAlumniProfileApi();
  }
);

export const updateAlumniProfile = createAsyncThunk(
  'alumni/updateAlumniProfile',
  async (profileData) => {
    return await alumniApi.updateAlumniProfileApi(profileData);
  }
);

export const fetchAlumniEvents = createAsyncThunk(
  'alumni/fetchAlumniEvents',
  async () => {
    return await alumniApi.fetchAlumniEventsApi();
  }
);

export const registerForEvent = createAsyncThunk(
  'alumni/registerForEvent',
  async (eventId) => {
    return await alumniApi.registerForEventApi(eventId);
  }
);

export const fetchChatUsers = createAsyncThunk(
  'alumni/fetchChatUsers',
  async () => {
    return await alumniApi.fetchChatUsersApi();
  }
);

export const fetchChats = createAsyncThunk(
  'alumni/fetchChats',
  async () => {
    return await alumniApi.fetchChatsApi();
  }
);

export const sendMessage = createAsyncThunk(
  'alumni/sendMessage',
  async (messageData) => {
    return await alumniApi.sendMessageApi(messageData);
  }
);

const alumniSlice = createSlice({
  name: 'alumni',
  initialState: {
    feedbacks: [],
    questionnaires: [],
    profile: null,
    events: [],
    chatUsers: [],
    chats: [],
    loading: false,
    error: null,
    submitSuccess: false,
    operations: {
      feedback: {
        loading: false,
        error: null,
      },
       questionnaire: {
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
      chat: {
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
      state.operations.chat.error = null;
    },
    resetAlumniState: (state) => {
      state.feedbacks = [];
      state.profile = null;
      state.events = [];
      state.chatUsers = [];
      state.chats = [];
      state.loading = false;
      state.error = null;
      state.operations.feedback.loading = false;
      state.operations.feedback.error = null;
      state.operations.profile.loading = false;
      state.operations.profile.error = null;
      state.operations.events.loading = false;
      state.operations.events.error = null;
      state.operations.chat.loading = false;
      state.operations.chat.error = null;
    },
    receiveMessage: (state, action) => {
      state.chats.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(registerForEvent.pending, (state) => {
        state.operations.events.loading = true;
        state.operations.events.error = null;
      })
      .addCase(registerForEvent.fulfilled, (state, action) => {
        state.operations.events.loading = false;
        const eventIndex = state.events.findIndex(event => event.id === action.payload.eventId);
        if (eventIndex !== -1) {
          state.events[eventIndex].registered = true;
        }
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.operations.events.loading = false;
        state.operations.events.error = action.payload;
      })
      .addCase(fetchChatUsers.pending, (state) => {
        state.operations.chat.loading = true;
        state.operations.chat.error = null;
      })
      .addCase(fetchChatUsers.fulfilled, (state, action) => {
        state.operations.chat.loading = false;
        state.chatUsers = action.payload;
      })
      .addCase(fetchChatUsers.rejected, (state, action) => {
        state.operations.chat.loading = false;
        state.operations.chat.error = action.payload;
      })
      .addCase(fetchChats.pending, (state) => {
        state.operations.chat.loading = true;
        state.operations.chat.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.operations.chat.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.operations.chat.loading = false;
        state.operations.chat.error = action.payload;
      })
      .addCase(sendMessage.pending, (state) => {
        state.operations.chat.loading = true;
        state.operations.chat.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.operations.chat.loading = false;
        state.chats.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.operations.chat.loading = false;
        state.operations.chat.error = action.payload;
      })

       // Fetch Questionnaires
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
      });
  }
});

export const { clearError, resetAlumniState, receiveMessage } = alumniSlice.actions;

export const selectFeedbacks = (state) => state.alumni.feedbacks;
export const selectFeedbacksLoading = (state) => state.alumni.operations.feedback.loading;
export const selectFeedbacksError = (state) => state.alumni.operations.feedback.error;

export const selectAlumniProfile = (state) => state.alumni.profile;
export const selectProfileLoading = (state) => state.alumni.operations.profile.loading;
export const selectProfileError = (state) => state.alumni.operations.profile.error;

export const selectAlumniEvents = (state) => state.alumni.events;
export const selectEventsLoading = (state) => state.alumni.operations.events.loading;
export const selectEventsError = (state) => state.alumni.operations.events.error;

export const selectChatUsers = (state) => state.alumni.chatUsers;
export const selectChats = (state) => state.alumni.chats;
export const selectChatLoading = (state) => state.alumni.operations.chat.loading;
export const selectChatError = (state) => state.alumni.operations.chat.error;

export const selectAlumniLoading = (state) => state.alumni.loading;
export const selectAlumniError = (state) => state.alumni.error;

export const selectQuestionnaires = (state) => state.alumni.questionnaires;
export const selectQuestionnairesLoading = (state) => state.alumni.operations.questionnaire.loading;
export const selectQuestionnairesError = (state) => state.alumni.operations.questionnaire.error;

export default alumniSlice.reducer;