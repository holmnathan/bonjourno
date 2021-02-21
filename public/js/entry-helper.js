"use strict";
//-----------------------------------------------------------------------------
// Prototypes
//-----------------------------------------------------------------------------

class API {
  constructor(name, url, paramaters) {
    this.name = name;
    this.paramaters = paramaters;
    this.url = this.build_url(url);
  }
  build_url(url) {
    const object_length = Object.keys(this.paramaters).length;
    let output_url = `${url}?`;
    let i = 1;
    for (const paramater in this.paramaters) {
      output_url += paramater;
      output_url += "=";
      output_url += this.paramaters[paramater];
      output_url += i !== (object_length) ? "&" : "";
      i += 1;
    }
    return output_url;
  }
  async request() {
    try {
      const response = await fetch(this.url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error.message);
    }
  }
}
//-----------------------------------------------------------------------------
// Global Variables
//-----------------------------------------------------------------------------

const ipdata = new API("ipdata", "https://api.ipdata.co", {
    "api-key": "242ce2f29a71b02db6a4f3556ae2137d49230230c8706c380985b66c"
  });
let autocomplete; // Initialize placeholder for Google Maps Autocomplete
const location_options = { // A list of fields to return from Google Maps API
  fields: ["place_id", "geometry", "name"]
};
const inputs = { // Get DOM elements needed
  weather: {
    fieldset: document.getElementById("fieldset-weather"),
    button: {
      remove: document.getElementById("button-remove-weather"),
      add: document.getElementById("button-add-weather")
    },
    field: {
      hidden: {
      weather_condition: document.getElementById("input-weather-condition"),
      weather_temp_f: document.getElementById("input-weather-temp-f"),
      weather_icon: document.getElementById("input-weather-icon")
      }
    }
  },
  location: {
    button: {
      reset: document.getElementById("button-remove-location")
    },
    field: {
      search: document.getElementById("input-location-search"),
      hidden: {
        longitude: document.getElementById("input-location-longitude"),
        latitude: document.getElementById("input-location-latitude"),
        name: document.getElementById("input-location-name"),
        place_id: document.getElementById("input-location-place-id")
      }
    },
    heading: document.getElementById("h4-location-name")
  }
}
//-----------------------------------------------------------------------------
// Google Maps Autocomplete
//-----------------------------------------------------------------------------

// Takes an object of DOM elements in format {Key: DOM Element},
// Accepts a new object in format {Matching Key: Value},
// Sets the DOM element’s value based on matching key.
const handle_field_change = (fields_object, new_values_object) => {
  for (const field in fields_object) {
    for (const value in new_values_object) {
      if (value === field) {
        fields_object[field].setAttribute("value", new_values_object[value]);
      }
    }
  }
}

const fill_form = () => {
  // Get current place from Google Maps Autocomplete field
  const place = autocomplete.getPlace();
  const new_values = {
    longitude: place.geometry.location.lng(),
    latitude: place.geometry.location.lat(),
    name: place.name,
    place_id: place.place_id
  }
  // Update hidden location fields to Google Maps Autocomplete values.
  handle_field_change(inputs.location.field.hidden, new_values);
  
  // Update Location title for end-user
  inputs.location.heading.textContent = place.name;
  inputs.location.heading.classList.remove("inactive-text");
}

// Instantiate a new Google Maps Autocomplete field.
autocomplete = new google.maps.places.Autocomplete(inputs.location.field.search, location_options);

// Add event listener for when Google Maps Autocomplete field changes.
autocomplete.addListener("place_changed", fill_form);

inputs.location.button.reset.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent form submission on click.
  
  const new_values = {
    longitude: "",
    latitude: "",
    name: "",
    place_id: ""
  }
  
  // Clear values for all hidden location fields.
  handle_field_change(inputs.location.field.hidden, new_values);
  
  // Reset Autocomplete field
  inputs.location.field.search.value = null;
  
  // Update Location title for end-user
  inputs.location.heading.textContent = "Add a Location…";
  inputs.location.heading.classList.add("inactive-text");
});
//-----------------------------------------------------------------------------
// OpenWeather
//-----------------------------------------------------------------------------

inputs.weather.button.add.addEventListener("click", async (event) => {
  event.preventDefault();
  try {
    
    let latitude = inputs.location.field.hidden.latitude.value;
    let longitude = inputs.location.field.hidden.longitude.value
    
    if ( !latitude || !longitude ) {
      const current_ip = await ipdata.request();
      
      if (current_ip) {
        latitude = current_ip.latitude;
        longitude = current_ip.longitude;
      } else {
        throw new Error("Unable to get the weather at your current location due to content blocker or privacy settings.")
      }
    }
     
    const openweather = new API("OpenWeather", "https://api.openweathermap.org/data/2.5/weather", {
      "lat": latitude,
      "lon": longitude,
      "units": "imperial",
      "appid": "3b61a76c04df0b3e820145234e10015d"
    });
    
    const current_weather = await openweather.request();
    console.log(current_weather);
    
    const new_values = {
      weather_temp_f: current_weather.main.temp,
      weather_condition: current_weather.weather[0].description,
      weather_icon: current_weather.weather[0].icon
    }
    
    // Clear values for all hidden location fields.
    handle_field_change(inputs.weather.field.hidden, new_values);
    
  } catch (error) {
    console.log(error.message);
  }
});