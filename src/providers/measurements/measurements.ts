import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


import firebase, { auth } from 'firebase';
import { AuthProvider } from '../../providers/auth/auth';

@Injectable()
export class MeasurementsProvider {

  measurementRef: any;
  userRef: any;
  colorRef: any;
  clothesRef: any;
  sizesRef: any;
  materialRef: any;

  uid: any;

  constructor(public authData: AuthProvider, ) {
    this.uid = this.authData.CurrentAuth();
    this.measurementRef = firebase.database().ref('/Measurements');
    this.colorRef = firebase.database().ref('/Colors');
    this.userRef = firebase.database().ref('/Users');
    this.clothesRef = firebase.database().ref('/Clothes');
    this.sizesRef = firebase.database().ref('/Sizes');
    this.materialRef = firebase.database().ref('/Material');
  }

  //Send new request
  Addmeasurements(uid, shop, material, selectedcolor, dress, size, note, myDate, date, time) {
    var key = this.measurementRef.push().key;
    this.measurementRef.child(key).set({
      uid: uid,
      shop: shop,
      material: material,
      color: selectedcolor,
      dress: dress,
      size: size,
      note: note,
      date: myDate,
      posteddate: date,
      postedtime: time,
      key: key,
      Status: ''
    });
  }

  //Update points
  Updatepoints(value: number) {
    var cpoints: number;
    this.userRef.child(this.uid).on('value', (snapshot) => {
      cpoints = snapshot.child("points").val();
    });

    var points: number = cpoints + value;

    this.userRef.child(this.uid).update({
      points: points,
    });
  }

  //Get Points
  Getpoints() {
    var cpoints;
    this.userRef.child(this.uid).on('value', (snapshot) => {
      cpoints = snapshot.child("points").val();
    });
    return cpoints;
  }

  //Update request
  Updatemeasurements(value, key, date, time) {
    this.measurementRef.child(key).update({
      uid: value.uid,
      shop: value.shop,
      material: value.material,
      color: value.color,
      dress: value.dress,
      size: value.size,
      note: value.note,
      date: value.myDate,
      posteddate: date,
      postedtime: time,
    });
  }

  //Update Status of request
  UpdateStatus(key, value) {
    this.measurementRef.child(key).update({
      Status: value
    });
  }

  //Update array value pass
  Updatevalues(value) {
    var array = [];
    var query = this.measurementRef.orderByChild('key').equalTo(value);
    query.once('value', snapshot => {
      snapshot.forEach(element => {
        array.push(element.val());
      });
    });
    return array;
  }


  //Delete request
  Deletemeasurements(value) {
    var query = this.measurementRef.orderByChild('key').equalTo(value);
    query.once('value', snapshot => {
      snapshot.forEach(element => {
        element.ref.remove();
        return false
      });
    });
  }

  //Shop requests get
  getShopMeasurements(value) {
    var promise = new Promise((resolve, reject) => {
      this.measurementRef.on('value', (snapshot) => {
        let temparr = [];
        snapshot.forEach(element => {
          let shopid = element.child("shop").val();
          if (value === shopid) {
            temparr.push(element.val());
          }
        });
        resolve(temparr);
      });
    });
    return promise;
  }

  //User requests get
  getUserMeasurements(value) {
    var promise = new Promise((resolve, reject) => {
      this.measurementRef.on('value', (snapshot) => {
        let temparr = [];
        snapshot.forEach(element => {
          let userid = element.child("uid").val();
          if (value === userid) {
            temparr.push(element.val());
          }
        });
        resolve(temparr);
      });
    });
    return promise;
  }

  getAllUsers() {
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

  //Get shop names
  getShopNames() {
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

  //Get color list
  getColorsList() {
    var promise = new Promise((resolve, reject) => {
      this.colorRef.on('value', (snapshot) => {
        let temparr = [];
        snapshot.forEach(element => {
          temparr.push(element.val());
        });
        resolve(temparr);
      });
    });
    return promise;
  }

  //Get Clothes List
  getClothesList() {
    var promise = new Promise((resolve, reject) => {
      this.clothesRef.on('value', (snapshot) => {
        let temparr = [];
        snapshot.forEach(element => {
          temparr.push(element.val());
        });
        resolve(temparr);
      });
    });
    return promise;
  }

  //Get Sizes List
  getSizesList() {
    var promise = new Promise((resolve, reject) => {
      this.sizesRef.on('value', (snapshot) => {
        let temparr = [];
        snapshot.forEach(element => {
          temparr.push(element.val());
        });
        resolve(temparr);
      });
    });
    return promise;
  }

  //Get Material List
  getMaterialsList() {
    var promise = new Promise((resolve, reject) => {
      this.materialRef.on('value', (snapshot) => {
        let temparr = [];
        snapshot.forEach(element => {
          temparr.push(element.val());
        });
        resolve(temparr);
      });
    });
    return promise;
  }

}
