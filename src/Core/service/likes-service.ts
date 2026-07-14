import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Member } from '../../types/Member';
 
@Injectable({
  providedIn: 'root'
})
export class LikesService {
  private baseUrl=environment.Apiurl;
  private http=inject(HttpClient);
  LikesIds=signal<string[]>([]);

  toggleLike(TargetMemberId:string)
  {
   return this.http.post(`${this.baseUrl}likes/${TargetMemberId}`,{});
  }
  getLikes(predicate:string)
  {
    return this.http.get<Member[]>(`${this.baseUrl}likes?predicate=${predicate}`);
  }
  getLikesIds(){
    return this.http.get<string[]>(this.baseUrl+'likes/list').subscribe({
      next:ids=>this.LikesIds.set(ids)
    })
  }
  clearLikesIds()
  {
    this.LikesIds.set([]);
  }
}
