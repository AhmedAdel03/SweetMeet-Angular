import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PaginationResult } from '../../types/Pagination';
import { Message } from '../../types/Message';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
 private baseUrl=environment.Apiurl;
 private http=inject(HttpClient);
 GetMessages(container:string,pageNumber:number,pagesize:number)  
 {
  let params=new HttpParams();
  params=params.append("container",container);
  params=params.append("pageNumber",pageNumber);
  params=params.append("pagesize",pagesize);
 return this.http.get<PaginationResult<Message>>(this.baseUrl+"Message",{params});
 }
GetMessageThread(memberId:string)
{
return this.http.get<Message[]>(this.baseUrl+"Message/Thread/"+memberId);

}
SendMessage(RecipientId:string,Content:string)
{
 return this.http.post<Message>(this.baseUrl+'Message',{RecipientId,Content});
}
DeleteMessage(Id:string)
{
   return this.http.delete(this.baseUrl+'Message/'+Id);
}


}
