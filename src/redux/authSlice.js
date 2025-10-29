import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    username: localStorage.getItem('username') || null,
    userId: localStorage.getItem('userId') || null,
    role: localStorage.getItem('role') || null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess: (state, action) => {
            const { accessToken, refreshToken, username, role, userId } = action.payload;

            state.accessToken = accessToken;
            state.refreshToken = refreshToken;
            state.username = username;
            state.userId = userId;
            state.role = role;
            state.isAuthenticated = true;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('username', username);
            localStorage.setItem('userId', userId);
            localStorage.setItem('role', role);
        },
        logout: (state) => {
            state.accessToken = null;
            state.refreshToken = null;
            state.username = null;
            state.userId = null;
            state.role = null;
            state.isAuthenticated = false;

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('username');
            localStorage.removeItem('userId');
            localStorage.removeItem('role');
        },
    },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;