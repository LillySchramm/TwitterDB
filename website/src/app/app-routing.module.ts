import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DetailsComponent } from './components/details/details.component';
import { ContactComponent } from './components/contact/contact.component';
import { ApiSiteComponent } from './components/api-site/api-site.component';
import { MainComponent } from './components/main/main.component'

const routes: Routes = [
  {path: '', component:MainComponent},
  {path: 'details/:type/:name', component:DetailsComponent},
  {path: 'contact', component:ContactComponent},
  {path: 'api', component:ApiSiteComponent},
  {path: '**', redirectTo:''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
