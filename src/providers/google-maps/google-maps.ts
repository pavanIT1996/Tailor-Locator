import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { ConnectivityServiceProvider } from '../connectivity-service/connectivity-service'
import { Geolocation } from '@ionic-native/geolocation';

import { Device } from '@ionic-native/device';
import { SetupProvider } from '../../providers/setup/setup';
declare var google;
import firebase from 'firebase';
export const snapshotToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
    let item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};
@Injectable()
export class GoogleMapsProvider {

  mapElement: any;
  pleaseConnect: any;
  // directionsPanel: any;
  markers = [];

  currentlocation: any;

  places2 = [];
  map: any;
  mapInitialised: boolean = false;
  mapLoaded: any;
  mapLoadedObserver: any;
  currentMarker: any;
  apiKey: string = "AIzaSyCn-L91YWuT_kNQqRzzMc8Atjrg_Y0tXsM";

  constructor(
    public setupData: SetupProvider,
    private device: Device,
    public connectivityService: ConnectivityServiceProvider,
    public geolocation: Geolocation) {
    this.setupData.GetAllDetails().then((res: any) => {
      this.places2 = res;
    })
  }

  init(mapElement: any, pleaseConnect: any): Promise<any> {

    this.mapElement = mapElement;
    this.pleaseConnect = pleaseConnect;
    // this.directionsPanel = directionsPanel;

    return this.loadGoogleMaps();

  }


  loadGoogleMaps(): Promise<any> {

    return new Promise((resolve) => {

      if (typeof google == "undefined" || typeof google.maps == "undefined") {

        console.log("Google maps JavaScript needs to be loaded.");
        this.disableMap();

        if (this.connectivityService.isOnline()) {

          window['mapInit'] = () => {

            this.initMap().then(() => {
              resolve(true);
            });

            this.enableMap();
          }

          let script = document.createElement("script");
          script.id = "googleMaps";

          if (this.apiKey) {
            script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit&libraries=places';
          } else {
            script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
          }

          document.body.appendChild(script);

        }
      } else {

        if (this.connectivityService.isOnline()) {
          this.initMap();
          this.enableMap();
        }
        else {
          this.disableMap();
        }

        resolve(true);

      }

      this.addConnectivityListeners();

    });

  }

  initMap(): Promise<any> {

    this.mapInitialised = true;

    return new Promise((resolve) => {

      this.geolocation.getCurrentPosition().then((position) => {

        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }

        this.map = new google.maps.Map(this.mapElement, mapOptions);
        // resolve(this.map);

      }).then(()=>{
        this.setupData.GetAllDetails().then((res: any) => {
          this.places2 = res;
        }).then((result)=>{
          for (let location of this.places2) {
            this.addMarker3(location.Shoplatitude, location.Shoplongitude, location.Shopname);
          }
        })
    
      })
     
      let watch = this.geolocation.watchPosition();
      watch.subscribe((data) => {
        this.currentlocation = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
        let image = 'assets/m1.png';
        this.addMarker(this.currentlocation, image);
        resolve(this.map);
      });

    });

  }

  addMarker(location, image) {
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      animation: google.maps.Animation.DROP,
      icon: image
    });
    this.markers.push(marker);
    let content = "My Location";
    this.addInfoWindow(marker, content)
  }

  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }

  clearMarkers() {
    this.setMapOnAll(null);
  }

  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }


  addMarker2(location) {

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: location
    });
    this.markers.push(marker);
    let content = location.name;
    this.addInfoWindow(marker, content);

  }

  addMarker3(lat: number, lng: number, shopname: string): void {

    let latLng = new google.maps.LatLng(lat, lng);

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      icon: 'assets/m2.png'
    });

    this.markers.push(marker);

    let infoWindow = new google.maps.InfoWindow({
      content: shopname
    });
    var value:number=1;
    google.maps.event.addListener(marker, 'click', () => {
     
      console.log("clic "+value);
      if(value===1){
        infoWindow.open(this.map, marker);
        value=2;
      }
      else if(value===2){
        this.getDirections(marker.position);
        value=3;
      }
      else{
      this.initMap();
      }
    });
  }

  addMarker4() {
    let location = {
      lat: null,
      lng: null,
      name: null,
    };
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter(),
      icon: 'assets/m3.png'
    });

    var loc = this.map.getCenter();
    location.lat = loc.lat();
    location.lng = loc.lng();
    this.markers.push(marker);
    let content = "<h4>Unknown</h4>";
    this.addInfoWindow(marker, content);
    return location;
  }
  addMarker5(lat: number, lng: number): void {

    let latLng = new google.maps.LatLng(lat, lng);

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng
    });

    this.markers.push(marker);

  }

  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }

  getDirections(location) {
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(this.map);
    directionsService.route({
      origin: this.currentlocation,
      destination: location,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        directionsDisplay.setDirections(response);
      } else {
        window.alert('Directions request failed due to ' + status);
      }
    });
  }

  startNavigating(location) {
    let directionsService = new google.maps.DirectionsService;
    let directionsDisplay = new google.maps.DirectionsRenderer;

    directionsDisplay.setMap(this.map);
    // directionsDisplay.setPanel(this.directionsPanel.nativeElement);

    directionsService.route({
      origin: this.currentlocation,
      destination: location,
      travelMode: google.maps.TravelMode['DRIVING']
    }, (res, status) => {

      if (status == google.maps.DirectionsStatus.OK) {
        directionsDisplay.setDirections(res);
      } else {
        console.warn(status);
      }

    });

  }




  disableMap(): void {

    if (this.pleaseConnect) {
      this.pleaseConnect.style.display = "block";
    }

  }

  enableMap(): void {

    if (this.pleaseConnect) {
      this.pleaseConnect.style.display = "none";
    }

  }

  addConnectivityListeners(): void {

    this.connectivityService.watchOnline().subscribe(() => {

      setTimeout(() => {

        if (typeof google == "undefined" || typeof google.maps == "undefined") {
          this.loadGoogleMaps();
        }
        else {
          if (!this.mapInitialised) {
            this.initMap();
          }

          this.enableMap();
        }

      }, 2000);

    });

    this.connectivityService.watchOffline().subscribe(() => {

      this.disableMap();

    });

  }

}