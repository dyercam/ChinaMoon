import {useState, useEffect} from "react";
import Axios from 'axios';



function App() {

  const [loading, setLoading] = useState(true);
  //different states for holding information before it is put/updated in the database
  const [saveCata, setSaveCata] = useState("")
  const [saveName, setSaveName] = useState("")
  const [saveDesc, setSaveDesc] = useState("")
  const [saveImg, setSaveImg] = useState("")
  const [savePrice, setSavePrice] = useState("")
  
  const [newPrice, setnewPrice] = useState(undefined)
  const [newName, setNewName] = useState(undefined)
  const [newDesc, setNewDesc] = useState(undefined)
  const [newImg, setnewImg] = useState(undefined)
  
  const [cataArray, setCataArray] = useState([])
  const [uniqueCata, setUniqueCata] = useState([])
  
  const [menuCata, setMenuCata] = useState([])
  const[orderCata, setOrderCata] = useState([])
  
  const [menu, setMenu] = useState([]) 
  const [images, setImages] = useState([]);
  const [imageData, setImageData] = useState(null)
  


//adding to the database when the user clicks the add button
const addItem = () =>{ 
  Axios.post('http://localhost:8081/create', {
    cata: saveCata, 
    dishName: saveName, 
    description: saveDesc, 
    price: savePrice,
    imageURL: saveImg 
  }).then(()=>{
    Axios.get('http://localhost:8081/menu').then((response)=>{
      
      setMenu(response.data);
      setLoading(false);
    });
      
    Axios.get('http://localhost:8081/catagories').then((response) => {
      setCataArray(response.data);
    });
    
    setSaveCata("");
    setSaveName("");
    setSaveDesc("");
    setSavePrice("");
    setSaveImg("");
    
  })

}


//adding items to the OrderOfItems database table
const addOrder = () =>{
  Axios.post('http://localhost:8081/orderOfItemInput', {
    cata: saveCata,
    pos: 2
  }).then(()=>{
   
  })
}
useEffect(() =>{
  Axios.get('http://localhost:8081/orderOfItemInput').then((response) =>{
    setOrderCata(response.data.map(item => item.name))
  })

},[menu])

//combining the two consts that add the items to the tables
const addAll = () =>{
  addItem();
  addOrder();
} 
//

//rendering the list of items in the db on the webpage
useEffect(()=>{
  Axios.get('http://localhost:8081/menu').then((response)=>{
    setMenu(response.data)
    setLoading(false);
    setMenuCata(response.data.map( item => item.catagory))
    console.log("loading: ",loading)
  })
},[]);
//

// Function to fetch and convert blob image data to base64 format
const fetchImage = async (imageData) => {
  try {
    

    // If not, proceed with converting to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1]; // Get only the base64-encoded part
        resolve(`data:image/jpeg;base64,${base64Data}`);
      };
      reader.onerror = reject;
      reader.readAsDataURL(new Blob([imageData.data]));
    });
  } catch (error) {
    console.error('Error converting image data:', error);
    return null;
  }
};

//pulling the catagories from the database for organization, then adding each unique category to the second array
useEffect(()=>{
  Axios.get('http://localhost:8081/catagories').then((response)=>{
  setCataArray(response.data)
  })
},[])

useEffect(() => {
  Axios.get("http://localhost:8081/menu").then((response) => {
    setImages(response.data);
  });
}, []);



//

//multiple Axios calls to update individual blocks in the db
const changeMenu = (id) =>{
  
  if(newPrice !== undefined && newPrice.trim() !==""){
    Axios.put("http://localhost:8081/updatePrice", {price: newPrice, itemId: id}).then((response) => {
    console.log("updated price")
    Axios.get('http://localhost:8081/menu').then((response)=>{
      setMenu(response.data);
      setLoading(false);
    });
  })
  }
  if(newName !== undefined && newName.trim() !==""){
    Axios.put("http://localhost:8081/updateName", {dishName: newName, itemId: id}).then((response) => {
    console.log("updated name")
    Axios.get('http://localhost:8081/menu').then((response)=>{
      setMenu(response.data);
      setLoading(false);
    });
  })
  }
  if(newDesc !== undefined && newDesc.trim() !==""){
    Axios.put("http://localhost:8081/updateDesc", {description: newDesc, itemId: id}).then((response) => {
    console.log("updated description")
    Axios.get('http://localhost:8081/menu').then((response)=>{
      setMenu(response.data);
      setLoading(false);
    });
  })
  }
  if(newImg !== undefined && newImg.trim() !==""){
    Axios.put("http://localhost:8081/updateImage", {image: newImg, itemId: id}).then((response) => {
    console.log("updated image")
    Axios.get('http://localhost:8081/menu').then((response)=>{
      console.log(response.data)
      setMenu(response.data);
      setLoading(false);
    });
  })
  }

}
//

