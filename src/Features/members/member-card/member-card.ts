import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../../types/Member';
import { RouterLink } from "@angular/router";
import { AgePipe } from "../../../Core/pipes/age-pipe";
import { LikesService } from '../../../Core/service/likes-service';

@Component({
  selector: 'app-member-card',
  imports: [RouterLink, AgePipe],
  templateUrl: './member-card.html',
  styleUrl: './member-card.css'
})
export class MemberCard {
  private LikesService=inject(LikesService)
  public member=input.required<Member>();
  protected hasLiked=computed(()=>this.LikesService.LikesIds().includes(this.member().id));
 
  toggleLike(event:Event) {
    event.stopPropagation();
    this.LikesService.toggleLike(this.member().id).subscribe({
      next:()=> {
        if(this.hasLiked())
        {
          this.LikesService.LikesIds.update(ids=>ids.filter(x=>x !== this.member().id))
        }else {
          this.LikesService.LikesIds.update(ids=>[...ids,this.member().id])
        }
      }
    })
  }

}
