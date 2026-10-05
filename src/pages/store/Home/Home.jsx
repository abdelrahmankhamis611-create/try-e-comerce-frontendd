
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import useCategories from "../../../features/categories/hooks/useCategories";
import { getProducts } from "../../../features/products/api/productApi";

import "./Home.css";

function Home() {
  const { fetchCategories } = useCategories();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state) => state.categories);

  const [featuredProducts, setFeaturedProducts] =
    useState([]);

  const [productsLoading, setProductsLoading] =
    useState(false);

  const [productsError, setProductsError] =
    useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);

        const data = await getProducts({
          limit: 8,
        });

        setFeaturedProducts(data.data || []);
      } catch (error) {
        console.log(
          "Fetch Featured Products Error:",
          error
        );

        const message =
          error.response?.data?.message ||
          "Failed to fetch products";

        setProductsError(message);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <main className="home">

      {/* =========================
          Categories Section
      ========================= */}

      <section className="home-categories">
        <div className="home-section-header">
          <h2>Shop by Category</h2>

          <p>
            Explore our categories and find what you are
            looking for.
          </p>
        </div>

        {categoriesLoading && (
          <div className="home-loading">
            Loading categories...
          </div>
        )}

        {categoriesError && (
          <div className="home-error">
            {categoriesError}
          </div>
        )}

        {!categoriesLoading &&
          !categoriesError &&
          categories.length > 0 && (
            <div className="categories-grid">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category._id}`}
                  className="category-card"
                >
                  <div className="category-image-wrapper">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="category-image"
                    />
                  </div>

                  <div className="category-info">
                    <h3>{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          )}
      </section>

      {/* =========================
          Products Section
      ========================= */}

      <section className="home-products">
        <div className="home-section-header">
          <h2>Featured Products</h2>

          <p>
            Discover some of our latest and most popular
            products.
          </p>
        </div>

        {productsLoading && (
          <div className="home-loading">
            Loading products...
          </div>
        )}

        {productsError && (
          <div className="home-error">
            {productsError}
          </div>
        )}

        {!productsLoading &&
          !productsError &&
          featuredProducts.length > 0 && (
            <>
              <div className="products-grid">
                {featuredProducts.map((product) => {
                  const hasDiscount =
                    product.priceAfterDiscount &&
                    product.priceAfterDiscount <
                      product.price;

                  return (
                    <article
                      key={product._id}
                      className="product-card"
                    >
                      {/* Product Image */}

                      <Link
                        to={`/products/${product._id}`}
                        className="product-image-wrapper"
                      >
                        <img
                          src={product.imageCover}
                          alt={product.title}
                          className="product-image"
                        />
                      </Link>

                      {/* Product Info */}

                      <div className="product-info">
                        <Link
                          to={`/products/${product._id}`}
                          className="product-title"
                        >
                          {product.title}
                        </Link>

                        {/* Rating */}

                        <div className="product-rating">
                          <span className="rating-stars">
                            ★
                          </span>

                          <span className="rating-value">
                            {product.ratingsAverage || 0}
                          </span>

                          <span className="rating-count">
                            (
                            {product.ratingsQuantity || 0}
                            )
                          </span>
                        </div>

                        {/* Price */}

                        <div className="product-price-wrapper">
                          {hasDiscount ? (
                            <>
                              <span className="product-price">
                                $
                                {
                                  product.priceAfterDiscount
                                }
                              </span>

                              <span className="product-old-price">
                                ${product.price}
                              </span>
                            </>
                          ) : (
                            <span className="product-price">
                              ${product.price}
                            </span>
                          )}
                        </div>

                        {/* View Product */}

                        <Link
                          to={`/products/${product._id}`}
                          className="product-button"
                        >
                          View Product
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* View All Products */}

              <div className="view-all-products">
                <Link
                  to="/products"
                  className="view-all-button"
                >
                  View All Products
                </Link>
              </div>
            </>
          )}

        {!productsLoading &&
          !productsError &&
          featuredProducts.length === 0 && (
            <div className="home-empty">
              No products found.
            </div>
          )}
      </section>
    </main>
  );
}

export default Home;

