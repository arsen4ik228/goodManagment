import { configureStore } from '@reduxjs/toolkit';
import { policyApi } from './policyApi';
import { goalApi } from './goalApi';
import {postApi} from "./postApi";
import {strategyApi} from "./strategyApi";
import {speedGoalApi} from "./speedGoalApi";

export const store = configureStore({
    reducer: {
        [policyApi.reducerPath]: policyApi.reducer,
        [goalApi.reducerPath]: goalApi.reducer,
        [strategyApi.reducerPath]: strategyApi.reducer,
        [postApi.reducerPath]: postApi.reducer,
        [speedGoalApi.reducerPath]: speedGoalApi.reducer,
    },
    middleware: (getDefaultMiddlware) => getDefaultMiddlware().concat(policyApi.middleware).concat(goalApi.middleware).concat(strategyApi.middleware).concat(postApi.middleware).concat(speedGoalApi.middleware)
});
export default store;