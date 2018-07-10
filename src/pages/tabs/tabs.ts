import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';

//pages
import { HomePage } from '../home/home';
import { RequestlistPage} from '../requestlist/requestlist';
import { SellclothesPage } from '../sellclothes/sellclothes';


@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  homeRoot = HomePage
  sellclothesRoot = SellclothesPage
  requestlistRoot = RequestlistPage


  constructor(
    public navCtrl: NavController, ) {

  }
}
