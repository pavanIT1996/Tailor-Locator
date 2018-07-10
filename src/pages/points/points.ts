import { Component ,Input} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams
} from 'ionic-angular';

//Provider
import { MeasurementsProvider } from '../../providers/measurements/measurements';

@Component({
  selector: 'page-points',
  templateUrl: 'points.html',
})
export class PointsPage {
 
  progress:any;
  points:any;

  constructor(
    public measureData: MeasurementsProvider,
    public navCtrl: NavController, 
    public navParams: NavParams) {
      this.points=this.measureData.Getpoints();
  }

  ionViewWillEnter() {
    this.percentage();
  }

  percentage(){
    this.progress=(this.points/1000)*100;
  }
}
