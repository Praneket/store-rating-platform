import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authAPI } from '../../api/services';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.login(credentials);
    localStorage.setItem('accessToken', data.data.accessToken);
    return data.data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const signupUser = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await authAPI.signup(userData);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Signup failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await authAPI.logout().catch(() => {});
  localStorage.removeItem('accessToken');
});

// Always resolves — returns user or null
export const fetchMe = createAsyncThunk('auth/fetchMe', async () => {
  const token = localStorage.getItem('accessToken');
  if (!token) return null;
  try {
    const { data } = await authAPI.getMe();
    return data.data;
  } catch {
    localStorage.removeItem('accessToken');
    return null;
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    initialized: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
    setUser: (state, action) => { state.user = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(signupUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(signupUser.fulfilled, (state) => { state.loading = false; })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => { state.user = null; })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.initialized = true;
      });
  },
});

export const { clearError, setUser } = authSlice.actions;
export default authSlice.reducer;
