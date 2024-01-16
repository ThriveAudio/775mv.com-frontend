const {MongoClient} = require('mongodb');
const url = 'mongodb://localhost:27017';

const client = new MongoClient(url)
const db = client.db('775mv_dev');

export function getDocument(collection: string, doc: Map<string, string>) {
  const dbColl = db.collection(collection);
  return dbColl.findOne(doc)
}

export function getCollection(collection: string) {
  return db.collection(collection)
}

export async function getCollectionAsArray(collection: string) {
  const dbColl = db.collection(collection)
  const cursor = dbColl.find()

  let arr = []
  for await (const doc of cursor) {
    arr.push(doc)
  }

  return arr
}