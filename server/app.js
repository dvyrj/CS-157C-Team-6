var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cassandra = require('cassandra-driver');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

let contactPoints = ['127.0.0.1'];
let localDataCenter = 'datacenter1';
let keyspace = 'team6';
let client = new cassandra.Client({contactPoints: contactPoints, localDataCenter: localDataCenter, keyspace: keyspace});

app.get('/getAccounts', (req, res) => {
  var data = [];
  var query = `SELECT * FROM account`;
  client.execute(query).then(result => {
    for (let i = 0; i < result.rowLength; i++) {
      data.push(result.rows[i]);
    }
  }).catch((error) => console.log('ERROR: ', error)).then(
    () => { res.json({ "data" : data }); });

});

function runQueries(queries) {
  for (let i = 0; i < queries.length; i++)
  {
    client.execute(queries[i]).then(
      () => {
        console.log("Query Executed.");
      }
    );
  }
}

// In Cassandra, run: 
// DROP KEYSPACE team6;
// CREATE KEYSPACE team6 WITH replication = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };
// Then go to: http://localhost:3001/buildTables
// Hopefully it will not crash

app.get('/buildTables', (req, res) => {
  var tableQueries = [
    "CREATE TABLE account(account_id varint PRIMARY KEY, account_type varint, date_added timestamp, email text, password text, first_name text, last_name text, balance float, orders_placed list<varint>, favorite_stores list<varint>, cart list<varint>)",
    "CREATE TABLE store(store_id varint PRIMARY KEY, account_id varint, date_added timestamp, keywords list<text>, num_ratings varint, store_rating float, menu_items list<varint>, orders_placed list<varint>, image text)",
    "CREATE TABLE orders(order_id varint PRIMARY KEY, account_id varint, store_id varint, date_added timestamp, items_ordered list<varint>, status text)",
    "CREATE TABLE item(item_id varint PRIMARY KEY, date_added timestamp, item_name text, price float, num_ratings varint, item_rating float)"
  ];

  runQueries(tableQueries);
  console.log("Built Tables");

  setTimeout(() => {
    res.redirect("http://localhost:3001/buildSampleData");
  }, 4000);
});

