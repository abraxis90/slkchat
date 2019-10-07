import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticationPageComponent } from './pages/authentication/authentication.page';
import { ConversationsPageComponent } from './pages/conversations/conversations.page';
import { IsAuthenticatedGuardService } from './services/auth/is-authenticated-guard.service';

const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'conversations',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: AuthenticationPageComponent
  },
  {
    path: 'conversations',
    component: ConversationsPageComponent,
    canActivate: [IsAuthenticatedGuardService]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
