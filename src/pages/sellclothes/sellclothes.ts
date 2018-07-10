import {
  Component,
  ViewChild
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ModalController,
  AlertController,
  ToastController,
  Slides,
  PopoverController,
  LoadingController,
} from 'ionic-angular';

//pages
import { AddclothesPage } from '../addclothes/addclothes';
import { PopoverPage } from '../popover/popover';

//Providers
import { AuthProvider } from '../../providers/auth/auth';
import { ClothesProvider } from '../../providers/clothes/clothes';
import { MeasurementsProvider } from '../../providers/measurements/measurements';
@Component({
  selector: 'page-sellclothes',
  templateUrl: 'sellclothes.html',
})
export class SellclothesPage {
  @ViewChild(Slides) slides: Slides;

  clothes: any;

  privateclothes=[];
  publicclothes=[];
  allclothes=[];
  sellers = [];
  
  uid: any;
  updateArray: any;
  public type: any;
  value: any;
  query: any;

  clothename: any;
  key: any;

  descending: boolean = false;
  order: number;
  column: string = 'name';
  loading: any;
  constructor(
    private loadCtrl: LoadingController,
    public measureData: MeasurementsProvider,
    public clothesdata: ClothesProvider,
    public authData: AuthProvider,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public popoverCtrl: PopoverController) {
    this.uid = this.authData.CurrentAuth();
    console.log("value "+this.uid);
    this.LoadingDefault();
  }

  //Popover
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  ionViewDidLoad() {
    this.clothesdata.getAllMarketList().then((res: any) => {
      this.allclothes = res;
    });
    this.clothesdata.getShopDetails().then((res2: any) => {
      this.sellers = res2;
    });
    this.clothesdata.getPrivateMarketList(this.uid).then((res3: any) => {
      this.privateclothes = res3;
    });
    this.clothesdata.getPublicMarketList(this.uid).then((res3: any) => {
      this.publicclothes = res3;
    });

  }

  ionViewDidEnter(){
    this.ionViewDidLoad();
  }

  ionViewWillEnter() {
    this.clothes = "private";
    this.type = this.authData.CurrentUserType(this.uid);
    this.loading.dismiss()
  }

  //Loading
  LoadingDefault() {
    this.loading = this.loadCtrl.create({
      content: 'Please Wait...'
    });
    this.loading.present();
  }


  //sort
  sort(){
    this.descending = !this.descending;
    this.order = this.descending ? 1 : -1;
  }

  //Add page
  GotoAddclothesPage() {
    let modal = this.modalCtrl.create(AddclothesPage, { uid: this.uid, value: 0 });
    modal.onDidDismiss((values) => {
      this.ionViewDidLoad();
    });
    modal.present();
  }

  //delete
  delete(value) {
    let alert = this.alertCtrl.create({
      title: 'Confirm',
      message: 'Do you really want to delete it? (You points 2 will reduce)',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.clothesdata.removeclothe(value);
            this.measureData.Updatepoints(-2);
            this.slides.slidePrev();
            let toast = this.toastCtrl.create({
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

  //upate value pass
  update(value) {
    var array=this.clothesdata.ClotheUpdateValues(value)
    console.log("array values: " + array);
    this.navCtrl.push(AddclothesPage, { array: array, value: 1, key: value });
  }


}
