import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

   

  constructor( public authService:AuthService,public router:Router){


    // console.log('Form auth Guard');
    // this.router.events.pipe(take(1)).subscribe(res=>console.log(res));

   // this.authService.loggedIn() ==true ?this.router.navigate(['/dashboard']):this.router.navigate(['/login']);

  }

canActivate():boolean{

  if(this.authService.loggedIn())
  {
    return true;
  }
  else{
    this.router.navigate(['/login']);
  }
}
}
