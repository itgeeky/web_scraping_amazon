const axios = require('axios')
const cheerio = require('cheerio')
require("dotenv").config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3030;

url ='https://www.amazon.com.mx/Apple-2022-iPad-Air-Wi-Fi-64-GB/dp/B09V44LVZ6/ref=sr_1_1_sspa?__mk_es_MX=%C3%85M%C3%85%C5%BD%C3%95%C3%91&keywords=ipad+air&qid=1665430123&qu=eyJxc2MiOiI1LjUzIiwicXNhIjoiNS4zMSIsInFzcCI6IjQuODMifQ%3D%3D&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEzSzlPUFdON0taVUlZJmVuY3J5cHRlZElkPUEwNzkwNDMxMlFaWFBTVTI3SzQ3QyZlbmNyeXB0ZWRBZElkPUEwNTg0MzgyMlcyMTFHQlhDQ0cyNCZ3aWRnZXROYW1lPXNwX2F0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU='
const product = { name: "", price: "", link: "" };

//create an interval
const handle = setInterval(scrape, 21600000);
//21600000

async function scrape() {
  //Fetch 
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const item = $("div#dp-container");
  //Extraer los datos necesarios 
  product.name = $(item).find("h1 span#productTitle").text();
  product.link = url;
  const price = $(item)
    .find("span .a-price-whole")
    .first()
    .text()
    .replace(/[,.]/g, "");
  const priceNum = parseInt(price);
  product.price = priceNum;
  console.log(product);
  //Enviar el sms
  if (priceNum < 13500) {
    client.messages
      .create({
        body: `The price of ${product.name} went below ${price}. Purchase it at ${product.link}`,
        from: "+13854813358",
        to: "+525577897416",
      })
      .then((message) => {
        console.log(message);
        clearInterval(handle);
      });
  }
}

scrape();

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});