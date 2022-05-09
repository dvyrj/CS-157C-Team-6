var cassandra = require('cassandra-driver');

let contactPoints = ['127.0.0.1'];
let localDataCenter = 'datacenter1';
let keyspace = 'team6';
let CassandraClient = new cassandra.Client({contactPoints: contactPoints, localDataCenter: localDataCenter, keyspace: keyspace});

module.exports = CassandraClient;