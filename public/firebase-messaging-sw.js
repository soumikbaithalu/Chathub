import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/5.9.4/firebase-messaging.js");
const firebaseConfig = {
  apiKey: "AIzaSyBaIYyoUD9Xl_fCaf2Hrvvg04Wm7CEfsN8",
  authDomain: "whatsapp-clone-react-f7071.firebaseapp.com",
  projectId: "whatsapp-clone-react-f7071",
  storageBucket: "whatsapp-clone-react-f7071.appspot.com",
  messagingSenderId: "495403742208",
  appId: "1:495403742208:web:e70a9f1dd7a087a063d4e5",
  measurementId: "G-JWKW7KGYMY",
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function (payload) {
  const promiseChain = clients
    .matchAll({
      type: "window",
      includeUncontrolled: true,
    })
    .then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        windowClient.postMessage(payload);
      }
    })
    .then(() => {
      return registration.showNotification("my notification title");
    });
  return promiseChain;
});
self.addEventListener("notificationclick", function (event) {
  //Action whatever happens on notification click
});
