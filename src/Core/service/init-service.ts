import { inject, Injectable } from '@angular/core';
import { ServiceAccount } from './service-account';
import { of } from 'rxjs';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root'
})
export class InitService {
protected accountservice=inject(ServiceAccount)
private LikesService=inject(LikesService);
  init()
  {
    const UserString=localStorage.getItem('user');
      if(!UserString) return of(null);
      const user=JSON.parse(UserString);
      this.accountservice.CurrentUser.set(user);
      this.LikesService.getLikesIds();
      return of(null)

  }
  
}
