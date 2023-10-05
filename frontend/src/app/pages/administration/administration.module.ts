import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutes } from './administration-routing.module';
import { TokenService } from 'src/app/services/auth/tokens.service';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule.forChild(AdministrationRoutes)],
  providers: [TokenService],
  declarations: [],
})
export class AdministrationModule {}
