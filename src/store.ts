import {
  Action,
  configureStore,
  ThunkAction,
  AnyAction,
} from '@reduxjs/toolkit'

import tabSlice from './slices/tabSlice'
import persistedTravelInfoReducer from './slices/travelInfoSlice'
import persistedTravelChatReducer from './slices/travelChatSlice'
import persistedQueryInputReducer from './slices/queryInputSlice'
import persistedRecommendInfoReducer from './slices/recommendSlice'
import persistedCityDetailReducer from './slices/cityDetailSlice'
import persistedImageQueryReducer from './slices/imageQuerySlice'

export const store = configureStore({
  reducer: {
    tab: tabSlice,
    cityDetail: persistedCityDetailReducer,
    travelInfo: persistedTravelInfoReducer,
    travelChat: persistedTravelChatReducer,
    queryInput: persistedQueryInputReducer,
    imageQuery: persistedImageQueryReducer,
    recommendInfo: persistedRecommendInfoReducer,
  },
  // middleware: (getDefaultMiddleware) =>
  // getDefaultMiddleware().concat(thunk),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch

// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   RootState,
//   unknown,
//   Action<string>
// >

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>
