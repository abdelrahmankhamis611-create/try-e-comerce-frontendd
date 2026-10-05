import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import useWishlist from "../../../features/wishlist/hooks/useWishlist";

import "./Wishlist.css";

function Wishlist() {
  const {
    fetchWishlist,
    removeFromWishlist,
  } = useWishlist();

  const {
    wishlist,
    loading,
    error,
  } = useSelector((state) => state.wishlist);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
    } catch (error) {
      console.log(
        "Remove Wishlist Error:",
        error
      );
    }
  };

  if (loading && wishlist.length === 0) {
    return (
      <main className="wishlist-page">
        <div className="wishlist-message">
          Loading wishlist...
        </div>
      </main>
    );
  }

  if (error && wishlist.length === 0) {
    return (
      <main className="wishlist-page">
        <div className="wishlist-message wishlist-error">
          {error}
        </div>
      </main>
    );
  }

  if (wishlist.length === 0) {
    return (
      <main className="wishlist-page">
        <div className="wishlist-container">
          <div className="wishlist-empty">
            <div className="wishlist-empty-icon">
              ♡
            </div>

            <h1>
              Your Wishlist is Empty
            </h1>

            <p>
              You haven't added any products
              to your wishlist yet.
            </p>

            <Link
              to="/products"
              className="wishlist-shopping-button"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="wishlist-page">
      <div className="wishlist-container">
        <div className="wishlist-header">
          <div>
            <h1>My Wishlist</h1>

            <p>
              {wishlist.length}{" "}
              {wishlist.length === 1
                ? "product"
                : "products"}{" "}
              in your wishlist
            </p>
          </div>
        </div>

        {error && (
          <div className="wishlist-error-box">
            {error}
          </div>
        )}

        <div className="wishlist-grid">
          {wishlist.map((product) => (
            <article
              key={product._id}
              className="wishlist-card"
            >
              <Link
                to={`/products/${product._id}`}
                className="wishlist-card-image"
              >
                <img
                  src={product.imageCover}
                  alt={product.title}
                />
              </Link>

              <div className="wishlist-card-content">
                <Link
                  to={`/products/${product._id}`}
                  className="wishlist-card-title"
                >
                  {product.title}
                </Link>

                <div className="wishlist-card-price">
                  {product.priceAfterDiscount &&
                  product.priceAfterDiscount <
                    product.price ? (
                    <>
                      <span className="wishlist-current-price">
                        $
                        {
                          product.priceAfterDiscount
                        }
                      </span>

                      <span className="wishlist-old-price">
                        ${product.price}
                      </span>
                    </>
                  ) : (
                    <span className="wishlist-current-price">
                      ${product.price}
                    </span>
                  )}
                </div>

                <div className="wishlist-card-actions">
                  <Link
                    to={`/products/${product._id}`}
                    className="wishlist-view-button"
                  >
                    View Product
                  </Link>

                  <button
                    type="button"
                    className="wishlist-remove-button"
                    onClick={() =>
                      handleRemove(
                        product._id
                      )
                    }
                    disabled={loading}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Wishlist;