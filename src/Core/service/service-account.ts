import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { LoginCredits, RegisterCredits, User } from '../../types/types';
import { register } from '../../Features/account/register/register';
import { environment } from '../../environments/environment.development';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root'
})
export class ServiceAccount {
  private http=inject(HttpClient);
  private baseUrl=environment.Apiurl;
  private LikesService=inject(LikesService);
   CurrentUser = signal<User | null>(null);
 Register(RegisterCredits:RegisterCredits)
{
 return this.http.post<User>(`${this.baseUrl}Account/Register`,RegisterCredits).pipe(
    tap(user=>{
    if(user)
    {
      localStorage.setItem('user',JSON.stringify(user));
      this.CurrentUser.set(user)
    }
  })
  )
}
   Login(LoginCredits:LoginCredits)
{
   return  this.http.post<User>(`${this.baseUrl}Account/Login`,LoginCredits).pipe(
  tap(user=>{
    if(user)
    {
      this.CurrentUser.set(user)
      localStorage.setItem('user',JSON.stringify(user));
      this.LikesService.getLikesIds();
    }
  })
 )

}
refreshToken() {
  return this.http.post('https://localhost:5001/api/Account/refreshToken', {
    refreshToken: this.getRefreshToken()
  });
}
private getRefreshToken(): string | null {
  const userJson = localStorage.getItem('user');
  if (!userJson) return null;
  const user = JSON.parse(userJson);
  return user.refreshToken ?? null;
}
updateuser(user: any) {
  localStorage.setItem('user', JSON.stringify(user));
  this.CurrentUser.set(user); // Sync the signal!
}

Logout()
{
  localStorage.removeItem('user');
    localStorage.removeItem('Filters');
    this.LikesService.clearLikesIds();
  this.CurrentUser.set(null);
}

  
}
