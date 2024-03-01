mapboxgl.accessToken =mapToken;
const map = new mapboxgl.Map({
    style: 'mapbox://styles/mapbox/streets-v11',
    container: 'map',
    center: coordinates, // starting position [lng, lat]
    zoom: 9 // starting zoom
});

const marker1 = new mapboxgl.Marker({color: "red"})
    .setLngLat(coordinates)
    .setPopup(
        new mapboxgl.Popup().setHTML(
            "<p>Exact location will be provided after booking.</p>"
        )
    )
    .addTo(map);