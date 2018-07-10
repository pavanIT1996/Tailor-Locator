import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  LoadingController,
  ActionSheetController,
  ModalController,
  ViewController,
  Platform
} from 'ionic-angular';

//Providers
import { AuthProvider } from '../../providers/auth/auth';


//plugins
import { Camera, CameraOptions } from '@ionic-native/camera';

//pages
import { SetupPage } from '../setup/setup';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  lastImage: string = null;
  loading: any;
  loading2: any;
  currentUser: any;

  userref: any;
  tailorref: any;
  users = [];
  tailors: Array<any> = [];
  user: any;
  image: any;
  email: any;
  id: any;
  type: any;

  public userProfile: any;

  uid: any;

  imageURL: any;
  imageURL2: any;
  userpro: any;

  updateArray: any;
  value: any;

  key: any;

  constructor(
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public authData: AuthProvider,
    private loadCtrl: LoadingController,
    private actionCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private camera: Camera,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.uid = this.authData.CurrentAuth();
    this.value = this.navParams.get("val");
    this.type = this.authData.CurrentUserType(this.uid);
 
  }

  close() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    this.authData.getUsersDetails(this.uid).then((res: any) => {
      this.users = res;
    });
  }

  ionViewWillEnter() {
 
  }

  ionViewDidEnter(){
    console.log("Did Enter()");
    this.authData.getUsersDetails(this.uid).then((res: any) => {
      this.users = res;
    });
  }

  update(val) {
    this.navCtrl.push(SetupPage, { array: this.users, value: val, key: this.uid });
    
  }
}
