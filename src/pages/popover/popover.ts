import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


//pages
import { TabsPage } from '../tabs/tabs';
import { LoginPage } from '../login/login';
import { ProfilePage } from '../profile/profile';
import { PointsPage } from '../points/points';

//Providers
import { AuthProvider } from '../../providers/auth/auth';


@Component({
  selector: 'page-popover',
  templateUrl: 'popover.html',
})
export class PopoverPage {

  constructor(
    public authData: AuthProvider,
    public navCtrl: NavController,
    public navParams: NavParams, ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopoverPage');
  }

  signOut() {
    this.authData.logoutUser();
    this.navCtrl.push(LoginPage);
    this.navCtrl.setRoot(LoginPage);
    console.log("logout");
  }

  profile() {
    this.navCtrl.push(ProfilePage);
  }

  points() {
    this.navCtrl.push(PointsPage );
  }

}
