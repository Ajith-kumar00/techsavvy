// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

import auth from './login/reducer'
import dashboard from './dashboard/reducer'
export const store = configureStore({
  reducer: {
    auth,
    dashboard
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})