app.get('/buildSampleData', (req, res) => {
  var insertQueries = [
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100001, 1, toTimestamp(now()), 'amy.anh@sjsu.edu', 'Amy123', 'Amy', 'Anh', 0, [400001, 400002, 400003, 400004, 400005, 400006, 400006, 400007, 400008, 400009, 400010, 400011, 400012, 400013, 400014, 400015], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100002, 1, toTimestamp(now()), 'ben.beans@sjsu.edu', 'Ben123', 'Ben', 'Beans', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100003, 1, toTimestamp(now()), 'caitlyn.chao@sjsu.edu', 'Caitlyn123', 'Caitlyn', 'Chao', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100004, 1, toTimestamp(now()), 'david.destiny@sjsu.edu', 'David123', 'David', 'Destiny', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100005, 1, toTimestamp(now()), 'edward.elric@sjsu.edu', 'Edward123', 'Edward', 'Elric', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100006, 1, toTimestamp(now()), 'felicia.fantasia@sjsu.edu', 'Felicia123', 'Felcicia', 'Fantasia', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100007, 1, toTimestamp(now()), 'george.gourd@sjsu.edu', 'George123', 'George', 'Gourd', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100008, 1, toTimestamp(now()), 'harry.ham@sjsu.edu', 'Harry123', 'Harry', 'Ham', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100009, 1, toTimestamp(now()), 'ivy.icecube@sjsu.edu', 'Ivy123', 'Ivy', 'Icecube', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100010, 1, toTimestamp(now()), 'john.john@sjsu.edu', 'John123', 'John', 'John', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100011, 1, toTimestamp(now()), 'kenny.ackerman@sjsu.edu', 'Kenny123', 'Kenny', 'Ackerman', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100012, 2, toTimestamp(now()), 'levi.ackerman@sjsu.edu', 'Levi123', 'Levi', 'Ackerman', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100013, 2, toTimestamp(now()), 'mikasa.ackerman@sjsu.edu', 'Mikasa123', 'Mikasa', 'Ackerman', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100014, 2, toTimestamp(now()), 'nanaju.nana@sjsu.edu', 'Nanaju123', 'Nanaju', 'Nana', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100015, 2, toTimestamp(now()), 'owo.oh@sjsu.edu', 'Owo123', 'Owo', 'Oh', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100016, 2, toTimestamp(now()), 'poo.poo@sjsu.edu', 'Poo123', 'Poo', 'Poo', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100017, 2, toTimestamp(now()), 'quincy.quest@sjsu.edu', 'Quincy123', 'Quincy', 'Quest', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100018, 2, toTimestamp(now()), 'rainy.rain@sjsu.edu', 'Rainy123', 'Rainy', 'Rain', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100019, 2, toTimestamp(now()), 'sour.soup@sjsu.edu', 'Sour123', 'Sour', 'Soup', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100020, 2, toTimestamp(now()), 'tee.tee@sjsu.edu', 'Tee123', 'Tee', 'Tee', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100021, 2, toTimestamp(now()), 'unce.unce@sjsu.edu', 'Unce123', 'Unce', 'Unce', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100022, 2, toTimestamp(now()), 'vicky.van@sjsu.edu', 'Vicky123', 'Vicky', 'Van', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100023, 2, toTimestamp(now()), 'willy.wonka@sjsu.edu', 'Willy123', 'Willy', 'Wonka', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100024, 2, toTimestamp(now()), 'xerneas.xerneas@sjsu.edu', 'Xerneas123', 'Xerneas', 'Xerneas', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100025, 2, toTimestamp(now()), 'ying.yang@sjsu.edu', 'Ying123', 'Ying', 'Yang', 0, [], [], [])",
    "INSERT INTO account(account_id, account_type, date_added, email, password, first_name, last_name, balance, orders_placed, favorite_stores, cart) VALUES(100026, 2, toTimestamp(now()), 'zip.zap@sjsu.edu', 'Zip123', 'Zip', 'Zap', 0, [], [], [])",

    "INSERT INTO store(store_id, account_id, date_added, keywords, num_ratings, store_rating, menu_items, orders_placed, image) VALUES(200001, 100012, toTimestamp(now()), [], 0, 0, [300001], [400001], '')",
    "INSERT INTO store(store_id, account_id, date_added, keywords, num_ratings, store_rating, menu_items, orders_placed, image) VALUES(200002, 100013, toTimestamp(now()), [], 0, 0, [300002], [400002], '')",
    "INSERT INTO store(store_id, account_id, date_added, keywords, num_ratings, store_rating, menu_items, orders_placed, image) VALUES(200003, 100014, toTimestamp(now()), [], 0, 0, [300003], [400003], '')",
    "INSERT INTO store(store_id, account_id, date_added, keywords, num_ratings, store_rating, menu_items, orders_placed, image) VALUES(200004, 100015, toTimestamp(now()), [], 0, 0, [300004], [400004], '')",
    "INSERT INTO store(store_id, account_id, date_added, keywords, num_ratings, store_rating, menu_items, orders_placed, image) VALUES(200005, 100016, toTimestamp(now()), [], 0, 0, [300005], [500005], '')",
    "INSERT INTO store(store_id, account_id, date_added, keywords, num_ratings, store_rating, menu_items, orders_placed, image) VALUES(200006, 100017, toTimestamp(now()), [], 0, 0, [300006], [400006], '')",
    "INSERT INTO store(store_id, account_id, date_added, keywords, num_ratings, store_rating, menu_items, orders_placed, image) VALUES(200007, 100018, toTimestamp(now()), [], 0, 0, [300007], [300007], '')",
    "INSERT INTO store(store_id, account_id, date_added, keywords, num_ratings, store_rating, menu_items, orders_placed, image) VALUES(200008, 100019, toTimestamp(now()), [], 0, 0, [300008], [400008], '')",
    "INSERT INTO store(store_id, account_id, date_added, keywords, num_ratings, store_rating, menu_items, orders_placed, image) VALUES(200009, 100020, toTimestamp(now()), [], 0, 0, [300009], [400009], '')",
    "INSERT INTO store(store_id, account_id, date_added, keywords, num_ratings, store_rating, menu_items, orders_placed, image) VALUES(200010, 100021, toTimestamp(now()), [], 0, 0, [300010], [400010], '')",
    "INSERT INTO store(store_id, account_id, date_added, keywords, num_ratings, store_rating, menu_items, orders_placed, image) VALUES(200011, 100022, toTimestamp(now()), [], 0, 0, [300011], [400011], '')",
    "INSERT INTO store(store_id, account_id, date_added, keywords, num_ratings, store_rating, menu_items, orders_placed, image) VALUES(200012, 100023, toTimestamp(now()), [], 0, 0, [300012], [400012], '')",
    "INSERT INTO store(store_id, account_id, date_added, keywords, num_ratings, store_rating, menu_items, orders_placed, image) VALUES(200013, 100024, toTimestamp(now()), [], 0, 0, [300013], [400013], '')",
    "INSERT INTO store(store_id, account_id, date_added, keywords, num_ratings, store_rating, menu_items, orders_placed, image) VALUES(200014, 100025, toTimestamp(now()), [], 0, 0, [300014], [400014], '')",
    "INSERT INTO store(store_id, account_id, date_added, keywords, num_ratings, store_rating, menu_items, orders_placed, image) VALUES(200015, 100026, toTimestamp(now()), [], 0, 0, [300015], [300015], '')",

    "INSERT INTO item(item_id, date_added, item_name, price, num_ratings, item_rating) VALUES (300001, toTimestamp(now()), 'Fried Rice', 10.00, 0, 0)",
    "INSERT INTO item(item_id, date_added, item_name, price, num_ratings, item_rating) VALUES (300002, toTimestamp(now()), 'Burger Combo', 10.00, 0, 0)",
    "INSERT INTO item(item_id, date_added, item_name, price, num_ratings, item_rating) VALUES (300003, toTimestamp(now()), 'Pho', 10.00, 0, 0)",
    "INSERT INTO item(item_id, date_added, item_name, price, num_ratings, item_rating) VALUES (300004, toTimestamp(now()), 'Pad Thai', 10.00, 0, 0)",
    "INSERT INTO item(item_id, date_added, item_name, price, num_ratings, item_rating) VALUES (300005, toTimestamp(now()), '10 Wing Combo', 10.00, 0, 0)",
    "INSERT INTO item(item_id, date_added, item_name, price, num_ratings, item_rating) VALUES (300006, toTimestamp(now()), 'Stir Fried Noodles', 10.00, 0, 0)",
    "INSERT INTO item(item_id, date_added, item_name, price, num_ratings, item_rating) VALUES (300007, toTimestamp(now()), 'Poke Bowl', 10.00, 0, 0)",
    "INSERT INTO item(item_id, date_added, item_name, price, num_ratings, item_rating) VALUES (300008, toTimestamp(now()), 'Curry Plate', 10.00, 0, 0)",
    "INSERT INTO item(item_id, date_added, item_name, price, num_ratings, item_rating) VALUES (300009, toTimestamp(now()), 'Sub Sandwich', 10.00, 0, 0)",
    "INSERT INTO item(item_id, date_added, item_name, price, num_ratings, item_rating) VALUES (300010, toTimestamp(now()), 'Beef Stew', 10.00, 0, 0)",
    "INSERT INTO item(item_id, date_added, item_name, price, num_ratings, item_rating) VALUES (300011, toTimestamp(now()), 'Lion King Roll', 10.00, 0, 0)",
    "INSERT INTO item(item_id, date_added, item_name, price, num_ratings, item_rating) VALUES (300012, toTimestamp(now()), 'Triple Taco', 10.00, 0, 0)",
    "INSERT INTO item(item_id, date_added, item_name, price, num_ratings, item_rating) VALUES (300013, toTimestamp(now()), 'Burrito', 10.00, 0, 0)",
    "INSERT INTO item(item_id, date_added, item_name, price, num_ratings, item_rating) VALUES (300014, toTimestamp(now()), 'Pizza', 10.00, 0, 0)",
    "INSERT INTO item(item_id, date_added, item_name, price, num_ratings, item_rating) VALUES (300015, toTimestamp(now()), 'Icecream', 10.00, 0, 0)",

    "INSERT INTO orders(order_id, account_id, store_id, date_added, items_ordered, status) VALUES (400001, 100001, 200001, toTimestamp(now()), [300001], 'Delivered')",
    "INSERT INTO orders(order_id, account_id, store_id, date_added, items_ordered, status) VALUES (400002, 100001, 200002, toTimestamp(now()), [300002], 'Delivered')",
    "INSERT INTO orders(order_id, account_id, store_id, date_added, items_ordered, status) VALUES (400003, 100001, 200003, toTimestamp(now()), [300003], 'Delivered')",
    "INSERT INTO orders(order_id, account_id, store_id, date_added, items_ordered, status) VALUES (400004, 100001, 200004, toTimestamp(now()), [300004], 'Delivered')",
    "INSERT INTO orders(order_id, account_id, store_id, date_added, items_ordered, status) VALUES (400005, 100001, 200005, toTimestamp(now()), [300005], 'Delivered')",
    "INSERT INTO orders(order_id, account_id, store_id, date_added, items_ordered, status) VALUES (400006, 100001, 200006, toTimestamp(now()), [300006], 'Delivered')",
    "INSERT INTO orders(order_id, account_id, store_id, date_added, items_ordered, status) VALUES (400007, 100001, 200007, toTimestamp(now()), [300007], 'Delivered')",
    "INSERT INTO orders(order_id, account_id, store_id, date_added, items_ordered, status) VALUES (400008, 100001, 200008, toTimestamp(now()), [300008], 'Delivered')",
    "INSERT INTO orders(order_id, account_id, store_id, date_added, items_ordered, status) VALUES (400009, 100001, 200009, toTimestamp(now()), [300009], 'Delivered')",
    "INSERT INTO orders(order_id, account_id, store_id, date_added, items_ordered, status) VALUES (400010, 100001, 200010, toTimestamp(now()), [300010], 'Delivered')",
    "INSERT INTO orders(order_id, account_id, store_id, date_added, items_ordered, status) VALUES (400011, 100001, 200011, toTimestamp(now()), [300011], 'Delivered')",
    "INSERT INTO orders(order_id, account_id, store_id, date_added, items_ordered, status) VALUES (400012, 100001, 200012, toTimestamp(now()), [300012], 'Delivered')",
    "INSERT INTO orders(order_id, account_id, store_id, date_added, items_ordered, status) VALUES (400013, 100001, 200013, toTimestamp(now()), [300013], 'Delivered')",
    "INSERT INTO orders(order_id, account_id, store_id, date_added, items_ordered, status) VALUES (400014, 100001, 200014, toTimestamp(now()), [300014], 'Delivered')",
    "INSERT INTO orders(order_id, account_id, store_id, date_added, items_ordered, status) VALUES (400015, 100001, 200015, toTimestamp(now()), [300015], 'Delivered')"
  ]

  runQueries(insertQueries);
  console.log("Inserted Sample Data");

  setTimeout(() => {
    res.redirect("http://localhost:3001/");
  }, 1000);
});

