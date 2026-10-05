
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

import useSubCategories from "../../../features/subcategories/hooks/useSubCategories";
import useCategories from "../../../features/categories/hooks/useCategories";

import "./Subcategories.css";

function SubCategories() {
  const {
    fetchSubCategories,
    handleCreateSubCategory,
    handleUpdateSubCategory,
    handleDeleteSubCategory,
  } = useSubCategories();

  const { fetchCategories } = useCategories();

  const {
    subCategories,
    loading,
    error,
    pagination,
    createLoading,
    updateLoading,
    deleteLoading,
  } = useSelector((state) => state.subCategories);

  const { categories } = useSelector(
    (state) => state.categories
  );

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] =
    useState(false);

  const [selectedSubCategory, setSelectedSubCategory] =
    useState(null);

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  // =========================
  // Fetch Categories
  // =========================

  useEffect(() => {
    fetchCategories({
      limit: 100,
    });
  }, [fetchCategories]);

  // =========================
  // Fetch SubCategories
  // =========================

  useEffect(() => {
    const params = {
      page,
      limit,
    };

    if (search.trim()) {
      params.keyword = search.trim();
    }

    if (selectedCategory) {
      params.category = selectedCategory;
    }

    fetchSubCategories(params);
  }, [
    fetchSubCategories,
    page,
    limit,
    search,
    selectedCategory,
  ]);

  // =========================
  // Get Category ID
  // =========================

  const getCategoryId = (categoryValue) => {
    if (!categoryValue) {
      return "";
    }

    if (typeof categoryValue === "string") {
      return categoryValue;
    }

    if (typeof categoryValue === "object") {
      return (
        categoryValue._id ||
        categoryValue.id ||
        ""
      );
    }

    return "";
  };

  // =========================
  // Open Add Modal
  // =========================

  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedSubCategory(null);
    setName("");
    setCategory("");
    setShowModal(true);
  };

  // =========================
  // Open Edit Modal
  // =========================

  const openEditModal = (subCategory) => {
    setIsEditMode(true);
    setSelectedSubCategory(subCategory);

    setName(subCategory.name || "");

    const categoryId = getCategoryId(
      subCategory.category
    );

    setCategory(categoryId);

    setShowModal(true);
  };

  // =========================
  // Close Modal
  // =========================

  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedSubCategory(null);
    setName("");
    setCategory("");
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Name is required",
      });

      return;
    }

    if (!category) {
      Swal.fire({
        icon: "warning",
        title: "Category is required",
      });

      return;
    }

    const subCategoryData = {
  name: name.trim(),
  category: String(category),
};

