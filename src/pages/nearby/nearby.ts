import {
  Component,
  ViewChild,
  ElementRef
} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

//Providers
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { LocationsProvider } from '../../providers/locations/locations';
@Component({
  selector: 'page-nearby',
  templateUrl: 'nearby.html',
})
export class NearbyPage {

  constructor(
    public locations: LocationsProvider,
    public maps: GoogleMapsProvider,
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NearbyPage');
  }

}
