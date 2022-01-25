import { Injectable, Injector } from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class InterceptorsService implements HttpInterceptor {


  constructor(private injector: Injector) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): any {

    let authService = this.injector.get(AuthService);
    let tokenizedReq = request.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.getToken()}`
      }
    })

    return next.handle(tokenizedReq);
  }
}
