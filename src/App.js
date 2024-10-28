import './App.css';
import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import Main from './UI/Main/Main.jsx'
import Chat from './UI/Chat/Chat.jsx'
import Policy from './UI/Policy/Policy.jsx'
import Posts from './UI/Posts/Posts'
import NewPosts from "./UI/Posts/NewPosts";
import Strategy from "./UI/Strategy/Strategy";
import NewStrategy from "./UI/Strategy/NewStrategy";
import NewPolicy from "./UI/Policy/NewPolicy";
import Goal from "./UI/Goal/Goal";
import CreateGoal from "./UI/Goal/CreateGoal";
import Objective from "./UI/Objective/Objective.jsx"
import NewObjective from "./UI/Objective/NewObjective";
import CreatePolicyDirectory from './UI/Policy/PolicyDirectory/CreatePolicyDirectory.jsx';
import Projects from './UI/Projects/Projects.jsx';
import MainProject from './UI/Projects/MainProject/MainProject.jsx';
import Target from './UI/Projects/Targets/Target.jsx';
import NewProject from './UI/Projects/NewProject/NewProject.jsx';

function App() {
    return (
        <>
            <Routes>
                <Route path={'/'} element={<Navigate replace to="Main"/>}></Route>
                <Route path="/*"
                       element={
                           <Routes>

                               <Route path="Main" element={<Main/>}/>

                               <Route path=":userId/Chat" element={<Chat/>}/>

                               <Route path=":userId/Policy" element={<Policy/>}/>
                               <Route path=":userId/Policy/new" element={<NewPolicy/>}/>
                               <Route path=":userId/Policy/CreateDirectory" element={<CreatePolicyDirectory/>}/>

                               <Route path=":userId/Posts" element={<Posts/>}/>
                               <Route path=":userId/Posts/new" element={<NewPosts/>}/>

                               <Route path=":userId/Strategy" element={<Strategy/>}/>
                               <Route path=":userId/Strategy/new" element={<NewStrategy/>}/>

                               <Route path=":userId/Goal" element={<Goal/>}/>
                               <Route path=":userId/Goal/new" element={<CreateGoal/>}/>

                               <Route path=":userId/Objective" element={<Objective/>}/>
                               <Route path=":userId/Objective/new" element={<NewObjective/>}/>

                               <Route path=":userId/Projects" element={<MainProject/>}/>
                               <Route path=":userId/Projects/:projectId" element={<Projects/>}/>
                               <Route path=":userId/Projects/Target" element={<Target/>}/>
                               <Route path=":userId/Projects/new" element={<NewProject/>}/>

                           </Routes>
                       }>
                </Route>
            </Routes>
        </>
    );
}

export default App;
