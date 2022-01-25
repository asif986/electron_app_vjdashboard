import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { LoginComponent } from './auth/login/login.component';
import { MomentModule } from 'ngx-moment';
import { antModule } from '../app/common/module/ant.module';
import { SpinnerComponent } from './common/spinner/spinner.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DashboardModule } from './pages/dashboard/dashboard.module';
import { InterceptorsService } from './shared/authentication/interceptors.service';
import { ViewrequestsComponent } from './pages/viewrequests/viewrequests.component';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AppInitializerProvider } from './app-initializer.service';


registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SpinnerComponent,
    ViewrequestsComponent
    
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IconsProviderModule,
    DashboardModule,
    NzLayoutModule,
    NzMenuModule,
    antModule,
    NgxSpinnerModule,
    MomentModule,

  ],
  providers: [AppInitializerProvider, { provide: NZ_I18N, useValue: en_US }, {
    provide: HTTP_INTERCEPTORS,
    useClass: InterceptorsService,
    multi: true

  },
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
