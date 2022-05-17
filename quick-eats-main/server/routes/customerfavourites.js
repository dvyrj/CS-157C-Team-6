const express = require('express');
const CassandraClient = require('../databaseConn.js');
const router = express.Router();
const uuid = require('uuid');

const connection = require('../resources.js');

router.get('/api/retrieveRestaurants', async (req, res) => {
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

router.post('/api/retrieveDishesbyId', async (req, res) => {
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

router.post('/api/retrieveOrdersByCustomerid', async (req, res) => {

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

router.post('/api/retrieveFavourites', async (req, res) => {
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

router.post('/api/favouritesUpdate', async (req, res) => {
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


module.exports = router;
