import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Config} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';

import { AngularFireAuth } from 'angularfire2/auth';
import { timer } from 'rxjs/observable/timer';
import { initializeApp } from 'firebase';

//Providers
import { AuthProvider } from '../providers/auth/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  time:any;
  showSplash=true;

  constructor(
    public authData: AuthProvider,
    public platform: Platform, 
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private afAuth: AngularFireAuth,
   ) {
    this.afAuth.authState.subscribe(auth => {
      if(!auth.emailVerified){
        this.nav.setRoot(LoginPage);}
      else
        this.nav.setRoot(TabsPage);
    });
    
      this.platform.ready().then(() => {
        this.statusBar.styleDefault();
        this.splashScreen.hide();
        timer(3000).subscribe(()=>this.showSplash=false);
      });
  }

}
