import { createSlice } from '@reduxjs/toolkit';

// Load persisted auth state from localStorage on app start
const savedToken = localStorage.getItem('auth_token');
const savedUser = (() => {
  try {
    const u = localStorage.getItem('auth_user');
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
})();

const initialState = {
  user: savedUser,
  token: savedToken,
  isAuthenticated: !!(savedToken && savedUser),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, access_token } = action.payload;
      state.user = user;
      state.token = access_token;
      state.isAuthenticated = true;
      // Persist to localStorage so session survives page refresh
      localStorage.setItem('auth_token', access_token);
      localStorage.setItem('auth_user', JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('auth_user', JSON.stringify(state.user));
    },
  },
});

export const { login, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;
