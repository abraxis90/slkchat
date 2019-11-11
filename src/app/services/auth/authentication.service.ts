import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { BehaviorSubject } from 'rxjs';
import { first, map } from 'rxjs/internal/operators';
import { Router } from '@angular/router';
import { User } from '../../store/users/user';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public state: BehaviorSubject<User | null> = new BehaviorSubject<User>(null);

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe((userRecord) => {
      if (userRecord) {
        this.state.next(
          new User(userRecord.uid,
            userRecord.email,
            userRecord.displayName,
            userRecord.photoURL)
        );
      } else {
        this.state.next(null);
      }
    });
  }

  login(): Promise<void> {
    return this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider())
      .then()
      .catch(err => console.error(err));
  }

  logout(): void {
    this.afAuth.auth.signOut()
      .then(() => {
        this.router.navigate(['login']);
      });
  }

  isLoggedIn(): Promise<boolean> {
    return this.state.pipe(
      first(),
      map(user => user !== null)
    ).toPromise();
  }
}
