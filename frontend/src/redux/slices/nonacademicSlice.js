import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as nonAcademicApi from "./../../apis/endpoints/nonAcademicEndpoint";

// Async Thunks
export const fetchFeedbacks = createAsyncThunk(
  "nonAcademic/fetchFeedbacks",
  async (_, { rejectWithValue }) => {
    try {
      return await nonAcademicApi.fetchFeedbacksApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitFeedback = createAsyncThunk(
  "nonAcademic/submitFeedback",
  async (feedbackData, { rejectWithValue }) => {
    try {
      return await nonAcademicApi.submitFeedbackApi(feedbackData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchQuestionnaires = createAsyncThunk(
  "nonAcademic/fetchQuestionnaires",
  async (_, { rejectWithValue }) => {
    try {
      return await nonAcademicApi.fetchQuestionnairesApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const respondToFeedback = createAsyncThunk(
  "nonAcademic/respondToFeedback",
  async ({ feedbackId, response }, { rejectWithValue }) => {
    try {
      return await nonAcademicApi.respondToFeedbackApi({
        feedbackId,
        response,
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchChats = createAsyncThunk(
  "nonAcademic/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      return await nonAcademicApi.fetchChatsApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchChatUsers = createAsyncThunk(
  "nonAcademic/fetchChatUsers",
  async (_, { rejectWithValue }) => {
    try {
      return await nonAcademicApi.fetchChatUsersApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  "nonAcademic/sendMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      return await nonAcademicApi.sendMessageApi(messageData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const nonAcademicSlice = createSlice({
  name: "nonAcademic",
  initialState: {
    feedbacks: [],
    questionnaires: [],
    chats: [],
    chatUsers: [],
    loading: false,
    error: null,
    socketConnected: false,
    submitSuccess: false,
    operations: {
      feedback: { loading: false, error: null },
      chat: { loading: false, error: null },
      questionnaire: { loading: false, error: null },
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
    },
    resetNonAcademicState: (state) => {
      state.feedbacks = [];
      state.chats = [];
      state.loading = false;
      state.error = null;
      state.questionnaires = [];
      state.socketConnected = false;
      state.operations.feedback.loading = false;
      state.operations.feedback.error = null;
      state.operations.chat.loading = false;
      state.operations.chat.error = null;
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
  resetNonAcademicState,
} = nonAcademicSlice.actions;

// Socket initialization helper
export const initializeNonAcademicSocket = (userId, dispatch) => {
  try {
    const socket = nonAcademicApi.initializeSocket(userId);

    // Set up socket listeners
    const cleanup = nonAcademicApi.setupSocketListeners(
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

export default nonAcademicSlice.reducer;

// Feedback selectors
export const selectFeedbacks = (state) => state.nonAcademic.feedbacks;
export const selectFeedbacksLoading = (state) =>
  state.nonAcademic.operations.feedback.loading;
export const selectFeedbacksError = (state) =>
  state.nonAcademic.operations.feedback.error;

// Chat selectors
export const selectChats = (state) => state.nonAcademic.chats;
export const selectChatUsers = (state) => state.nonAcademic.chatUsers;
export const selectChatsLoading = (state) =>state.nonAcademic.operations.chat.loading;
export const selectChatsError = (state) => state.nonAcademic.operations.chat.error;
export const selectSocketConnected = (state) => state.nonAcademic.socketConnected;

// General selectors
export const selectNonAcademicLoading = (state) => state.nonAcademic.loading;
export const selectNonAcademicError = (state) => state.nonAcademic.error;

export const selectQuestionnaires = (state) => state.nonAcademic.questionnaires;
export const selectQuestionnairesLoading = (state) =>
  state.nonAcademic.operations.questionnaire.loading;
export const selectQuestionnairesError = (state) =>
  state.nonAcademic.operations.questionnaire.error;
