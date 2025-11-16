// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.13.0/firebase-messaging-compat.js')

// Initialize Firebase in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyAIjrlztHzXjwJqVvKyo0hF1Xql5kiiuFY",
  authDomain: "the-little-things-79742.firebaseapp.com",
  projectId: "the-little-things-79742",
  storageBucket: "the-little-things-79742.firebasestorage.app",
  messagingSenderId: "571747956247",
  appId: "1:571747956247:web:e8a904dc3a5229d8f3ce52"
})

const messaging = firebase.messaging()

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload)

  const notificationTitle = payload.notification?.title || 'The Little Things'
  const notificationOptions = {
    body: payload.notification?.body || 'A gentle reminder for you',
    icon: '/pwa-192x192.png',
    badge: '/pwa-64x64.png',
    tag: 'little-things-notification',
    requireInteraction: false,
    data: payload.data
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event)
  event.notification.close()

  // Open the app when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // If app is already open, focus it
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus()
          }
        }
        // Otherwise, open a new window
        if (clients.openWindow) {
          return clients.openWindow('/')
        }
      })
  )
})
