'use strict';
const functions = require('firebase-functions');
const logging = require('@google-cloud/logging');
const admin = require('firebase-admin');
admin.initializeApp();

function reportError(err, context={}){
  const logName = 'errors';
  const log = logging.log(logName);

  const metadata = {
    resource:{
      type:'cloud_function',
      labels:{function_name:process.env.FUNCTION_NAME}
    }
  }

  const errorEvent = {
    message:err.stack,
    serviceContext:{
      service: process.env.FUNCTION_NAME,
      resourceType:'cloud_function'
    },
    context: context
  }

  return new Promise((resolve, reject) => {
    log.write(log.entry(metadata, errorEvent), (error) =>{
      if(error){
        return reject(error);
      }
      return resolve();
    } );
  });
}

exports.helloWorld = functions.https.onRequest((request, response) => {
  // console.error(new Error('This is a failure'));
  // throw new Error('Another failure');
  return reportError(new Error('This is the functions'),{})
  // console.info(new Error('Any error'));
  // response.status(500).send("Hello from Firebase!");
});

exports.addTodoItem = functions.https.onRequest((req, res) => {
  const original = req.query.text;
  const snapshot = admin.database().ref('/todoitems')
  .push({original: original});
  res.redirect(303, snapshot.ref.toString());
});

exports.toUpperCase = functions.database.ref('/todoitems/{pushId}/original')
    .onCreate((snapshot, context) => {
    const original = snapshot.val();
    console.log('Uppercasing', context.params.pushId, original);
    const uppercase = original.toUpperCase();
    return snapshot.ref.parent.child('uppercase').set(uppercase);
});