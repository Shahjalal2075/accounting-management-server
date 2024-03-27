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
    const salesReport = database.collection("salesReport");
    const conceptoReport = database.collection("conceptoReport");

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
    app.get('/sales-report', async (req, res) => {
      const cursor = salesReport.find()
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/sales-report', async (req, res) => {
      const user = req.body;
      console.log('Sales Add', user);
      const result = await salesReport.insertOne(user);
      res.send(result);
    })
    app.get('/sales-report/:mail', async (req, res) => {
      const mail = req.params.mail;
      const query = { mail: mail }
      const product = await salesReport.find(query).toArray();
      res.send(product);
    })
    app.get('/sales-report/:mail/:name', async (req, res) => {
      const name = req.params.name;
      const mail = req.params.mail;
      const query = { name: name, mail: mail }
      const product = await salesReport.findOne(query);
      res.send(product);
    })
    app.put('/sales-report/:mail/:name', async (req, res) => {
      const name = req.params.name;
      const mail = req.params.mail;
      const product = req.body;
      const filter = { name: name, mail: mail };
      const options = { upsert: true };
      console.log('update product : ', product);
      const updatedProduct = {
        $set: {
          Compra: product.Compra,
          Ventas: product.Ventas,
          PTax: product.PTax,
          STax: product.STax,
        }
      }
      const result = await salesReport.updateOne(filter, updatedProduct, options);
      res.send(result);
    })
    app.get('/concepto-report', async (req, res) => {
      const cursor = conceptoReport.find()
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/concepto-report', async (req, res) => {
      const user = req.body;
      console.log('concepto Add', user);
      const result = await conceptoReport.insertOne(user);
      res.send(result);
    })
    app.get('/concepto-report/:mail', async (req, res) => {
      const mail = req.params.mail;
      const query = { mail: mail }
      const product = await conceptoReport.find(query).toArray();
      res.send(product);
    })
    app.get('/concepto-report/:mail/:name', async (req, res) => {
      const name = req.params.name;
      const mail = req.params.mail;
      const query = { name: name, mail: mail }
      const product = await conceptoReport.findOne(query);
      res.send(product);
    })
    app.put('/concepto-report/:mail/:name', async (req, res) => {
      const name = req.params.name;
      const mail = req.params.mail;
      const product = req.body;
      const filter = { name: name, mail: mail };
      const options = { upsert: true };
      console.log('update product : ', product);
      const updatedProduct = {
        $set: {
          record: product.record,
          value: product.value,
        }
      }
      const result = await conceptoReport.updateOne(filter, updatedProduct, options);
      res.send(result);
    })

    app.get('/user-list/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email }
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
    app.get('/sale-invoice/:mail', async (req, res) => {
      const mail = req.params.mail;
      const query = { mail: mail }
      const cursor = saleInvoice.find(query)
      const result = await cursor.toArray();
      res.send(result);
    })
    app.get('/purchase-invoice/:mail', async (req, res) => {
      const mail = req.params.mail;
      const query = { mail: mail }
      const cursor = purchaseInvoice.find(query)
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
    app.get('/sale-invoice/:mail', async (req, res) => {
      const mail = req.params.mail;
      const query = { mail: mail }
      const cursor = saleInvoice.find(query)
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/sale-invoice', async (req, res) => {
      const invoice = req.body;
      console.log('invoice Add', invoice);
      const result = await saleInvoice.insertOne(invoice);
      res.send(result);
    })

    app.get('/purchase-invoice/:mail/:id', async (req, res) => {
      const id = req.params.id;
      const mail = req.params.mail;
      const query = { _id: new ObjectId(id), mail: mail }
      const product = await purchaseInvoice.findOne(query);
      res.send(product);
    })
    app.get('/sale-invoice/:mail/:id', async (req, res) => {
      const id = req.params.id;
      const mail = req.params.mail;
      const query = { _id: new ObjectId(id), mail: mail }
      const product = await saleInvoice.findOne(query);
      res.send(product);
    })

    app.put('/purchase-invoice/:mail/:id', async (req, res) => {
      const id = req.params.id;
      const mail = req.params.mail;
      const product = req.body;
      const filter = { _id: new ObjectId(id), mail: mail };
      const options = { upsert: true };
      console.log('update product : ', product);
      const updatedProduct = {
        $set: {
          nfc: product.nfc,
          id: product.id,
          rnc: product.rnc,
          company: product.company,
          fecha: product.fecha,
          fechDePago: product.fechDePago,
          formaDePago: product.formaDePago,
          modificado: product.modificado,
          monto: product.monto,
          subTotals: product.subTotals,
          totals: product.totals,
          totalToPagars: product.totalToPagars,
          count: product.count,
          taxs: product.taxs,
          taxAmmount: product.taxAmmount,
          conceptoValue: product.conceptoValue,
          enable: product.enable,
          discounts: product.discounts,
          discountAmmount: product.discountAmmount,
          totalDis: product.totalDis,
          montoList: product.montoList,
          tipoList: product.tipoList,
          tipoCk: product.tipoCk,
          ammount: product.ammount,
          ammountDisscount: product.ammountDisscount,
          mark: product.mark
        }
      }
      const result = await purchaseInvoice.updateOne(filter, updatedProduct, options);
      res.send(result);
    })
    app.put('/sale-invoice/:mail/:id', async (req, res) => {
      const id = req.params.id;
      const mail = req.params.mail;
      const product = req.body;
      const filter = { _id: new ObjectId(id), mail: mail };
      const options = { upsert: true };
      console.log('update product : ', product);
      const updatedProduct = {
        $set: {
          nfc: product.nfc,
          id: product.id,
          rnc: product.rnc,
          company: product.company,
          fecha: product.fecha,
          fechDePago: product.fechDePago,
          tipoDeIngreso: product.tipoDeIngreso,
          formaDePago: product.formaDePago,
          modificado: product.modificado,
          monto: product.monto,
          subTotals: product.subTotals,
          totals: product.totals,
          totalToPagars: product.totalToPagars,
          taxs: product.taxs,
          taxAmmount: product.taxAmmount,
          discounts: product.discounts,
          discountAmmount: product.discountAmmount,
          totalDis: product.totalDis,
          ammountDisscount: product.ammountDisscount,
          mark: product.mark
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