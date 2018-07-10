import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  AlertController,
  ViewController
} from 'ionic-angular';

//Pages
import { RequestlistPage } from '../../pages/requestlist/requestlist'

//Providers
import { AuthProvider } from '../../providers/auth/auth';
import { MeasurementsProvider } from '../../providers/measurements/measurements';


import { FormGroup, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'page-measurement-send',
  templateUrl: 'measurement-send.html',
})
export class MeasurementSendPage {

  colors: any;
  color: any;

  //Ngmodel Variables
  uid: any;
  shop: any;
  dress: any;
  size: any;
  note: any;
  myDate: any;
  selectedcolor: any;
  material: any;

  //Arrays
  clothes = [];
  sizes = [];
  materials = [];
  measurements = [];
  measurements2 = [];
  user = [];

  myMinDate: any;
  array: any;
  val: any;
  key: any;
  date: any;
  time: any;
  //Other Variables
  public type: string = "user";
  private measureSendData: FormGroup;
  constructor(
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    public measureData: MeasurementsProvider,
    public authData: AuthProvider,
    private ToastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {

    this.uid = this.authData.CurrentAuth();
    this.array = this.navParams.get('array');
    this.val = this.navParams.get('value');
    this.key = this.navParams.get('key');

  }

  ionViewDidLoad() {
    this.date = new Date().toLocaleDateString();
    this.time = new Date().toLocaleTimeString();
    this.myMinDate = new Date().toISOString();
    this.measureData.getColorsList().then((res2: any) => {
      this.colors = res2;
    });
    this.measureData.getShopNames().then((res3: any) => {
      this.user = res3;
    });
    this.measureData.getMaterialsList().then((res4: any) => {
      this.materials = res4;
    });
    this.measureData.getClothesList().then((res5: any) => {
      this.clothes = res5;
    });
    this.measureData.getSizesList().then((res6: any) => {
      this.sizes = res6;
    });
    this.measureData.getShopMeasurements(this.uid).then((res: any) => {
      this.measurements = res;
    });
    this.measureData.getUserMeasurements(this.uid).then((res2: any) => {
      this.measurements2 = res2;
    });
  }


  //Measurement sent Toast
  send() {
    this.measureData.Addmeasurements(
      this.uid,
      this.shop,
      this.material,
      this.color,
      this.dress,
      this.size,
      this.note,
      this.myDate,
      this.date,
      this.time);
    this.measureData.Updatepoints(3);
    let SendmeasureToast = this.ToastCtrl.create({
      message: "Measurements are sent & added 3 points",
      duration: 2000
    });
    SendmeasureToast.present();
    this.navCtrl.pop();
  }

  //Close
  close() {
    this.viewCtrl.dismiss();
  }

  //Update
  update(value) {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you really want to update it? (Your points 1 will reduce)',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.measureData.Updatemeasurements(
              value,
              this.key,
              this.date,
              this.time)
            this.measureData.Updatepoints(-1);
            let AddclothesToast = this.ToastCtrl.create({
              message: "Measurements are updated & reduced 1 points",
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


}
