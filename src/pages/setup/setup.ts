import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  LoadingController,
  ActionSheetController,
  Loading,
  AlertController,
  ToastController
} from 'ionic-angular';

//pages
import { LocationSelectPage } from '../location-select/location-select';

//firebase
import firebase from 'firebase';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';

//Providers
import { AuthProvider } from '../../providers/auth/auth';
import { SetupProvider } from '../../providers/setup/setup';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
//plugins
import { Camera, CameraOptions } from '@ionic-native/camera';
@Component({
  selector: 'page-setup',
  templateUrl: 'setup.html',
})
export class SetupPage {

  userRef: any;
  sname: any = "";

  lng: any = "";
  lat: any = "";
  locname: any = "";

  note: any = "";
  image: any = "";
  contact: any = "";

  tailor: Array<any> = [];
  uid: any;
  type: any;
  user: any;


  imageURL2: any = "";
  imageURL: any = "";

  loading: any;
  loading2: any;

  // array: any;
  val: number;
  key: any;
  array: any;

  private SetupData: FormGroup;
  private SetupData2: FormGroup;
  constructor(
    public setupData: SetupProvider,
    private formBuilder: FormBuilder,
    public authData: AuthProvider,
    private loadCtrl: LoadingController,
    private actionCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private camera: Camera,
    private ToastCtrl: ToastController,
    private afDatabase: AngularFireDatabase,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.uid = this.authData.CurrentAuth();
    this.array = this.navParams.get('array');
    this.val = this.navParams.get('value');
    this.key = this.navParams.get('key');

    this.lng = this.navParams.get('lng');
    this.lat = this.navParams.get('lat');
    this.locname = this.navParams.get('name');
    console.log("value 012 = " + this.val);

    this.SetupData = this.formBuilder.group({

      name: ['', Validators.compose([
        Validators.pattern('^[A-Za-z\\s]{1,}[\.]{0,1}[A-Za-z\\s]{0,}$'),
        Validators.required])],
      note: ['', Validators.compose([
        Validators.minLength(20),
        Validators.pattern('^[A-Za-z\\s]{1,}[\.]{0,1}[A-Za-z\\s]{0,}$'),
        Validators.required])],
      contact: ['', Validators.compose([
        Validators.maxLength(10),
        Validators.pattern('^[0-9]{10}$'),
        Validators.required])],
    });

    this.SetupData2 = this.formBuilder.group({
      username: ['', Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(25),
        Validators.pattern('^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$'),
        Validators.required])],
      contact: ['', Validators.compose([
        Validators.maxLength(10),
        Validators.pattern('^[0-9]{10}$'),
        Validators.required])],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SetupPage');

    this.type = this.authData.CurrentUserType(this.uid);
    this.lng = this.navParams.get('lng');
    this.lat = this.navParams.get('lat');
    this.locname = this.navParams.get('name');
    console.log("Value number is: " + this.val);
  }

  ionViewWillEnter() {
    this.val = this.navParams.get('value');
  }

  gotomap() {
    let modal = this.modalCtrl.create(LocationSelectPage, { uid: this.uid, type: this.type });
    modal.onDidDismiss((values) => {
      if (values !== undefined) {
        this.lng = values.lng;
        this.lat = values.lat;
        this.locname = values.name;
      }
      console.log("values " + this.lng + this.lat + this.locname);
    });
    modal.present();
  }

  setup() {
    if (!this.SetupData.valid) {
      let toast = this.ToastCtrl.create({
        message: "Please Try Again With Valid Data",
        duration: 3000
      });
      toast.present();
    }
    else {
      this.upload();

      if (this.locname === undefined || this.lat === undefined || this.lng === undefined) {
        this.locname = "";
        this.lat = "";
        this.lng = "";
      }
      this.setupData.AddShopDetails(this.SetupData, this.imageURL2, this.locname, this.lat, this.lng,this.uid);

      if (this.imageURL2 !== "") {
        this.loading.dismiss();
      }
      let SetupToast = this.ToastCtrl.create({
        message: "Successfully Joined",
        duration: 2000
      });
      SetupToast.present();
      this.imageURL2 = "";
      this.navCtrl.pop();
    }

  }

