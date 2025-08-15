
const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition((position) => {
    const data = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };
    socket.emit('locationUpdate', data);
  });
  (error) => {
    console.error('Error getting location:', error);
  },
  {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000
  }
}

const map = L.map('map').setView([0, 0], 16);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Anup Chaurasiya',
}).addTo(map);

const marker = L.marker([0, 0]).addTo(map);

const userMarkers = {};

socket.on('locationUpdate', (data) => {
    const { id, latitude, longitude } = data;
    map.setView([latitude, longitude], 16); 


    if (!userMarkers[id]) {
        userMarkers[id] = L.marker([latitude, longitude]).addTo(map);
    } else {
        userMarkers[id].setLatLng([latitude, longitude]);
    }
});

socket.on('userDisconnected', (id) => {
    if(userMarkers[id]){
        map.removeLayer(userMarkers[id]);
        delete userMarkers[id];
    }   
});