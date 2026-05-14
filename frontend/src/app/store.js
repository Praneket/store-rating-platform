import { configureStore, createSlice } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

// Default = light. Only dark if explicitly saved.
const savedTheme = localStorage.getItem('theme');
const isDark = savedTheme === 'dark';

// Apply on load
document.documentElement.classList.toggle('dark', isDark);

const themeSlice = createSlice({
  name: 'theme',
  initialState: { dark: isDark },
  reducers: {
    toggleTheme: (state) => {
      state.dark = !state.dark;
      localStorage.setItem('theme', state.dark ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', state.dark);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;

const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeSlice.reducer,
  },
});

export default store;
