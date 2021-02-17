const db = require('./models')
const async = require('async')

const run_image_source = async () => {

const [source_name, source_created] = await db.image_source.findOrCreate({
  where: {
  name: "unsplash",
  url: "https://res.cloudinary.com/cakebake/image/upload/"
}
});

  console.log("------------------------------");
  console.log("UUID: ", source_name.id);
  console.log("Name: ", source_name.name);
  console.log("Name: ", source_name.url);
  console.log("------------------------------");

}

const run_image = async () => {

const [image_name, image_created] = await db.image.findOrCreate({
  where: {
  source_value: "8asdf9asdf0"
}
});

const [image_source_name, image_source_created] = await db.image_source.findOrCreate({
  where: {
  name: "unsplash",
  url: "https://res.cloudinary.com/cakebake/image/upload/"
}
});

  console.log("------------------------------");
  console.log("UUID: ", source_name.id);
  console.log("Name: ", source_name.name);
  console.log("Name: ", source_name.url);
  console.log("------------------------------");

}

const run_user = async () => {

const [user_name, user_created] = await db.user.findOrCreate({
  where: {
  full_name: "Jonathan Appleseed",
  display_name: "Johnny",
  email: "johnny@appleseed.com",
  birth_date: "1962-01-21",
  password: "test",
  username: "jseed".toLowerCase()
}
});

const [image_source, source_created] = await db.image_source.findOrCreate({
  where: {
    name: "cloudinary",
    url: "http://www.cloudinary.com"
  }
});
 
const [image_name, image_created] = await db.image.findOrCreate({
  where: {
    source_value: "THIS IMAGE"
  }
});

const getMethods = (obj) => {
  let properties = new Set()
  let currentObj = obj
  do {
    Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
  } while ((currentObj = Object.getPrototypeOf(currentObj)))
  return [...properties.keys()].filter(item => typeof obj[item] === 'function')
}

console.log("------------------------------");
console.log("Image Source Name: ", getMethods(image_name));
console.log("Image Source Value: ", image_name.source_value);
console.log("------------------------------\n\n\n");

image_name.setImage_source(image_source);
// 
user_name.setImage(image_name);

  console.log("------------------------------");
  console.log("UUID: ", user_name.id);
  console.log("Name: ", user_name.full_name);
  console.log("Display Name: ", user_name.display_name);
  console.log("Username: ", user_name.username);
  console.log("------------------------------");
  console.log("Birth Date: ", user_name.birth_date);
  console.log("Email: ", user_name.email);
  console.log("------------------------------");

}

const testAssociation = async () => {
  const result = await db.user.findOne({
    where: { id: 3 },
    include: db.image
  });
  
  console.log(result.image.dataValues);
}

// run_image_source();
run_user();

// testAssociation();


// console.log(db.image_source);