import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthenticationPageComponent } from './pages/authentication/authentication.page';
import { ConversationsPageComponent } from './pages/conversations/conversations.page';
import { ConversationPageComponent } from './pages/conversation/conversation.page';
import { AngularFireAuthGuard, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['conversations']);

const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'conversations',
    pathMatch: 'full'
  },
  {
    path: 'login',
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToItems },
    component: AuthenticationPageComponent
  },
  {
    path: 'conversations',
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin },
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
