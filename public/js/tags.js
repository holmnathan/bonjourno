"use strict";

const button_color = document.getElementById("button-tag-color");

const fieldset_color = document.getElementById("fieldset-tag-color");

const hidden_field = document.getElementById("input-tag_color-id");

const color_choice = fieldset_color.querySelectorAll(".color-id");

for (const choice of color_choice) {
  choice.addEventListener("click", (event) => {
    event.preventDefault();
    
    const css_class = `tag-${choice.dataset.colorName}`;
    button_color.classList.remove("tag-red", "tag-orange", "tag-yellow", "tag-green", "tag-blue", "tag-purple");
    button_color.classList.add(css_class);
    hidden_field.value=choice.dataset.colorId;
    
    fieldset_color.classList.add("hidden-popover");
  });
}

console.log(color_choice);

button_color.addEventListener("click", (event) => {
  event.preventDefault();
  
  fieldset_color.classList.toggle("hidden-popover");
})

const test = document.querySelectorAll("[data-is-tag]");

for (const form of test) {
  const input = form.querySelector("input");
  input.setAttribute("type", "hidden");
  const span = document.createElement("span")
  span.innerText = input.value
  span.setAttribute("contentEditable", "true")
  form.prepend(span);
  span.addEventListener("input", (event) => {
    input.value = event.target.innerText;
  });
  
  const button_delete = form.querySelector("[data-button-delete]")
  // button_delete.addEventListener("click", (event) => {
  //   event.preventDefault();
  //   window.alert(`Are you sure you want to delete "${span.innerText}" from your library?`)
  // })
}