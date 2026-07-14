import { Component, inject, Inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceAccount } from '../../Core/service/service-account';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { themes } from '../Themes';
  

@Component({
  selector: 'app-nav-bar',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar implements OnInit {
 
  protected accountService=inject(ServiceAccount)
  protected ToasterService=inject(ToastrService)
  protected Credits:any ={};
  protected selectedthemes=signal<string>(localStorage.getItem('themes' )|| 'light' );
  protected themes=themes;
   ngOnInit(): void {
 document.documentElement.setAttribute('data-theme',this.selectedthemes());
  }
  handleSelectedTheme(theme:string)
  {
    this.selectedthemes.set(theme);
    localStorage.setItem('theme',theme);
    document.documentElement.setAttribute('data-theme',theme)

  }
  private router=inject(Router)
   Login()
  {
   return this.accountService.Login(this.Credits).subscribe({
    next:result=>{
        this.router.navigateByUrl('/members')
        this.ToasterService.success("Login Success")
      
      },
    error:error=> console.log(error)
      

    })
  }
  logOut()
  {
    this.accountService.Logout();
    this.router.navigateByUrl('/')
    this.ToasterService.show('LogOut Success')

  }

}
