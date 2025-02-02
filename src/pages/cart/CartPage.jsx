import CartDisplayProduct from "../../components/cart-display-product/CartDisplayProduct";
import { useEffect, useState } from "react";
import { Modal } from "@material-ui/core";
import "./CartPage.css";
// import data from "../../products";
import {
  getCart,
  addItemToCart,
  removeItemFromCart,
  addItemQuantity,
  reduceItemQuantity,
  getOrders,
  addOrderItem,
  addOrderArr,
} from "./useLocalStorage";

function CartPage(props) {
  const { setCartItemsCount } = props;
  const convert = (str) => {
    let res = str.replace(/\D/g, "");
    // parseInt(str.replace(/\D/g, ""));
    return parseInt(res);
  };

  const [cartItems, setCartItems] = useState(getCart() || []);
  const [totalPrice, setTotalPrice] = useState(0);

  const [address, setAddress] = useState(
    localStorage.getItem("userAddress") || ""
  );

  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (e) => {
    e.preventDefault();
    setOpen(false);
    localStorage.setItem("userAddress", address);
  };

  function handleRemove(id) {
    removeItemFromCart(id);
    setCartItems(getCart);
    setCartItemsCount(getCart().length);
  }

  const handleOrder = () => {
    console.log(getOrders());
    addOrderArr(cartItems);
    console.log(getOrders());
    localStorage.setItem("cartItems", JSON.stringify([]));
    setCartItems([]);
    setCartItemsCount(getCart().length);
  };
  function calculateTotalPrice() {
    let total = 0;
    // setCartItems(getCart());
    cartItems.forEach((item) => {
      total += parseInt(item.quantity) * convert(item.price);
    });
    setTotalPrice(total);
  }

  useEffect(() => {
    calculateTotalPrice();
  }, [cartItems]);

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h1>No Items In Cart</h1>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-page-left">
        <div className="cart-page-left-header">
          <h1>My Cart({cartItems.length})</h1>
          <div className="address-container">
            {!address ? (
              <>
                <button onClick={handleOpen} className="add-address">
                  Add Address
                </button>
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="lightblue"
                >
                  <path d="M12 0c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602zm0 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z" />
                </svg>
                Deliver to
                <h1 className="cart-page-left-header-address">{address}</h1>
                <button onClick={handleOpen} className="edit-address">
                  Edit Address
                </button>
              </>
            )}
          </div>
        </div>

        {/* Map items here */}
        {cartItems.map((item) => (
          <CartDisplayProduct
            key={item.id}
            id={item.id}
            name={item.name}
            image={item.img}
            price={item.price}
            rating={item.rating}
            quantity={item.quantity}
            handleRemove={handleRemove}
            setCartItems={setCartItems}
          />
        ))}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div className="addressForm">
          <form action="">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button onClick={handleClose} className="add-address">
              Add Address
            </button>
          </form>
        </div>
      </Modal>
      <div className="cart-page-right">
        <h1 className="cart-price-details">PRICE DETAILS</h1>
        <hr className="plane-hr" />
        <div className="cart-price">
          <h1>Price ({cartItems.length})</h1>
          <h1>{totalPrice * 1.25}</h1>
        </div>
        <div className="cart-discount">
          <h1>Discount</h1>
          <h1 className="disc">25%</h1>
        </div>
        <div className="cart-delivery-charges">
          <h1>Delivery Charges</h1>
          <h1 className="disc">Free</h1>
        </div>

        <hr className="dashed-hr" />
        <div className="cart-total">
          <h1 className="total-amt">Total Amount</h1>
          <h1>{totalPrice}</h1>
        </div>

        <button onClick={handleOrder} className="place-order">
          Place Order
        </button>
      </div>
    </div>
  );
}

export default CartPage;
