"use strict";


const search_options = {
  fields: ["place_id", "geometry", "name"]
};

const input_field = document.getElementById("input-location");

const fill_form = () => {
  const place = autocomplete.getPlace();
  console.log(place.geometry.location);
  const form_elements = {
    longitude: place.geometry.location.lng(),
    latitude: place.geometry.location.lat(),
    name: place.name,
    place_id: place.place_id
  }
  
  for (const element in form_elements) {
    document.getElementById(`input-location-${element}`).setAttribute("value", form_elements[element]);
  }
}

const autocomplete = new google.maps.places.Autocomplete(input_field, search_options);

autocomplete.addListener("place_changed", fill_form);