const fs = require("fs");
const http = require("http");
const url = require("url");
const replaceTemplate = require('./modules/replaceTemplate')
// blocking syncronus way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')

// console.log(textIn)

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;

// fs.writeFileSync('./txt/output.txt', textOut)

// console.log('file written')

// non-blocking

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2)
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {

//             })
//         });
//     });
// });
// console.log('will read file')
//////////////////////////////

////server



const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {

console.log(req.url);
console.log(url.parse(req.url, true))

// const pathname = req.url
const {query, pathname } = url.parse(req.url, true);
  
//overview page

  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, {
      'Content-type': "text/html"
    })

    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)

    res.end(output);
//product page

  } else if (pathname === "/product") {
    console.log(query);
    res.writeHead(200, {
      'Content-type': "text/html"
    })
    const product = dataObj[query.id]
    const output = replaceTemplate(tempProduct, product)
   res.end(output);

//api page
  } else if (pathname === "/api") {
    res.writeHead(404, {
      "content-type": "application/json"
    });
    res.end(data);

// not found
  } else {
    res.writeHead(404, {
      "content-type": "text/html"
    });
    res.end("<h1>this page can no be found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("listening to request on port 8000");
})
