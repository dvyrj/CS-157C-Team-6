const express = require('express');
const router = express.Router();
const uuid = require('uuid');

const CassandraClient = require('../databaseConn.js');
const connection = require('../resources.js');

router.post('/api/createRestaurant', async (req, res) => {

  const restaurant = req.body;
  console.log('Adding a Restaurant', restaurant);
  const insert_restaurant_sql = `INSERT INTO restaurants (restaurant_id, store_name, store_location, owner_email ) values ('` + uuid.v4() + `',?,?,?)`
  CassandraClient.execute(insert_restaurant_sql, [restaurant.storeName, restaurant.storeLocation, restaurant.ownerEmail], async function (error) {
    if (error) {
      console.log(error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.writeHead(310, {
          'Content-Type': 'text/plain'
        });
        res.end(error.code);
      }
      else {
        res.writeHead(400, {
          'Content-Type': 'text/plain'
        });
        res.end(error.code);
      }
    }
    else {
      console.log('Restaurant Added');
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end('Restaurant Added Successfully');
    }
  });
});

router.post('/api/saveRestaurantProfile', async (req, res) => {

  const restaurantProfile = req.body;
  console.log(restaurantProfile);
  const update_res = `UPDATE restaurants set store_name = ? ,  store_location = ? , description = ? , restaurant_img = ?, cuisine = ?, timings = ? , delivery_type = ?, dishes_type = ?, phone = ?, street = ?, state = ?, country = ?, pincode = ? where owner_email= ? and restaurant_id= ?`;
  CassandraClient.execute(update_res, [restaurantProfile.restaurantName, restaurantProfile.location, restaurantProfile.description, restaurantProfile.restaurantImgUrl, restaurantProfile.cuisine, restaurantProfile.timings, restaurantProfile.deliveryType, restaurantProfile.dishesType, restaurantProfile.phone, restaurantProfile.street, restaurantProfile.state, restaurantProfile.country, restaurantProfile.pincode.toString(), restaurantProfile.emailId, restaurantProfile.restaurantId], { prepare: true }, async function (error, results) {
    if (error) {
      console.log(error);
      console.log('Restaurant Profile could not be updated');
      res.send("Update of Restuarant Profile failed");
    }
    else {
      console.log('Restaurant Profile updated');
      res.send("Successful");
    }
  });
});

router.post('/api/getRestaurantProfile', async (req, res) => {

  const emailId = req.body.emailId;
  const select_res_query = `SELECT * FROM restaurants where owner_email = ? ALLOW FILTERING`
  CassandraClient.execute(select_res_query, [emailId], async function (error, results) {
    let returnData = [];
    for (let i = 0; i < results.rowLength; i++) {
      returnData.push(results.rows[i]);
    }
    results = returnData;
    console.log(JSON.stringify(results));
    if (results.length > 1) {
      console.log("Multiple Entries exists, Delete one Resturant user and profile entry");
      res.writeHead(301, {
        'Content-Type': 'text/plain'
      });
      res.send("Multiple Entries Exist, Please Contact Administrator");
    }

    else if (results.length === 0) {
      console.log("Restaurant Doesn't exist");
      res.writeHead(400, 'Restaurant Does not Exist', {
        'Content-Type': 'text/plain'
      });
      res.end();
    }

    else if (results.length === 1) {
      console.log('Successfully Retrieved the Restaurant profile');
      console.log(JSON.stringify(results[0]));
      res.send(JSON.stringify(results[0]));
    }

    else if (error) {
      console.log('Error Occured While Fetching the Data ' + error);
      res.writeHead(400, 'Contact Administrator', {
        'Content-Type': 'text/plain',
      });
      res.end();
    }

    else {
      console.log('Unknown Fault Occured While Fetching the Restaurant');
      res.writeHead(500, 'Contact Administrator', {
        'Content-Type': 'text/plain',
      });
      res.end();
    }
  });
});

