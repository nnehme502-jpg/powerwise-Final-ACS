import { createSlice } from "@reduxjs/toolkit";

const energySlice = createSlice({
  name: "energy",
  initialState: { total: 0 },
  reducers: {
    setEnergy: (state, action) => {
      state.total = action.payload;
    }
  }
});

export const { setEnergy } = energySlice.actions;
export default energySlice.reducer;