const http = require("http");
const fs = require('fs')
const path = require('path')
const formidable = require('formidable')
const { basket, commetns, products, profile } = require('./api');
const { error } = require("console");
http.createServer((req, res) => {
    const routes = req.url.split('/')

    switch (req.url) {
        case "/":
            res.write('index page')
            break;
        case "/product":
            res.write(JSON.stringify(products))
            break;
        case "/profile":
            const profile = {
                name: 'mohammad',
                last_name: 'tazaroie',
                age: "14",

            }
            res.write(JSON.stringify(profile))
            break;
        case "/basket":
            const productIds = basket.map(item => item.productId)
            const myBasket = (products.filter(product => productIds.includes(product.id)).map(item => {
                item.count = basket.find(bask => bask.productId == item.id).count;
                item.basketProductPrice = item.count * item.price;

                return item
            }))
            res.write(JSON.stringify(myBasket))
            break;
        case "/comments":
            res.write(JSON.stringify(commetns))
            break;
        default:
        case "/fileupload":
            if (req.method.toLowerCase() === "post") {
                if (!fs.existsSync(path.join(__dirname, "uploads", "files"))) {
                    fs.mkdirSync("uploads/files", { recursive: true })
                }
                const options = {
                    uploadDir: path.join(__dirname, "uploads", "files"),
                    keepExtensions: true,
                    multiples: true,
                    maxFieldsSize: 5 * 1024 * 1024,
                    allowEmptyFiles: false,
                    filter: function ({ name, originalFilename, mimetype }) {
                        // keep only images
                        return mimetype && mimetype.includes("image");
                    }
                }
                const form = new formidable.IncomingForm(options);
                res.write('file uploaded')

                form.parse(req, (err, fields, files) => {
                })
            } else {
                const htmlForm = fs.readFileSync("./uploadfile.html", "utf-8")
                res.write(htmlForm)
            }

            break;

            res.write(JSON.stringify({ status: 404, message: 'page not fount' }))
            break;
    }

    console.log(req.url);
    res.end()
}).listen(2500, () => {
    console.log('http://localhost:2500');
})