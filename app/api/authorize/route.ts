// ts-nocheck
import { cookies } from 'next/headers'
import { getDocument } from '../mongo'
// let ApiContracts = require('authorizenet').APIContracts;
// let ApiControllers = require('authorizenet').APIControllers;
import { AuthorizeDoc, createOrder, newOrderId, orderAddAuthorize } from '../utils';
import { sendEmail, sendTemplate } from '../email';
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

async function renderEmailInfo(account, res, config) {
  let email_info = {items: [], shipping: 0, total: 0, amount: 0, user: {}, address: {}}
  for (let i = 0; i < account['cart'].length; i++) {
    const db_item = await getDocument('products', {'sku': account['cart'][i].sku})
    email_info.items.push({
      name: db_item.name,
      amount: account['cart'][i].amount,
      price: db_item.price * account['cart'][i].amount
    })
    email_info.total += db_item.price * account['cart'][i].amount
    email_info.amount += account['cart'][i].amount
  }
  if (res.items.shipping.country == "US") {
    email_info.shipping = config.shipping_price.US
    email_info.total += config.shipping_price.US
  } else {
    email_info.shipping = config.shipping_price.Worldwide
    email_info.total += config.shipping_price.Worldwide
  }

  email_info.user['first_name'] = res.items.shipping.first_name
  email_info.user['last_name'] = res.items.shipping.last_name

  email_info['address']['address1'] = res.items.shipping['address1']
  email_info['address']['address2'] = res.items.shipping['address2']
  email_info['address']['city'] = res.items.shipping.city
  email_info['address']['state'] = res.items.shipping.state
  email_info['address']['zip'] = res.items.shipping.zip
  email_info['address']['country'] = res.items.shipping.country

  return email_info
}

export async function POST(request: Request) {
  console.log('POST authorize Nextjs API called')

  const res = await request.json()
  const sessionId = cookies().get('sessionId')?.value
  const order_id = await newOrderId()
  // const req = await (await fetch('http://127.0.0.1:8000/authorize', {"method": "post", "body": JSON.stringify(res)})).json()

  const session = await getDocument('sessions', {'id': sessionId})
  const account = await getDocument('accounts', {'_id': session['account']})
  const config = await getDocument('config', {'type': 'config'})
  let req = {"result": "error"}

  // Input validation
  if (account['cart'].length == 0) {
    return Response.json({"result": "error"})
  }

  console.log("GOT HERE")
  // authorize.net

  let authDoc = new AuthorizeDoc()
  authDoc.setShipping(res.items.shipping.first_name,
                      res.items.shipping.last_name,
                      res.items.shipping.address,
                      res.items.shipping.city,
                      res.items.shipping.state,
                      res.items.shipping.zip,
                      "US")

  if (res.items.billing.same_as_shipping) {
    authDoc.setBilling(res.items.shipping.first_name,
                      res.items.shipping.last_name,
                      res.items.shipping.address,
                      res.items.shipping.city,
                      res.items.shipping.state,
                      res.items.shipping.zip,
                      "US")
  } else {
    authDoc.setBilling(res.items.billing.first_name,
                      res.items.billing.last_name,
                      res.items.billing.address,
                      res.items.billing.city,
                      res.items.billing.state,
                      res.items.billing.zip,
                      "US")
  }

  const cc_number_list = res.items.payment['cc-number'].split(" ")
  const cc_number = cc_number_list.join("")
  authDoc.setCreditCard(cc_number, res.items.payment['cc-exp'], res.items.payment['cc-cvv']) 
                        //'4111111111111111',
                        //'2035-12',
                        //'123')

  authDoc.setId(order_id.toString())


  let price = 0

  for (let i = 0; i < account['cart'].length; i++) {
    const db_item = await getDocument('products', {'sku': account['cart'][i].sku})
    authDoc.addItem(account['cart'][i].sku,
                    account['cart'][i].sku,
                    db_item.description,
                    account['cart'][i].amount,
                    db_item.price)
    price += db_item.price
    // console.log(account['cart'][i])
  }

  price += config['shipping_price']['US']


  authDoc.setPrice(price.toString())

  const authRequest = await authDoc.render()

  console.log("GOT HERE2")
  

  //const authorize = await (await fetch("https://apitest.authorize.net/xml/v1/request.api", {'method': 'post', 'body': authRequest})).json()
  const authorize = new XMLHttpRequest()

  authorize.open("POST", "https://apitest.authorize.net/xml/v1/request.api", false)
  authorize.send(authRequest)
  // console.log(authorize.responseText)
  if (authorize.responseText.search(/<resultCode>Ok<\/resultCode>/g) != -1) {
    const start_index = authorize.responseText.search(/<transId>/g)
    const end_index = authorize.responseText.search(/<\/transId>/g)
    const trans_id = authorize.responseText.slice(start_index+9, end_index)

    // record order in db
    const order_db_id = await createOrder(account, res, order_id)
    orderAddAuthorize(order_db_id, trans_id)

    const email_info = await renderEmailInfo(account, res, config)
    console.log("EMAIL INFO ", email_info)

    // send customer email
    sendTemplate(res.items.shipping.email, `DEV 775mv TEST Order #${order_id} confirmation`, 'order-confirmation.html', {
      order_id: order_id,
      order_db_id: order_db_id,
      info: email_info
    })

    // send new order email
    sendTemplate('thriveaudiollc@gmail.com', `TEST New Order #${order_id} | ${email_info.user.first_name} ${email_info.user.last_name}`, 'new-order.html', {
      info: email_info
    })

    console.log("transaction successful")
  } else {
    console.log("transaction failed ", authorize.responseText)
  }
  

  console.log("GOT HERE3")

  // console.log(authorize)

  console.log("RETURNING ERROR")
  return Response.json(req)
  
}







