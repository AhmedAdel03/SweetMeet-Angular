import { Component, inject, OnInit, signal } from '@angular/core';
import { MessageService } from '../../Core/service/message-service';
import { PaginationResult } from '../../types/Pagination';
import { Message } from '../../types/Message';
import { Paginator } from "../../Shared/paginator/paginator";
import { DatePipe } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-messages',
  imports: [Paginator, DatePipe, RouterLink],
  templateUrl: './messages.html',
  styleUrl: './messages.css'
})
export class Messages implements OnInit {

private MessageService=inject(MessageService);
protected container="Inbox";
protected pageNumber=1;
protected pagesize=10;
protected PaginatedMessages=signal<PaginationResult<Message> |null>(null);
tabs=[
  {label:"Inbox",value:"Inbox"},
  {label:"Outbox",value:"Outbox"}
]
ngOnInit(): void {
 this.loadMessages();
}
loadMessages()
{
  this.MessageService.GetMessages(this.container,this.pageNumber,this.pagesize).subscribe({
next:Response=>this.PaginatedMessages.set(Response)
  })
  
}
get IsInbox()
{
  return this.container=="Inbox";
}
setContainer(container:string)
{
  this.container=container;
  this.loadMessages();

}
onPageChange(event:{pageNumber:number,pagesize:number})
  {
    this.pageNumber=event.pageNumber;
    this.pagesize=event.pagesize;
    this.loadMessages();
  }
  DeleteMessage(event:Event,id:string)
  {
    event.stopPropagation();
    this.MessageService.DeleteMessage(id).subscribe({
      next:()=>{
        const CurrentMessages=this.PaginatedMessages();
        if(CurrentMessages?.items)
        {
          this.PaginatedMessages.update(prev => {
            if(!prev)return null;
            const newItems=prev?.items.filter(x=>x.id!==id)||[]
            return {
              items:newItems,
              paginatedMetaData:prev?.paginatedMetaData
            }
          })
        }

      }
    })
  }
}
