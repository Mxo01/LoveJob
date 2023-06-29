import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './Components/login-page/login-page.component';
import { HomePageComponent } from './Components/home-page/home-page.component';
import { SearchPageComponent } from './Components/search-page/search-page.component';
import { FeedbackPageComponent } from './Components/feedback-page/feedback-page.component';
import { AuthGuard } from './Guards/auth.guard';
import { AdminGuard } from './Guards/admin.guard';
import { ResetPasswordComponent } from './Components/reset-password/reset-password.component';

const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'forgotpassword', component: LoginPageComponent },
  { path: 'resetpassword', component: ResetPasswordComponent },
  { path: 'signup', component: LoginPageComponent },
  { path: 'search', component: SearchPageComponent, canActivate: [AuthGuard] },
  { path: 'feedbacks', component: FeedbackPageComponent, canActivate: [AdminGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
