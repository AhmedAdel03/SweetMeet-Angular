import { Component, computed, input, model, output } from '@angular/core';
import { retry } from 'rxjs';

@Component({
  selector: 'app-paginator',
  imports: [],
  templateUrl: './paginator.html',
  styleUrl: './paginator.css'
})
export class Paginator {
pageNumber=model(1)
pagesize=model(5)
totalcount=input(0)
pageSizeOptions=input([5,10,15,20])
totalPages=input(0)
lastItemIndex=computed(()=>{
return Math.min(this.pageNumber()*this.pagesize(),this.totalcount())
});
pageChange=output<{pageNumber:number,pagesize:number}>();
onPageChange(newPage?:number,pagesize?:EventTarget|null)
{
  if(newPage) this.pageNumber.set(newPage);
  if(pagesize) 
  {
    const size=Number((pagesize as HTMLSelectElement).value)
  this.pagesize.set(size)

  }
    this.pageChange.emit({
      pageNumber:this.pageNumber(),
      pagesize:this.pagesize()

    })

}
}
