import {
  Action,
  configureStore,
  ThunkAction,
  AnyAction,
} from '@reduxjs/toolkit'

import counterReducer from './slices/counterSlice'
import travelInfoReducer from './slices/travelInfoSlice'
import travelChatReducer from './slices/travelChatSlice'
import questionnaireReducer from './slices/questionnaireSlice'
import queryInputSlice from './slices/queryInputSlice'
import attractionQuerySlice from './slices/imageQuerySlice'
import persistedCounterReducer from './slices/counterSlice'
import persistedAttractionQuerySlice from './slices/imageQuerySlice'
import persistedTravelInfoReducer from './slices/travelInfoSlice'
import persistedTravelChatReducer from './slices/travelChatSlice'
import persistedQuestionnaireReducer from './slices/questionnaireSlice'
import persistedQueryInputReducer from './slices/queryInputSlice'
import persistedAttractionQueryReducer from './slices/imageQuerySlice'

export const store = configureStore({
  reducer: {
    counter: persistedCounterReducer,
    travelInfo: persistedTravelInfoReducer,
    travelChat: persistedTravelChatReducer,
    questionnaire: persistedQuestionnaireReducer,
    queryInput: persistedQueryInputReducer,
    attractionQuery: persistedAttractionQueryReducer,
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
