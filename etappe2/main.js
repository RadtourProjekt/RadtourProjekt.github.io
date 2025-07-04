let vorarl = {
    lat: 47.413635,
    lng: 9.742376
};

let map = L.map("map", {
    maxZoom:19
}).setView([vorarl.lat, vorarl.lng],13);

// WMTS Hintergrundlayer der eGrundkarte Tirol
let eGrundkarteTirol = {
    sommer: L.tileLayer("https://wmts.kartetirol.at/gdi_summer/{z}/{x}/{y}.png", {
        attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
    }),
    ortho: L.tileLayer("https://wmts.kartetirol.at/gdi_ortho/{z}/{x}/{y}.png", {
        attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`
    }
    ),
    nomenklatur: L.tileLayer("https://wmts.kartetirol.at/gdi_nomenklatur/{z}/{x}/{y}.png", {
        attribution: `Datenquelle: <a href="https://www.data.gv.at/katalog/dataset/land-tirol_elektronischekartetirol">eGrundkarte Tirol</a>`,
        pane: "overlayPane",
    })
}

// Overlays definieren
let overlays = {
    shops: L.markerClusterGroup({
        disableClusteringAtZoom: 17
    }), // .addto(map) um layer default zu checken
    campings: L.featureGroup().addTo(map)
};

// / Layer control mit eGrundkarte Tirol und Standardlayern
L.control.layers({
    "eGrundkarte Tirol Sommer": L.layerGroup([
        eGrundkarteTirol.sommer,
        eGrundkarteTirol.nomenklatur
    ]).addTo(map),


    "eGrundkarte Tirol Orthofoto": L.layerGroup([
        eGrundkarteTirol.ortho,
        eGrundkarteTirol.nomenklatur,
    ]),
    "OpenStreetMap": L.tileLayer.provider("OpenStreetMap.Mapnik"),
    "Esri WorldImagery": L.tileLayer.provider("Esri.WorldImagery"),
}, {
    "Campingplätze": overlays.campings,
    "Shops": overlays.shops, // .addto(map) um layer default zu checken
    
}).addTo(map);

// Maßstab
L.control.scale({
    imperial: false,
}).addTo(map);

// Einkaufszentren Vorarlberg
async function loadShops(url) { // funktion wird definiert
    //console.log(url);

    let response = await fetch(url); // anfrage an server
    let jsondata = await response.json(); // in variable schreiben
    //console.log(jsondata);

    L.geoJSON(jsondata, {
        attribution: "Datenquelle: <a href='https://data.gv.at'>Land Vorarlberg</a>",
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: `../icons/supermarkt.png`,
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37] // popup um Bildhöhe nach oben verschieben
                })
            });
        },
    }).addTo(overlays.shops); // mit leaflet in karte hinzufügen!
};

// Campingplätze Vorarlberg
async function loadCampings(url) { // funktion wird definiert
    //console.log(url);

    let response = await fetch(url); // anfrage an server
    let jsondata = await response.json(); // in variable schreiben
    //console.log(jsondata);

    L.geoJSON(jsondata, {
        attribution: "Datenquelle: <a href='https://www.campingclub.at/campingplaetze/vorarlberg'>Camping Club</a>",
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {
                icon: L.icon({
                    iconUrl: `../icons/camping.png`,
                    iconAnchor: [16, 37],
                    popupAnchor: [0, -37] // popup um Bildhöhe nach oben verschieben
                })
            });
        },
        onEachFeature: function (feature, layer) {
            console.log(feature.properties)
            layer.bindPopup(`
                <h4> ${feature.properties.name}</h4>
                <div>Tel.: ${feature.properties.tel}</div>
                `);
        }
    }).addTo(overlays.campings); // mit leaflet in karte hinzufügen!
};

loadShops("https://RadtourProjekt.github.io/data/Einkaufszentren.geojson");
loadCampings("https://RadtourProjekt.github.io/data/campings.geojson");

// LocateControl hinzufügen
L.control.locate({
    position: "topright",
    drawCircle: false,
    flyTo: true,
    strings: {
        title: "Standort anzeigen"
    },
}).addTo(map);

//Etappe 2 Gesamt
let controlElevation = L.control.elevation({
    theme: "bike-vorarlberg",
    time: false,
    elevationDiv: "#profile",
    height: 300,
}).addTo(map);
controlElevation.load("../data/etappe2.gpx");