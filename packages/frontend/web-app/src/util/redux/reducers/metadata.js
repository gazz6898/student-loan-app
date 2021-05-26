import { createSlice } from '@reduxjs/toolkit';
import { combineReducers, createStore } from 'redux';

import { APIS, client } from '@ku-loan-app/libs-api-client';

const metadataSlice = createSlice({
  name: 'metadata',
  initialState: {
    token: null,
  },
  reducers: {
    login: async (state, action) => {
      const {
        payload: { email, password },
      } = action;
      const { token } = await client.login({ email, password });
      state.token = token;
    },
  },
});

export const { login } = metadataSlice.actions;

export default metadataSlice.reducer;