router.post('/api/getRestaurantProfileById', async (req, res) => {

  const restaurantId = req.body.restaurantId;
  const select_res_query = `SELECT * FROM restaurants where restaurant_id = '?' ALLOW FILTERING`
  CassandraClient.execute(select_res_query, [restaurantId], async function (error, results) {
    let returnData = [];
    for (let i = 0; i < results.rowLength; i++) {
      returnData.push(results.rows[i]);
    }
    results = returnData;
    console.log(JSON.stringify(results));
    if (results.length > 1) {
      console.log("Multiple Entries exists, Delete one Resturant user and profile entry");
      res.writeHead(301, {
        'Content-Type': 'text/plain'
      });
      res.send("Multiple Entries Exist, Please Contact Administrator");
    }

    else if (results.length === 0) {
      console.log("Restaurant Doesn't exist");
      res.writeHead(400, 'Restaurant Does not Exist', {
        'Content-Type': 'text/plain'
      });
      res.end();
    }

    else if (results.length === 1) {
      console.log('Successfully Retrieved the Restaurant profile');
      res.send(JSON.stringify(results[0]));
    }

    else if (error) {
      console.log('Error Occured While Fetching the Data ' + error);
      res.writeHead(400, 'Contact Administrator', {
        'Content-Type': 'text/plain',
      });
      res.end();
    }

    else {
      console.log('Unknown Fault Occured While Fetching the Restaurant');
      res.writeHead(500, 'Contact Administrator', {
        'Content-Type': 'text/plain',
      });
      res.end();
    }
  });
});

router.post('/api/saveDish', async (req, res) => {

  const select_query = `select restaurant_id from restaurants where owner_email = ? ALLOW FILTERING`
  CassandraClient.execute(select_query, [req.body.emailId], async function (error, results) {
    let restaurant_id;
    for (let i = 0; i < results.rowLength; i++) {
      restaurant_id = results.rows[i].restaurant_id;
    }
    console.log(restaurant_id);
    if (error) {
      console.log(error);
      console.log('Dish could not be added');
      res.send("insert of dish failed");
    }
    else {
      const insert_dish_query = `INSERT INTO dishes (dish_id, restaurant_id,dish_name,dish_description,dish_price,dish_ingredients,dish_category,dish_img) VALUES ('` + uuid.v4() + `',?,?,?,?,?,?,?)`
      CassandraClient.execute(insert_dish_query, [restaurant_id, req.body.dishName, req.body.dishDescription, req.body.dishPrice, req.body.dishIngredients, req.body.dishCategory, req.body.dishImgUrl], async function (error, results) {
        console.log(JSON.stringify(results));
        if (error) {
          console.log(error);
          console.log('Dish could not be added');
          res.send("insert of dish failed");
        }
        else {
          console.log('Dish added successfully');
          res.send("Successful");
        }
      });
    }
  });


});

router.post('/api/getDishes', async (req, res) => {

  const select_res_query = `select restaurant_id from restaurants where owner_email=? ALLOW FILTERING`;
  CassandraClient.execute(select_res_query, [req.body.emailId], async function (error, results) {
    console.log("asasasaa");
    if (error) {
      console.log(error);
    } else {
      let restaurant_Id;
      for (let i = 0; i < results.rowLength; i++) {
        restaurant_Id = results.rows[i].restaurant_id;
      }
      console.log(restaurant_Id);
      if (restaurant_Id) {
        const select_dishes_query = `select * from dishes where restaurant_id = ? ALLOW FILTERING`;
        CassandraClient.execute(select_dishes_query, [restaurant_Id], async function (error, results) {
          if (error) {
            console.log('No Dishes Found for this restaurant  ');
            res.send(JSON.stringify([]));
          } else {
            if (results) {
              let returnData = [];
              for (let i = 0; i < results.rowLength; i++) {
                returnData.push(results.rows[i]);
              }
              results = returnData;
              console.log(JSON.stringify(results));
              if (results.length === 0) {
                console.log('No Dishes Found for this restaurant  ');
                res.send(JSON.stringify(results));
              }

              else if (results.length > 0) {
                console.log('Successfully Retrieved the dishes for this restaurant');
                res.send(JSON.stringify(results));
              }

              else if (error) {
                console.log('Error Occured While Fetching the Data ' + error);
                res.writeHead(400, 'Contact Administrator', {
                  'Content-Type': 'text/plain',
                });
                res.end();
              }

              else {
                console.log('Unknown Fault Occured While Fetching the Dishes');
                res.writeHead(500, 'Contact Administrator', {
                  'Content-Type': 'text/plain',
                });
                res.end();
              }
            } else {
              console.log('No Dishes Found for this restaurant  ');
              res.send(JSON.stringify([]));
            }
          }


        });
      } else {
        res.send(JSON.stringify([]));
      }
    }
  });

});

