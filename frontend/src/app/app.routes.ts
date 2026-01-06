import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { Landing } from './landing/landing';

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
    }
];
