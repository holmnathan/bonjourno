"use strict";
//-----------------------------------------------------------------------------
// Prototypes
//-----------------------------------------------------------------------------

import dotenv from "./dotenv.mjs"

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

const get_key_name = (dom_element, attribute, position) => {
  let attribute_name;
  let name_parts;
  let array_position;
  
  try {
    if (!(dom_element instanceof Element)) {
      throw new Error(`“${dom_element}” is not a valid HTML DOM Element`);
    } else if ( dom_element.getAttribute(attribute) === null) {
      throw new Error(`“${dom_element.tagName}” element has no “${attribute}” attribute`);
    }
    
  attribute_name = dom_element.getAttribute(attribute);
  name_parts = attribute_name.split("-");
  
  if (position === "last") {
    array_position = name_parts.length - 1;
  } else if (position === "first") {
    array_position = 0;
  } else if (Number.isInteger(position)) {
    if (position < name_parts.length && position >= 0) {
      array_position = position;
    } else {
      throw new RangeError(`Position ${position} is out of range. Must be betwen 0 and ${name_parts.length - 1}`);
    }
  } else {
    throw new RangeError(`“${position}” is not a valid argument. Only an integer, “last” or “first” are allowed.`)
  }
  
    // console.log(`Element ID: “${attribute_name}”\nReturning: “${name_parts[array_position]}”`);
    return name_parts[array_position];
    
  } catch (error) {
    console.log(error.message);
  }
}


class DOM_Element {
  constructor(element, tag_names_array) {
    // Initialize property names and values.
    this.initialize(element, tag_names_array);
  }
  // Accepts an array of DOM elements and converts it to an object, with
  // a key name generated from the last word in its ID attribute.
  get_children(element_array) {
    const output = {};
    for (const element of element_array) {
      const key = get_key_name(element, "id", "last");
      if (key) {
        output[key] = element
      }
    }
    return Object.keys(output).length > 0 ? output : undefined
  }
  // Accepts a DOM element and returns the child elements whose ID attribute
  // matches arguments in ${tag_name_array} array.
  initialize(element, tag_name_array) {
    
    // console.log(elements_array)
    for (let tag_name of tag_name_array) {
        // Get child elements with an ID value that starts with ${tag_name}
        let tags = element.querySelectorAll(`[class^="tag"]`);
        
        // Get matching child elements with key names
        const tag_object = this.get_children(tags, "last")
        
        // Assign tag_object to prototype with this.${tag_name}
        if (tag_object !== undefined) {
          this[tag_name] = tag_object;
        }
      }  
    }
  }

//-----------------------------------------------------------------------------
// Global Variables
//-----------------------------------------------------------------------------

const ipdata = new API("ipdata", "https://api.ipdata.co", {
    "api-key": dotenv.IPDATA_API_KEY
  });
let autocomplete; // Initialize placeholder for Google Maps Autocomplete
const location_options = { // A list of fields to return from Google Maps API
  fields: ["place_id", "geometry", "name"]
};

const inputs = {}

for (const selector of document.querySelectorAll(".metadata-entry")) {
  const inputs_key = get_key_name(selector, "id", "last");
  inputs[inputs_key] = new DOM_Element(selector, ["button", "hidden", "input", "heading"]);
}

console.log(inputs);
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
  handle_field_change(inputs.location.hidden, new_values);
  
  // Update Location title for end-user
  inputs.location.heading.h4.textContent = place.name;
  inputs.location.heading.h4.classList.remove("inactive-text");
}

// Instantiate a new Google Maps Autocomplete 
autocomplete = new google.maps.places.Autocomplete(inputs.location.input.search, location_options);

// Add event listener for when Google Maps Autocomplete field changes.
autocomplete.addListener("place_changed", fill_form);

// Add event listener for location "reset" button
inputs.location.button.remove.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent form submission on click.
  
  const new_values = {
    longitude: "",
    latitude: "",
    name: "",
    place_id: ""
  }
  
  // Clear values for all hidden location fields.
  handle_field_change(inputs.location.hidden, new_values);
  
  // Reset Autocomplete field
  inputs.location.input.search.value = null;
  
  // Update Location title for end-user
  inputs.location.heading.h4.textContent = "Add a Location…";
  inputs.location.heading.h4.classList.add("inactive-text");
});

inputs.location.button.edit.addEventListener("click", (event) => {
  event.preventDefault();
  
  
});

//-----------------------------------------------------------------------------
// OpenWeather
//-----------------------------------------------------------------------------

inputs.weather.button.add.addEventListener("click", async (event) => {
  event.preventDefault();
  try {
    
    let latitude = inputs.location.hidden.latitude.value;
    let longitude = inputs.location.hidden.longitude.value
    
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
      "appid": dotenv.OPENWEATHER_API_KEY
    });
    
    const current_weather = await openweather.request();
    console.log(current_weather);
    
    const new_values = {
      temp_f: current_weather.main.temp,
      condition: current_weather.weather[0].description,
      icon: current_weather.weather[0].icon
    }
    
    // Clear values for all hidden weather fields.
    handle_field_change(inputs.weather.hidden, new_values);
    
  } catch (error) {
    console.log(error.message);
  }
});

inputs.weather.button.remove.addEventListener("click", async (event) => {
  try {
    const new_values = {
      temp_f: "",
      condition: "",
      icon: ""
    }
    
    // Clear values for all hidden weather fields.
    handle_field_change(inputs.weather.hidden, new_values);
  } catch (error) {
    console.log(error.message);
  }
});