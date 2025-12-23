import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as academicApi from "./../../apis/endpoints/academicEndpoint";

// Async Thunks
export const fetchFeedbacks = createAsyncThunk(
  "academic/fetchFeedbacks",
  async (_, { rejectWithValue }) => {
    try {
      return await academicApi.fetchFeedbacksApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitFeedback = createAsyncThunk(
  "academic/submitFeedback",
  async (feedbackData, { rejectWithValue }) => {
    try {
      return await academicApi.submitFeedbackApi(feedbackData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchQuestionnaires = createAsyncThunk(
  "academic/fetchQuestionnaires",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching questionnaires from API...");
      return await academicApi.fetchQuestionnairesApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const respondToFeedback = createAsyncThunk(
  "academic/respondToFeedback",
  async ({ feedbackId, response }, { rejectWithValue }) => {
    try {
      return await academicApi.respondToFeedbackApi({ feedbackId, response });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchChats = createAsyncThunk(
  "academic/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      return await academicApi.fetchChatsApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchChatUsers = createAsyncThunk(
  "academic/fetchChatUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await academicApi.fetchChatUsersApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSentimentTrends = createAsyncThunk(
  "academic/fetchSentimentTrends",
  async (params, { rejectWithValue }) => {
    try {
      return await academicApi.fetchSentimentTrendsApi(params);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "academic/sendMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      return await academicApi.sendMessageApi(messageData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const academicSlice = createSlice({
  name: "academic",
  initialState: {
    feedbacks: [],
    questionnaires: [],
    chats: [],
    chatUsers: [],
    sentimentTrends: null,
    loading: false,
    error: null,
    socketConnected: false,
    submitSuccess: false,
    operations: {
      feedback: { loading: false, error: null },
      questionnaire: { loading: false, error: null },
      chat: { loading: false, error: null },
      sentiment: { loading: false, error: null },
    },
  },

  reducers: {
    addMessage: (state, action) => {
      state.chats.push(action.payload);
    },
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.operations.feedback.error = null;
      state.operations.chat.error = null;
      state.operations.sentiment.error = null;
    },
    clearSentimentTrends: (state) => {
      state.sentimentTrends = null;
    },
    resetAcademicState: (state) => {
      state.feedbacks = [];
      state.chats = [];
      state.chatUsers = [];
      state.sentimentTrends = null;
      state.questionnaires = [];
      state.loading = false;
      state.error = null;
      state.socketConnected = false;
      state.operations.feedback.loading = false;
      state.operations.feedback.error = null;
      state.operations.chat.loading = false;
      state.operations.chat.error = null;
      state.operations.sentiment.loading = false;
      state.operations.sentiment.error = null;
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

      // Respond to Feedback
      .addCase(respondToFeedback.pending, (state) => {
        state.operations.feedback.loading = true;
        state.operations.feedback.error = null;
      })
      .addCase(respondToFeedback.fulfilled, (state, action) => {
        state.operations.feedback.loading = false;
        const feedback = state.feedbacks.find(
          (f) => f.id === action.payload.feedbackId
        );
        if (feedback) {
          feedback.FeedbackResponses = feedback.FeedbackResponses || [];
          feedback.FeedbackResponses.push(action.payload);
        }
      })
      .addCase(respondToFeedback.rejected, (state, action) => {
        state.operations.feedback.loading = false;
        state.operations.feedback.error = action.payload;
      })

      // Fetch Chats
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

      // Fetch Chat Users (Added)
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
      })

      // Fetch Sentiment Trends
      .addCase(fetchSentimentTrends.pending, (state) => {
        state.operations.sentiment.loading = true;
        state.operations.sentiment.error = null;
      })
      .addCase(fetchSentimentTrends.fulfilled, (state, action) => {
        state.operations.sentiment.loading = false;
        state.sentimentTrends = action.payload;
      })
      .addCase(fetchSentimentTrends.rejected, (state, action) => {
        state.operations.sentiment.loading = false;
        state.operations.sentiment.error = action.payload;
      })

      // Send Message
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
      });
  },
});

export const {
  addMessage,
  setSocketConnected,
  clearError,
  clearSentimentTrends,
  resetAcademicState,
} = academicSlice.actions;

// Socket initialization helper
export const initializeAcademicSocket = (userId, dispatch) => {
  try {
    const socket = academicApi.initializeSocket(userId);

    // Set up socket listeners
    const cleanup = academicApi.setupSocketListeners(
      socket,
      dispatch,
      addMessage
    );

    // Handle connection status
    socket.on("connect", () => {
      dispatch(setSocketConnected(true));
    });

    socket.on("disconnect", () => {
      dispatch(setSocketConnected(false));
    });

    return cleanup;
  } catch (error) {
    console.error("Failed to initialize socket:", error);
    return () => {};
  }
};

export default academicSlice.reducer;

// Feedback selectors
export const selectFeedbacks = (state) => state.academic.feedbacks;
export const selectFeedbacksLoading = (state) =>
  state.academic.operations.feedback.loading;
export const selectFeedbacksError = (state) =>
  state.academic.operations.feedback.error;

// Chat selectors
export const selectChats = (state) => state.academic.chats;
export const selectChatUsers = (state) => state.academic.chatUsers; // Added
export const selectChatsLoading = (state) =>
  state.academic.operations.chat.loading;
export const selectChatsError = (state) => state.academic.operations.chat.error;
export const selectSocketConnected = (state) => state.academic.socketConnected;

// Sentiment selectors
export const selectSentimentTrends = (state) => state.academic.sentimentTrends;
export const selectSentimentLoading = (state) =>
  state.academic.operations.sentiment.loading;
export const selectSentimentError = (state) =>
  state.academic.operations.sentiment.error;

// General selectors
export const selectAcademicLoading = (state) => state.academic.loading;
export const selectAcademicError = (state) => state.academic.error;

export const selectQuestionnaires = (state) => state.academic.questionnaires;
export const selectQuestionnairesLoading = (state) =>
  state.academic.operations.questionnaire.loading;
export const selectQuestionnairesError = (state) =>
  state.academic.operations.questionnaire.error;
