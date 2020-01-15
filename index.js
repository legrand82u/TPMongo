const map= L.map('map').setView([48.7037, 6.1306], 12);

const parkingIcon = L.icon({
    iconUrl: './images/park.svg',
    iconSize: [80,60],
    iconAnchor: [40,30],
    popupAnchor: [0, -10]
});

$(document).ready( () => {
    initMap();
    getParkings().then((resultat) => {
        displayParkings(resultat);
    })
})

// Initialisation de la map
function initMap() {
    const tiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
      minZoom: 2.5
    });
    tiles.addTo(map);
}

// Effectue une requête pour récupérer les parkings depuis la BD
function getParkings() {
     return new Promise((resolve,reject) => {
        fetch("http://localhost:3000/parkings", {
            method: "GET"
        }).then((resultat) => {
            resolve(resultat)
        }).catch((err) => reject(err));
     })
}

// Affiche les parkings
function displayParkings(parkings) {
    parkings.json().then((data) => {
        for (const parking of data) {
            const marker = L.marker([parking.geometry.y,parking.geometry.x], { icon: parkingIcon});
            marker.addTo(map);
            marker.bindPopup(`<p>${parking.name}</p>`);
        }
    })
}