
import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";
import { useSelector } from "react-redux";

import useProducts from "../../../features/products/hooks/useProducts";
import useCategories from "../../../features/categories/hooks/useCategories";

import "./Products.css";

function Products() {
  const { fetchProducts } = useProducts();
  const { fetchCategories } = useCategories();

  const [searchParams, setSearchParams] =
    useSearchParams();

  const {
    products,
    loading,
    error,
    pagination,
  } = useSelector((state) => state.products);

  const { categories } = useSelector(
    (state) => state.categories
  );

  // =========================
  // Search
  // =========================

  const urlKeyword =
    searchParams.get("keyword") || "";

  const urlCategory =
    searchParams.get("category") || "";

  const [keyword, setKeyword] = useState(
    urlKeyword
  );

  const [searchKeyword, setSearchKeyword] =
    useState(urlKeyword);

  // =========================
  // Filters
  // =========================

  const [selectedCategory, setSelectedCategory] =
    useState(urlCategory);

  const [sort, setSort] = useState("");

  // Applied price filters
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Price inputs
  const [minPriceInput, setMinPriceInput] =
    useState("");

  const [maxPriceInput, setMaxPriceInput] =
    useState("");

  // =========================
  // Pagination
  // =========================

  const [page, setPage] = useState(1);

  const limit = 6;

  // =========================
  // Sync Search And Category
  // With URL
  // =========================

  useEffect(() => {
    const currentKeyword =
      searchParams.get("keyword") || "";

    const currentCategory =
      searchParams.get("category") || "";

    setKeyword(currentKeyword);
    setSearchKeyword(currentKeyword);

    setSelectedCategory(currentCategory);

    setPage(1);
  }, [searchParams]);

  // =========================
  // Fetch Categories
  // =========================

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // =========================
  // Fetch Products
  // =========================

  useEffect(() => {
    const params = {
      page,
      limit,
    };

    // Search
    if (searchKeyword.trim()) {
      params.keyword =
        searchKeyword.trim();
    }

    // Category
    if (selectedCategory) {
      params.category = selectedCategory;
    }

    // Sort
    if (sort) {
      params.sort = sort;
    }

    // Minimum Price
    if (minPrice !== "") {
      params["price[gte]"] = minPrice;
    }

    // Maximum Price
    if (maxPrice !== "") {
      params["price[lte]"] = maxPrice;
    }

    fetchProducts(params);
  }, [
    fetchProducts,
    page,
    searchKeyword,
    selectedCategory,
    sort,
    minPrice,
    maxPrice,
  ]);

  // =========================
  // Search
  // =========================

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmedKeyword =
      keyword.trim();

    setPage(1);

    const params = {};

    if (trimmedKeyword) {
      params.keyword = trimmedKeyword;
    }

    if (selectedCategory) {
      params.category = selectedCategory;
    }

    setSearchParams(params);
  };

  // =========================
  // Category Filter
  // =========================

  const handleCategoryChange = (e) => {
    const categoryId =
      e.target.value;

    setSelectedCategory(categoryId);

    setPage(1);

    const params = {};

    if (searchKeyword.trim()) {
      params.keyword =
        searchKeyword.trim();
    }

    if (categoryId) {
      params.category = categoryId;
    }

    setSearchParams(params);
  };

  // =========================
  // Sort
  // =========================

  const handleSortChange = (e) => {
    setSort(e.target.value);

    setPage(1);
  };

  // =========================
  // Price Filter
  // =========================

  const handlePriceFilter = (e) => {
    e.preventDefault();

    setMinPrice(minPriceInput);
    setMaxPrice(maxPriceInput);

    setPage(1);
  };

  // =========================
  // Clear Filters
  // =========================

  const handleClearFilters = () => {
    setKeyword("");
    setSearchKeyword("");

    setSelectedCategory("");

    setSort("");

    setMinPrice("");
    setMaxPrice("");

    setMinPriceInput("");
    setMaxPriceInput("");

    setPage(1);

    setSearchParams({});
  };

  // =========================
  // Render
  // =========================

  return (
    <main className="products-page">

      {/* =========================
          Page Header
      ========================= */}

      <section className="products-header">
        <div>
          <h1>All Products</h1>

          <p>
            Browse our collection and find the
            products you need.
          </p>
        </div>
      </section>

      {/* =========================
          Search
      ========================= */}

      <section className="products-search-section">
        <form
          className="products-search-form"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
          />

          <button type="submit">
            Search
          </button>
        </form>
      </section>

      {/* =========================
          Main Content
      ========================= */}

      <section className="products-content">

        {/* =========================
            Filters Sidebar
        ========================= */}

        <aside className="products-sidebar">

          <div className="filter-header">
            <h2>Filters</h2>

            <button
              type="button"
              onClick={handleClearFilters}
            >
              Clear
            </button>
          </div>

          {/* =========================
              Category
          ========================= */}

          <div className="filter-group">
            <h3>Category</h3>

            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">
                All Categories
              </option>

              {categories.map((category) => (
                <option
                  key={category._id}
                  value={category._id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* =========================
              Price
          ========================= */}

          <div className="filter-group">
            <h3>Price</h3>

            <form
              className="price-filter-form"
              onSubmit={handlePriceFilter}
            >
              <input
                type="number"
                name="minPrice"
                placeholder="Min price"
                min="0"
                value={minPriceInput}
                onChange={(e) =>
                  setMinPriceInput(
                    e.target.value
                  )
                }
              />

              <input
                type="number"
                name="maxPrice"
                placeholder="Max price"
                min="0"
                value={maxPriceInput}
                onChange={(e) =>
                  setMaxPriceInput(
                    e.target.value
                  )
                }
              />

              <button type="submit">
                Apply
              </button>
            </form>
          </div>

          {/* =========================
              Sort
          ========================= */}

          <div className="filter-group">
            <h3>Sort By</h3>

            <select
              value={sort}
              onChange={handleSortChange}
            >
              <option value="">
                Default
              </option>

              <option value="price">
                Price: Low to High
              </option>

              <option value="-price">
                Price: High to Low
              </option>

              <option value="title">
                Name: A to Z
              </option>

              <option value="-title">
                Name: Z to A
              </option>

              <option value="-createdAt">
                Newest
              </option>
            </select>
          </div>

        </aside>

        {/* =========================
            Products Area
        ========================= */}

        <div className="products-main">

          {/* Loading */}

          {loading && (
            <div className="products-message">
              Loading products...
            </div>
          )}

          {/* Error */}

          {error && (
            <div className="products-message products-error">
              {error}
            </div>
          )}

          {/* Products */}

          {!loading &&
            !error &&
            products.length > 0 && (
              <>
                <div className="products-top-bar">

                  <span>
                    {pagination?.totalPages
                      ? `Page ${pagination.currentPage} of ${pagination.totalPages}`
                      : `${products.length} products`}
                  </span>

                  <span>
                    {products.length} products
                  </span>

                </div>

                <div className="products-grid-page">

                  {products.map((product) => {

                    const hasDiscount =
                      product.priceAfterDiscount &&
                      product.priceAfterDiscount <
                        product.price;

                    return (
                      <article
                        key={product._id}
                        className="product-card-page"
                      >

                        {/* Product Image */}

                        <Link
                          to={`/products/${product._id}`}
                          className="product-card-page-image"
                        >
                          <img
                            src={
                              product.imageCover
                            }
                            alt={product.title}
                          />
                        </Link>

                        {/* Product Info */}

                        <div className="product-card-page-info">

                          <Link
                            to={`/products/${product._id}`}
                            className="product-card-page-title"
                          >
                            {product.title}
                          </Link>

                          {/* Rating */}

                          <div className="product-card-page-rating">

                            <span className="rating-stars">
                              ★
                            </span>

                            <span>
                              {product.ratingsAverage ||
                                0}
                            </span>

                            <span className="rating-count">
                              (
                              {product.ratingsQuantity ||
                                0}
                              )
                            </span>

                          </div>

                          {/* Price */}

                          <div className="product-card-page-price">

                            {hasDiscount ? (
                              <>
                                <span className="current-price">
                                  $
                                  {
                                    product.priceAfterDiscount
                                  }
                                </span>

                                <span className="old-price">
                                  ${product.price}
                                </span>
                              </>
                            ) : (
                              <span className="current-price">
                                ${product.price}
                              </span>
                            )}

                          </div>

                          {/* Button */}

                          <Link
                            to={`/products/${product._id}`}
                            className="product-card-page-button"
                          >
                            View Product
                          </Link>

                        </div>

                      </article>
                    );
                  })}

                </div>

                {/* =========================
                    Pagination
                ========================= */}

                {pagination &&
                  pagination.totalPages > 1 && (
                    <div className="products-pagination">

                      <button
                        type="button"
                        disabled={
                          !pagination.prevPage
                        }
                        onClick={() =>
                          setPage(
                            pagination.prevPage
                          )
                        }
                      >
                        Previous
                      </button>

                      {/* Page 1 */}

                      <button
                        type="button"
                        className={
                          pagination.currentPage ===
                          1
                            ? "active"
                            : ""
                        }
                        onClick={() =>
                          setPage(1)
                        }
                      >
                        1
                      </button>

                      {/* Dots after first page */}

                      {pagination.currentPage >
                        3 && (
                        <span className="products-pagination-dots">
                          ...
                        </span>
                      )}

                      {/* Pages around current page */}

                      {Array.from(
                        {
                          length:
                            pagination.totalPages,
                        },
                        (_, index) =>
                          index + 1
                      )
                        .filter(
                          (pageNumber) =>
                            pageNumber !== 1 &&
                            pageNumber !==
                              pagination.totalPages &&
                            Math.abs(
                              pageNumber -
                                pagination.currentPage
                            ) <= 1
                        )
                        .map((pageNumber) => (
                          <button
                            key={pageNumber}
                            type="button"
                            className={
                              pageNumber ===
                              pagination.currentPage
                                ? "active"
                                : ""
                            }
                            onClick={() =>
                              setPage(
                                pageNumber
                              )
                            }
                          >
                            {pageNumber}
                          </button>
                        ))}

                      {/* Dots before last page */}

                      {pagination.currentPage <
                        pagination.totalPages -
                          2 && (
                        <span className="products-pagination-dots">
                          ...
                        </span>
                      )}

                      {/* Last page */}

                      {pagination.totalPages >
                        1 && (
                        <button
                          type="button"
                          className={
                            pagination.currentPage ===
                            pagination.totalPages
                              ? "active"
                              : ""
                          }
                          onClick={() =>
                            setPage(
                              pagination.totalPages
                            )
                          }
                        >
                          {
                            pagination.totalPages
                          }
                        </button>
                      )}

                      <button
                        type="button"
                        disabled={
                          !pagination.nextPage
                        }
                        onClick={() =>
                          setPage(
                            pagination.nextPage
                          )
                        }
                      >
                        Next
                      </button>

                    </div>
                  )}
              </>
            )}

          {/* No Products */}

          {!loading &&
            !error &&
            products.length === 0 && (
              <div className="products-message">
                No products found.
              </div>
            )}

        </div>
      </section>
    </main>
  );
}

export default Products;

