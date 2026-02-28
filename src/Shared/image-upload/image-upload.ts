import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-image-upload',
  imports: [],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css'
})
export class ImageUpload {
protected imgSrc?:string|ArrayBuffer|null=null;
protected isDragging=false;
private FileUploaded:File|null=null;
uploadfile=output<File>();
loading=input<boolean>(false);
onDragover(event:DragEvent)
{
  event.preventDefault();
  event.stopPropagation();
  this.isDragging=true;

}
onDragLeave(event:DragEvent)
{
  event.preventDefault();
  event.stopPropagation();
  this.isDragging=false;
  

}
onDrop(event:DragEvent)
{
  event.preventDefault();
  event.stopPropagation();
  this.isDragging=false;
  if(event.dataTransfer?.files.length)
  {
    const file=event.dataTransfer.files[0];
    this.previewImg(file);
    this.FileUploaded=file
  }
}
private previewImg(file:File)
{
  const reader=new FileReader();
  reader.onload=(e)=> this.imgSrc=e.target?.result;
  reader.readAsDataURL(file);

}
onCancel()
{
  this.FileUploaded=null;
  this.imgSrc=null;
}
onUpload()
{
  if(this.FileUploaded)
  {
    this.uploadfile.emit(this.FileUploaded);
  }
}


}
