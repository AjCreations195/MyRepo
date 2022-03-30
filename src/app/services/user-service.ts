import { Injectable } from '@angular/core';
import {  doc, docData, Firestore,setDoc, updateDoc } from '@angular/fire/firestore';
import { ProfileUser } from '../models/user.profile';
import { from, Observable, of, switchMap } from 'rxjs';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

    get currentUserProfile$():Observable<ProfileUser |null >{
            return this.authenticationService.currentUser$.pipe(
              switchMap(user =>{
                if(!user?.uid){
                  return of(null);
                }
                console.log(user);
                
                const ref = doc(this.fireStore, 'users',user?.uid)
               return docData(ref) as Observable<ProfileUser>
              })
            )
          }
  
  constructor(private fireStore:Firestore,
    private authenticationService:AuthenticationService) { }

  addUser(user:ProfileUser): Observable<any>{
    const ref = doc(this.fireStore, 'users',user?.uid)
    return from(setDoc(ref,user))
  }

  updateUser(user:ProfileUser): Observable<any>{
    const ref = doc(this.fireStore, 'users',user?.uid)
    return from(updateDoc(ref,{...user}))
  }

//  
 
}
