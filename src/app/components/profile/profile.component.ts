import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { concatMap, Subscription, } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ImageUploadService } from 'src/app/services/image-upload.service';
import { Dimensions, ImageCroppedEvent, base64ToFile } from 'ngx-image-cropper';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UsersService } from 'src/app/services/user-service';
import { ProfileUser } from 'src/app/models/user.profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {

  @ViewChild('inputField') inputField!: ElementRef;
  user$ = this.userService.currentUserProfile$;

  selectedValue = '';
  Categories = ['customer', 'employee']
  imageChangedEvent: any = '';
  croppedImage: any = '';
  cropperVisible = false;
  userSub!: Subscription;
  fileToReturn!:File;
  profileForm = new FormGroup({
    uid: new FormControl(''),
    displayName: new FormControl('', Validators.required),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]),
    category: new FormControl('')
  })

  constructor(private authService: AuthenticationService,
    private router: Router,
    private toast: HotToastService,
    private imageUploadService: ImageUploadService,
    private userService: UsersService) { }


  ngOnInit(): void {
    this.userService.currentUserProfile$.subscribe((user) => {
      this.profileForm.patchValue({ ...user });

    })
  }

  onEditImage() {
    this.inputField.nativeElement.click()
  }


  onSaveImage(user: ProfileUser) {
    this.imageUploadService.uploadImage(this.fileToReturn, `images/profile/${user.uid}`).pipe(
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
    ).subscribe()
  }

  onFileSelected(event: any) { }
  imageLoaded() {
    this.cropperVisible = true;
    console.log('Image loaded');
  }
  fileChangeEvent(event: any, user: ProfileUser): void {
    this.imageChangedEvent = event;
    this.cropperVisible = true
  }
  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }


  imageCropped(event: ImageCroppedEvent, user: ProfileUser) {
    this.croppedImage = event.base64
     this.fileToReturn = this.base64ToFile(
      event.base64,
      this.imageChangedEvent.target.files[0].name,
    )
    console.log(this.fileToReturn);
    
     return this.fileToReturn;

  }
  base64ToFile(data: any, filename: string) {

    const arr = data.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe()
    }
  }
}
