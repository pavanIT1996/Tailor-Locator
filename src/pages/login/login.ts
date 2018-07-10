import { Component } from '@angular/core';
import {
  NavController,
  ToastController,
  AlertController,
  LoadingController,
  Loading,
} from 'ionic-angular';


//Pages
import { SignupPage } from '../signup/signup';
import { HomePage } from '../home/home';
import { TabsPage } from '../tabs/tabs';
import { ForgetPage } from '../forget/forget';
import { SetupPage } from '../setup/setup';

//Providers
import { AuthProvider } from '../../providers/auth/auth';

//firebase
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {


  private loggedData: FormGroup;

  email: any;
  pwd: any
  constructor(
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    private afAuth: AngularFireAuth,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public authData: AuthProvider

  ) {


    this.loggedData = formBuilder.group({

      email: ['', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'),
        Validators.required])],
      password: ['', Validators.compose([
        Validators.minLength(8),
        Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        Validators.required])],
    });

  }

  test() {
    this.email = "pavan.chamantha@my.sliit.lk";
    this.pwd = "Chamantha1996";
  }
  test1() {
    this.email = "chamanthapavan@gmail.com";
    this.pwd = "Chamantha1996";
  }
  test2() {
    this.email = "smartwaterbottle1@gmail.com";
    this.pwd = "Chamantha1996";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  ionViewWillEnter() {

  }

  //login user
  login() {
    if (!this.loggedData.valid) {
      let toast = this.toastCtrl.create({
        message: "Please Try Again With Valid Data",
        duration: 3000
      });
      toast.present();
    }
    else {
      this.authData.loginUser(this.loggedData.value.email, this.loggedData.value.password)
        .then(auth => {
          // Do custom things with auth
          if (!auth.emailVerified) {
            let toast = this.toastCtrl.create({
              message: 'Email Not verified',
              duration: 2000
            });
            toast.present();
          }
          else {
            let toast = this.toastCtrl.create({
              message: 'Email Verified',
              duration: 2000
            });
            toast.present();
            this.navCtrl.setRoot(TabsPage);
          }
        })
        .catch(err => {
          // Handle error
          let toast = this.toastCtrl.create({
            message: err.message,
            duration: 3000
          });
          toast.present();
        });
    }
  }

  //signup page
  signup() {
    this.navCtrl.push(SignupPage, { email: this.loggedData.value.email });
  }

  //forget page
  forget() {
    this.navCtrl.push(ForgetPage, { email: this.loggedData.value.email });
  }

}
