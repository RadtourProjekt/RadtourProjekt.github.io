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
    }).addTo(map), // .addto(map) um layer default zu checken
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
        onEachFeature: function (feature, layer) {
            console.log(feature.properties)
            layer.bindPopup(`
                <h4> ${feature.properties.legende}</h4>
                `);
        }
    }).addTo(overlays.shops); // mit leaflet in karte hinzufügen!
};

loadShops("https://RadtourProjekt.github.io/data/Einkaufszentren.geojson");

//Etappe 3
let controlElevation = L.control.elevation({
    theme: "bike-tirol",
    time: false,
    elevationDiv: "#profile",
    height: 300,
}).addTo(map);
controlElevation.load("../data/etappe3.gpx");