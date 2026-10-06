import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

import useCategories from "../../../features/categories/hooks/useCategories";

import "./Categories.css";

function Categories() {
  const {
    fetchCategories,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
  } = useCategories();

  const {
    categories,
    loading,
    error,
    pagination,
    createLoading,
    updateLoading,
    deleteLoading,
  } = useSelector(
    (state) => state.categories
  );

  const [keyword, setKeyword] =
    useState("");

  const [searchKeyword, setSearchKeyword] =
    useState("");

  const [page, setPage] = useState(1);

  const [showForm, setShowForm] =
    useState(false);

  const [editingCategory, setEditingCategory] =
    useState(null);

  const [formData, setFormData] =
    useState({
      name: "",
      image: null,
    });

  const limit = 5;

  // =========================
  // Fetch Categories
  // =========================
  useEffect(() => {
    const params = {
      page,
      limit,
    };

    if (searchKeyword.trim()) {
      params.keyword =
        searchKeyword.trim();
    }

    fetchCategories(params);
  }, [
    fetchCategories,
    page,
    searchKeyword,
  ]);

  // =========================
  // Search
  // =========================
  const handleSearch = (e) => {
    e.preventDefault();

    setPage(1);

    setSearchKeyword(
      keyword.trim()
    );
  };

  // =========================
  // Clear Search
  // =========================
  const handleClearSearch = () => {
    setKeyword("");
    setSearchKeyword("");
    setPage(1);
  };

  // =========================
  // Open Add Form
  // =========================
  const handleAddCategory = () => {
    setEditingCategory(null);

    setFormData({
      name: "",
      image: null,
    });

    setShowForm(true);
  };

  // =========================
  // Open Edit Form
  // =========================
  const handleEditCategory = (
    category
  ) => {
    setEditingCategory(category);

    setFormData({
      name: category.name || "",
      image: null,
    });

    setShowForm(true);
  };

  // =========================
  // Close Form
  // =========================
  const handleCloseForm = () => {
    if (
      createLoading ||
      updateLoading
    ) {
      return;
    }

    setShowForm(false);
    setEditingCategory(null);

    setFormData({
      name: "",
      image: null,
    });
  };

  // =========================
  // Input Change
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Image Change
  // =========================
  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image:
        e.target.files[0] || null,
    }));
  };

  // =========================
  // Submit
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append(
      "name",
      formData.name
    );

    if (formData.image) {
      data.append(
        "image",
        formData.image
      );
    }

    try {
      if (editingCategory) {
        await handleUpdateCategory(
          editingCategory._id,
          data
        );
      } else {
        await handleCreateCategory(
          data
        );
      }

      handleCloseForm();

      await Swal.fire({
        title: editingCategory
          ? "Updated!"
          : "Created!",
        text: editingCategory
          ? "Category has been updated successfully."
          : "Category has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong.";

      await Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  // =========================
  // Delete Category
  // =========================
  const handleDelete = async (
    category
  ) => {
    const result =
      await Swal.fire({
        title: "Delete Category?",
        text: `Are you sure you want to delete "${category.name}"?`,
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
      await handleDeleteCategory(
        category._id
      );

      await Swal.fire({
        title: "Deleted!",
        text:
          "Category has been deleted successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Failed to delete category";

      await Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="admin-page">
      {/* =========================
          Header
      ========================= */}
      <div className="admin-page-header">
        <div>
          <h2>Categories</h2>

          <p>
            Manage your store categories.
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={
            handleAddCategory
          }
        >
          Add Category
        </button>
      </div>

      {/* =========================
          Search
      ========================= */}
      <div className="admin-categories-toolbar">
        <form
          className="admin-categories-search"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search categories..."
            value={keyword}
            onChange={(e) =>
              setKeyword(
                e.target.value
              )
            }
          />

          <button type="submit">
            Search
          </button>
        </form>

        {searchKeyword && (
          <button
            type="button"
            className="admin-secondary-button"
            onClick={
              handleClearSearch
            }
          >
            Clear
          </button>
        )}
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
          Loading categories...
        </div>
      )}

      {/* =========================
          Table
      ========================= */}
      {!loading &&
        !error &&
        categories.length > 0 && (
          <div className="admin-categories-table-wrapper">
            <table className="admin-categories-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map(
                  (category) => (
                    <tr
                      key={
                        category._id
                      }
                    >
                      <td>
                        {category.image ? (
                          <img
                            src={
                              category.image
                            }
                            alt={
                              category.name
                            }
                            className="admin-category-image"
                          />
                        ) : (
                          <div className="admin-category-no-image">
                            No Image
                          </div>
                        )}
                      </td>

                      <td>
                        <strong>
                          {
                            category.name
                          }
                        </strong>
                      </td>

                      <td>
                        {
                          category.slug ||
                          "-"
                        }
                      </td>

                      <td>
                        {category.createdAt
                          ? new Date(
                              category.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        <div className="admin-category-actions">
                          <button
                            type="button"
                            className="admin-edit-button"
                            onClick={() =>
                              handleEditCategory(
                                category
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
                                category
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}

      {/* =========================
          Empty
      ========================= */}
      {!loading &&
        !error &&
        categories.length === 0 && (
          <div className="admin-empty-state">
            <h3>
              No Categories Found
            </h3>

            <p>
              There are no categories
              matching your search.
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
          <div className="admin-categories-pagination">
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

      {/* =========================
          Add / Edit Modal
      ========================= */}
      {showForm && (
        <div
          className="admin-modal-overlay"
          onClick={handleCloseForm}
        >
          <div
            className="admin-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="admin-modal-header">
              <h3>
                {editingCategory
                  ? "Edit Category"
                  : "Add Category"}
              </h3>

              <button
                type="button"
                className="admin-modal-close"
                onClick={
                  handleCloseForm
                }
                disabled={
                  createLoading ||
                  updateLoading
                }
              >
                ×
              </button>
            </div>

            <form
              className="admin-category-form"
              onSubmit={
                handleSubmit
              }
            >
              <div className="admin-form-group">
                <label htmlFor="category-name">
                  Category Name
                </label>

                <input
                  id="category-name"
                  name="name"
                  type="text"
                  value={
                    formData.name
                  }
                  onChange={
                    handleChange
                  }
                  required
                  minLength={3}
                  maxLength={50}
                  placeholder="Enter category name"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="category-image">
                  Category Image
                </label>

                <input
                  id="category-image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={
                    handleImageChange
                  }
                />

                {editingCategory &&
                  editingCategory.image && (
                    <div className="admin-current-image">
                      <p>
                        Current Image:
                      </p>

                      <img
                        src={
                          editingCategory.image
                        }
                        alt={
                          editingCategory.name
                        }
                      />
                    </div>
                  )}
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={
                    handleCloseForm
                  }
                  disabled={
                    createLoading ||
                    updateLoading
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-primary-button"
                  disabled={
                    createLoading ||
                    updateLoading
                  }
                >
                  {createLoading ||
                  updateLoading
                    ? "Saving..."
                    : editingCategory
                    ? "Update Category"
                    : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;