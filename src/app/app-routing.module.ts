import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnauthorizedComponent } from './shared/components/unauthorized/unauthorized.component';
import { UnmatchedPathComponent } from './shared/components/unmatched-path/unmatched-path.component';
import { LogComponent } from './shared/components/log/log.component';
import { AuthGuard } from './v2/core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadChildren: () =>
      import('src/app/login/login.module').then(
        (m) => m.LoginPageModule
      ),
  },
  {
    path: 'contact-us',
    loadChildren: () =>
      import('src/app/contact-us/contact-us.module').then(
        (m) => m.ContactUsPageModule
      ),
  },
  {
    path: 'data-admin',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('src/app/data-admin/data-admin.module').then(
        (m) => m.DataAdminPageModule
      ),
  },
  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'logs', component: LogComponent },
  {
    path: 'location',
    loadChildren: () =>
      import('src/app/location/location.module').then(
        (m) => m.LocationModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
