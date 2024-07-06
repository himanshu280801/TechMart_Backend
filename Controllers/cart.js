import { Cart } from "../Models/Cart.js";

// add To Cart
export const addToCart = async (req, res) => {
  const { productId, title, price, qty, imgSrc } = req.body;

  const userId = req.user;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = new Cart({ userId, items: [] }); 
  }
   
  /* iske jagah niche wala code liha hai const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );*/
  const itemIndex = cart.items.findIndex((item) => item && item.productId && item.productId.toString() === productId);
 
  if (itemIndex > -1) {
    cart.items[itemIndex].qty += qty;
    cart.items[itemIndex].price += price * qty; 
  } else {
    cart.items.push({ productId, title, price, qty, imgSrc });
  }

  await cart.save();
  res.json({ message: "Items Added To Cart", cart });
};

// get User Cart
export const userCart = async (req,res) =>{
   const userId = req.user;
   
   let cart = await Cart.findOne({userId});
   if(!cart) return res.json({messge:'Cart not found'})

    res.json({message:"user cart",cart})
}

// remove product from cart
export const removeProductFromCart = async (req, res) => {
    const productId = req.params.productId;
  const userId = req.user;

  let cart = await Cart.findOne({ userId });
  if (!cart) return res.json({ messge: "Cart not found" });

 cart.items = cart.items.filter((item)=>item.productId.toString() !== productId)
  /* ye chat gpt wala tha if (productId) {
    cart.items = cart.items.filter((item) => {
      if (!item.productId || !productId) {
          // Handle the case where productId or item.productId is undefined
          return true; // or false depending on what you want to achieve
      }
      return item.productId.toString() !== productId.toString();
  });*/

  await cart.save();

  res.json({ message: "product remove from cart"});
};


// clear cart
export const clearCart = async (req, res) => {

  const userId = req.user;

  let cart = await Cart.findOne({ userId });
  if (!cart){
    cart = new Cart({items:[]})
  } else{
    cart.items = [];
  }
  
  await cart.save();

  res.json({ message: " cart cleared"});
};


// decrease qty from Cart
export const decreaseProudctQty = async (req, res) => {
  const { productId, qty} = req.body;

  const userId = req.user;

  let cart = await Cart.findOne({ userId });
 
  if (!cart) {
    cart = new Cart({ userId, items: [] });
    // return res.json({messge:'Cart not find'})
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex > -1) {
    const item = cart.items[itemIndex]

    if(item.qty > qty){
        const pricePerUnit = item.price/item.qty

        item.qty -= qty
        item.price -= pricePerUnit*qty
    }else{
        cart.items.splice(itemIndex,1)
    }

  } else {
    return res.json({messge:'invalid product Id'})
  } 

  await cart.save();
  res.json({ message: "Items qty decreased", cart });
};