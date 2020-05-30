import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});


export const getStudent = functions.https.onRequest((request, response) => {
    admin.firestore().doc('students/etrupja').get()
    .then(snapshot => {
        response.send(snapshot.data());
    })
    .catch(error => {
        response.status(500).send("Something went wrong!");
    })
})