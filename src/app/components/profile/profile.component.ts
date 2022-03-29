import { Component,OnDestroy, OnInit,ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { concatMap, Subscription, } from 'rxjs';
import { User } from '@angular/fire/auth'
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/user-service';
import { ProfileUser } from 'src/app/models/user.profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  user$ = this.userService.currentUserProfile$;

  selectedValue = '';
  Categories = ['customer', 'employee']
  imageChangedEvent: any = '';
  croppedImage: any = '';
  userSub!: Subscription;
  profileForm = new FormGroup({
    uid: new FormControl(''),
    displayName: new FormControl(''),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl(''),
    category: new FormControl('')
  })

  constructor(private authService: AuthenticationService,
    private router: Router,
    private toast: HotToastService,
    private imageUploadService: ImageUploadService,
    private userService: UsersService,
    private viewRef: ViewContainerRef) { }


  ngOnInit(): void {
    this.userService.currentUserProfile$.subscribe((user) => {
      this.profileForm.patchValue({ ...user });

    })
  }


  onSaveImage(user: ProfileUser) {
    this.imageUploadService.uploadImage(this.imageChangedEvent.target.files[0], `images/profile/${user.uid}`).pipe(
      this.toast.observe({
        loading: 'Image is uploading...',
        success: 'Image Uploaded Successfully',
        error: 'There was an error'
      }), concatMap((photoURL) => this.userService.updateUser({ uid: user.uid, photoURL }))
    ).subscribe();

  }
  saveProfile() {
    const profileData = this.profileForm.value;
    this.userService.updateUser(profileData).pipe(
      this.toast.observe({
        loading: 'Updating data...',
        success: 'Data has been updatd!',
        error: 'There was an error in updating the data'
      })
    )
  }

  onFileSelected(event: any) { }

  fileChangeEvent(event: any, user: ProfileUser): void {
    this.imageChangedEvent = event;

  }

  imageCropped(event: ImageCroppedEvent, user: ProfileUser) {
    this.croppedImage = event.base64

  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe()
    }
  }
}
