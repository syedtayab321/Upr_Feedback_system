import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as studentApi from './../../apis/endpoints/studentEndpoint';

// Async Thunks
export const submitFeedback = createAsyncThunk(
  'student/submitFeedback',
  async (feedbackData, { rejectWithValue }) => {
    try {
      return await studentApi.submitFeedbackApi(feedbackData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchFeedbacks = createAsyncThunk(
  'student/fetchFeedbacks',
  async (_, { rejectWithValue }) => {
    try {
      return await studentApi.fetchFeedbacksApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchQuestionnaires = createAsyncThunk(
  'student/fetchQuestionnaires',
  async (_, { rejectWithValue }) => {
    try {
      return await studentApi.fetchQuestionnairesApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchChatUsers = createAsyncThunk(
  'student/fetchChatUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await studentApi.fetchChatUsersApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchChats = createAsyncThunk(
  'student/fetchChats',
  async (_, { rejectWithValue }) => {
    try {
      return await studentApi.fetchChatsApi();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'student/sendMessage',
  async (messageData, { rejectWithValue }) => {
    try {
      return await studentApi.sendMessageApi(messageData);
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

const studentSlice = createSlice({
  name: 'student',
  initialState: {
    feedbacks: [],
    questionnaires: [],
    chatUsers: [],
    chats: [],
    loading: false,
    error: null,
    socketConnected: false,
    operations: {
      feedback: {
        loading: false,
        error: null,
      },
      questionnaire: {
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
    addMessage: (state, action) => {
      state.chats.push(action.payload);
    },
    setSocketConnected: (state, action) => {
      state.socketConnected = action.payload;
    },
    clearError: (state) => {
      state.error = null;
      state.operations.feedback.error = null;
      state.operations.questionnaire.error = null;
      state.operations.chat.error = null;
    },
    resetStudentState: (state) => {
      state.feedbacks = [];
      state.questionnaires = [];
      state.chatUsers = [];
      state.chats = [];
      state.loading = false;
      state.error = null;
      state.socketConnected = false;
      state.operations.feedback.loading = false;
      state.operations.feedback.error = null;
      state.operations.questionnaire.loading = false;
      state.operations.questionnaire.error = null;
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
      
      // Fetch Chat Users
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
  }
});

export const { 
  addMessage, 
  setSocketConnected, 
  clearError, 
  resetStudentState 
} = studentSlice.actions;

// Socket initialization helper
export const initializeStudentSocket = (userId, dispatch) => {
  try {
    const socket = studentApi.initializeSocket(userId);
    
    // Set up socket listeners
    const cleanup = studentApi.setupSocketListeners(
      socket, 
      dispatch, 
      addMessage
    );
    
    // Handle connection status
    socket.on('connect', () => {
      dispatch(setSocketConnected(true));
    });
    
    socket.on('disconnect', () => {
      dispatch(setSocketConnected(false));
    });
    
    return cleanup;
  } catch (error) {
    console.error('Failed to initialize socket:', error);
    return () => {};
  }
};

export default studentSlice.reducer;

// Feedback selectors
export const selectFeedbacks = (state) => state.student.feedbacks;
export const selectFeedbacksLoading = (state) => state.student.operations.feedback.loading;
export const selectFeedbacksError = (state) => state.student.operations.feedback.error;

// Questionnaire selectors
export const selectQuestionnaires = (state) => state.student.questionnaires;
export const selectQuestionnairesLoading = (state) => state.student.operations.questionnaire.loading;
export const selectQuestionnairesError = (state) => state.student.operations.questionnaire.error;

// Chat selectors
export const selectChatUsers = (state) => state.student.chatUsers;
export const selectChats = (state) => state.student.chats;
export const selectChatsLoading = (state) => state.student.operations.chat.loading;
export const selectChatsError = (state) => state.student.operations.chat.error;
export const selectSocketConnected = (state) => state.student.socketConnected;

// General selectors
export const selectStudentLoading = (state) => state.student.loading;
export const selectStudentError = (state) => state.student.error;