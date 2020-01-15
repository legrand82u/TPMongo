const map= L.map('map').setView([48.6899, 6.179], 15);

const parkingIcon = L.icon({
    iconUrl: './images/park.svg',
    iconSize: [80,60],
    iconAnchor: [40,30],
    popupAnchor: [0, -10]
});

const cinemaIcon = L.icon({
    iconUrl: './images/film.svg',
    iconSize: [80,60],
    iconAnchor: [40,30],
    popupAnchor: [0, -10]
});

const markersParking = L.layerGroup();
const markersCinema = L.layerGroup();

$(document).ready( () => {
    initMap();
    getParkings().then((resultat) => {
        displayParkings(resultat);
    })
    getCinemas().then((resultat) => {
        displayCinemas(resultat);
    })
    $('#filtreParking').change(() => {
        console.log('Filtre modifié')
        if($('#filtreParking').is(":checked")){
            getParkings().then((resultat) => {
                displayParkings(resultat);
            }) 
        }

        else {
            clearParkings();
        }
    })
    $('#filtreCinema').change(() => {
        console.log('Filtre modifié')
        if($('#filtreCinema').is(":checked")){
            getCinemas().then((resultat) => {
                displayCinemas(resultat);
            }) 
        }

        else {
            clearCinemas();
        }
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
            marker.bindPopup(`<p>${parking.attributes.NOM}</p><p>${parking.attributes.PLACES}/${parking.attributes.CAPACITE}`);
            marker.addTo(markersParking);
        }
        markersParking.addTo(map);
    })
}

// Effectue une requête pour récupérer les cinémas depuis la BD
function getCinemas() {
    return new Promise((resolve,reject) => {
       fetch("http://localhost:3000/cinemas", {
           method: "GET"
       }).then((resultat) => {
           resolve(resultat)
       }).catch((err) => reject(err));
    })
}

// Affiche les parkings
function displayCinemas(cinemas) {
    cinemas.json().then((data) => {
        for (const cine of data) {
            const marker = L.marker([cine.y,cine.x], { icon: cinemaIcon});
            marker.addTo(markersCinema);
            marker.bindPopup(`<p>${cine.nom}</p>`);
        }
        markersCinema.addTo(map);
    })
}

function clearParkings() {
    markersParking.clearLayers();
}

function clearCinemas() {
    markersCinema.clearLayers();
}