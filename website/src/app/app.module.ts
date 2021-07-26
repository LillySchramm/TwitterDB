import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms';
import { NgxEchartsModule } from 'ngx-echarts';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SearchbarComponent } from './components/header/searchbar/searchbar.component';
import { MainComponent } from './components/main/main.component';
import { MainBannerComponent } from './components/main/main-banner/main-banner.component';
import { MainTopTableComponent } from './components/main/main-top-table/main-top-table.component';
import { MainTopTopTableButtonComponent } from './components/main/main-top-top-table-button/main-top-top-table-button.component';
import { DetailsComponent } from './components/details/details.component';
import { QAComponent } from './components/qa/qa.component';
import { ContactComponent } from './components/contact/contact.component';
import { ApiSiteComponent } from './components/api-site/api-site.component';
import { FaqSiteComponent } from './components/faq-site/faq-site.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchbarComponent,
    MainComponent,
    MainBannerComponent,
    MainTopTableComponent,
    MainTopTopTableButtonComponent,
    DetailsComponent,
    QAComponent,
    ContactComponent,
    ApiSiteComponent,
    FaqSiteComponent
  ],
  imports: [
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})


export class AppModule { }
