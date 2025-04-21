import React, { useState, useEffect, useReducer } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js"; // Single import
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Calculate total price
  const totalPrice = () => {
    try {
      let total = 0;
      cart?.forEach((item) => {
        total += item.price;
      });
      return total.toLocaleString("en-US", {
        style: "currency",
        currency: "INR",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Remove item from cart
  const removeCartItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);
      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  // Create PayPal order
  const createOrder = async (data, actions) => {
    try {
      const { data: orderData } = await axios.post(
        "/api/v1/product/paypal/create-order",
        { cart }
      );
      return orderData.orderID;
    } catch (error) {
      console.error(error);
    }
  };

  // Handle PayPal payment approval
  const onApprove = async (data, actions) => {
    try {
      setLoading(true);
      await axios.post("/api/v1/product/paypal/capture-order", {
        orderID: data.orderID,
        cart,
      });
      setLoading(false);
      localStorage.removeItem("cart");
      setCart([]);
      navigate("/dashboard/user/orders");
      toast.success("Payment Completed Successfully");
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="cart-page">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-2 mb-1">
              {!auth?.user
                ? "Hello Guest"
                : `Hello  ${auth?.token && auth?.user?.name}`}
              <p className="text-center">
                {cart?.length
                  ? `You Have ${cart.length} items in your cart ${
                      auth?.token ? "" : "please login to checkout !"
                    }`
                  : " Your Cart Is Empty"}
              </p>
            </h1>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-7 p-0 m-0">
              {cart?.map((p) => (
                <div className="row card flex-row" key={p._id}>
                  <div className="col-md-4">
                    <img
                      src={`/api/v1/product/product-photo/${p._id}`}
                      className="card-img-top"
                      alt={p.name}
                      width="100%"
                      height={"130px"}
                    />
                  </div>
                  <div className="col-md-4">
                    <p>{p.name}</p>
                    <p>{p.description.substring(0, 30)}</p>
                    <p>Price : {p.price}</p>
                  </div>
                  <div className="col-md-4 cart-remove-btn">
                    <button
                      className="btn btn-danger"
                      onClick={() => removeCartItem(p._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-5 cart-summary">
              <h2>Bookings Summary</h2>
              <p>Total | Checkout | Payment</p>
              <hr />
              <h4>Total : {totalPrice()} </h4>
              {auth?.user?.address ? (
                <>
                  <div className="mb-3">
                    <h4>Current Address</h4>
                    <h5>{auth?.user?.address}</h5>
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  </div>
                </>
              ) : (
                <div className="mb-3">
                  {auth?.token ? (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => navigate("/dashboard/user/profile")}
                    >
                      Update Address
                    </button>
                  ) : (
                    <button
                      className="btn btn-outline-warning"
                      onClick={() =>
                        navigate("/login", {
                          state: "/cart",
                        })
                      }
                    >
                      Please Login to checkout
                    </button>
                  )}
                </div>
              )}
              <div className="mt-2">
                {!auth?.token || !cart?.length ? (
                  ""
                ) : (
                  <PayPalScriptProvider
                    options={{
                      "client-id": process.env.REACT_APP_PAYPAL_CLIENT_ID,
                    }}
                  >
                    <PayPalButtons
                      createOrder={(data, actions) =>
                        createOrder(data, actions)
                      }
                      onApprove={(data, actions) => onApprove(data, actions)}
                      style={{ layout: "vertical" }}
                      disabled={loading || !auth?.user?.address}
                    />
                  </PayPalScriptProvider>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
