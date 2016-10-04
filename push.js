function urlBase64ToUint8Array(base64String) {
  var padding = '='.repeat((4 - base64String.length % 4) % 4);
  var base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
  var rawData = window.atob(base64);
  var outputArray = new Uint8Array(rawData.length);

  for (var i = 0, n = rawData.length; i < n; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

document.addEventListener('DOMContentLoaded', function () {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistration().then(function (registration) {
      navigator.serviceWorker.register('/push-sw.js', { scope: '/' }).then(function (registration) {
        navigator.serviceWorker.ready.then(function (sw) {
          Notification.requestPermission(function (permission) {
            if (permission !== 'denied') {
              // sw.pushManager.getSubscription().then(function (subscription) {
              //   return subscription.unsubscribe();
              // }).then(function (successful) {
              //   console.log("successful:", successful);
              // }).catch(console.error);
              var applicationServerKey = urlBase64ToUint8Array('BFn00OL-Fb56exz43l-THJHCbyP8K8bXDC7HzUOdkphCz7whsESosWRK4sLYcr4CX1OMCxxJF0P7U34oJGDhFnc');

              sw.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: applicationServerKey,
              }).then(function (subscription) {
                console.log('subscription.endpoint = ' + subscription.endpoint);
                console.log('subscription.keys.p256dh = ' + subscription.getKey('p256dh'));
                console.log('subscription.keys.auth = ' + subscription.getKey('auth'));
                console.log(subscription.toJSON());
              });
            }
          });
        });
      }).catch(console.error);
    });
  }
});