router.post('/api/getOrdersByResId', async (req, res) => {

  const select_res_query = `select restaurant_id from restaurants where owner_email=? ALLOW FILTERING`;
  CassandraClient.execute(select_res_query, [req.body.emailId], async function (error, results) {
    if (error) {
      console.log(error);
    } else {
      let restaurant_Id;
      for (let i = 0; i < results.rowLength; i++) {
        restaurant_Id = results.rows[i].restaurant_id;
      }
      console.log(restaurant_Id);
      if (restaurant_Id) {
        const select_dishes_query = `select * from orders where restaurant_id = ? ALLOW FILTERING`;
        CassandraClient.execute(select_dishes_query, [restaurant_Id], async function (error, results) {
          let returnData = [];
          for (let i = 0; i < results.rowLength; i++) {
            returnData.push(results.rows[i]);
          }
          results = returnData;
          console.log(JSON.stringify(results));
          if (results.length === 0) {
            console.log('No Dishes Found for this restaurant  ');
            res.send(JSON.stringify(results));
          }

          else if (results.length > 0) {
            console.log('Successfully Retrieved the dishes for this restaurant');
            res.send(JSON.stringify(results));
          }

          else if (error) {
            console.log('Error Occured While Fetching the Data ' + error);
            res.writeHead(400, 'Contact Administrator', {
              'Content-Type': 'text/plain',
            });
            res.end();
          }

          else {
            console.log('Unknown Fault Occured While Fetching the Dishes');
            res.writeHead(500, 'Contact Administrator', {
              'Content-Type': 'text/plain',
            });
            res.end();
          }
        });
      } else {
        res.send(JSON.stringify([]));
      }
    }
  });

});

router.post('/api/updateOrder', async (req, res) => {

  const order = req.body;
  console.log(order);
  const update_order = `UPDATE orders set status = ? where order_id = ? and cust_email_id = ?`;
  CassandraClient.execute(update_order, [order.status, order.order_id, order.cust_email_id], { prepare: true }, async function (error, results) {
    if (error) {
      console.log(error);
      console.log('Order with Order Id ' + order.order_id + 'could not be updated');
      res.send("Update of order failed");
    }
    else {
      console.log('Order updated');
      res.send("Successful");
    }
  });
});

router.post('/api/updateDish', async (req, res) => {

  const dish = req.body;
  console.log(dish);
  const update_dish = `UPDATE dishes set dish_name = ?, dish_description = ? ,dish_price = ? , dish_ingredients = ? , dish_category = ? , dish_img= ? where dish_id = ?`
  CassandraClient.execute(update_dish, [dish.dishName, dish.dishDescription, dish.dishPrice, dish.dishIngredients, dish.dishCategory, dish.dishImgUrl, dish.dishId], { prepare: true }, async function (error, results) {
    if (error) {
      console.log(error);
      console.log('Diswh with Dish Id ' + dish.dishId + 'could not be updated');
      res.send("Update of Dish failed");
    }
    else {
      console.log('Dish updated');
      res.send("Successful");
    }
  });
});

module.exports = router;