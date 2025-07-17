import { NgModule, Inject } from '@angular/core';
import { RouterModule, Routes, ActivatedRoute } from '@angular/router';
import { MyrebatesComponent } from './components/myrebates/myrebates.component';
import { RebateComponent } from './components/rebate/rebate.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { AuthGuard } from './helpers/auth.guard';
import { UnauthorizedComponent } from './components/unauthorized/unauthorized.component';
const routes: Routes = [
  //{ path: '', component: MyrebatesComponent },
  { path: 'rebate', component: RebateComponent },
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: 'register',
    component: RegisterPageComponent,
  },
  { path: 'myrebates', component: MyrebatesComponent },
  { path: '', redirectTo: '/myrebates?acct=54321', pathMatch: 'full' }, // Default route
  //{ path: '', redirectTo: '/?acct=54321', pathMatch: 'full' }, // Default route
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: '**', redirectTo: 'unauthorized' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
}
