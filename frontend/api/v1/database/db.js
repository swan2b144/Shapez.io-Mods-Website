const apiVariables = require("../api_variables");
const mongo = require("mongodb");
const getConnection = (callback) =>
  mongo.MongoClient.connect(apiVariables.databaseUrl, function (err, client) {
    if (err) console.log(err);
    if ((db = client.db(apiVariables.databaseName))) callback(client, db);
  });

const find = (collection, data, callback) => {
  if (!data || !collection) callback(null, null);

  getConnection((client, db) => {
    db.collection(collection)
      .find(data)
      .toArray((err, docs) => {
        if (err) {
          callback(err, null);
          client.close();
        } else if (docs.length > 0) {
          callback(null, docs[0]);
          client.close();
        } else {
          callback(null, null);
          client.close();
        }
      });
  });
};
const findMultiple = (collection, data, callback) => {
  if (!data || !collection) callback(null, null);

  getConnection((client, db) => {
    db.collection(collection)
      .find(data)
      .toArray((err, docs) => {
        if (err) {
          callback(err, null);
          client.close();
        } else if (docs.length >= 0) {
          callback(null, docs);
          client.close();
        } else {
          callback(null, null);
          client.close();
        }
      });
  });
};

const findAll = (collection, callback) => {
  if (!collection) callback(null, null);

  getConnection((client, db) => {
    db.collection(collection)
      .find()
      .toArray((err, docs) => {
        if (err) {
          callback(err, null);
          client.close();
        } else if (docs.length >= 0) {
          callback(null, docs);
          client.close();
        } else {
          callback(null, null);
          client.close();
        }
      });
  });
};

const add = (collection, data, callback) => {
  getConnection((client, db) => {
    db.collection(collection).insertOne(data, (err, result) => {
      if (err) {
        callback(err, null);
        client.close();
      } else if (result) {
        find(collection, data, callback);
        client.close();
      } else {
        callback(null, null);
        client.close();
      }
    });
  });
};

const edit = (collection, id, data, callback) => {
  getConnection((client, db) => {
    let update = {};
    let { $push, $pull, ...$set } = data;
    if ($set && Object.keys($set).length > 0) update.$set = $set;
    if ($push && Object.keys($push).length > 0) update.$push = $push;
    if ($pull && Object.keys($pull).length > 0) update.$pull = $pull;
    if (!update || !Object.keys(update).length > 0)
      return callback("No updates", null);
    db.collection(collection).updateOne(
      { _id: new mongo.ObjectID(id) },
      update,
      (err, result) => {
        if (err) {
          callback(err, null);
          client.close();
        } else if (result) {
          find(collection, { _id: new mongo.ObjectID(id) }, callback);
          client.close();
        } else {
          callback(null, null);
          client.close();
        }
      }
    );
  });
};

const remove = (collection, id, callback) => {
  getConnection((client, db) => {
    find(collection, { _id: new mongo.ObjectID(id) }, (err, doc) => {
      if (err) {
        callback(err, null);
        client.close();
      } else if (doc) {
        db.collection(collection).deleteOne(
          { _id: new mongo.ObjectID(id) },
          (err, result) => {
            if (err) {
              callback(err, null);
              client.close();
            } else if (result) {
              callback(null, doc);
              client.close();
            } else {
              callback(null, null);
              client.close();
            }
          }
        );
        client.close();
      } else {
        callback(null, null);
        client.close();
      }
    });
  });
};

module.exports = {
  getConnection,
  find,
  findAll,
  add,
  edit,
  remove,
  findMultiple,
};
