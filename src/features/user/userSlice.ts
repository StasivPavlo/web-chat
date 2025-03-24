import { User } from '@custom-types/user';
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface State {
  user: User | null
}

const initialState: State = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<User>) => {
      state.user =  action.payload;
    },
    remove: (state) => {
      state.user = null;
    },
  },
});

export const { add, remove } = userSlice.actions;
export default userSlice.reducer;
