import {
    NavController,
    Platform,
    ViewController,
    AlertController,
    ToastController,
    NavParams
} from 'ionic-angular';

import {
    Component,
    ElementRef,
    ViewChild,
    NgZone
} from '@angular/core';
import { toObservable } from '@angular/forms/src/validators';

//pages
import { NearbyPage } from '../nearby/nearby';

//providers
import { GoogleMapsProvider } from '../../providers/google-maps/google-maps';
import { LocationsProvider } from '../../providers/locations/locations';
import { AuthProvider } from '../../providers/auth/auth';
import { SetupProvider } from '../../providers/setup/setup';

//firebase
import { Observable } from '@firebase/util';
import firebase from 'firebase';
import { AngularFireDatabase, AngularFireList, snapshotChanges } from 'angularfire2/database';

//plugins
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

//declarations
declare var google;

@Component({
    selector: 'page-location-select',
    templateUrl: 'location-select.html'
})
export class LocationSelectPage {

    @ViewChild('map') mapElement: ElementRef;
    @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
    // @ViewChild('directionsPanel') directionsPanel: ElementRef;


    uid: any;
    public type: string;

    userRef: any;

    latitude: number;
    longitude: number;
    autocompleteService: any;
    placesService: any;
    query: string = '';

    places: any = [];
    places2: any = [];

    searchDisabled: boolean;
    saveDisabled: boolean;
    location: any;


    locationRef: any;
    value: boolean = false;


    items: Observable<any[]>;

    constructor(
        public setupData: SetupProvider,
        public locations: LocationsProvider,
        public authData: AuthProvider,
        public navParams: NavParams,
        private ToastCtrl: ToastController,
        private AlertCtrl: AlertController,
        private afDatabase: AngularFireDatabase,
        private locationAccuracy: LocationAccuracy,
        public navCtrl: NavController,
        public zone: NgZone,
        public maps: GoogleMapsProvider,
        public platform: Platform,
        public geolocation: Geolocation,
        public viewCtrl: ViewController,
    ) {
        this.userRef = firebase.database().ref('/Users');
        this.uid = this.authData.CurrentAuth();

        console.log("values" + this.uid + this.type);
        this.searchDisabled = true;
        this.saveDisabled = true;
       
    }

    ionViewWillEnter() {
        this.type = this.authData.CurrentUserType(this.uid);
    }



    ionViewDidLoad() {
        console.log("Did load map");

        //run in the device
        if (this.platform.is('cordova')) {
            this.locationAccuracy.canRequest().then((canRequest: boolean) => {

                if (canRequest) {
                    // the accuracy option will be ignored by iOS
                    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                        () => console.log('Request successful'),
                        error => console.log('Error requesting location permissions', error)
                    );
                }

            });
            let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {

                Promise.all([
                    mapLoaded,
                    this.setupData.GetAllDetails().then((res: any) => {
                        this.places2 = res;
                    })
                ]).then((result) => {

                    this.autocompleteService = new google.maps.places.AutocompleteService();
                    this.placesService = new google.maps.places.PlacesService(this.maps.map);

                    this.searchDisabled = false;
                    // this.startNavigating();
                    for (let location of this.places2) {
                        this.maps.addMarker3(location.Shoplatitude, location.Shoplongitude, location.Shopname);
                    }
                });
            });
        }
        //run in the browser
        else {
            let mapLoaded = this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {

                Promise.all([
                    mapLoaded,
                    this.setupData.GetAllDetails().then((res: any) => {
                        this.places2 = res;
                    })
                ]).then((result) => {


                    this.autocompleteService = new google.maps.places.AutocompleteService();
                    this.placesService = new google.maps.places.PlacesService(this.maps.map);

                    this.searchDisabled = false;

                    for (let location of this.places2) {
                        this.maps.addMarker3(location.Shoplatitude, location.Shoplongitude, location.Shopname);
                    }
                });
            });
        }
    }




    //Select Place
    selectPlace(place) {

        this.places = [];

        let location = {
            lat: null,
            lng: null,
            name: place.name
        };

        this.placesService.getDetails({ placeId: place.place_id }, (details) => {

            this.zone.run(() => {

                location.name = details.name;
                location.lat = details.geometry.location.lat();
                location.lng = details.geometry.location.lng();
                this.saveDisabled = false;

                this.maps.map.setCenter({ lat: location.lat, lng: location.lng });

                this.location = location;
                this.maps.addMarker2(location);
            });
        });

    }

    //Add Place
    Add() {
        let location = {
            lat: null,
            lng: null,
            name: null,
        };
        var position = this.maps.addMarker4();
        location.lat = position.lat;
        location.lng = position.lng;
        location.name = position.name;
        this.location = location;
        this.saveDisabled = false;
    }

    //Clear Place
    Clear() {
        this.maps.clearMarkers();
        this.saveDisabled = true;
    }

    //Search Place
    searchPlace() {

        this.saveDisabled = true;

        if (this.query.length > 0 && !this.searchDisabled) {

            let config = {
                types: ['geocode'],
                input: this.query
            }

            this.autocompleteService.getPlacePredictions(config, (predictions, status) => {

                if (status == google.maps.places.PlacesServiceStatus.OK && predictions) {

                    this.places = [];

                    predictions.forEach((prediction) => {
                        this.places.push(prediction);
                    });
                }

            });

        } else {
            this.places = [];
        }

    }

    save() {
        this.viewCtrl.dismiss({ lat: this.location.lat, lng: this.location.lng, name: this.location.name });
    }

    close() {
        this.viewCtrl.dismiss();
    }

    NearBy() {
        this.navCtrl.push(NearbyPage);
    }

}