//delete row in db
const deleteItem = (id, category) =>{
  Axios.delete(`http://localhost:8081/delete/${id}`).then((response)=>{
    setMenu(menu.filter((val)=>{
      return val.itemId != id
    }))
    setUniqueCata(uniqueCata.filter((cat) => cat.catagory !== category));
  })
}


useEffect(() =>{
  const uniqueSet = new Set(cataArray.map(item => item.catagory));
  const uniqueArray = Array.from(uniqueSet).map(catagory => ({ catagory }))
  setUniqueCata(uniqueArray)

},[cataArray,menu])




//two consts that handle input of information when adding an item
const handleInput = (stateChanger)=> (e) => {
  stateChanger(e.target.value)
}

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onloadend = () => {
    const imageData = reader.result;
    setSaveImg(imageData);
  };

  if (file) {
    reader.readAsDataURL(file);
  }
};







const [imageDataMap, setImageDataMap] = useState({});

useEffect(() => {
  // Fetch image data for all menu items
  const fetchImageData = async () => {
    const dataMap = {};
    await Promise.all(menu.map(async (item) => {
      const imageData = await fetchImage(item.image);
      dataMap[item.itemId] = imageData;
    }));
    setImageDataMap(dataMap);
  };

  fetchImageData();
}, [menu]);



//main output, contains the inputs, and the button the user clicks to finalize the information. this part of the code
//also renders the information on screen
  return (
    <div>
      <div className="inputs">
        <label>Catagory:</label>
        <input value={saveCata} onChange={handleInput(setSaveCata)}/>

        <label >Dish Name:</label>
        <input value={saveName} onChange={handleInput(setSaveName)}/>

        <label >Description:</label>
        <input value={saveDesc} onChange={handleInput(setSaveDesc)}/>

        <label >Price:</label>
        <input value={savePrice} onChange={handleInput(setSavePrice)}/>

        
      
      <button onClick={addAll}>Add item</button>


      </div>
      {console.log("MenuCata: ",menuCata)}
      {console.log("OrderCata: ", orderCata)}
      {console.log("uniqueCata: ",uniqueCata)}
      {/* Loading section */}
      {loading && <div>Loading...</div>}

      { !loading && <div className="menu">
        
        {uniqueCata.map((val, index) => (
          <div key={index}>
             <h1>{val.catagory}</h1>
             {/* filter menu items based on categories and render them*/}
             {menu.filter(item => item.catagory === val.catagory).map((val, key) => (
              <div key={key}>
                <div>{val.dishName}</div>
                <div>{val.description}</div>
                <div>{val.price}</div>
                
                <div> 
               
                  
                </div>

                <div>
              {" "}
              <input onChange={(e) => {
                setNewName(e.target.value)
              }} 
              type="text" placeholder="new name"></input>
              <button onClick={()=>{changeMenu(val.itemId)}}>Update</button>

              <input onChange={(e) => {
                setNewDesc(e.target.value)
              }} 
              type="text" placeholder="new description"></input>
              <button onClick={()=>{changeMenu(val.itemId)}}>Update</button>

              <input onChange={(e) => {
                setnewPrice(e.target.value)
              }} 
              type="text" placeholder="new price"></input>
              <button onClick={()=>{changeMenu(val.itemId)}}>Update</button>
              
              <input onChange={(e) => {
                setnewImg(e.target.value)
              }} 
              type="text" placeholder="new image"></input>
              <button onClick={()=>{changeMenu(val.itemId)}}>Update</button>


              <button onClick={()=> {deleteItem(val.itemId, val.catagory)}}>delete</button>
            </div>
              </div>
              
            ))}
          </div>
          
          
        ))}





        


      </div>}
    </div>
  );
}

export default App;
