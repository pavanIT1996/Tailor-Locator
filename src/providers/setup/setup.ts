import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


import firebase, { auth } from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';
@Injectable()
export class SetupProvider {

  userRef: any;
  uid: any;
  constructor(public authData: AuthProvider, ) {
    this.uid = this.authData.CurrentAuth();
    this.userRef = firebase.database().ref('/Users');
  }

  AddShopDetails(SetupData, imageURL2, locname, lat, lng,uid) {
    this.userRef.child(uid).update({
      Shopname: SetupData.value.name,
      Shopimage: imageURL2,
      Location: locname,
      Shoplatitude: lat,
      Shoplongitude: lng,
      Shopnote: SetupData.value.note,
      contact: SetupData.value.contact
    });
  }

  GetShopDetails(value) {
    var promise = new Promise((resolve, reject) => {
      this.userRef.child(value).on('value', (snapshot) => {
        let temparr = [];
        snapshot.forEach(element => {
          let utype = element.child("type").val();
          temparr.push(element.val());
        });
        resolve(temparr);
      });
    });
    return promise;
  }


  GetAllDetails() {
    var promise = new Promise((resolve, reject) => {
      this.userRef.on('value', (snapshot) => {
        let temparr = [];
        snapshot.forEach(element => {
          temparr.push(element.val());
        });
        resolve(temparr);
      });
    });
    return promise;
  }

  AddUserDetails(SetupData2, imageURL2,uid) {
    this.userRef.child(uid).update({
      username: SetupData2.value.username,
      image: imageURL2,
      contact: SetupData2.value.contact
    });
  }

  RemoveShopImage(uid) {
    this.userRef.child(uid).update({
      Shopimage: ""
    });
  }

  RemoveUserImage(uid) {
    this.userRef.child(uid).update({
      image: ""
    });
  }

}
