const http = require('http');
const fs = require('fs');
const cassandra = require('cassandra-driver');

const hostname = '127.0.0.1';
const port = 3000;

let contactPoints = ['127.0.0.1'];
let localDataCenter = 'datacenter1';
let client = new cassandra.Client({contactPoints: contactPoints, localDataCenter: localDataCenter, keyspace:'team6'});

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type' : 'text/html'});
    fs.readFile('index.html', 
    (error, data) => {
        if (error) {
            res.writeHead(404);
            res.write('Error: File Not Found');
            res.end();
        }
        else {
            res.write(data);
            var id = 1;
            var query = `SELECT first_name, last_name FROM account WHERE account_id = ${id} ALLOW FILTERING`;
            client.execute(query).then(result => {
                res.write(`The name of the person with the account ID ${id} is ${result.rows[0].first_name} ${result.rows[0].last_name}.\n`);
            }).catch((error) => console.log('ERROR: ', error)).then(() => { res.end(); });
        }
    });
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});