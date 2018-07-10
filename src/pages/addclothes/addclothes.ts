import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  Refresher,
  LoadingController,
  AlertController,
  ActionSheetController,
  ViewController
} from 'ionic-angular';


//plugins
import { Camera, CameraOptions } from '@ionic-native/camera';

//providers
import { ClothesProvider } from '../../providers/clothes/clothes';
import { MeasurementsProvider } from '../../providers/measurements/measurements';

import firebase from 'firebase';
@Component({
  selector: 'page-addclothes',
  templateUrl: 'addclothes.html',
})
export class AddclothesPage {

  //Ngmodel Variables
  uid: any = "";
  name: any = "";
  gender: any = "";
  image: any = "";
  size: any = "";
  type: any = "";
  price: any = "";
  note: any = "";
  date: any = "";
  time: any = "";

  imageURL2: any = "";
  imageURL: any = "";

  array: any;
  key: any;
  arrayimage: any;
  val: number;

  loading: any;
  loading2: any;

  constructor(
    public measureData: MeasurementsProvider,
    public clothesdata: ClothesProvider,
    public viewCtrl: ViewController,
    private loadCtrl: LoadingController,
    private actionCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    private camera: Camera,
    private ToastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.uid = this.navParams.get('uid');
    this.array = this.navParams.get('array');
    this.val = this.navParams.get('value');
    this.key = this.navParams.get('key');
    console.log("values " + this.uid + this.array + this.val + this.key);
  }

  ionViewDidLoad() {
    this.date = new Date().toLocaleDateString();
    this.time = new Date().toLocaleTimeString();
  }

  ionViewWillEnter() {

  }

  //Close
  close() {
    this.viewCtrl.dismiss();
  }

  //Add clothes
  addToSale() {
    this.upload();
    if (this.imageURL2 === "") {
      this.imageURL2 = "";
    }

    this.clothesdata.Addclothe(
      this.uid,
      this.name,
      this.imageURL2,
      this.gender,
      this.size,
      this.type,
      this.price,
      this.note,
      this.date,
      this.time);
    this.measureData.Updatepoints(3);
    let AddclothesToast = this.ToastCtrl.create({
      message: "Clothes Added To Sale & Added 3 points",
      duration: 2000
    });
    AddclothesToast.present();
    this.navCtrl.pop();
  }

  //Update clothes
  updateSale(value) {
    this.upload();
    if (this.imageURL2 === "") {
      this.imageURL2 = value.image;
    }

    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you really want to update it? (Your points 1 will reduce)',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.clothesdata.updateclothe(
              this.key,
              value,
              this.imageURL2,
              this.date,
              this.time);
            this.measureData.Updatepoints(-1);
            let AddclothesToast = this.ToastCtrl.create({
              message: "Clothes are updated & reduced 1 points",
              duration: 2000
            });
            AddclothesToast.present();
            this.navCtrl.pop();
          },
        }
        , {
          text: 'No',
          role: 'cancel'
        }
      ],
    });
    alert.present();
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
      const imageRef = storageRef.child(`clothes/${filename}.jpg`);

      imageRef.putString(this.imageURL2, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
        // Do something here when the data is succesfully uploaded!
        this.loading.dismiss();

      });
    }
  }

  presentLoadingDefault() {
    this.loading = this.loadCtrl.create({
      content: 'Storing...'
    });

    this.loading.present();

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

}
