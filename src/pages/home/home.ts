import {
  Component,
  ElementRef,
  ViewChild,
  NgZone
} from '@angular/core';
import {
  NavController,
  ModalController,
  NavParams,
  Platform,
  PopoverController
} from 'ionic-angular';


//pages
import { SellclothesPage } from '../sellclothes/sellclothes';
import { AddclothesPage } from '../addclothes/addclothes';
import { SetupPage } from '../setup/setup';
import { LocationSelectPage } from '../location-select/location-select';
import { PopoverPage } from '../popover/popover';
import { LoginPage } from '../login/login';
import { ProfilePage } from '../profile/profile';


//Providers
import { AuthProvider } from '../../providers/auth/auth';
import { SetupProvider } from '../../providers/setup/setup';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  Details = [];
  rootPage: any;

  user = [];
  public type: string = "user";

  uid: any;
  time: any;
  public timeval: number = 0;

  constructor(
    public setupData: SetupProvider,
    public authData: AuthProvider,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public navParams: NavParams,
    private platform: Platform,
    public popoverCtrl: PopoverController
  ) {
    this.uid = this.authData.CurrentAuth();
 
    
    console.log("type12345 "+this.type);
  }


  ionViewDidLoad() {
    this.time = new Date().getHours();
    this.authData.getUsersDetails(this.uid).then((res: any) => {
      this.user = res;
    });
  }

  ionViewDidEnter(){
   this.ionViewDidLoad();
  }

  ionViewWillEnter() {
    this.type = this.authData.CurrentUserType(this.uid);
    this.Greeting();
  }

  Greeting() {
    if (this.time >= "5" && this.time < "12") {
      console.log("Good Morning");
      this.timeval = 1;
    }
    else if (this.time >= "12" && this.time < "17") {
      console.log("Good Afternoon");
      this.timeval = 2;
    }
    else if (this.time >= "17" && this.time < "20") {
      console.log("Good Evening");
      this.timeval = 3;
    }
    else {
      console.log("Good Night");
      this.timeval = 4;
    }
  }


  ionViewCanEnter() {
    let val;
    let type;
    this.authData.getUsersDetails(this.uid).then((res: any) => {
      this.Details = res;
      this.type = this.authData.CurrentUserType(this.uid);
    }).then((value) => {
      if (this.Details.length === 4) {
        if ( this.type=== "admin"){
        console.log("type "+this.type);
          this.firstgotosetup(0);}
        else if (this.type === "user"){
          console.log("type "+this.type);
          this.firstgotosetup(2);}
        else{
          console.log("type "+this.type);
          return false;}
      }
      else {
        return true;
      }
    });
  }


  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss((values) => {
      this.ionViewDidLoad();
    });
  }

  signOut() {
    this.authData.logoutUser();
    this.rootPage = LoginPage;
    this.navCtrl.setRoot(LoginPage);
    console.log("logout");
  }

  GotoBuycothesPage() {
    this.navCtrl.push(SellclothesPage);
  }

  gotosetup(val) {
    this.navCtrl.push(SetupPage, { uid: this.uid, type: this.type, value: val });
  }

  firstgotosetup(val) {
    let modal = this.modalCtrl.create(SetupPage, { uid: this.uid, type: this.type, value: val });
    modal.present();
  }

  golocations() {
    let modal = this.modalCtrl.create(LocationSelectPage);
    modal.present();
  }

  goprofile() {
    let modal = this.modalCtrl.create(ProfilePage, { val: 1 });
    modal.present();
    modal.onDidDismiss((values) => {
      this.ionViewDidLoad();
    });
  }

}
