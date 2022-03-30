import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private authService:AuthenticationService,
    private toast:HotToastService,
    private router:Router) { }

  passwordForm= new FormGroup({
    email:new FormControl('',[Validators.required, Validators.email]),
    })
  ngOnInit(): void {
  }
  forgotPassword(){
    this.authService.forgotPassword(this.passwordForm.value.email).pipe(
      this.toast.observe({
      success:'Email sent successfully',
      loading:'Sending Password reset email...',
      error:({message})=>`${message}`,
    })).subscribe(()=>{
      this.router.navigate(['/verify-email'])
    })
  }

  get email(){
    return this.passwordForm.get('email');
  }
}
