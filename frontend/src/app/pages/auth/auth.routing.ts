import { Routes } from '@angular/router';

import { AppSideLoginComponent } from './login/login.component';
import { AppSideRegisterComponent } from './register/register.component';
import { PostLoginComponent } from './post-login/post-login.component';

export const AuthRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: AppSideLoginComponent,
      },
      {
        path: 'registrar',
        component: AppSideRegisterComponent,
      },
      {
        path: 'postlogin',
        component: PostLoginComponent,
      },
    ],
  },
];
