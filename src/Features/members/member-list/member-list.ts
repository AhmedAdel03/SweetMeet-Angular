import { Component, inject, OnInit, signal, Signal, ViewChild } from '@angular/core';
import { MemberService } from '../../../Core/service/member-service';
import { filter, Observable } from 'rxjs';
import { Member } from '../../../types/Member';
import { AsyncPipe } from '@angular/common';
import { MemberCard } from "../member-card/member-card";
import { PaginationResult } from '../../../types/Pagination';
import { Paginator } from "../../../Shared/paginator/paginator";
import { MemberParams } from '../../../types/Member';
import { FilterModel } from '../filter-model/filter-model';

@Component({
  selector: 'app-member-list',
  imports: [MemberCard, Paginator, FilterModel],
  templateUrl: './member-list.html',
  styleUrl: './member-list.css'
})
export class MemberList implements OnInit {
  @ViewChild('filterModal') modal! : FilterModel;
  private memberservice=inject(MemberService);
  protected PaginatedMembers=signal<PaginationResult<Member> | null>(null);
 memberParams=new MemberParams();
 
 constructor() {
  const Filters=localStorage.getItem('Filters');
  if(Filters){
    this.memberParams=JSON.parse(Filters);
  }
  
 }
  ngOnInit(): void {
    this.loadMembers();
  }
  loadMembers()
  {
    
 this.memberservice.fetchMembers(this.memberParams).subscribe({
  next:result=> {
     this.PaginatedMembers.set(result);
  }
 })

  }
  onPageChange(event:{pageNumber:number,pagesize:number})
  {
    this.memberParams.PageNumber=event.pageNumber;
    this.memberParams.pageSize=event.pagesize;
    this.loadMembers()
  }
  openModal()
  {
    this.modal.open();
  }
  onclose()
  {
    this.modal.close();

  }
onfilterChange(data:MemberParams)
{
  this.memberParams=data;
  this.loadMembers();

}
resetFilter()
{
  this.memberParams=new MemberParams();
  this.loadMembers();
}
get DisplayMessage():string {
  const defaultParams=new MemberParams();
  const filters:string[]=[];
  if(this.memberParams.Gender)
  {
    filters.push(this.memberParams.Gender+'s');

  }
  else {
    filters.push("Females","Males")
  }
  if(this.memberParams.minAge!==defaultParams.minAge||this.memberParams.maxAge!==defaultParams.maxAge){
    filters.push(`Ages ${this.memberParams.minAge}-${this.memberParams.maxAge}`)
  }
  filters.push(this.memberParams.OrderBy==="lastActive" ?"Recently Active":"Newset Active");
  return filters.length >0 ? `Selecte: ${filters.join(" | ")}`:"All Members"

}
}