console.log("========== SUBCATEGORY DEBUG ==========");
console.log("isEditMode:", isEditMode);
console.log("category state:", category);
console.log("category type:", typeof category);
console.log("subCategoryData:", subCategoryData);
console.log("subCategoryData.category:", subCategoryData.category);
console.log(
  "subCategoryData.category type:",
  typeof subCategoryData.category
);
console.log("=======================================");
    try {
      if (isEditMode) {
        await handleUpdateSubCategory(
          selectedSubCategory._id,
          subCategoryData
        );

        Swal.fire({
          icon: "success",
          title:
            "SubCategory updated successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      } else {
        await handleCreateSubCategory(
          subCategoryData
        );

        Swal.fire({
          icon: "success",
          title:
            "SubCategory created successfully",
          timer: 1500,
          showConfirmButton: false,
        });
      }

      closeModal();

      fetchSubCategories({
        page,
        limit,
        ...(search.trim()
          ? { keyword: search.trim() }
          : {}),
        ...(selectedCategory
          ? { category: selectedCategory }
          : {}),
      });
    } catch (error) {
      // Error is already handled by Redux.
    }
  };

  // =========================
  // Delete
  // =========================

  const handleDelete = async (
    subCategoryId
  ) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete SubCategory?",
      text: "This action cannot be undone.",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await handleDeleteSubCategory(
        subCategoryId
      );

      Swal.fire({
        icon: "success",
        title:
          "SubCategory deleted successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      fetchSubCategories({
        page,
        limit,
        ...(search.trim()
          ? { keyword: search.trim() }
          : {}),
        ...(selectedCategory
          ? { category: selectedCategory }
          : {}),
      });
    } catch (error) {
      // Error is already handled by Redux.
    }
  };

  // =========================
  // Get Category Name
  // =========================

  const getCategoryName = (subCategory) => {
    if (!subCategory.category) {
      return "-";
    }

    if (
      typeof subCategory.category ===
      "object"
    ) {
      return (
        subCategory.category.name || "-"
      );
    }

    const foundCategory =
      categories.find(
        (item) =>
          item._id ===
          subCategory.category
      );

    return foundCategory?.name || "-";
  };

  const totalPages =
    pagination?.numberOfPages || 1;

  return (
    <div className="admin-page">

      {/* ========================= */}
      {/* Header */}
      {/* ========================= */}

      <div className="admin-page-header">
        <div>
          <h2>subcategories</h2>

          <p>
            Manage your product subcategories
          </p>
        </div>

        <button
          type="button"
          className="admin-primary-button"
          onClick={openAddModal}
        >
          + Add SubCategory
        </button>
      </div>

      {/* ========================= */}
      {/* Error */}
      {/* ========================= */}

      {error && (
        <div className="admin-error-message">
          {error}
        </div>
      )}

      {/* ========================= */}
      {/* Toolbar */}
      {/* ========================= */}

      <div className="admin-subcategories-toolbar">

        <div className="admin-subcategories-search">
          <input
            type="text"
            placeholder="Search subcategories..."
            value={search}
            onChange={(event) => {
              setSearch(
                event.target.value
              );

              setPage(1);
            }}
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(event) => {
            setSelectedCategory(
              event.target.value
            );

            setPage(1);
          }}
          className="admin-subcategories-category-filter"
        >
          <option value="">
            All Categories
          </option>

          {categories.map((item) => (
            <option
              key={item._id}
              value={item._id}
            >
              {item.name}
            </option>
          ))}
        </select>

      </div>

      {/* ========================= */}
      {/* Content */}
      {/* ========================= */}

      {loading ? (
        <div className="admin-loading-message">
          Loading subcategories...
        </div>
      ) : subCategories.length === 0 ? (
        <div className="admin-empty-state">
          <h3>
            No SubCategories Found
          </h3>

          <p>
            There are no subcategories to
            display.
          </p>
        </div>
      ) : (
        <>
          {/* ========================= */}
          {/* Table */}
          {/* ========================= */}

          <div className="admin-subcategories-table-wrapper">

            <table className="admin-subcategories-table">

              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Slug</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {subCategories.map(
                  (
                    subCategory,
                    index
                  ) => (
                    <tr
                      key={
                        subCategory._id
                      }
                    >

                      <td>
                        {(page - 1) *
                          limit +
                          index +
                          1}
                      </td>

                      <td>
                        {
                          subCategory.name
                        }
                      </td>

                      <td>
                        {getCategoryName(
                          subCategory
                        )}
                      </td>

                      <td>
                        {
                          subCategory.slug ||
                          "-"
                        }
                      </td>

                      <td>
                        {
                          subCategory.createdAt
                            ? new Date(
                                subCategory.createdAt
                              ).toLocaleDateString()
                            : "-"
                        }
                      </td>

                      <td>

                        <div className="admin-subcategory-actions">

                          <button
                            type="button"
                            className="admin-edit-button"
                            onClick={() =>
                              openEditModal(
                                subCategory
                              )
                            }
                            disabled={
                              updateLoading
                            }
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="admin-delete-button"
                            onClick={() =>
                              handleDelete(
                                subCategory._id
                              )
                            }
                            disabled={
                              deleteLoading
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

          {/* ========================= */}
          {/* Pagination */}
          {/* ========================= */}

          <div className="admin-subcategories-pagination">

            <button
              type="button"
              disabled={page === 1}
              onClick={() =>
                setPage(
                  (current) =>
                    current - 1
                )
              }
            >
              Previous
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={
                page >= totalPages
              }
              onClick={() =>
                setPage(
                  (current) =>
                    current + 1
                )
              }
            >
              Next
            </button>

          </div>
        </>
      )}

      {/* ========================= */}
      {/* Modal */}
      {/* ========================= */}

      {showModal && (
        <div className="admin-modal-overlay">

          <div className="admin-modal">

            <div className="admin-modal-header">

              <h3>
                {isEditMode
                  ? "Edit SubCategory"
                  : "Add SubCategory"}
              </h3>

              <button
                type="button"
                className="admin-modal-close"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            <form
              className="admin-subcategory-form"
              onSubmit={handleSubmit}
            >

              <div className="admin-form-group">

                <label htmlFor="subcategory-name">
                  Name
                </label>

                <input
                  id="subcategory-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(
                      event.target.value
                    )
                  }
                  placeholder="Enter subcategory name"
                  disabled={
                    createLoading ||
                    updateLoading
                  }
                />

              </div>

              <div className="admin-form-group">

                <label htmlFor="subcategory-category">
                  Category
                </label>

                <select
                  id="subcategory-category"
                  value={category}
                  onChange={(event) =>
                    setCategory(
                      event.target.value
                    )
                  }
                  disabled={
                    createLoading ||
                    updateLoading
                  }
                >

                  <option value="">
                    Select Category
                  </option>

                  {categories.map(
                    (item) => (
                      <option
                        key={item._id}
                        value={item._id}
                      >
                        {item.name}
                      </option>
                    )
                  )}

                </select>

              </div>

              <div className="admin-modal-actions">

                <button
                  type="button"
                  className="admin-secondary-button"
                  onClick={closeModal}
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
                    : isEditMode
                      ? "Update"
                      : "Create"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default SubCategories;

