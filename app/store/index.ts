import { configureStore } from "@reduxjs/toolkit";
import statusSlice from "./features/statusSlice";

export default configureStore({
  reducer: {
    status: statusSlice,
  },
});
