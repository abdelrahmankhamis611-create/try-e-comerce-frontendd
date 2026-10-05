
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

import useProducts from "../../../features/products/hooks/useProducts";

import "./Products.css";

function Products() {
  const navigate = useNavigate();

  const {
    fetchProducts,
    handleDeleteProduct,
  } = useProducts();

  const {
    products,
    loading,
    error,
    pagination,
    deleteLoading,
  } = useSelector(
    (state) => state.products
  );

  const [keyword, setKeyword] = useState("");

  const [page, setPage] = useState(1);

  const limit = 10;

  // =========================
  // Fetch Products
  // =========================

  useEffect(() => {
    const params = {
      page,
      limit,
    };

    if (keyword.trim()) {
      params.keyword = keyword.trim();
    }

    fetchProducts(params);
  }, [
    fetchProducts,
    page,
    keyword,
  ]);

  // =========================
  // Search
  // =========================

  const handleSearchChange = (e) => {
    const value = e.target.value;

    setKeyword(value);

    // Start from first page
    // whenever the search changes
    setPage(1);
  };

  // =========================
  // Add Product
  // =========================

  const handleAddProduct = () => {
    navigate("/admin/products/add");
  };

  // =========================
  // Edit Product
  // =========================

  const handleEditProduct = (
    product
  ) => {
    navigate(
      `/admin/products/edit/${product._id}`
    );
  };

  // =========================
  // Delete Product
  // =========================

  const handleDelete = async (
    product
  ) => {
    const result =
      await Swal.fire({
        title: "Delete Product?",
        text: `Are you sure you want to delete "${product.title}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText:
          "Yes, delete it",
        cancelButtonText:
          "Cancel",
        reverseButtons: true,
      });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await handleDeleteProduct(
        product._id
      );

      await Swal.fire({
        title: "Deleted!",
        text: "Product has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to delete product";

      await Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // =========================
  // Render
  // =========================

  return (
    <div className="admin-page">

      {/* =========================
          Header
      ========================= */}

      <div className="admin-page-header">

        <div>
          <h2>Products</h2>

          <p>
            Manage your store products.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={handleAddProduct}
        >
          Add Product
        </button>

      </div>

      {/* =========================
          Search
      ========================= */}

      <div className="admin-products-toolbar">

        <div className="admin-products-search">

          <input
            type="text"
            placeholder="Search products..."
            value={keyword}
            onChange={handleSearchChange}
          />

        </div>

      </div>

      {/* =========================
          Error
      ========================= */}

      {error && (
        <div className="admin-error-message">
          {error}
        </div>
      )}

      {/* =========================
          Loading
      ========================= */}

      {loading && (
        <div className="admin-loading-message">
          Loading products...
        </div>
      )}

      {/* =========================
          Products Table
      ========================= */}

      {!loading &&
        !error &&
        products.length > 0 && (
          <div className="admin-products-table-container">

            {/* =========================
                Mobile Scroll Hint
            ========================= */}

            <div className="admin-products-scroll-hint">

              <span className="admin-products-scroll-icon">
                ↔
              </span>

              <span>
                Swipe to see more
              </span>

            </div>

            {/* =========================
                Table
            ========================= */}

            <div className="admin-products-table-wrapper">

              <table className="admin-products-table">

                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Sold</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {products.map(
                    (product) => {

                      const hasDiscount =
                        product.priceAfterDiscount &&
                        product.priceAfterDiscount <
                          product.price;

                      return (
                        <tr
                          key={
                            product._id
                          }
                        >

                          {/* Image */}

                          <td>
                            <img
                              src={
                                product.imageCover
                              }
                              alt={
                                product.title
                              }
                              className="admin-product-image"
                            />
                          </td>

                          {/* Product */}

                          <td>
                            <div className="admin-product-name">
                              {product.title}
                            </div>
                          </td>

                          {/* Category */}

                          <td>
                            {product.category
                              ?.name ||
                              "N/A"}
                          </td>

                          {/* Price */}

                          <td>

                            {hasDiscount ? (
                              <div className="admin-product-price">

                                <span className="admin-current-price">
                                  $
                                  {
                                    product.priceAfterDiscount
                                  }
                                </span>

                                <span className="admin-old-price">
                                  $
                                  {
                                    product.price
                                  }
                                </span>

                              </div>
                            ) : (
                              <span className="admin-current-price">
                                $
                                {
                                  product.price
                                }
                              </span>
                            )}

                          </td>

                          {/* Quantity */}

                          <td>
                            {
                              product.quantity
                            }
                          </td>

                          {/* Sold */}

                          <td>
                            {
                              product.sold
                            }
                          </td>

                          {/* Rating */}

                          <td>
                            <span className="admin-product-rating">
                              ★{" "}
                              {
                                product.ratingsAverage ||
                                0
                              }
                            </span>

                            <span className="admin-product-rating-count">
                              (
                              {
                                product.ratingsQuantity ||
                                0
                              }
                              )
                            </span>
                          </td>

                          {/* Actions */}

                          <td>
                            <div className="admin-product-actions">

                              <button
                                type="button"
                                className="admin-edit-button"
                                onClick={() =>
                                  handleEditProduct(
                                    product
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                className="admin-delete-button"
                                disabled={
                                  deleteLoading
                                }
                                onClick={() =>
                                  handleDelete(
                                    product
                                  )
                                }
                              >
                                Delete
                              </button>

                            </div>
                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          </div>
        )}

      {/* =========================
          Empty State
      ========================= */}

      {!loading &&
        !error &&
        products.length === 0 && (
          <div className="admin-empty-state">

            <h3>
              No Products Found
            </h3>

            <p>
              There are no products matching
              your search.
            </p>

          </div>
        )}

      {/* =========================
          Pagination
      ========================= */}

      {!loading &&
        !error &&
        pagination &&
        pagination.totalPages > 1 && (
          <div className="admin-products-pagination">

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

            <span>
              Page{" "}
              {pagination.currentPage}{" "}
              of{" "}
              {pagination.totalPages}
            </span>

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

    </div>
  );
}

export default Products;

