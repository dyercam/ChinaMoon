import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import multer from 'multer'
import path from 'path'

const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
    user:'root',
    host: 'localhost',
    password: 'faruk2018',
    database: 'ChinaMoon',

});



// Multer configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      // Specify the directory where uploaded files will be stored
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      // Specify the filename for uploaded files
      cb(null, Date.now() + path.extname(file.originalname));
    }
  });

  const upload = multer({ storage: storage });


//allows the user to create a new entry
app.post("/create", upload.single('image'), (req, res) => {
    const catagory = req.body.cata;
    const dishName = req.body.dishName;
    const description = req.body.description;
    const price = req.body.price;
    const imageURL = req.body.imageURL;

    db.query('INSERT INTO Menu (catagory, dishName, description, price, image) VALUES (?,?,?,?,?)',
     [catagory, dishName, description, price, imageURL], (err, result) => {
        if (err){
            console.log(err)
        } else{
            res.send("Values inserted")
        }
     }

    );

})
//

app.post("/orderOfItemInput", (req,res) => {
    const name = req.body.cata;
    const pos = req.body.pos;
    db.query("INSERT INTO OrderOfItems (name, position) VALUES (?,?)", 
    [name, pos], (err, result) => {
        if (err){
            console.log(err)
        } else{
            res.send("Values inserted into OrderOfItems")
        }
    })
})

//gets the data from the database to allow it to be rendered on screen
app.get("/menu", (req, res) =>{
    db.query("SELECT * FROM Menu", (err, result) =>{
        if (err){
            console.log(err)
        } else{
            res.send(result)
        }
    })
})

app.get("/orderOfItemInput", (req,res) => {
    db.query("SELECT name FROM OrderOfItems",
        (err,result) => {
            if (err){
                console.log(err)
            }else{
                res.send(result)
            }
        }
    )
})

app.get('/image/:filename', (req, res) => {
    const filename = req.params.filename;
    // Send the requested image file
    res.sendFile(path.join(__dirname, 'uploads', filename));
  });
  
//



app.get("/catagories", (req,res) =>{
    db.query("SELECT catagory FROM Menu", (err, result) =>{
        if(err){
            soncolse.log(err)
        }else{
            res.send(result)
        }
    })
})


//allows for the updating of each part of an entry
  app.put('/updateName', (req, res) => {
    const id = req.body.itemId
    const newDish = req.body.dishName
    db.query("UPDATE Menu SET dishName = ? WHERE itemId = ?", [newDish, id], (err, result) =>{
        if (err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
  })

  app.put('/updateDesc', (req, res) => {
    const id = req.body.itemId
    const newDesc = req.body.description
    db.query("UPDATE Menu SET description = ? WHERE itemId = ?", [newDesc, id], (err, result) =>{
        if (err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
  })

  app.put('/updatePrice', (req, res) => {
    const id = req.body.itemId
    const priceChange = req.body.price
    db.query("UPDATE Menu SET price = ? WHERE itemId = ?", [priceChange, id], (err, result) =>{
        if (err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
  })

  app.put('/updateImage', (req, res) => {
    const id = req.body.itemId
    const newIMG = req.body.image
    db.query("UPDATE Menu SET image = ? WHERE itemId = ?", [newIMG, id], (err, result) =>{
        if (err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
  })
  //

//allows for the deletion of entries
app.delete('/delete/:id', (req, res) =>{
    const id = req.params.id
    db.query("DELETE FROM Menu Where itemID = ?", id, (err, result) =>{
        if (err){
            console.log(err)
        }else{
            res.send(result)
        }
    })
})
//

app.listen(8081, ()=> {
    console.log("Listening in backend")
})