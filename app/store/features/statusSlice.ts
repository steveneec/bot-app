import { createSlice } from "@reduxjs/toolkit";
import { faces } from "../../resources";

export const statusSlice = createSlice({
  name: "status",
  initialState: {
    speechResult: "",
    isListening: false,
    isBusy: false,
    expression: faces.sleep,
    expressionPosition: "first",
    intent: null,
  },
  reducers: {
    setSpeechResult: (state, action) => {
      state.speechResult = action.payload;
    },
    setIsListening: (state, action) => {
      state.isListening = action.payload;
    },
    setIsBusy: (state, action) => {
      state.isBusy = action.payload;
    },
    setExpression: (state, action) => {
      state.expression = action.payload;
    },
    setIntent: (state, action) => {
      state.intent = action.payload;
    },
    setExpressionPosition: (state, action) => {
      state.expressionPosition = action.payload;
    },
  },
});

export const {
  setSpeechResult,
  setIsListening,
  setIsBusy,
  setExpression,
  setIntent,
  setExpressionPosition,
} = statusSlice.actions;
export const selectSpeechResult = (state: any) => state.status.speechResult;
export const selectIsListening = (state: any) => state.status.isListening;
export const selectIsBusy = (state: any) => state.status.isBusy;
export const selectExpression = (state: any) => state.status.expression;
export const selectIntent = (state: any) => state.status.intent;
export const selectExpressionPosition = (state: any) =>
  state.status.expressionPosition;
export default statusSlice.reducer;
