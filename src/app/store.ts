import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/userSlice.ts';
import chatsReducer from "../features/chats/chatsSlice.ts";

export const store = configureStore({
  reducer: {
    user: userReducer,
    chats: chatsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
