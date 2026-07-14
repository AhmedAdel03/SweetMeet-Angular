import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
 import { EditableMember, Member, Photo } from '../../types/Member';
import { tap } from 'rxjs';
import { PaginationResult } from '../../types/Pagination';
import { MemberParams } from '../../types/Member';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  member = signal<Member | null>(null);
  private baseUrl =environment.Apiurl;
  editmode = signal(false);


  fetchMembers(MemberParams: MemberParams) {
    let params = new HttpParams()
    params = params.append("PageNumber", MemberParams.PageNumber);
    params = params.append("PageSize", MemberParams.pageSize);
    params = params.append("maxAge", MemberParams.maxAge);
    params = params.append("minAge", MemberParams.minAge);
    params = params.append("OrderBy", MemberParams.OrderBy);

    if (MemberParams.Gender != null) {
      params = params.append("Gender", MemberParams.Gender);
    }
    return this.http.get<PaginationResult<Member>>(this.baseUrl + 'Member', { params: params }).pipe(
      tap(()=>{
        localStorage.setItem('Filters',JSON.stringify(MemberParams));
      })
    )
  }

  // Use Auth
  getMember(id: string) {
    return this.http.get<Member>(this.baseUrl + 'Member/' + id).pipe(
      tap(member => {
        this.member.set(member);
      })
    )
  }
  getPhoto(id: string) {
    return this.http.get<Photo[]>(this.baseUrl + 'Member/' + id + '/photo')
  }
  UpdateMember(member: EditableMember) {
    return this.http.patch(this.baseUrl + 'Member', member);


  }
  UploadPhoto(file: File) {

    const formData = new FormData()
    formData.append('file', file);
    return this.http.post<Photo>(this.baseUrl + "Member/UploadPhoto", formData);

  }
  setMainPhoto(photo: Photo) {
    return this.http.put(this.baseUrl + "Member/set-main-photo/" + photo.photoId, {});
  }
  DeletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + "Member/DeletePhoto/ " + photoId);
  }

}
