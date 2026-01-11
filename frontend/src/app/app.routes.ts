import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { Landing } from './landing/landing';
import { ViewRisk } from './view-risk/view-risk';
import { ViewUser } from './view-user/view-user';
import { Risks } from './risks/risks';
import { Users } from './users/users';

export const routes: Routes = [
    {
        path:"", component:Landing,title:"Home"
    },
    {
        path:"home", component:Home,title:"Home"
    },
    {
        path:"login", component:Login,title:"Welcome Back!"
    },
    {
        path:"register", component:Register,title:"Register"
    },
    {
        path:"get/:id/risk", component:ViewRisk,title:"Risk Details"
    },
    {
        path:"get/:id/user", component:ViewUser,title:"User Details"
    },
    {
        path:"risks", component:Risks,title:"All Risks"
    },
    {
        path:"users", component:Users,title:"All Users"
    }
];
