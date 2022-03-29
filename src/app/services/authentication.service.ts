import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, authState,  updateProfile ,signInWithEmailAndPassword} from '@angular/fire/auth';
import { createUserWithEmailAndPassword, UserInfo,  sendPasswordResetEmail} from '@angular/fire/auth';
import { concatMap, from, Observable, of} from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  currentUser$= authState(this.auth);
  constructor(private auth:Auth,
    private http:HttpClient,
    private router:Router) { }

  login(email:string,password:string){
    return from(signInWithEmailAndPassword(this.auth,email,password))
  }
  signUp(email:string,password:string){
    return from(createUserWithEmailAndPassword(this.auth,email,password))
    // .pipe(
    //   switchMap(({ user })=>updateProfile(user,{displayName:name,photoURL:file}))
    // )
  }

  updateProfileData(profileData:Partial<UserInfo>):Observable<any>{
    const user = this.auth.currentUser;
    return of(user).pipe(
      concatMap(user =>{
        if(!user) throw new Error("Not Authenticated")
        return updateProfile(user,profileData);
      })
    ) 
  }
  logout(){
    return from(this.auth.signOut())
  }

  //forgot passsword
  forgotPassword(email:string){
    return from(sendPasswordResetEmail(this.auth,email).then(()=>{
      this.router.navigate(['/verify-email'])
    },err =>{
          alert('Something went wrong')
        }))
  }
  
}
