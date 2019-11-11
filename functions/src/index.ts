import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

/**
 * Function triggered onCreateUser. Adds a doc to the `USERS` collections using the provided UserRecord from Auth.
 * @type {CloudFunction<UserRecord>}
 */
exports.onCreateUser = functions.auth.user()
  .onCreate((user) => {

    const userInfo = {
      fullName: user.displayName || '',
      email: user.email || '',
      avatarURL: user.photoURL || ''
    };

    return db.collection('USERS').doc(user.uid).set(userInfo);
  });

/**
 * Function triggered onDeleteUser. Removes a doc from the `USERS` collections using the provided UserRecord from Auth.
 * @type {CloudFunction<UserRecord>}
 */
exports.onDeleteUser = functions.auth.user().onDelete((user) => {
  return db.collection('USERS').doc(user.uid).delete();
});
