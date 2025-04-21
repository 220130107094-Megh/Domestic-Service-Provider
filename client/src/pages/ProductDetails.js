import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ProductDetailsStyles.css";

const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);

  //initalp details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);
  //getProduct
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };
  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  // const rawDescription = product.description;

  // // Extract parts using regex or simple split
  // const addressMatch = rawDescription.match(
  //   /Address\s*:\s*(.*?)(Email|Contact|$)/i
  // );
  // const emailMatch = rawDescription.match(/Email\s*:\s*(.*?)(Contact|$)/i);
  // const contactMatch = rawDescription.match(/Contact\s*No?\s*\.?\s*:\s*(.*)/i);

  // // Optional: Remove extra parts for main description
  // const mainDescription = rawDescription.split("Address")[0].trim();

  return (
    <Layout>
      <div className="row container product-details">
        <div className="col-md-6">
          <img
            src={`/api/v1/product/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            height="300"
            width={"350px"}
          />
        </div>
        <div className="col-md-6 product-details-info">
          <h1 className="text-center">Service Details</h1>
          <hr />
          <h6>Name : {product.name}</h6>
          {/* <h6>Description : {product.description}</h6> */}
          <h6>
            {product?.description && (
              <div>
                <p>
                  <strong>Description:</strong>{" "}
                  {product.description.split("Address")[0].trim()}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {(
                    product.description.match(
                      /Address\s*:\s*(.*?)(?=\s*Email|Contact|$)/i
                    )?.[1] || ""
                  ).trim()}
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  {(
                    product.description.match(
                      /Email\s*:\s*([\w.-]+@[\w.-]+\.\w+)/i
                    )?.[1] || ""
                  ).trim()}
                </p>
                <p>
                  <strong>Contact No.:</strong>{" "}
                  {(
                    product.description.match(
                      /Contact\s*No?\s*\.?\s*:\s*(\d{10})/i
                    )?.[1] || ""
                  ).trim()}
                </p>
              </div>
            )}
          </h6>
          <h6>
            Price :
            {product?.price?.toLocaleString("en-US", {
              style: "currency",
              currency: "INR",
            })}
          </h6>
          <h6>Category : {product?.category?.name}</h6>
          {/* <button className="btn btn-secondary ms-1">BOOK SERVICE</button> */}
          <button
                    className="btn btn-dark ms-1"
                    onClick={() => {
                      setCart([...cart, p]);
                      localStorage.setItem(
                        "cart",
                        JSON.stringify([...cart, p])
                      );
                      toast.success("Your Service is Booked");
                    }}
                  >
                    BOOK SERVICE
                  </button>
        </div>
      </div>
      <hr />
      <div className="row container similar-products">
        <h4>Similar Services ➡️</h4>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Services found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2" key={p._id}>
              <img
                src={`/api/v1/product/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <div className="card-name-price">
                  <h5 className="card-title">{p.name}</h5>
                  <h5 className="card-title card-price">
                    {p.price.toLocaleString("en-US", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </h5>
                </div>
                <p className="card-text ">
                  {p.description.substring(0, 60)}...
                </p>
                <div className="card-name-price">
                  <button
                    className="btn btn-info ms-1"
                    onClick={() => navigate(`/product/${p.slug}`)}
                  >
                    More Details
                  </button>
                  {/* // eslint-disable-next-line */}
                  <button
                    className="btn btn-dark ms-1"
                    onClick={() => {
                      setCart([...cart, p]);
                      localStorage.setItem(
                        "cart",
                        JSON.stringify([...cart, p])
                      );
                      toast.success("Your Service is Booked");
                    }}
                  >
                    BOOK SERVICE
                  </button>
                  
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
