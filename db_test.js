const db = require('./models');
const async = require('async');
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

//-----------------------------------------------------------------------------

const run_user = async () => {

const [user_name, user_created] = await db.user.findOrCreate({
  where: {
  full_name: "Jenny Miller",
  display_name: "Jenny",
  email: "jenny@miller.com",
  birth_date: "1965-02-21",
  password: "test",
  username: "jennymill".toLowerCase()
}
});

// const [image_source, source_created] = await db.image_source.findOrCreate({
//   where: {
//     name: "cloudinary",
//     url: "https://res.cloudinary.com/"
//   }
// });
//  
// const [image_name, image_created] = await db.image.findOrCreate({
//   where: {
//     asset_id: "THIS IMAGE"
//   }
// });

// const getMethods = (obj) => {
//   let properties = new Set()
//   let currentObj = obj
//   do {
//     Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
//   } while ((currentObj = Object.getPrototypeOf(currentObj)))
//   return [...properties.keys()].filter(item => typeof obj[item] === 'function')
// }
// 
// console.log("------------------------------");
// console.log("Image Source Name: ", getMethods(image_name));
// console.log("Image Source Value: ", image_name.source_value);
// console.log("------------------------------\n\n\n");

// image_name.setImage_source(image_source);
// user_name.setImage(image_name);

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

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------

const run_journal = async () => {

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

const [journal_name, journal_created] = await db.journal_entry.findOrCreate({
  where: {
  body: "Johnny",
  temperature_kelvin: 255,
  weather: "Sunny"
}
});
 
const [image_name, image_created] = await db.image.findOrCreate({
  where: {
    asset_id: "NEW AND EXCITING IMAGE"
  }
});

// const getMethods = (obj) => {
//   let properties = new Set()
//   let currentObj = obj
//   do {
//     Object.getOwnPropertyNames(currentObj).map(item => properties.add(item))
//   } while ((currentObj = Object.getPrototypeOf(currentObj)))
//   return [...properties.keys()].filter(item => typeof obj[item] === 'function')
// }
// 
// console.log("------------------------------");
// console.log("Image Source Name: ", getMethods(image_name));
// console.log("Image Source Value: ", image_name.source_value);
// console.log("------------------------------\n\n\n");

journal_name.setImage(image_name);
user_name.addJournal_entry(journal_name);

  console.log("------------------------------");
  console.log("UUID: ", journal_name.id);
  console.log("Name: ", user_name.full_name);
  console.log("Journal Title: ", journal_name.title);
  console.log("Journal Body: ", journal_name.body);
  console.log("------------------------------");
  console.log("Image Asset: ", image_name.asset_id);
  console.log("------------------------------");

}

//-----------------------------------------------------------------------------

const testAssociation = async () => {
  const result = await db.image.findOne({
    where: { id: "ThVirZM1sTk" },
    include: [db.image_source]
  });
  
  console.log(result.image_source.dataValues);
}

const createUser = async () => {
  try {
    const new_user = await db.user.create({
      full_name: "Jonathan Appleseed",
      display_name: "Johnny",
      email: "johnny@appleseed.com",
      birth_date: "1962-01-21",
      password: "test",
      username: "jseed".toLowerCase(),
    });
    return {
      success: true,
      id: new_user.full_name
    };
  } catch (e) {
    console.log('error creating user:', e);
  }
}

const createJournal = async () => {
  try {
    const new_entry = await db.journal_entry.create({
      title: "Vacation Pictures",
      body: "I just went to the Bahamas and here are my thoughts about the Bahamas ",
      user_id: "4"
    });
    return {
      success: true,
      id: new_entry.title
    };
  } catch (e) {
    console.log('error creating user:', e);
  }
}

const createImage = async () => {
  try {
    const new_image = await db.image.create({
      asset_id: "asdfasdfasdf"
      })
      }
      catch (e) {
    console.log('error creating image:', e);
  }
}

const bulkInsert = async () => {
  await db.tag_color.bulkCreate([
    {name: "red"},
    {name: "orange"},
    {name: "yellow"},
    {name: "green"},
    {name: "blue"},
    {name: "purple"}
  ])
}

const bulkTag = async () => {
  const temp = await db.tag.create(
    {
      name: "Yoddy",
      color: {
        id: 3,
        name: "yellow"
      }
    }, {
      include: [{ association: db.tag_color, as: "color" }],
    }
  );
}

const tag_entryy = async () => {
  try {
    const entry = db.journal_entry.addTag({
      where: {
        user_id: 1
        
      }
    });
  } catch (error) {
    console.log(error.message);
  }
  
}

// bulkInsert();
// bulkTag();

// createImage();
// createUser();
// createJournal();

// run_image_source();
// run_user();
// run_journal();

// testAssociation();


// console.log(db.image_source);

