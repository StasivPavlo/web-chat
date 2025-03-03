import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chat } from "../../types/chat.ts";

interface State {
  chats: Chat[];
}

const initialState: State = {
  chats: [],
}

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    add: (state, action: PayloadAction<Chat | Chat[]>) => {
      if (Array.isArray(action.payload)) {
        state.chats = [...state.chats, ...action.payload];
      } else {
        state.chats.push(action.payload);
      }
    },
    remove: (state, action: PayloadAction<number>) => {
      state.chats = state.chats.filter(chat => chat.id !== action.payload);
    },
    addMessage: (state, action: PayloadAction<{ userId: number, chatId: number, message: string, time?: string }>) => {
      state.chats = state.chats.map((chat: Chat) => {
        if (chat.id === action.payload.chatId) {
          return { ...chat, messages: [...chat.messages, { userId: action.payload.userId, message: action.payload.message, time: action.payload.time || new Date().toISOString() }] };
        }

        return chat;
      });
    }
  },
});

export const { add, remove, addMessage } = chatsSlice.actions;
export default chatsSlice.reducer;
