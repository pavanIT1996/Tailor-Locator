import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import firebase, { auth } from 'firebase';
import { log } from '@firebase/database/dist/esm/src/core/util/util';
import { AngularFireAuth } from 'angularfire2/auth';
import { Item } from 'ionic-angular';
// import { AngularFireAuth } from 'angularfire2/auth';
// import { AngularFireDatabase ,AngularFireList} from 'angularfire2/database';

@Injectable()
export class AuthProvider {

  public userid: any;

  loggedinData = {
    email: '',
    uid: '',
  };

  userref: any;
  user: any;
  public type: string = "user";

  constructor(
    private afAuth: AngularFireAuth) {
    console.log('Hello AuthProvider Provider');
  }

  loginUser(email: string, password: string): Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  signupUser(email: string, password: string): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(newUser => {
        this.userid = firebase.auth().currentUser.uid;
        firebase
          .database()
          .ref('/Users')
          .child(newUser.uid)
          .set({ email: email, id: this.userid, type: "user", points: 100 });
      });
  }


  signupShop(email: string, password: string): Promise<any> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(newUser => {
        this.userid = firebase.auth().currentUser.uid;
        firebase
          .database()
          .ref('/Users')
          .child(newUser.uid)
          .set({ email: email, id: this.userid, type: "admin", points: 100 });
      });
  }

  resetPassword(email: string): Promise<void> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  sendEmailVerification(email: string) {
    return firebase.auth().currentUser.sendEmailVerification();
  }

  logoutUser(): Promise<void> {
    return firebase.auth().signOut();
  }

  CurrentAuth() {
    this.loggedinData.uid = this.afAuth.auth.currentUser.uid;
    return this.loggedinData.uid;
  }

  CurrentUserType(value) {
    this.userref = firebase.database().ref('Users/' + value);
    this.userref.on('value', snapshot => {
      this.user = [];
      return this.type = snapshot.child("type").val();
    });
    return this.type
  }

  getUsersDetails(value) {
    this.userref = firebase.database().ref('Users/' + value);
    var promise = new Promise((resolve, reject) => {
      this.userref.on('value', (snapshot) => {
        let temparr = [];
        temparr.push(snapshot.val());
        resolve(temparr);
      });
    });
    return promise;
  }

}
