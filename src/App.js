import './App.css';
import React from 'react';
import { Route, Routes } from "react-router-dom";
// import AuthorizationPage from './UI/Authorization/AuthorizationPage.jsx'
import Main from './UI/Main/Main.jsx'
import Chat from './UI/Chat/Chat.jsx'
import MainPolicy from './UI/Policy/MainPolicy.jsx'
import Policy from './UI/Policy/Policy.jsx'
import NewPolicy from "./UI/Policy/NewPolicy";
import CreatePolicyDirectory from './UI/Policy/PolicyDirectory/CreatePolicyDirectory.jsx';
import EditPolicyDirectories from './UI/Policy/PolicyDirectory/EditPolicyDirectory.jsx';
import MainPost from './UI/Posts/MainPost.jsx'
import Posts from './UI/Posts/Posts'
import NewPosts from "./UI/Posts/NewPosts";
import AttachStatistics from './UI/Posts/AttachStatistics/AttachStatistics.jsx';
import MainStrategy from './UI/Strategy/MainStartegy.jsx';
import Strategy from "./UI/Strategy/Strategy";
import NewStrategy from "./UI/Strategy/NewStrategy";
import Goal from "./UI/Goal/Goal";
import Objective from "./UI/Objective/Objective.jsx"
import NewObjective from "./UI/Objective/NewObjective";
import Projects from './UI/Projects/Projects.jsx';
import MainProject from './UI/Projects/MainProject/MainProject.jsx';
import Target from './UI/Projects/Targets/Target.jsx';
import NewProject from './UI/Projects/NewProject/NewProject.jsx';
import Programs from './UI/Projects/Programs.jsx';
import ProjectArchive from './UI/Projects/Archive/ProjectArchive.jsx';
import MainStatistics from './UI/Statistics/MainStatistics.jsx';
import Statistics from './UI/Statistics/Statistics.jsx';
import NewStatistic from './UI/Statistics/NewStatistic.jsx';

function App() {
    return (
        <>
            <Routes>
                {/* <Route path={'/'} element={<Navigate replace to="Main" />}></Route> */}
                {/* <Route path={'/'} element={<AuthorizationPage/>}></Route> */}
                <Route path="/*"
                    element={
                        <Routes>

                            <Route path="Main" element={<Main />} />

                            <Route path=":userId/Chat" element={<Chat />} />

                            <Route path=":userId/Policy" element={<MainPolicy />} />
                            <Route path=":userId/Policy/:policyId" element={<Policy />} />
                            <Route path=":userId/Policy/new" element={<NewPolicy />} />
                            <Route path=":userId/Policy/CreateDirectory" element={<CreatePolicyDirectory />} />
                            <Route path=":userId/Policy/EditDirectory/:policyDirectoryId" element={<EditPolicyDirectories />} />

                            <Route path=":userId/Posts" element={<MainPost />} />
                            <Route path=":userId/Posts/:postId" element={<Posts />} />
                            <Route path=":userId/Posts/new" element={<NewPosts />} />
                            <Route path=":userId/Posts/:postId/attachStatistics" element={<AttachStatistics />} />

                            <Route path=":userId/Strategy" element={<MainStrategy />} />
                            <Route path=":userId/Strategy/new/:organizationId" element={<NewStrategy />} />
                            <Route path=":userId/Strategy/:strategyId" element={<Strategy />} />

                            <Route path=":userId/Goal" element={<Goal />} />

                            <Route path=":userId/Objective" element={<Objective />} />
                            <Route path=":userId/Objective/new" element={<NewObjective />} />

                            <Route path=":userId/Projects" element={<MainProject />} />
                            <Route path=":userId/Projects/:projectId" element={<Projects />} />
                            <Route path=":userId/Projects/Target" element={<Target />} />
                            <Route path=":userId/Projects/new" element={<NewProject />} />
                            <Route path=":userId/Projects/program/:programId" element={<Programs />} />
                            <Route path=":userId/Projects/archive/:projectId" element={<ProjectArchive />} />

                            <Route path=":userId/Statistics" element={<MainStatistics />} />
                            <Route path=":userId/Statistics/:statisticId" element={<Statistics />} />
                            <Route path=":userId/Statistics/new/:paramPostID?" element={<NewStatistic />} />



                        </Routes>
                    }>
                </Route>
            </Routes>
        </>
    );
}

export default App;
