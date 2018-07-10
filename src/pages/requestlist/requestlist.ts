import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController,
  ToastController,
  ModalController,
  ViewController,
  PopoverController,
  LoadingController,
} from 'ionic-angular';

import { PopoverPage } from '../popover/popover';

//Providers
import { MeasurementsProvider } from '../../providers/measurements/measurements';
import { AuthProvider } from '../../providers/auth/auth';

//Pages
import { MeasurementSendPage } from '../../pages/measurement-send/measurement-send';
import { snapshotChanges } from 'angularfire2/database';

//Plugin
import { CallNumber } from '@ionic-native/call-number';

@Component({
  selector: 'page-requestlist',
  templateUrl: 'requestlist.html',
})
export class RequestlistPage {

  measurements2 = [];
  measurements = [];
  shops = [];
  uid: any;
  loading: any;
  public type: any;
  constructor(
    private callNumber: CallNumber,
    private loadCtrl: LoadingController,
    public popoverCtrl: PopoverController,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    public authData: AuthProvider,
    public ToastCtrl: ToastController,
    public alertCtrl: AlertController,
    public measureData: MeasurementsProvider,
    public navCtrl: NavController,
    public navParams: NavParams) {
    this.uid = this.authData.CurrentAuth();

  }

  ionViewDidLoad() {
    this.LoadingDefault();
    this.measureData.getShopMeasurements(this.uid).then((res: any) => {
      this.measurements = res;
    });
    this.measureData.getUserMeasurements(this.uid).then((res2: any) => {
      this.measurements2 = res2;
    });
    this.measureData.getAllUsers().then((res3: any) => {
      this.shops = res3;
    });
    this.loading.dismiss();
  }

  ionViewWillEnter() {
    this.type = this.authData.CurrentUserType(this.uid);
  }

  //popover
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  //Call function
  call(value) {
    this.callNumber.callNumber("value", true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
    console.log("Phone number" + value);
  }

  //Loading
  LoadingDefault() {
    this.loading = this.loadCtrl.create({
      content: 'Please Wait...'
    });
    this.loading.present();
  }

  //Delete Request
  delete(value) {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you really want to delete it? (You points 2 will reduce)',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.measureData.Deletemeasurements(value);
            this.measureData.Updatepoints(-2);
            let toast = this.ToastCtrl.create({
              message: "successfully deleted & reduced 2 points",
              duration: 2000
            });
            toast.present();
            this.ionViewDidLoad();
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

  //Update request pass
  update(value) {
    var array = this.measureData.Updatevalues(value)
    console.log("array values: " + array);
    this.navCtrl.push(MeasurementSendPage, { array: array, value: 1, key: value });
  }

  //Add measurement page
  GotoAddmeasurementPage() {
    let modal = this.modalCtrl.create(MeasurementSendPage, { uid: this.uid, value: 0 });
    modal.onDidDismiss((values) => {
        this.ionViewDidLoad();
    });
    modal.present();
  }

  //Reject the request
  Reject(value) {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you really want to Reject it? (Your points 1 will reduce)',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            var status = "Rejected";
            this.measureData.UpdateStatus(value, status);
            this.ionViewDidLoad();
            this.measureData.Updatepoints(-1);
            let AddclothesToast = this.ToastCtrl.create({
              message: "Rejected & reduced 1 points",
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

  //Accept the request
  Accept(value) {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you really want to Accept it? (Your points 3 will added)',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            var status = "Accepted";
            this.measureData.UpdateStatus(value, status);
            this.ionViewDidLoad();
            this.measureData.Updatepoints(3);
            let AddclothesToast = this.ToastCtrl.create({
              message: "Accepted & added 3 points",
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
