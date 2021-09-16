import { React, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

const Map = ({ tour }) => {
  const locations = tour.locations;
  const mapId = useRef(null);

  mapboxgl.accessToken =
    'pk.eyJ1IjoiZnJvbWluZGlhMSIsImEiOiJja29zZHJwZWkwMGl6MnFsc3JtdGg4ZGZkIn0.zHRisllWeuVkVW2y2FCBYQ';

  useEffect(() => {
    let map = new mapboxgl.Map({
      container: mapId.current,
      style: 'mapbox://styles/fromindia1/ckoso76ho3fdo17kcckcc6r7e',
      scrollZoom: false,
    });
    var bounds = new mapboxgl.LngLatBounds();

    locations.forEach((loc) => {
      // create a marker
      const el = document.createElement('div');
      el.className = 'marker';

      new mapboxgl.Marker({
        element: el,
        anchor: 'bottom',
      })
        .setLngLat(loc.coordinates)
        .addTo(map);

      bounds.extend(loc.coordinates);
      //  create a pop-up
      new mapboxgl.Popup({
        offset: 30,
      })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day} ${loc.description}</p>`)
        .addTo(map);
    });
    map.fitBounds(bounds, {
      padding: {
        top: 200,
        left: 150,
        bottom: 150,
        right: 100,
      },
    });
  }, [locations]);
  // var bounds = new mapboxgl.LngLatBounds()

  // locations.forEach(loc => {
  //   // create a marker
  //    const el = document.createElement("div")
  //    el.className = "marker"

  //    new mapboxgl.Marker({
  //      element:el,
  //      anchor:"center"
  //    }).setLngLat(loc.coordinates).addTo( map)

  // });

  return (
    <>
      <section className="section-map">
        <div ref={mapId} id="map"></div>
      </section>
    </>
  );
};

export default Map;
