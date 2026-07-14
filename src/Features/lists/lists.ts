import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../Core/service/likes-service';
import { Member } from '../../types/Member';
import { MemberCard } from "../members/member-card/member-card";

@Component({
  selector: 'app-lists',
  imports: [MemberCard],
  templateUrl: './lists.html',
  styleUrl: './lists.css'
})
export class Lists implements OnInit {

private LikesService=inject(LikesService);
protected Members=signal<Member[]>([]);
protected predicate="Liked";
tabs=[
  {label:"Liked",value:"Liked"},
 {label:"Liked me",value:"LikedBy"},
  {label:"mutual",value:"mutual"},

]

ngOnInit(): void {
   this.LoadLikes();
}
SetPredicate(predicate:string)
{
  if(this.predicate!==predicate)
  {
    this.predicate=predicate;
    this.LoadLikes();
  }

}
LoadLikes()
{
  this.LikesService.getLikes(this.predicate).subscribe({
    next:members =>{
      this.Members.set(members)
    }
  })
}
}