//   let authRequest = `<createTransactionRequest xmlns=\"AnetApi/xml/v1/schema/AnetApiSchema.xsd\">
//   <merchantAuthentication>
//       <name>34UTh2qF6d</name>
//       <transactionKey>49F877p4KvPBUgwR</transactionKey>
//   </merchantAuthentication>
//   <refId>123456</refId>
//   <transactionRequest>
//       <transactionType>authOnlyTransaction</transactionType>
//       <amount>5</amount>
//       <payment>
//           <creditCard>
//               <cardNumber>5424000000000015</cardNumber>
//               <expirationDate>2025-12</expirationDate>
//               <cardCode>999</cardCode>
//           </creditCard>
//       </payment>
//       <order>
//        <invoiceNumber>INV-12345</invoiceNumber>
//        <description>Product Description</description>
//       </order>
//       <lineItems>
//           <lineItem>
//               <itemId>1</itemId>
//               <name>vase</name>
//               <description>Cannes logo </description>
//               <quantity>18</quantity>z
//               <unitPrice>45.00</unitPrice>
//           </lineItem>
//       </lineItems>
//       <tax>
//           <amount>4.26</amount>
//           <name>level2 tax name</name>
//           <description>level2 tax</description>
//       </tax>
//       <duty>
//           <amount>8.55</amount>
//           <name>duty name</name>
//           <description>duty description</description>
//       </duty>
//       <shipping>
//           <amount>4.26</amount>
//           <name>level2 tax name</name>
//           <description>level2 tax</description>
//       </shipping>
//       <poNumber>456654</poNumber>
//       <customer>
//           <id>99999456654</id>
//       </customer>
//       <billTo>
//           <firstName>Ellen</firstName>
//           <lastName>Johnson</lastName>
//           <company>Souveniropolis</company>
//           <address>14 Main Street</address>
//           <city>Pecan Springs</city>
//           <state>TX</state>
//           <zip>44628</zip>
//           <country>US</country>
//       </billTo>
//       <shipTo>
//           <firstName>China</firstName>
//           <lastName>Bayles</lastName>
//           <company>Thyme for Tea</company>
//           <address>12 Main Street</address>
//           <city>Pecan Springs</city>
//           <state>TX</state>
//           <zip>44628</zip>
//           <country>US</country>
//       </shipTo>
//       <customerIP>192.168.1.1</customerIP>
//       <userFields>
//           <userField>
//               <name>MerchantDefinedFieldName1</name>
//               <value>MerchantDefinedFieldValue1</value>
//           </userField>
//           <userField>
//               <name>favorite_color</name>
//               <value>blue</value>
//           </userField>
//       </userFields>
//       <processingOptions>
//           <isSubsequentAuth>true</isSubsequentAuth>  
//       </processingOptions>
//       <subsequentAuthInformation>
//           <originalNetworkTransId>123456789NNNH</originalNetworkTransId>      
//           <originalAuthAmount>45.00</originalAuthAmount> 
//           <reason>resubmission</reason>    
//       </subsequentAuthInformation>   
//       <authorizationIndicatorType>
//           <authorizationIndicator>pre</authorizationIndicator>  
//       </authorizationIndicatorType>
//   </transactionRequest>
// </createTransactionRequest>`