// Customer
app.get('/registerAccount', (req, res) => {
  console.log("Register account into Cassandra here!");
  res.redirect("http://localhost:3000/");
});

app.get('/loginAccount', (req, res) => {
  console.log("Check account in Cassandra here!");
  res.redirect("http://localhost:3000/");
});

app.get('/getItems', (req, res) => {
  res.redirect("http://localhost:3000/");
});

app.get('/getCartItems', (req, res) => {
  res.redirect("http://localhost:3000/");
});

app.get('/getOrders', (req, res) => {
  res.redirect("http://localhost:3000/");
});

app.get('/editCart', (req, res) => {
  res.redirect("http://localhost:3000/");
});

app.get('/emptyCart', (req, res) => {
  res.redirect("http://localhost:3000/");
});

app.get('/addItemToCart', (req, res) => {
  res.redirect("http://localhost:3000/");
});

// Store Owner
app.get('/getOrders', (req, res) => {
  res.redirect("http://localhost:3000/");
});

app.get('/getItems', (req, res) => {
  res.redirect("http://localhost:3000/");
});

app.get('/editItems', (req, res) => {
  res.redirect("http://localhost:3000/");
});

// Admin
app.get('/getAccounts', (req, res) => {
  res.redirect("http://localhost:3000/");
});

app.get('/editAccounts', (req, res) => {
  res.redirect("http://localhost:3000/");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;