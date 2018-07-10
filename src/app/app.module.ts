import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { ForgetPage } from '../pages/forget/forget';
import { NearbyPage } from '../pages/nearby/nearby';
import { TabsPage } from '../pages/tabs/tabs';
import {ProfilePage} from '../pages/profile/profile';
import {PopoverPage} from '../pages/popover/popover';
import {MeasurementSendPage} from '../pages/measurement-send/measurement-send';
import {AddclothesPage} from '../pages/addclothes/addclothes';
import {SellclothesPage} from '../pages/sellclothes/sellclothes';
import {SetupPage} from '../pages/setup/setup';
import {RequestlistPage} from '../pages/requestlist/requestlist';
import {PointsPage} from '../pages/points/points';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

import { Camera} from '@ionic-native/camera';
import { Keyboard } from '@ionic-native/keyboard';
import { Device } from '@ionic-native/device';
import { CallNumber } from '@ionic-native/call-number';

import { AuthProvider } from '../providers/auth/auth';

import { LocationSelectPage } from '../pages/location-select/location-select';
import { ConnectivityServiceProvider } from '../providers/connectivity-service/connectivity-service';
import { GoogleMapsProvider } from '../providers/google-maps/google-maps';
import { Network } from '@ionic-native/network';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

import { HttpModule } from '@angular/http';
import { GoogleMapsClusterProvider } from '../providers/google-maps-cluster/google-maps-cluster';
import { ClothesProvider } from '../providers/clothes/clothes';
import { LocationsProvider } from '../providers/locations/locations';
import { MeasurementsProvider } from '../providers/measurements/measurements';
import { SetupProvider } from '../providers/setup/setup';

import { SearchPipe } from '../pipes/search/search';
import { SortPipe } from '../pipes/sort/sort';

// Import ng-circle-progress
import { NgCircleProgressModule } from 'ng-circle-progress';

var config = {
  apiKey: "AIzaSyCIRLTGOb4M7xus9jSuzDf3ZNu-wU6rsMg",
  authDomain: "tailorlocator-1d8e7.firebaseapp.com",
  databaseURL: "https://tailorlocator-1d8e7.firebaseio.com",
  projectId: "tailorlocator-1d8e7",
  storageBucket: "tailorlocator-1d8e7.appspot.com",
  messagingSenderId: "69624975930"
}

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignupPage,
    ForgetPage,
    TabsPage,
    HomePage,
    PopoverPage, 
    ProfilePage,
    LocationSelectPage,
    NearbyPage,
    MeasurementSendPage,
    AddclothesPage,
    SellclothesPage,
    SetupPage,
    SearchPipe,
    SortPipe,
    RequestlistPage,
    PointsPage
  ],
  imports: [
    HttpModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
      // Specify ng-circle-progress as an import
      NgCircleProgressModule.forRoot({
        // set defaults here
        radius: 100,
        outerStrokeWidth: 16,
        innerStrokeWidth: 8,
        outerStrokeColor: "#78C000",
        innerStrokeColor: "#C7E596",
        animationDuration: 300,
      })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignupPage,
    ForgetPage,
    TabsPage,
    HomePage,
    PopoverPage, 
    ProfilePage,
    LocationSelectPage,
    NearbyPage,
    MeasurementSendPage,
    AddclothesPage,
    SellclothesPage,
    SetupPage,
    RequestlistPage,
    PointsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    Geolocation,
    Network,
    AuthProvider,
    ConnectivityServiceProvider,
    GoogleMapsProvider, 
    {provide: ErrorHandler, useClass: IonicErrorHandler},  
    LocationAccuracy,
    Camera,
    Keyboard,
    GoogleMapsClusterProvider,
    ClothesProvider,
    Device,
    LocationsProvider,
    MeasurementsProvider,
    SetupProvider,
    CallNumber
]
})
export class AppModule {}
