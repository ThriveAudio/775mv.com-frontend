// @ts-nocheck
import { cookies } from 'next/headers'
const {MongoClient} = require('mongodb');
const url = 'mongodb://localhost:27017';

export async function GET(request: Request) {
  console.log('GET get-products Nextjs API called')
  let res = []

  const client = new MongoClient(url)

  const db = client.db('775mv_dev');
  const collection = db.collection('products');
  const cursor = collection.find()


  let i = 0
  for await (const doc of cursor) {
    console.dir(doc);
    doc['id'] = i
    res.push(doc)
    console.log("GET 1 loop")
    i++
  }

  // client.close();

  return Response.json(res)
}
// TODO export mongodb base logic