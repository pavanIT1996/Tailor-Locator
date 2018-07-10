import { Component } from '@angular/core';
import {
  NavController,
  NavParams,
  AlertController,
  ToastController
} from 'ionic-angular';

//pages
import { LoginPage } from '../login/login';

//firebase
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'page-forget',
  templateUrl: 'forget.html',
})
export class ForgetPage {

  forget = {
    email: '',
  };

  email:any;
  
  private ForgetData: FormGroup;
  constructor(
    private authPrv: AuthProvider,
    public toastCtrl:ToastController,
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    private alertCtrl: AlertController,
    private afAuth: AngularFireAuth,
  ) {
    this.email = this.navParams.get('email');
    console.log("email "+this.email);
    this.ForgetData = formBuilder.group({
      email: ['', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'),
        Validators.required])],
    });
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPage');
  }

  //reset password
  reset() {
    if (!this.ForgetData.valid) {
      let toast = this.toastCtrl.create({
        message: "Please Try Again With Valid Data",
        duration: 3000
      });
      toast.present();
    }
    else{

    this.authPrv.resetPassword(this.ForgetData.value.email)
      .then(auth => {
        // Could do something with the Auth-Response
        let alert = this.alertCtrl.create({
          title: 'Password Reset Email Was Sent',
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
        // Handle error
        let alert = this.alertCtrl.create({
          title: 'Error',
          message: err.message,
          buttons: ['ok']
        });
        alert.present();
      });
    }
  }

  //login page
  logpage() {
    this.navCtrl.pop();
  }
}


