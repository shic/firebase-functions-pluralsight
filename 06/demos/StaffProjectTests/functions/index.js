'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

//Http-Functions
exports.addTodoItem = functions.https.onRequest((req, res) => {
  const original = req.query.text;
  const snapshot = admin.database().ref('/todoitems')
  .push({original: original});
  res.redirect(303, snapshot.ref.toString());
});

//Non-Http Function
exports.toUpperCase = functions.database.ref('/todoitems/{pushId}/original')
    .onCreate((snapshot, context) => {
    const original = snapshot.val();
    console.log('Uppercasing', context.params.pushId, original);
    const uppercase = original.toUpperCase();
    return snapshot.ref.parent.child('uppercase').set(uppercase);
});