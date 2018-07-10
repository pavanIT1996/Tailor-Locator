import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


import firebase, { auth } from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';
@Injectable()
export class ClothesProvider {

  marketRef: any;
  userRef: any;
  uid: any;

  constructor(public authData: AuthProvider, ) {
    this.uid = this.authData.CurrentAuth();
    this.marketRef = firebase.database().ref('Market/');
    this.userRef = firebase.database().ref('Users/');
  }

  Addclothe(uid, name, imageURL2, gender, size, type, price, note, date, time) {
    var key = this.marketRef.push().key;
    this.marketRef.child(key).set({
      uid: uid,
      name: name,
      image: imageURL2,
      gender: gender,
      size: size,
      type: type,
      price: price,
      note: note,
      date: date,
      time: time,
      key:key
    });
  }

  //Update array value pass
  ClotheUpdateValues(value) {
    var array=[];
    var query = this.marketRef.orderByChild('key').equalTo(value);
    query.once('value', snapshot => {
      snapshot.forEach(element => {
        array.push(element.val());
      });
    });
    return array;
}

  updateclothe(key, value, imageURL2, date, time) {
    this.marketRef.child(key).update({
      name: value.name,
      image: imageURL2,
      gender: value.gender,
      size: value.size,
      type: value.type,
      price: value.price,
      note: value.note,
      date: date,
      time: time,
    });
  }

  removeclothe(value) {
    var query = this.marketRef.orderByChild('key').equalTo(value);
    query.once('value', snapshot => {
      snapshot.forEach(element => {
        element.ref.remove();
        return false;
      });
    });
  }

  getAllMarketList() {
    var promise = new Promise((resolve, reject) => {
      this.marketRef.on('value', (snapshot) => {
        let temparr = [];
        snapshot.forEach(element => {
          temparr.push(element.val());
        });
        resolve(temparr);
      });
    });
    return promise;
  }

  getShopDetails() {
    var promise = new Promise((resolve, reject) => {
      this.userRef.on('value', (snapshot) => {
        let temparr = [];
        snapshot.forEach(element => {
          let utype = element.child("type").val();
          if (utype === "admin") {
            temparr.push(element.val());
          }
        });
        resolve(temparr);
      });
    });
    return promise;
  }

  getPrivateMarketList(value) {
    var promise = new Promise((resolve, reject) => {
      this.marketRef.on('value', (snapshot) => {
        let temparr = [];
        snapshot.forEach(element => {
          let userid = element.child("uid").val();
          if (userid === value) {
            temparr.push(element.val());
          }
        });
        resolve(temparr);
      });
    });
    return promise;
  }

  getPublicMarketList(value) {
    var promise = new Promise((resolve, reject) => {
      this.marketRef.on('value', (snapshot) => {
        let temparr = [];
        snapshot.forEach(element => {
          let userid = element.child("uid").val();
          if (userid !== value) {
            temparr.push(element.val());
          }
        });
        resolve(temparr);
      });
    });
    return promise;
  }

}
