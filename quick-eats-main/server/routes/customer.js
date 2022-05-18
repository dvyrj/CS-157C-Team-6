const express = require('express');
const CassandraClient = require('../databaseConn.js');
const router = express.Router();
const uuid = require('uuid');

const connection = require('../resources.js');

router.get('/api/getAllRestaurants', async (req, res) => {
  await CassandraClient.execute('SELECT * FROM restaurants ALLOW FILTERING', async function (error, results) {
    if (error) {
      console.log("Not Successfull");
      res.send(JSON.stringify(error));
    }
    else {
      let returnData = [];
      for (let i = 0; i < results.rowLength; i++) {
        returnData.push(results.rows[i]);
      }
      results = returnData;
      console.log('Successfully Retrieved the restaurants');
      res.send(JSON.stringify(results));
    }
  });
});

router.post('/api/getDishesbyResId', async (req, res) => {
  const restaurantId = req.body.restaurantId;
  console.log('Fetching for dishes ....');
  const select_dishes_sql = `SELECT * FROM dishes where restaurant_id = ? ALLOW FILTERING`;
  await CassandraClient.execute(select_dishes_sql, [restaurantId], {prepare:true}, async function (error, results) {
    if (error) {
      console.log("Not Successfull");
      res.send(JSON.stringify(error));
    }
    else {
      if (results) {
        let returnData = [];
        for (let i = 0; i < results.rowLength; i++) {
          returnData.push(results.rows[i]);
        }
        results = returnData;
        console.log('Successfully Retrieved the restaurants');
        res.send(JSON.stringify(results));
      } else {
        console.log('Successfully Retrieved the restaurants');
        res.send(JSON.stringify([]));
      }

    }
  });
});

router.post('/api/sendOrders', async (req, res) => {
  const custEmailId = req.body.custEmailId;
  const restaurantId = req.body.restaurantId;
  const dishes = req.body.dishes;
  const deliveryAddress = req.body.deliveryAddress;
  const orderTimeStamp = req.body.orderTimeStamp;
  const paymentMode = req.body.paymentMode;
  const totalPrice = req.body.totalPrice;

  console.log('Saving Order....');
  const insert_order_query = `INSERT INTO orders ( order_id, cust_email_id, restaurant_id, dishes_ordered, delivery_address, order_timestamp, payment_mode, order_price, status) values ('` + uuid.v4() + `',?,?,?,?,?,?,?,'RECEIVED')`
  await CassandraClient.execute(insert_order_query, [custEmailId, restaurantId, dishes, deliveryAddress, orderTimeStamp, paymentMode, totalPrice], async function (error, results) {
    if (error) {
      console.log("Not Successfull");
      res.send(JSON.stringify(error));
    }
    else {
      console.log('Successfully Received an Order');
      res.send(JSON.stringify(results));
    }
  });
});

router.post('/api/getOrdersByCustEmail', async (req, res) => {

  const select_orders_query = `select * from orders where cust_email_id = ? ALLOW FILTERING`
  await CassandraClient.execute(select_orders_query, [req.body.emailId], async function (error, results) {
    let returnData = [];
    for (let i = 0; i < results.rowLength; i++) {
      returnData.push(results.rows[i]);
    }
    results = returnData;
    console.log(JSON.stringify(results));
    if (results.length === 0) {
      console.log('No Orders Found for this Customer  ');
      res.send(JSON.stringify(results));
    }

    else if (results.length > 0) {
      console.log('Successfully Retrieved the Orders for this Customer');
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
      console.log('Unknown Fault Occured While Fetching the Orders');
      res.writeHead(500, 'Contact Administrator', {
        'Content-Type': 'text/plain',
      });
      res.end();
    }
  });
});

router.post('/api/getCustomerProfileByEmailId', async (req, res) => {
  const emailId = req.body.emailId;
  const select_user_profile_sql = `SELECT * from customer_profiles where email_id = ? ALLOW FILTERING`
  await CassandraClient.execute(select_user_profile_sql, [emailId], async function (error, results) {
    let returnData = [];
    for (let i = 0; i < results.rowLength; i++) {
      returnData.push(results.rows[i]);
    }
    results = returnData;
    if (results.length === 0) {
      console.log('Customer is viewing the profile for first time, sending empty results');
      results = [];
      res.send(JSON.stringify(results));
    }

    else if (results.length > 0) {
      console.log('Successfully Retrieved the Profile for Customer');
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
      console.log('Unknown Fault Occured While Fetching the Customer Profile');
      res.writeHead(500, 'Contact Administrator', {
        'Content-Type': 'text/plain',
      });
      res.end();
    }
  });
});

router.post('/api/saveCustomerProfile', async (req, res) => {
  const insert_default_user_profile_sql = `insert into customer_profiles (profile_id, email_id, phone, name , nick_name, DOB , address, profile_img) values ('` + uuid.v4() + `',?,?,?,?,?,?,?)`
  await CassandraClient.execute(insert_default_user_profile_sql, [req.body.emailId, req.body.phone, req.body.name, req.body.nickName, req.body.dob, req.body.address, req.body.profileImg], async function (error, results) {
    if (error) {
      console.log("Not Successfull");
      res.send(JSON.stringify(error));
    }
    else {
      console.log('Successfully Saved the customer Profile');
      res.send('SUCCESS');
    }
  });
});

