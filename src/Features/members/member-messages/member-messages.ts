import { Component, effect, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MessageService } from '../../../Core/service/message-service';
import { MemberService } from '../../../Core/service/member-service';
import { Message } from '../../../types/Message';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-member-messages',
  imports: [DatePipe,FormsModule],
  templateUrl: './member-messages.html',
  styleUrl: './member-messages.css'
})
export class MemberMessages implements OnInit {
 @ViewChild('messageEndRef')messageEndRef!:ElementRef
  private MessageService=inject(MessageService);
  private MemberService=inject(MemberService);
  protected messages=signal<Message[]>([]);
  protected MessageContent='';
 
constructor() {
  effect(()=>{
 const CurrentMessage=this.messages();
  if(CurrentMessage.length > 0 ){
    this.ScrollToBottom();
  }
  }) 
}
 ngOnInit(): void {
    this.loadMessageThread();
    
  }

  loadMessageThread()
  {
const memberId=this.MemberService.member()?.id;
if(memberId)
  {
    this.MessageService.GetMessageThread(memberId).subscribe({
      next:response=>this.messages.set(response.map(messages=>({
        ...messages,
        CurrentUserSender:messages.senderId!==memberId
      }))),
      complete:()=>this.ScrollToBottom()
    })
  }    
  }
  SendMessage()
  {
    const RecipientId=this.MemberService.member()?.id;
    if(!RecipientId) return;
    this.MessageService.SendMessage(RecipientId,this.MessageContent).subscribe({
next:message=>{
  this.messages.update(messages=>{
message.CurrentUserSender=true;
return[...messages,message]
  })
  this.MessageContent='';
}

    })

  }
  ScrollToBottom()
  {
    setTimeout(() => {
      if(this.messageEndRef){
      this.messageEndRef.nativeElement.scrollIntoView({
        behavior:'smooth'
      })
    }
    });
    
  }

}
