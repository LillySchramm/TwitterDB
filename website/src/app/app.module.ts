import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SearchbarComponent } from './components/header/searchbar/searchbar.component';
import { MainComponent } from './components/main/main.component';
import { MainBannerComponent } from './components/main/main-banner/main-banner.component';
import { MainTopTableComponent } from './components/main/main-top-table/main-top-table.component';
import { MainTopTopTableButtonComponent } from './components/main/main-top-top-table-button/main-top-top-table-button.component';
import { DetailsComponent } from './components/details/details.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchbarComponent,
    MainComponent,
    MainBannerComponent,
    MainTopTableComponent,
    MainTopTopTableButtonComponent,
    DetailsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
