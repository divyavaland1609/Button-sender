// create Store

import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import nodesReducer from "./nodesSlice";

const persistConfig = {
  key: "nodes",
  storage,
};

const persistedReducer = persistReducer(persistConfig, nodesReducer);

export const store = configureStore({
  reducer:{
    nodes: persistedReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
