const express = require('express');
const router = express.Router();
const uuid = require('uuid');

const connection = require('../resources.js');
const CassandraClient = require('../databaseConn.js');
const { upload } = require('../services/fileUploadAWS');

router.get('/api/users', async (req, res) => {
  await CassandraClient.execute('SELECT * FROM users ALLOW FILTERING', async function (error, results) {
    if (error) {
      console.log("Not Successfull");
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end(error.code);
    }
    else {
      console.log("Successfull");
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      let returnData = [];
      for (let i = 0; i < results.rowLength; i++) {
        returnData.push(results.rows[i]);
      }
      res.end(JSON.stringify(returnData));
    }
  });
});

router.post('/api/createUser', async (req, res) => {

  const user = req.body;
  console.log('Adding a User', user);
  console.log(uuid.v4());
  const insert_user_sql = `INSERT INTO users (user_id, user_name,user_emailId,user_pwd,restaurant_owner) values ('`+uuid.v4().toString()+`',?,?,?,?)`
  await CassandraClient.execute(insert_user_sql, [user.userName, user.userEmail, user.password, user.restaurantOwner], async function (error, results) {
    if (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        res.writeHead(301, {
          'Content-Type': 'text/plain'
        });
        res.end(error.code);
      }
      else {
        res.writeHead(400, {
          'Content-Type': 'text/plain'
        });
        console.log(error);
        res.end(error.code);
      }
    }
    else {
      console.log('User Added')
      res.writeHead(200, {
        'Content-Type': 'text/plain'
      });
      res.end('User Added Successfully');
    }
  });
});

router.post('/api/imageUpload/:entity', upload.single('image'), function (req, res, next) {
  res.send({ imageUrl: req.file.location });
});
module.exports = router;

module.exports = router;