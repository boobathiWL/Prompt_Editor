import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./userSlice"; // Import your user slice

// Create a persist config
const persistConfig = {
  key: "root", // Key for storing the persisted state in local storage
  storage, // Specify the storage engine
};

// Create a persisted reducer
const persistedUserReducer = persistReducer(persistConfig, userReducer);

// Create the Redux store with the persisted reducer
export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
  },
});

// Create a persistor to manage the persistence
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
