import { Component, ElementRef, output, ViewChild, viewChild } from '@angular/core';
import { MemberParams } from '../../../types/Member';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-filter-model',
  imports: [FormsModule],
  templateUrl: './filter-model.html',
  styleUrl: './filter-model.css'
})
export class FilterModel {
@ViewChild('filterModal') ModalRef!:ElementRef<HTMLDialogElement>
closeModal=output();
submitData=output<MemberParams>();
memberParams=new MemberParams();
 
constructor() {
    const Filters=localStorage.getItem('Filters');
  if(Filters){
    this.memberParams=JSON.parse(Filters);
  }
  
}
open(){
  this.ModalRef.nativeElement.showModal();
}
close()
{
  this.ModalRef.nativeElement.close();
  this.closeModal.emit();
}
sumbit()
{
  this.submitData.emit(this.memberParams);
  this.close();
}
onMinAgeChange()
{
if(this.memberParams.maxAge>18) this.memberParams.minAge=18;
}
onMaxAgeChange()
{
  if(this.memberParams.maxAge<this.memberParams.minAge)
  {
    this.memberParams.maxAge=this.memberParams.minAge;
  }
}
}
