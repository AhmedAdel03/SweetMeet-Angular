import { Component, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../Core/service/member-service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Member, Photo } from '../../../types/Member';
import { AsyncPipe } from '@angular/common';
import { ImageUpload } from "../../../Shared/image-upload/image-upload";
import { ServiceAccount } from '../../../Core/service/service-account';
 



@Component({
  selector: 'app-member-photo',
  imports: [  ImageUpload ],
  templateUrl: './member-photo.html',
  styleUrl: './member-photo.css'
})
export class MemberPhoto implements OnInit {
  protected memberservice=inject(MemberService);
  protected account=inject(ServiceAccount);
  private route=inject(ActivatedRoute);
protected photos=signal<Photo[]>([]);
 
 
  ngOnInit(): void {
     const memberId=this.route.parent?.snapshot.paramMap.get('id');
   if(memberId)
   {
    this.memberservice.getPhoto(memberId).subscribe({
      next:photos=>this.photos.set(photos)

    });
   }


  }
 onUploadImg(file:File)
 {
  this.memberservice.UploadPhoto(file).subscribe({
    next:newPhoto=>{
      this.memberservice.editmode.set(false);
       this.photos.update(photos => [...photos, newPhoto]);
          

    },
    error:error=>{
      console.log("error")
         
    }
  })

 }
 setMainPhoto(photo:Photo)
 {
  this.memberservice.setMainPhoto(photo).subscribe({
    next:()=>{
      const user=this.account.CurrentUser();
      if(user)
      {
         user.imageURl=photo.photoUrl;
         localStorage.setItem('user',JSON.stringify(user))
      }
      this.memberservice.member.update(member=>({
        ...member,imageUrl:photo.photoUrl
      }) as Member);

    }
  })

 }
 DeletePhoto(photoId:number)
 {
  this.memberservice.DeletePhoto(photoId).subscribe({
    next:()=>{
      this.photos.update(photos=>photos.filter(x=>x.photoId!=photoId));
    }
  });


 }

 

}
