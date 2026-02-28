import { HttpClient    } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { EditableMember, Member, Photo } from '../../types/Member';
import { tap } from 'rxjs';
  
@Injectable({
  providedIn: 'root'
})
export class MemberService { 
  private http=inject(HttpClient);
    member=signal<Member| null>(null);
   private baseUrl=environment.url;
   editmode=signal(false);


  fetchMembers() {
  return this.http.get<Member[]>(this.baseUrl + 'Member' );
}

// Use Auth
getMember(id: string) {
  return this.http.get<Member>(this.baseUrl + 'Member/' + id ).pipe(
    tap(member=>{
      this.member.set(member);
    })
  )
}
getPhoto(id:string)
{
  return this.http.get<Photo[]>(this.baseUrl+'Member/' + id+ '/photo' )
}
UpdateMember(member:EditableMember)
{
  return this.http.patch(this.baseUrl+'Member',member);


}
  UploadPhoto(file:File)
  {
    
    const formData=new FormData()
    formData.append('file',file);
   return this.http.post<Photo>(this.baseUrl+"Member/UploadPhoto",formData);
  
  }
  setMainPhoto(photo:Photo) 
  {
    return this.http.put(this.baseUrl+"Member/set-main-photo/"+photo.photoId,{});
  }
  DeletePhoto(photoId:number)
  {
   return this.http.delete(this.baseUrl+"Member/DeletePhoto/ "+ photoId);
  }
  
}