// new AuthorizeDoc()
  // authRequest.openField("merchantAuthentication")
  //   authRequest.addItem("name", config['authorize_name'])
  //   authRequest.addItem("transactionKey", config['authorize_key'])
  // authRequest.closeField()

  // const new_id = newOrderId()
  // authRequest.addItem("refId", new_id.toString())

  // authRequest.openField("transactionRequest")
  //   authRequest.addItem("transactionType", "authOnlyTransaction")
  //   authRequest.addItem("amount", "5")
  //   authRequest.openField("payment")
  //     authRequest.openField("creditCard")
  //       authRequest.addItem("cardNumber", "5424000000000015")
  //       authRequest.addItem("expirationDate", "2025-12")
  //       authRequest.addItem("cardCode", "999")
  //     authRequest.closeField()
  //   authRequest.closeField()
  //   authRequest.openField("order")
  //     authRequest.addItem("invoiceNumber", new_id.toString())
  //   authRequest.closeField()
  //   authRequest.openField("lineItems")
  //     authRequest.openField("lineItem")


  // const parsed = authRequest.finalize()











  // let merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	// merchantAuthenticationType.setName(config['authorize_name']);
	// merchantAuthenticationType.setTransactionKey(config['authorize_key']);

	// let creditCard = new ApiContracts.CreditCardType();
	// creditCard.setCardNumber('4242424242424242');
	// creditCard.setExpirationDate('0822');
	// creditCard.setCardCode('999');

  // let paymentType = new ApiContracts.PaymentType();
	// paymentType.setCreditCard(creditCard);

	// let orderDetails = new ApiContracts.OrderType();
	// orderDetails.setInvoiceNumber('INV-12345');
	// orderDetails.setDescription('Product Description');

  // let tax = new ApiContracts.ExtendedAmountType();
	// tax.setAmount('4.26');
	// tax.setName('level2 tax name');
	// tax.setDescription('level2 tax');

  // let duty = new ApiContracts.ExtendedAmountType();
	// duty.setAmount('8.55');
	// duty.setName('duty name');
	// duty.setDescription('duty description');

  // let shipping = new ApiContracts.ExtendedAmountType();
	// shipping.setAmount('8.55');
	// shipping.setName('shipping name');
	// shipping.setDescription('shipping description');

  // let billTo = new ApiContracts.CustomerAddressType();
	// billTo.setFirstName('Ellen');
	// billTo.setLastName('Johnson');
	// billTo.setCompany('Souveniropolis');
	// billTo.setAddress('14 Main Street');
	// billTo.setCity('Pecan Springs');
	// billTo.setState('TX');
	// billTo.setZip('44628');
	// billTo.setCountry('USA');

  // let shipTo = new ApiContracts.CustomerAddressType();
	// shipTo.setFirstName('China');
	// shipTo.setLastName('Bayles');
	// shipTo.setCompany('Thyme for Tea');
	// shipTo.setAddress('12 Main Street');
	// shipTo.setCity('Pecan Springs');
	// shipTo.setState('TX');
	// shipTo.setZip('44628');
	// shipTo.setCountry('USA');

  // let lineItem_id1 = new ApiContracts.LineItemType();
	// lineItem_id1.setItemId('1');
	// lineItem_id1.setName('vase');
	// lineItem_id1.setDescription('cannes logo');
	// lineItem_id1.setQuantity('18');
	// lineItem_id1.setUnitPrice(45.00);

  // let lineItem_id2 = new ApiContracts.LineItemType();
	// lineItem_id2.setItemId('2');
	// lineItem_id2.setName('vase2');
	// lineItem_id2.setDescription('cannes logo2');
	// lineItem_id2.setQuantity('28');
	// lineItem_id2.setUnitPrice('25.00');

  // let lineItemList = [];
	// lineItemList.push(lineItem_id1);
	// lineItemList.push(lineItem_id2);

	// let lineItems = new ApiContracts.ArrayOfLineItem();
	// lineItems.setLineItem(lineItemList);

  // let userField_a = new ApiContracts.UserField();
	// userField_a.setName('A');
	// userField_a.setValue('Aval');

	// let userField_b = new ApiContracts.UserField();
	// userField_b.setName('B');
	// userField_b.setValue('Bval');

  // let userFieldList = [];
	// userFieldList.push(userField_a);
	// userFieldList.push(userField_b);

	// var userFields = new ApiContracts.TransactionRequestType.UserFields();
	// userFields.setUserField(userFieldList);

  // let transactionSetting1 = new ApiContracts.SettingType();
	// transactionSetting1.setSettingName('duplicateWindow');
	// transactionSetting1.setSettingValue('1');

  // let transactionSetting2 = new ApiContracts.SettingType();
	// transactionSetting2.setSettingName('recurringBilling');
	// transactionSetting2.setSettingValue('false');

  // let transactionSettingList = [];
	// transactionSettingList.push(transactionSetting1);
	// transactionSettingList.push(transactionSetting2);

	// var transactionSettings = new ApiContracts.ArrayOfSetting();
	// transactionSettings.setSetting(transactionSettingList);

  // let transactionRequestType = new ApiContracts.TransactionRequestType();
	// transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHONLYTRANSACTION);
	// transactionRequestType.setPayment(paymentType);
	// transactionRequestType.setAmount("123");
	// transactionRequestType.setLineItems(lineItems);
	// transactionRequestType.setUserFields(userFields);
	// transactionRequestType.setOrder(orderDetails);
	// transactionRequestType.setTax(tax);
	// transactionRequestType.setDuty(duty);
	// transactionRequestType.setShipping(shipping);
	// transactionRequestType.setBillTo(billTo);
	// transactionRequestType.setShipTo(shipTo);
	// transactionRequestType.setTransactionSettings(transactionSettings);

  // let createRequest = new ApiContracts.CreateTransactionRequest();
	// createRequest.setMerchantAuthentication(merchantAuthenticationType);
	// createRequest.setTransactionRequest(transactionRequestType);

  // let ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());

  // // ctrl.execute(function(){
  // let apiResponse = ctrl.getResponse();

  // var response = new ApiContracts.CreateTransactionResponse(apiResponse);

  // if(response != null){
  //   if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
  //     if(response.getTransactionResponse().getMessages() != null){
  //       console.log("TRANSACTION SUCCESSFUL")
  //       req = {"result": "success yay"}
  //       return Response.json(req)
  //     }
  //   } else {
  //     console.log("ERROR: ", response.getTransactionResponse().getMessages())
  //   }
  // }
  // // })