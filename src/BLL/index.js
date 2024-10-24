import { configureStore } from '@reduxjs/toolkit';
import { policyApi } from './policyApi';
import { policyDirectoriesApi } from './policyDirectoriesApi';
import { goalApi } from './goalApi';
import {postApi} from "./postApi";
import {strategyApi} from "./strategyApi";
import {speedGoalApi} from "./speedGoalApi";
import { projectApi } from './projectApi';

export const store = configureStore({
    reducer: {
        [policyApi.reducerPath]: policyApi.reducer,
        [goalApi.reducerPath]: goalApi.reducer,
        [strategyApi.reducerPath]: strategyApi.reducer,
        [postApi.reducerPath]: postApi.reducer,
        [speedGoalApi.reducerPath]: speedGoalApi.reducer,
        [policyDirectoriesApi.reducerPath]: policyDirectoriesApi.reducer,
        [projectApi.reducerPath]: projectApi.reducer,
    },
    middleware: (getDefaultMiddlware) => getDefaultMiddlware().concat(policyApi.middleware).concat(goalApi.middleware).concat(strategyApi.middleware).concat(postApi.middleware).concat(speedGoalApi.middleware).concat(policyDirectoriesApi.middleware).concat(projectApi.middleware)
});
export default store;