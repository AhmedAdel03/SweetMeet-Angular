import { Component, inject, OnInit, signal } from '@angular/core';
import { RegisterCredits } from '../../../types/types';
import { Home } from '../../home/home';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServiceAccount } from '../../../Core/service/service-account';
import { ToastrService } from 'ngx-toastr';
import { ErrorTest } from '../../error-test/error-test';
import { ValidationService } from '../../../Core/service/validation-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class register implements OnInit {

  protected toaster=inject(ToastrService)
  protected router=inject(Router)
  protected accountService=inject(ServiceAccount)
  protected RegisterCredits={} as RegisterCredits
  protected ValidationError=signal<string[]>([]);
  protected RegisterForm: FormGroup =new FormGroup({});
    ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm()
  {
    this.RegisterForm=new FormGroup({
      Email:new FormControl('',[Validators.required,Validators.email]),
      displayname:new FormControl('',Validators.required),
      password:new FormControl('',[Validators.required,Validators.minLength(6),Validators.maxLength(16)]),
      DateOfbirth:new FormControl('',Validators.required),
      Gender:new FormControl('',Validators.required),
      City:new FormControl('',Validators.required),
      Country:new FormControl('',Validators.required),
      Description:new FormControl('',[Validators.required,Validators.minLength(10),Validators.maxLength(16)]),
      
      
    })

  }
  Register()
{
console.log(this.RegisterForm.value)
   if(this.RegisterForm.valid)
   {
    const formData=this.RegisterForm.value;
    this.accountService.Register(formData).subscribe(
    {
    next:Response=>{
       this.toaster.success('Welcome to Sweetmeet','Register Completed success')
      this.router.navigateByUrl("/members")
    },
    error:error=> {
      console.log(error),
      this.ValidationError.set(error); 
    }
    
    }
  )
   }
  
     
}

}
