import { configureStore } from '@reduxjs/toolkit';
import { combineReducers, createStore } from 'redux';

import metadataReducer from './reducers/metadata';

const store = configureStore({
  reducer: {
      metadata: metadataReducer
  }
});

export default store;