router.post('/api/updateCustomerProfile', async (req, res) => {
  const insert_default_user_profile_sql = `update customer_profiles set email_id = ?, phone = ?,  name = ? ,  nick_name = ?,  DOB = ? ,  address = ?,  profile_img = ? where profile_id = ?`
  await CassandraClient.execute(insert_default_user_profile_sql, [req.body.emailId, req.body.phone, req.body.name, req.body.nickName, req.body.dob, req.body.address, req.body.profilePictureUrl, req.body.profileId], { prepare: true }, async function (error, results) {
    if (error) {
      console.log("Not Successfull");
      res.send(JSON.stringify(error));
    }
    else {
      console.log('Successfully Updated the customer Profile');
      res.send('SUCCESS');
    }
  });
});

router.post('/api/getRestaurantsBasedonSearch', async (req, res) => {
  const searchString = req.body.searchString.concat('%');
  const select_restaurants_based_on_search = `SELECT DISTINCT r.restaurant_id,r.store_name,r.store_location,r.owner_email,r.description,r.timings,r.phone,r.street,r.state,r.country,r.pincode,r.restaurant_img,r.delivery_type,r.dishes_type FROM restaurants r LEFT OUTER JOIN dishes m ON m.restaurant_id = r.restaurant_id WHERE (m.dish_name LIKE ? OR m.dish_description LIKE ? OR r.store_name LIKE ? OR r.store_location LIKE ? OR r.cuisine LIKE ?);`
  await connection.query(select_restaurants_based_on_search, [searchString, searchString, searchString, searchString, searchString], async function (error, results) {
    if (error) {
      console.log("Not Successfull");
      res.send(JSON.stringify(error));
    }
    else {
      console.log('Successfully Retrieved the restaurants based on search string the customer profile');
      res.send(JSON.stringify(results));
    }
  });
});

router.post('/api/getFavourites', async (req, res) => {
  const emailId = req.body.emailId;
  const select_profile_id = `select profile_id from customer_profiles where email_id = ? ALLOW FILTERING`;
  await CassandraClient.execute(select_profile_id, [emailId], async function (error, results) {
    if (error) {
      console.log(error);
      console.log("Not Successfull");
    }
    else
    {
      let profile_id;
      for (let i = 0; i < results.rowLength; i++) {
        profile_id = results.rows[i].profile_id;
      }
      const select_favourites = `SELECT favourites from customer_profiles where email_id = ? ALLOW FILTERING`;
      await CassandraClient.execute(select_favourites, [emailId], async function (error, results) {
        if (error) {
          console.log("Not Successfull");
          console.log(JSON.stringify(error));
          res.send(JSON.stringify(error));
        }
        else {
          console.log('Successfully Retrieved the favourites for the customer');
          console.log(results.rows[0].favourites);
          res.send(JSON.stringify(results));
        }
      });
    }
  });
});

router.post('/api/updateFavourites', async (req, res) => {
  const emailId = req.body.emailId;
  const updatedFavourites = req.body.updatedFavourites;
  const select_profile_id = `select profile_id from customer_profiles where email_id = ? ALLOW FILTERING`;
  await CassandraClient.execute(select_profile_id, [emailId], async function (error, results) {
    if (error) {
      console.log(error);
      console.log("Not Successfull");
    }
    else {
      console.log(results);
      let profile_id;
      for (let i = 0; i < results.rowLength; i++) {
        profile_id = results.rows[i].profile_id;
      }
      const select_favourites = `UPDATE customer_profiles set favourites = ?  where profile_id = ?`;
      await CassandraClient.execute(select_favourites, [updatedFavourites, profile_id], { prepare: true }, async function (error, results) {
        if (error) {
          console.log(error);
          console.log("Not Successfull");
          res.send(false);
        }
        else {
          console.log(results);
          console.log('Successfully Updated the customer favourites');
          res.send(true);
        }
      });
    }
  });

});

router.post('/api/getRestaurantsBasedonIds', async (req, res) => {

  const select_restaurants = `SELECT * FROM restaurants where restaurant_id IN ?`;
  await CassandraClient.execute(select_restaurants, [req.body.searchString], async function (error, results) {
    if (error) {
      console.log("Not Successfull");
      res.send(JSON.stringify(error));
    }
    else {
      console.log('Successfully Retrieved the restaurants based on search string the customer profile');
      res.send(JSON.stringify(results));
    }
  });
});

router.post('/api/getRestaurantProfileByID', async (req, res) => {

  const select_restaurants = `SELECT * FROM restaurants where restaurant_id = ?`;
  await CassandraClient.execute(select_restaurants, [req.body.resId.toString()], async function (error, results) {
    if (error) {
      console.log("Not Successfull");
      console.log(error.message)
      res.send(JSON.stringify(error));
    }
    else {
      console.log('Successfully Retrieved the restaurants based on search string the customer profile');
      res.send(JSON.stringify(results));
    }
  });
});


module.exports = router;