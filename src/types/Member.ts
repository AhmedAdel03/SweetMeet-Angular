export type Member={
  id: string
  dateOfBirth: string
  imageUrl?: string
  displayName: string
  createdAt: string
  lastActive: string
  gender: string
  description?: string
  city: string
  country: string
  
}
export type Photo ={
  photoId: number
  photoUrl: string
  photoPublicId: string
  memberid: string
}
export  type EditableMember =
{
    displayname: string
   description?: string
  city: string
  country: string
}
export class MemberParams 
{
    Gender?:string;
    minAge=18;
    maxAge=100;
    PageNumber=1;
    pageSize=10;
    OrderBy="lastActive"
    
}