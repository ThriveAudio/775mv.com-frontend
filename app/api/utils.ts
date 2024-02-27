// @ts-nocheck
import { addDocument, getDocument, updateDocument } from './mongo';
import { parse } from 'node-html-parser'
import mongoose from "mongoose"

export async function createAccount() {
  return await addDocument('accounts', {
    "new_emails": {},
    "email": "",
    "old_emails": [],
    "password": "",
    "password_id": "",
    "salt": "",
    "timer_var": 0,
    "timer": 0,
    "cart": [],
    "orders": [],
    "access_timestamps": []
  })
}

export class AuthorizeDoc {
  credit_card
  shipping
  billing
  price
  items
  id

  constructor() {
    this.credit_card = {}
    this.shipping = {}
    this.billing = {}
    this.price = {}
    this.items = []
  }

  setCreditCard(cardNumber, expirationDate, cardCode) {
    this.credit_card = {
      'cardNumber': cardNumber,
      'expirationDate': expirationDate,
      'cardCode': cardCode
    }
  }

  setShipping(firstName, lastName, address, city, state, zip, country) {
    this.shipping = {
      'firstName': firstName,
      'lastName': lastName,
      'address': address,
      'city': city,
      'state': state,
      'zip': zip,
      'country': country
    }
  }

  setBilling(firstName, lastName, address, city, state, zip, country) {
    this.billing = {
      'firstName': firstName,
      'lastName': lastName,
      'address': address,
      'city': city,
      'state': state,
      'zip': zip,
      'country': country
    }
  }

  setPrice(price) {
    this.price = price
  }

  setId(id) {
    this.id = id
  }

  addItem(itemId, name, description, quantity, unitPrice) {
    this.items.push({
      'itemId': itemId,
      'name': name,
      'description': description,
      'quantity': quantity,
      'unitPrice': unitPrice
    })
  }

  async render() {
    let config = await getDocument('config', {'type': 'config'})
    let doc = `<createTransactionRequest xmlns=\"AnetApi/xml/v1/schema/AnetApiSchema.xsd\">
    <merchantAuthentication>
        <name>${config['authorize_name']}</name>
        <transactionKey>${config['authorize_key']}</transactionKey>
    </merchantAuthentication>
    <refId>${this.id}</refId>
    <transactionRequest>
        <transactionType>authOnlyTransaction</transactionType>
        <amount>${this.price}</amount>
        <payment>
            <creditCard>
                <cardNumber>${this.credit_card.cardNumber}</cardNumber>
                <expirationDate>${this.credit_card.expirationDate}</expirationDate>
                <cardCode>${this.credit_card.cardCode}</cardCode>
            </creditCard>
        </payment>
        <order>
         <invoiceNumber>${this.id}</invoiceNumber>
        </order>
        <lineItems>`

    for (let i = 0; i < this.items.length; i++) {
      doc = doc + `<lineItem>
                    <itemId>${this.items[i].itemId}</itemId>
                    <name>${this.items[i].name}</name>
                    <description>${this.items[i].description}</description>
                    <quantity>${this.items[i].quantity}</quantity>
                    <unitPrice>${this.items[i].unitPrice}</unitPrice>
                  </lineItem>`
    }

    doc = doc + `</lineItems>
    <poNumber>${this.id}</poNumber>
    <billTo>
      <firstName>${this.billing.firstName}</firstName>
      <lastName>${this.billing.lastName}</lastName>
      <address>${this.billing.address}</address>
      <city>${this.billing.city}</city>
      <state>${this.billing.state}</state>
      <zip>${this.billing.zip}</zip>
      <country>${this.billing.country}</country>
    </billTo>
    <shipTo>
      <firstName>${this.shipping.firstName}</firstName>
      <lastName>${this.shipping.lastName}</lastName>
      <address>${this.shipping.address}</address>
      <city>${this.shipping.city}</city>
      <state>${this.shipping.state}</state>
      <zip>${this.shipping.zip}</zip>
      <country>${this.shipping.country}</country>
    </shipTo>
    <transactionSettings>
      <setting>
        <settingName>duplicateWindow</settingName>
        <settingValue>1</settingValue>
      </setting>
    </transactionSettings>
    <authorizationIndicatorType>
        <authorizationIndicator>pre</authorizationIndicator>  
    </authorizationIndicatorType>
</transactionRequest>
</createTransactionRequest>`
    return doc
  }
}

export function randint(max) {
  return Math.floor(Math.random() * max)
}

export async function newOrderId() {
  // last_id = (await db.get_document('orders', {"type": "last_id"}))['id']
  //       new_id = last_id + random.randint(1, 13)
  //       await db.db['orders'].update_one({'type': 'last_id'}, {'$set': {'id': new_id}})
  const last_id = (await getDocument('orders', {type: "last_id"}))['id']
  const new_id = last_id + randint(13)
  await updateDocument('orders', {'type': 'last_id'}, {'id': new_id})
  return new_id
}

export async function createOrder(account, res, id=-1) {

  const config = await getDocument('config', {'type': 'config'})

  if (id == -1) {
    id = await newOrderId()
  }
  
  let items = []
  for (let i = 0; i < account['cart'].length; i++) {
    const prod_id = (await getDocument('products', {'sku': account['cart'][i]['sku']}))['_id']
    items.push({
      'id': prod_id,
      'amount': account['cart'][i]['amount']
    })
  }
  await updateDocument('accounts', {'_id': account['_id']}, {'cart': []})

  const order = await addDocument('orders', {
    'id': id,
    'time': {
      'ordered': Date.now()/1000,
      'shipped': 0,
      'delivered': 0
    },
    'payment_status': '',
    'payment_method': '',
    'authorize_id': '',
    'paypal_info': '',
    'order_status': 'processing',
    'user': {
      'account': account['_id'],
      'contact': {
        'first_name': res.items.shipping.first_name,
        'last_name': res.items.shipping.last_name,
        'email': res.items.shipping.email,
        'phone': res.items.shipping.phone
      },
      'shipping': {
        'address1': res.items.shipping.address1,
        'address2': res.items.shipping.address2,
        'city': res.items.shipping.city,
        'state': res.items.shipping.state,
        'zip': res.items.shipping.zip,
        'country': res.items.shipping.country,
        'price': config['shipping_price']['US']
      }
    },
    'items': items
  })

  return order.insertedId
}

export async function orderAddAuthorize(order_id, authorize_id) {
  await updateDocument('orders', {'_id': order_id}, {'authorize_id': authorize_id})
  await updateDocument('orders', {'_id': order_id}, {'payment_status': 'authorized'})
  await updateDocument('orders', {'_id': order_id}, {'payment_method': 'card'})
}

export function validatePassword(password) {
  if (password.search(/[0-9]+/g) == -1) {
    return false
  }
  if (password.search(/[a-z]+/g) == -1) {
    return false
  }
  if (password.search(/[A-Z]+/g) == -1) {
    return false
  }
  if (password.search(/[^a-zA-Z0-9 \n]+/g) == -1) {
    return false
  }
  return true
}

export function validateEmail(email) {
  return email.search(/.+@.+\..+/g) != -1
}

export function mongoId(id) {
  return new mongoose.Types.ObjectId(id)
}