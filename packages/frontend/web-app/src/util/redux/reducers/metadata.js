import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { combineReducers, createStore } from 'redux';

import { APIS, client } from '@ku-loan-app/libs-api-client';

const initialState = {
  token: localStorage.getItem('jwt'),
  user: localStorage.getItem('user'),
};

export const requestLogin = createAsyncThunk(
  'metadata/requestLogin',
  async ({ email, password }, thunkAPI) =>
    client.login({ email, password }).catch(error => thunkAPI.rejectWithValue(error))
);

const metadataSlice = createSlice({
  name: 'metadata',
  initialState,
  reducers: {
    signout: (state, action) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
    },
  },
  extraReducers: {
    [requestLogin.fulfilled.type]: (state, action) => {
      const {
        payload: {
          token,
          user: { _id: id },
        },
      } = action;
      state.token = token;
      localStorage.setItem('jwt', token);
      state.user = id;
      localStorage.setItem('user', id);
    },
    [requestLogin.rejected.type]: (state, action) => {
      console.error(action.payload);
      state.token = null;
      state.user = null;
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
    },
  },
});

export const { signout } = metadataSlice.actions;

export default metadataSlice.reducer;
