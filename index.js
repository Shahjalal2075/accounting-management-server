const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

console.log('UserName: ', process.env.DB_USER);
console.log('Password: ', process.env.DB_PASS);


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s6b6iw5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();

    const database = client.db("accountServerDB");
    const users = database.collection("users");
    const purchaseInvoice = database.collection("purchaseInvoice");
    const saleInvoice = database.collection("saleInvoice");

    app.get('/user-list', async (req, res) => {
      const cursor = users.find()
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/user-list', async (req, res) => {
      const user = req.body;
      console.log('User Add', user);
      const result = await users.insertOne(user);
      res.send(result);
    })
    app.get('/user-list/:email', async (req, res) => {
      const email = req.params.email;
      const query = {email : email }
      const product = await users.findOne(query);
      res.send(product);
    })
    app.patch('/user-list/:email', async (req, res) => {
      const id = req.params.email;
      const query = { email: id }
      const updateEmployee = req.body;
      console.log(query);
      const updateDoc = {
        $set: {
          verify: updateEmployee.verify,
          role: updateEmployee.role
        }
      }
      const result = await users.updateOne(query, updateDoc);
      res.send(result);
    })
    app.get('/purchase-invoice', async (req, res) => {
      const cursor = purchaseInvoice.find()
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/purchase-invoice', async (req, res) => {
      const invoice = req.body;
      console.log('invoice Add', invoice);
      const result = await purchaseInvoice.insertOne(invoice);
      res.send(result);
    })
    app.get('/sale-invoice', async (req, res) => {
      const cursor = saleInvoice.find()
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/sale-invoice', async (req, res) => {
      const invoice = req.body;
      console.log('invoice Add', invoice);
      const result = await saleInvoice.insertOne(invoice);
      res.send(result);
    })

     app.get('/purchase-invoice/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const product = await purchaseInvoice.findOne(query);
      res.send(product);
    })
     app.get('/sale-invoice/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const product = await saleInvoice.findOne(query);
      res.send(product);
    })

    app.put('/purchase-invoice/:id', async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      console.log('update product : ', product);
      const updatedProduct = {
        $set: {
          nfc: product.nfc,
          id: product.id,
          rnc: product.rnc,
          fecha: product.fecha,
          fechDePago: product.fechDePago,
          formaDePago: product.formaDePago,
          modificado: product.modificado,
        }
      }
      const result = await purchaseInvoice.updateOne(filter, updatedProduct, options);
      res.send(result);
    })
    app.put('/sale-invoice/:id', async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      console.log('update product : ', product);
      const updatedProduct = {
        $set: {
          nfc: product.nfc,
          id: product.id,
          rnc: product.rnc,
          fecha: product.fecha,
          fechDePago: product.fechDePago,
          formaDePago: product.formaDePago,
          modificado: product.modificado,
          
        }
      }
      const result = await saleInvoice.updateOne(filter, updatedProduct, options);
      res.send(result);
    })

    app.delete('/purchase-invoice/:id', async (req, res) => {
      const id = req.params.id;
      console.log('delete server id: ', id);
      const query = { _id: new ObjectId(id) };
      const result = await purchaseInvoice.deleteOne(query);
      res.send(result);
    })
    app.delete('/sale-invoice/:id', async (req, res) => {
      const id = req.params.id;
      console.log('delete server id: ', id);
      const query = { _id: new ObjectId(id) };
      const result = await saleInvoice.deleteOne(query);
      res.send(result);
    })

    /* app.get('/brands', async (req, res) => {
      const cursor = usersCollectionBrands.find()
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/cart', async (req, res) => {
      const cursor = usersCollectionCart.find()
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/cart/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email }
      const product = usersCollectionCart.find(query);
      const result = await product.toArray();
      res.send(result);
    })

    app.get('/products', async (req, res) => {
      const cursor = usersCollectionProducts.find()
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/products/:brand', async (req, res) => {
      const brand = req.params.brand;
      const query = { brandName: brand }
      const product = usersCollectionProducts.find(query);
      const result = await product.toArray();
      res.send(result);
    })

    app.get('/products/:brand/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const product = await usersCollectionProducts.findOne(query);
      res.send(product);
    })

    app.put('/products/:brand/:id', async (req, res) => {
      const id = req.params.id;
      const product = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      console.log('update product : ', product);
      const updatedProduct = {
        $set: {
          productName: product.productName,
          brandName: product.brandName,
          type: product.type,
          price: product.price,
          photo: product.photo,
          rating: product.rating
        }
      }
      const result = await usersCollectionProducts.updateOne(filter, updatedProduct, options);
      res.send(result);
    })

    app.post('/products', async (req, res) => {
      const product = req.body;
      console.log('new product', product);
      const result = await usersCollectionProducts.insertOne(product);
      res.send(result);
    })

    app.post('/cart', async (req, res) => {
      const product = req.body;
      console.log('new cart product', product);
      const result = await usersCollectionCart.insertOne(product);
      res.send(result);
    })

    app.delete('/cart/:id', async (req, res) => {
      const id = req.params.id;
      console.log('delete server id: ', id);
      const query = { _id: new ObjectId(id) };
      const result = await usersCollectionCart.deleteOne(query);
      res.send(result);
    }) */


    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    //console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send("Curd Running serverr");
})

app.listen(port, () => {
  console.log(`Ser running port: ${port}`);
}) 