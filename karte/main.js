let map = L.map("map", {
    maxZoom:19
}).setView();

//Overlays definieren
let overlays = {
    Campingplätze: L.featureGroup().addTo(map),
    Supermarkt: L.featureGroup().addTo(map),
    Unterkünfte: L.featureGroup().addTo(map),
    zones: L.featureGroup().addTo(map),

}

// Layercontrol
L.control.layers({
    "BasemapAT watercolour": L.tileLayer.provider('Stadia.StamenWatercolor').addTo(map),
    "BasemapAT": L.tileLayer.provider('BasemapAT.basemap').addTo(map),
    "BasemapAT surface": L.tileLayer.provider('BasemapAT.surface').addTo(map),
    "BasemapAT orthophoto": L.tileLayer.provider('BasemapAT.orthofoto').addTo(map)
}, {
    "Sehenswürdigkeiten": overlays.sights,
    "Vienna sightseeing Linien": overlays.lines,
    "Vienna sightseeing Haltstellen": overlays.stops,
    "Fußgängerzonen": overlays.zones,
    "Hotels und Unterkünfte": overlays.hotels,
}).addTo(map);