  setup2() {
    if (!this.SetupData2.valid) {
      let toast = this.ToastCtrl.create({
        message: "Please Try Again With Valid Data",
        duration: 3000
      });
      toast.present();
    }
    else {
      this.upload();
      this.setupData.AddUserDetails(this.SetupData2, this.imageURL2,this.uid);
      if (this.imageURL2 !== "") {
        this.loading.dismiss();
      }
      let SetupToast = this.ToastCtrl.create({
        message: "Successfully Joined",
        duration: 2000
      });
      SetupToast.present();
      this.imageURL2 = "";
      this.navCtrl.pop();
    }

  }

  update() {
    if (!this.SetupData.valid) {
      let toast = this.ToastCtrl.create({
        message: "Please Try Again With Valid Data",
        duration: 3000
      });
      toast.present();
    }
    else {
      this.upload();
      if (this.locname === undefined || this.lat === undefined || this.lng === undefined) {
        this.locname = "";
        this.lat = "";
        this.lng = "";
      }
      this.setupData.AddShopDetails(this.SetupData, this.imageURL2, this.locname, this.lat, this.lng, this.uid);

      if (this.imageURL2 !== "") {
        this.loading.dismiss();
      }
      let SetupToast = this.ToastCtrl.create({
        message: "Successfully Updated",
        duration: 2000
      });
      SetupToast.present();
      this.imageURL2 = "";
      this.navCtrl.pop();
    }

  }

  update2() {
    if (!this.SetupData2.valid) {
      let toast = this.ToastCtrl.create({
        message: "Please Try Again With Valid Data",
        duration: 3000
      });
      toast.present();
    }
    else {
      this.upload();
      this.setupData.AddUserDetails(this.SetupData2, this.imageURL2,this.uid);
      if (this.imageURL2 !== "") {
        this.loading.dismiss();
      }
      let SetupToast = this.ToastCtrl.create({
        message: "Successfully Updated",
        duration: 2000
      });
      SetupToast.present();
      this.imageURL2 = "";
      this.navCtrl.pop();
    }

  }
  capture() {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      this.imageURL2 = 'data:image/jpeg;base64,' + imageData;
    }, (err) => {
      console.log(err);
    });
  }

  upload() {
    if (this.imageURL2 !== "") {
      this.presentLoadingDefault();
      let storageRef = firebase.storage().ref();
      // Create a timestamp as filename
      const filename = Math.floor(Date.now() / 1000);

      // Create a reference to 'images/todays-date.jpg'
      const imageRef = storageRef.child(`Profiles/${filename}.jpg`);

      imageRef.putString(this.imageURL2, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
        // Do something here when the data is succesfully uploaded!

      });
    }
  }


  presentLoadingDefault() {
    this.loading = this.loadCtrl.create({
      content: 'Storing...'
    });

    this.loading.present();

  }

  presentLoading() {
    this.loading2 = this.loadCtrl.create({
      content: 'Loading...'
    });

    this.loading2.present();
  }

  loadFromLibrary() {
    let options = {
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
    };
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.imageURL2 = 'data:image/jpeg;base64,' + imageData;
      this.imageURL2 = this.imageURL2;
    }, (err) => {
      console.log("ERROR -> " + JSON.stringify(err));
    });

  }


  presentActionSheet() {
    let actionSheet = this.actionCtrl.create({
      title: 'Change clothe picture',
      buttons: [
        {
          text: 'Take new photo',
          icon: 'camera',
          handler: () => {
            console.log('take a new photo');
            this.capture();
          }
        }, {
          text: 'Select photo from gallery ',
          icon: 'apps',
          handler: () => {
            console.log('load from gallery');
            this.loadFromLibrary();
          }
        }, {
          text: 'Remove clothe picture',
          icon: 'trash',
          handler: () => {
            console.log('remove picture clicked');
            this.removepicture();
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          icon: 'close',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }


  removepicture() {
    if (this.val === 0 || this.val === 1) {
      this.setupData.RemoveShopImage(this.uid);
    }
    if (this.val === 2 || this.val === 3) {
      this.setupData.RemoveUserImage(this.uid);
    }

  }
}
