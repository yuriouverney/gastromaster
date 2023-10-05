import { Routes } from '@angular/router';
import { AppIndexComponent } from './index/index.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: AppIndexComponent,
    data: {
      title: 'Início',
    },
  },
];
