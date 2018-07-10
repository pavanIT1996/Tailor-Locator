import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  ToastController,
  AlertController,
  Loading,
  LoadingController,
} from 'ionic-angular';


//providers
import { AuthProvider } from '../../providers/auth/auth';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})

export class SignupPage {


  users: any;
  private SignupData: FormGroup;
  private SignupData2: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authPrv: AuthProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) {
    this.SignupData = this.formBuilder.group({

      email: ['', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'),
        Validators.required])],
      password: ['', Validators.compose([
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        Validators.required])],
      passwordRetyped: ['', Validators.compose([
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        Validators.required])],
    });

    this.SignupData2 = this.formBuilder.group({

      email2: ['', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'),
        Validators.required])],
      password2: ['', Validators.compose([
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        Validators.required])],
      passwordRetyped2: ['', Validators.compose([
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        Validators.required])],
    });
  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  ionViewWillEnter() {
    this.users = "user";
  }

  //signup user
  signup() {
    if (!this.SignupData.valid) {
      let toast = this.toastCtrl.create({
        message: "Please Try Again With Valid Data",
        duration: 3000
      });
      toast.present();
    }
    else if (this.SignupData.value.password !== this.SignupData.value.passwordRetyped) {
      let toast = this.toastCtrl.create({
        message: 'Your password and your re-entered password does not match each other.',
        duration: 3000
      });
      toast.present();
      return;
    }
    else {
      this.authPrv.signupUser(this.SignupData.value.email, this.SignupData.value.password)
        .then(auth => {
          this.authPrv.sendEmailVerification(this.SignupData.value.email)
            .then(auth => {
              let alert = this.alertCtrl.create({
                title: 'Confirmation Email Was Sent',
                message: 'Please check your emails',
                buttons: [{
                  text: 'OK',
                  handler: () => {
                    this.logpage();
                  }
                }],
              });
              alert.present();
            })
            .catch(err => {
              let toast = this.toastCtrl.create({
                message: err.message,
                duration: 2000
              });
              toast.present();
            });
        })
        .catch(err => {
          let toast = this.toastCtrl.create({
            message: err.message,
            duration: 2000
          });
          toast.present();
        });
    }
  }

  //signup shop
  signup2() {
    if (!this.SignupData2.valid) {
      let toast = this.toastCtrl.create({
        message: "Please Try Again With Valid Data",
        duration: 3000
      });
      toast.present();
    }
    else if (this.SignupData2.value.password2 !== this.SignupData2.value.passwordRetyped2) {
      let toast = this.toastCtrl.create({
        message: 'Your password and your re-entered password does not match each other.',
        duration: 3000
      });
      toast.present();
      return;
    }
    else {
    this.authPrv.signupShop(this.SignupData2.value.email2, this.SignupData2.value.password2)
      .then(auth => {
        this.authPrv.sendEmailVerification(this.SignupData2.value.email2)
          .then(auth => {
            let alert = this.alertCtrl.create({
              title: 'Confirmation Email Was Sent',
              message: 'Please check your emails',
              buttons: [{
                text: 'OK',
                handler: () => {
                  this.logpage();
                }
              }],
            });
            alert.present();
          })
          .catch(err => {
            let toast = this.toastCtrl.create({
              message: err.message,
              duration: 2000
            });
            toast.present();
          });
      })
      .catch(err => {
        let toast = this.toastCtrl.create({
          message: err.message,
          duration: 2000
        });
        toast.present();
      });
    }
  }

  //login page
  logpage() {
    this.navCtrl.popToRoot();
  }
}
