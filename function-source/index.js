// Cart Chart PDX Dialogflow VUI
'use strict';
 
const functions = require('firebase-functions');
const {WebhookClient} = require('dialogflow-fulfillment');
const {Card, Suggestion} = require('dialogflow-fulfillment');
const axios = require('axios');
 
process.env.DEBUG = 'dialogflow:debug'; // enables lib debugging statements
 
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
  const agent = new WebhookClient({ request, response });
  console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
  console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

  function welcome(agent) {
    agent.add(`Welcome to Cart Chart PDX. Let's find some food carts!`);
  }
  
  function help(agent) {
    agent.add(`I can help find food carts! For example, ask for a cart by food type or neighborhood. Or just say: random cart.`);
  }
 
  function fallback(agent) {
    agent.add(`I didn't understand`);
    agent.add(`I'm sorry, can you try again?`);
  }
  
  // food cart database 
  const cartList = {
    byPod: [
      { podName: 'Heist', 
        region: 'southeast',
        neighborhood: 'Woodstock',
        carts: [     
          { cartName: 'Fresh N Funky', cuisine: 'American', dish: 'burgers' },
          { cartName: 'Smaaken', cuisine: 'brunch', dish: 'brunch' },
          { cartName: 'Indian Rasoi', cuisine: 'Indian', dish: 'masala' },
          { cartName: 'Island Style Grill', cuisine: 'Hawaiian', dish: 'Hawaiian food' },
          { cartName: 'Sammich', cuisine: 'American', dish: 'sandwiches' }
      ]},
      { podName: 'Hinterland', 
        region: 'Mt. Tabor',
        neighborhood: 'division',
        carts: [     
          { cartName: 'Hunker Down', cuisine: 'American', dish: 'burgers' },
          { cartName: 'Thai Panther', cuisine: 'Thai', dish: 'curry' },
          { cartName: 'Matts BBQ Tacos', cuisine: 'Southern', dish: 'BBQ' },
          { cartName: 'Pizza Gold', cuisine: 'Italian', dish: 'pizza' }
      ]},
      { podName: 'Rose City', 
        region: 'northeast',
        neighborhood: 'Hollywood',
        carts: [     
          { cartName: 'Lets Roll', cuisine: 'Japanese', dish: 'sushi' },
          { cartName: 'Rocket Breakfast', cuisine: 'American', dish: 'brunch' },
          { cartName: 'Simply Thai', cuisine: 'Thai', curry: 'curry' },
          { cartName: 'El Guero', cuisine: 'Mexican', dish: 'tacos' },
          { cartName: 'Adda Beer', cuisine: 'beverage', dish: 'beverages' }
      ]},
      { podName: 'Piknik Park', 
        region: 'Sellwood',
       	neighborhood: 'Sellwood',
        carts: [
          { cartName: 'Village Kitchen', cuisine: 'Burmese', dish: 'Burmese food' },
          { cartName: 'Jin Dak', cuisine: 'Korean', dish: 'Korean food' },
          { cartName: 'Uncle Tsang', cuisine: 'Chinese', dish: 'veggie options' },
          { cartName: 'Taste of Casablanca', cuisine: 'Moroccan', dish: 'falafel' }
      ]},
      { podName: 'Cart Blocks', 
        region: 'downtown',
        neighborhoods: 'downtown',
        carts: [
          { cartName: 'Villa Angel Taqueria', cuisine: 'Mexican', dish: 'tacos' },
          { cartName: 'Kim Jong Grillin', cuisine: 'Korean', dish: 'Korean food' },
          { cartName: 'Rachel and Rose', cuisine: 'beverage', dish: 'beverages' }
      ]},
      { podName: 'The Lot', 
        region: 'Mt. Tabor',
        neighborhoods: 'Division',
        carts: [
          { cartName: 'Namu', cuisine: 'Hawaiian', dish: 'Hawaiian food' },
          { cartName: 'Garden Monsters', cuisine: 'veggie options', dish: 'veggie options' },
          { cartName: 'Gyro Kingdom', cuisine: 'Mediterranean', dish: 'gyros' },
          { cartName: 'The Dog House', cuisine: 'American', dish: 'burgers' }
      ]},
      { podName: 'Cartopia', 
        region: 'Buckman',
        neighborhood: 'Buckman',
        carts: [
          { cartName: 'Pyro Pizza', cuisine: 'Italian', dish: 'pizza' },
          { cartName: 'Chicken and Guns', cuisine: 'Peruvian', dish: 'chicken' },
          { cartName: 'Tahrir Square', cuisine: 'Mediterranean', dish: 'gyros' },
          { cartName: 'Potato Champion', cuisine: 'American', dish: 'fries' }
      ]},
      { podName: 'St. Johns Beer Porch', 
        region: 'St. Johns',
        neighborhood: 'St. Johns',
        carts: [
          { cartName: 'Flourish', cuisine: 'veggie options', dish: 'veggie options' },
          { cartName: 'Pizza Creature', cuisine: 'Italian', dish: 'pizza' },
          { cartName: 'Sissys Beverage Emporium', cuisine: 'beverage', dish: 'beverages' },
          { cartName: 'Two of Us', cuisine: 'American', dish: 'brunch' },
          { cartName: 'NoPoBoys', cuisine: 'Cajun Creole', dish: 'sandiwches' },
          { cartName: 'Mangiamo', cuisine: 'Italian', dish: 'pasta' },
          { cartName: 'Cozo Grill', cuisine: 'veggie options', dish: 'sandwiches' }
      ]},
      { podName: 'Hawthorne Asylum', 
        region: 'Buckman',
        neighborhood: 'Buckman',
        carts: [
          { cartName: 'Daily Fuel', cuisine: 'veggie options', dish: 'veggie options' },
          { cartName: 'Asylum Spirits', cuisine: 'beverage', dish: 'beverages' },
          { cartName: 'Tall Boy Fish & Chips', cuisine: 'British', dish: 'fish and chips' }
      ]},
      { podName: 'Upright Brewing Beer Station', 
        region: 'northeast',
        neighborhood: 'Cully',
        carts: [
          { cartName: 'Ninos Birrieria', cuisine: 'Mexican', dish: 'birria' },
          { cartName: 'Upright Beer', cuisine: 'beverage', dish: 'beverages' },
          { cartName: 'Pine State Biscuits Airstream', cuisine: 'Southern', dish: 'brunch' }
      ]},
      { podName: 'Springwater', 
        region: 'Johnson Creek',
        neighborhood: 'Johnson Creek',
        carts: [     
          { cartName: 'Taqueria Brothers Express', cuisine: 'Mexican', dish: 'tacos' },
          { cartName: 'Griddly Bear', cuisine: 'American', dish: 'brunch' },
          { cartName: 'The Rock House Grill', cuisine: 'American', dish: 'burgers' },
          { cartName: 'Suki Ramen', cuisine: 'Japanese', dish: 'ramen' }
      ]},
      { podName: 'PSU', 
        region: 'downtown',
        neighborhood: 'downtown',
        carts: [     
          { cartName: 'Chunky Subs', cuisine: 'American', dish: 'sandwiches' },
          { cartName: 'Dosirak', cuisine: 'Korean', dish: 'bento' },
          { cartName: 'PoomPui', cuisine: 'Thai', dish: 'curry' },
          { cartName: 'Old Taste of India', cuisine: 'Indian', dish: 'masala' }
      ]},
      { podName: 'Hawthorne and 32nd', 
        region: 'Hawthorne',
        neighborhood: 'Hawthorne',
        carts: [     
          { cartName: 'Birrieria Pepe Chile', cuisine: 'Mexican', dish: 'birria' },
          { cartName: 'Tov Coffee & Tea', cuisine: 'beverages', dish: 'beverages' },
          { cartName: 'JAB Thai', cuisine: 'Thai', dish: 'curry' },
          { cartName: 'La Morenita', cuisine: 'Mexican', dish: 'tacos' }
      ]},
      { podName: 'Prost Marketplace', 
        region: 'north',
        neighborhood: 'Mississippi',
        carts: [     
          { cartName: 'Koi Fusion', cuisine: 'Asian Fusion', dish: 'Asian fusion' },
          { cartName: 'Native Bowl', cuisine: 'veggie options', dish: 'veggie options' },
          { cartName: 'Burger Stevens', cuisine: 'American', dish: 'burgers' },
          { cartName: 'Fried Egg Im In Love', cuisine: 'American', dish: 'brunch' },
          { cartName: 'DesiPDX', cuisine: 'Indian', dish: 'curry' }
      ]},
      { podName: 'Hillsdale', 
        region: 'southwest',
        neighborhood: 'Hillsdale',
        carts: [
          { cartName: 'Mama Noors', cuisine: 'Indian',dish: 'Indian food' },
          { cartName: 'Phat Cart',  cuisine: 'Asian Fusion', dish: 'bento' },
          { cartName: 'Sushi Lover PDX',  cuisine: 'Japanese', dish: 'sushi' },
          { cartName: 'Taco City Taco Truck', cuisine: 'Mexican', dish: 'tacos' }
      ]}
    ]
  };

  // true if agent found cart options
  let optCheck = false;

  function findByPod(agent) {
    const cartPod = agent.parameters.cartpod;    
    for (let i = 0; i < cartList.byPod.length; i++) {
      if (cartList.byPod[i].podName == cartPod) {
        optCheck = true;
          agent.add(`These carts are at the ${cartPod} pod:`);
          for (let j = 0; j < cartList.byPod[i].carts.length; j++) {
            agent.add(`${cartList.byPod[i].carts[j].cartName} has ${cartList.byPod[i].carts[j].dish},`);
          }
      }
    }
    if (optCheck == false) {
      agent.add(`Sorry... I couldn't find that cart pod.`);
    }
  }
  
  function findByLocation(agent) {
    const region = agent.parameters.pdxneighborhoods;
    const dish = agent.parameters.dish;
    const cuisine = agent.parameters.cuisine;
    
    agent.add(`Okay, let me check that area...`);
    for (let i = 0; i < cartList.byPod.length; i++) {
      if (cartList.byPod[i].region == region) {   
        if (dish || cuisine) {
          for (let j = 0; j < cartList.byPod[i].carts.length; j++) {
            if ((cartList.byPod[i].carts[j].dish == dish) || (cartList.byPod[i].carts[j].cuisine == cuisine)) {
              optCheck = true;
              agent.add(`${cartList.byPod[i].carts[j].cartName} is at ${cartList.byPod[i].podName} cart pod,`); 
            }
          }
        }
        else {
          optCheck = true;
          agent.add(`These carts are at the ${cartList.byPod[i].podName} pod:`);
          for (let j = 0; j < cartList.byPod[i].carts.length; j++) {
            agent.add(`${cartList.byPod[i].carts[j].cartName} has ${cartList.byPod[i].carts[j].dish},`);
          }
        }
      }
    }
    if (optCheck == false) {
      agent.add(`Sorry... I couldn't find anything in that area!`);
    }
    else {
      agent.add(`If you want to know more about a cart, just tell me it's name.`);
    }
  }
  
  function findByCuisine(agent) {
    let dish = agent.parameters.dish;
    let cuisine = agent.parameters.cuisine;
    
    agent.add(`Here are some options for ${dish || cuisine}:`);
    for (let x = 0; x < cartList.byPod.length; x++) {
      for (let y = 0; y < cartList.byPod[x].carts.length; y++) {
        if ((cartList.byPod[x].carts[y].dish == dish) || (cartList.byPod[x].carts[y].cuisine == cuisine)) {
          optCheck = true;
          let tempCart = cartList.byPod[x];
          agent.add(`${tempCart.carts[y].cartName} is in the ${tempCart.region} region,`); 
        }
      }
    }
    if (optCheck == false) {
      agent.add(`Oops... no options found! Please try again.`);
    }
    else {
      agent.add(`If you want to know more about a cart, just tell me it's name.`);
    }
  }
  
  function getNeighborhood(matchName) {
    for (let x = 0; x < cartList.byPod.length; x++) {
      for (let y = 0; y < cartList.byPod[x].carts.length; y++) {
        if (cartList.byPod[x].carts[y].cartName == matchName) {
          return cartList.byPod[x];
        }
      }
    }
  }
  
  function cartInfo(agent) {
	const searchName = agent.parameters.cartName;
    const cartData = getNeighborhood(searchName);
    const searchNeighborhood = cartData.neighborhood;
    const podData = cartData.podName;
    return axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=place_id%2Cname%2Crating%2Copening_hours&input=${searchName}%20${searchNeighborhood}%20portland%20oregon&inputtype=textquery&key=<YOUR_API_KEY>`)
      .then(function (value){
        const resultCart = value.data.candidates[0];
        agent.context.set("cartcontext", 5, {cName: searchName, placeId: resultCart.place_id, pod: podData});
        let toAdd = `${resultCart.name} has a Google rating of ${resultCart.rating} out of 5,`;
        if (resultCart.opening_hours.open_now) {
          toAdd += ` and is currently open.`;	 
        }
        else {
          toAdd += ` but it doesn't look like it's open right now.`;
        }
        toAdd += ` If you'd like more cart details, just say: more info.`;
        agent.add(toAdd);
      }).catch(function (error) {
        agent.add(`Sorry, I'm having trouble finding that cart.`);
        console.log(error);
      });
  }
  
  function moreInfo(agent) {
    const searchId = agent.context.get("cartcontext").parameters.placeId;
    return axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${searchId}&key=<YOUR_API_KEY>`)
    .then(function (ret){
      const cartInfo = ret.data.result;
      if (cartInfo.website) {
      	agent.add(`Here's their website: ${cartInfo.website} .`);
      }
      else {
		agent.add(`I couldn't find a website for that cart.`);
      }
      agent.add(`To hear hours, say: hours,`);
      agent.add(`To get a top review, say: review,`);
      agent.add(`To hear the cart location, say: area.`);
      
      let rand = Math.floor(Math.random() * 5);
      const searchPod = agent.context.get("cartcontext").parameters.pod;
      const nameOfCart = agent.context.get("cartcontext").parameters.cName;
      agent.context.set("cartcontext", 5, {cName: nameOfCart, area: cartInfo.vicinity, review: cartInfo.reviews[rand], hours: cartInfo.current_opening_hours, pod: searchPod});
    }).catch(function (error) {
      agent.add(`Sorry, I couldn't find that cart.`);
      console.log(error);
    });
  }
    
  function getReview(agent) {
  	const cartReview = agent.context.get("cartcontext").parameters.review;
    agent.add(`Here's what ${cartReview.author_name} had to say: ${cartReview.text}.`);
  }
  
  function getDirections(agent) {
    const contextPod = agent.context.get("cartcontext").parameters.pod;
    const cartArea = agent.context.get("cartcontext").parameters.area;
    const cartsName = agent.context.get("cartcontext").parameters.cName;
    agent.add(`${cartsName} can be found at ${contextPod}: ${cartArea}.`);
  }
  
  function getHours(agent) {
    const cartHours = agent.context.get("cartcontext").parameters.hours;
    const cartsName = agent.context.get("cartcontext").parameters.cName;
    agent.add(`Hours for ${cartsName}:`);
    for (let i = 0; i < 7; ++i) {
      agent.add(`${cartHours.weekday_text[i]},`);
    }
  }
  
  function randomCart (agent) {
    let randPod = Math.floor(Math.random() * cartList.byPod.length);
    let randCart = Math.floor(Math.random() * cartList.byPod[randPod].carts.length);
    agent.parameters.cartName = cartList.byPod[randPod].carts[randCart].cartName;
    agent.add(`Finding a random cart...`);
  	agent.setFollowupEvent({ name: 'getInfo', parameters: {cartName: cartList.byPod[randPod].carts[randCart].cartName}, languageCode: 'en-US' });
  }
  
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Fallback Intent', fallback);
  intentMap.set('Find by Location', findByLocation);
  intentMap.set('Find By Cuisine', findByCuisine);
  intentMap.set('Cart Info', cartInfo);
  intentMap.set('More Info', moreInfo);
  intentMap.set('Random Cart', randomCart);
  intentMap.set('Get Review', getReview);
  intentMap.set('Get Hours', getHours);
  intentMap.set('Get Help', help);
  intentMap.set('Get Directions', getDirections);
  intentMap.set('Find Pod', findByPod);
  agent.handleRequest(intentMap);
});
