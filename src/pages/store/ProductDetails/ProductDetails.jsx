import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import useProduct from "../../../features/products/hooks/useProduct";
import useCart from "../../../features/cart/hooks/useCart";
import useWishlist from "../../../features/wishlist/hooks/useWishlist";

import "./ProductDetails.css";

function ProductDetails() {
  const { productId } = useParams();

  const { fetchProduct } = useProduct();
  const { addToCart } = useCart();

  const {
    addToWishlist,
    removeFromWishlist,
  } = useWishlist();

  const {
    product,
    loading,
    error,
  } = useSelector((state) => state.products);

  const {
    cart,
    loading: cartLoading,
    error: cartError,
  } = useSelector((state) => state.cart);

  const {
    wishlist,
    loading: wishlistLoading,
    error: wishlistError,
  } = useSelector((state) => state.wishlist);

  const [selectedImage, setSelectedImage] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  useEffect(() => {
    if (product?.imageCover) {
      setSelectedImage(product.imageCover);
    }

    setSelectedColor("");
    setQuantity(1);
    setSuccessMessage("");
  }, [product]);

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const increaseQuantity = () => {
    setQuantity((prev) =>
      Math.min(product.quantity, prev + 1)
    );
  };

  const handleAddToCart = async () => {
    try {
      setSuccessMessage("");

      if (
        product.colors &&
        product.colors.length > 0 &&
        !selectedColor
      ) {
        setSuccessMessage(
          "Please select a color first."
        );

        return;
      }

     await addToCart(
  product._id,
  selectedColor,
  quantity
);

      setSuccessMessage(
        `${quantity} ${
          quantity === 1 ? "item" : "items"
        } added to cart successfully.`
      );
    } catch (error) {
      console.log(
        "Add To Cart Error:",
        error
      );
    }
  };

  const isInWishlist = wishlist.some((item) => {
    const wishlistProductId =
      typeof item === "string"
        ? item
        : item?._id;

    return (
      String(wishlistProductId) ===
      String(product?._id)
    );
  });

  const handleWishlist = async () => {
    if (!product?._id) {
      return;
    }

    try {
      if (isInWishlist) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product._id);
      }
    } catch (error) {
      console.log(
        "Wishlist Error:",
        error
      );
    }
  };

  if (loading) {
    return (
      <main className="product-details-page">
        <div className="product-details-message">
          Loading product...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="product-details-page">
        <div className="product-details-message product-details-error">
          {error}
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="product-details-page">
        <div className="product-details-message">
          Product not found.
        </div>
      </main>
    );
  }

  const images = [
    product.imageCover,
    ...(product.image || []),
  ].filter(Boolean);

  const hasDiscount =
    product.priceAfterDiscount &&
    product.priceAfterDiscount < product.price;

  return (
    <main className="product-details-page">
      <div className="product-details-container">
        <div className="product-breadcrumb">
          <Link to="/">Home</Link>

          <span>/</span>

          <Link to="/products">
            Products
          </Link>

          <span>/</span>

          <span>{product.title}</span>
        </div>

        <div className="product-details">
          <section className="product-gallery">
            <div className="product-thumbnails">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={
                    selectedImage === image
                      ? "product-thumbnail active"
                      : "product-thumbnail"
                  }
                  onClick={() =>
                    setSelectedImage(image)
                  }
                >
                  <img
                    src={image}
                    alt={`${product.title} ${
                      index + 1
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="product-main-image">
              <img
                src={selectedImage || null}
                alt={product.title}
              />
            </div>
          </section>

          <section className="product-information">
            <div className="product-category">
              {product.category?.name ||
                "Product"}
            </div>

            <h1>{product.title}</h1>

            <div className="product-rating-details">
              <span className="rating-stars">
                ★
              </span>

              <strong>
                {product.ratingsAverage || 0}
              </strong>

              <span>
                ({product.ratingsQuantity || 0}{" "}
                reviews)
              </span>
            </div>

            <div className="product-price-details">
              {hasDiscount ? (
                <>
                  <span className="product-current-price">
                    ${product.priceAfterDiscount}
                  </span>

                  <span className="product-original-price">
                    ${product.price}
                  </span>

                  <span className="product-discount">
                    {Math.round(
                      ((product.price -
                        product.priceAfterDiscount) /
                        product.price) *
                        100
                    )}
                    % OFF
                  </span>
                </>
              ) : (
                <span className="product-current-price">
                  ${product.price}
                </span>
              )}
            </div>

            <div className="product-description">
              <h2>Description</h2>

              <p>
                {product.description}
              </p>
            </div>

            {product.colors &&
              product.colors.length > 0 && (
                <div className="product-colors">
                  <h2>
                    Available Colors
                  </h2>

                  <div className="colors-list">
                    {product.colors.map(
                      (color, index) => (
                        <span
                          key={`${color}-${index}`}
                          className={
                            selectedColor === color
                              ? "color-option selected"
                              : "color-option"
                          }
                          onClick={() =>
                            setSelectedColor(color)
                          }
                        >
                          {color}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

            <div className="product-stock">
              {product.quantity > 0 ? (
                <span className="in-stock">
                  In Stock
                </span>
              ) : (
                <span className="out-of-stock">
                  Out of Stock
                </span>
              )}

              {product.quantity > 0 && (
                <span>
                  {product.quantity} items
                  available
                </span>
              )}
            </div>

            {successMessage && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  backgroundColor:
                    successMessage.includes(
                      "Please"
                    )
                      ? "#fff7ed"
                      : "#ecfdf5",
                  color:
                    successMessage.includes(
                      "Please"
                    )
                      ? "#c2410c"
                      : "#047857",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {successMessage}
              </div>
            )}

            {cartError && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  backgroundColor:
                    "#fef2f2",
                  color: "#dc2626",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {cartError}
              </div>
            )}

            {wishlistError && (
              <div
                style={{
                  marginTop: "15px",
                  padding: "10px 12px",
                  borderRadius: "6px",
                  backgroundColor:
                    "#fef2f2",
                  color: "#dc2626",
                  fontSize: "14px",
                  fontWeight: "600",
                }}
              >
                {wishlistError}
              </div>
            )}

            {product.quantity > 0 && (
              <div className="product-purchase">
                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      quantity <= 1 ||
                      cartLoading
                    }
                  >
                    −
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                    disabled={
                      quantity >=
                        product.quantity ||
                      cartLoading
                    }
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  className="add-to-cart-button"
                  onClick={
                    handleAddToCart
                  }
                  disabled={cartLoading}
                >
                  {cartLoading
                    ? "Adding..."
                    : "Add to Cart"}
                </button>

                <button
                  type="button"
                  className="wishlist-button"
                  onClick={
                    handleWishlist
                  }
                  disabled={
                    wishlistLoading
                  }
                  aria-label={
                    isInWishlist
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  {isInWishlist
                    ? "♥"
                    : "♡"}
                </button>
              </div>
            )}

            {product.quantity <= 0 && (
              <div className="product-purchase">
                <button
                  type="button"
                  className="wishlist-button"
                  onClick={
                    handleWishlist
                  }
                  disabled={
                    wishlistLoading
                  }
                  aria-label={
                    isInWishlist
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  {isInWishlist
                    ? "♥"
                    : "♡"}
                </button>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default ProductDetails;