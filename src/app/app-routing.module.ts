import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticationPageComponent } from './pages/authentication/authentication.page';
import { ConversationsPageComponent } from './pages/conversations/conversations.page';
import { IsAuthenticatedGuardService } from './services/auth/is-authenticated-guard.service';
import { ConversationPageComponent } from './pages/conversation/conversation.page';

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
    canActivate: [IsAuthenticatedGuardService],
    children: [
      {
        path: '',
        component: ConversationsPageComponent
      },
      {
        path: ':uid',
        component: ConversationPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(ROUTES)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
