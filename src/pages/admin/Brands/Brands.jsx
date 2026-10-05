import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

import useBrands from "../../../features/brands/hooks/useBrands";

import "./Brands.css";

function Brands() {
  const {
    fetchBrands,
    handleCreateBrand,
    handleUpdateBrand,
    handleDeleteBrand,
  } = useBrands();

  const {
    brands,
    loading,
    error,
  } = useSelector((state) => state.brands);

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const resetForm = () => {
    setName("");
    setImage(null);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    const formData = new FormData();

    formData.append("name", name.trim());

    if (image) {
      formData.append("image", image);
    }

    try {
      if (editingId) {
        await handleUpdateBrand(
          editingId,
          formData
        );

        await Swal.fire({
          icon: "success",
          title: "Brand Updated",
          text: "Brand has been updated successfully.",
        });
      } else {
        await handleCreateBrand(formData);

        await Swal.fire({
          icon: "success",
          title: "Brand Created",
          text: "Brand has been created successfully.",
        });
      }

      resetForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text:
          error.response?.data?.message ||
          "Something went wrong.",
      });
    }
  };

  const handleEdit = (brand) => {
    setEditingId(brand._id);
    setName(brand.name);
    setImage(null);
  };

  const handleDelete = async (brandId) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete Brand?",
      text: "This brand will be deleted permanently.",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      await handleDeleteBrand(brandId);

      await Swal.fire({
        icon: "success",
        title: "Deleted",
        text: "Brand has been deleted successfully.",
      });

      if (editingId === brandId) {
        resetForm();
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text:
          error.response?.data?.message ||
          "Failed to delete brand.",
      });
    }
  };

  return (
    <main className="admin-brands-page">
      <div className="admin-brands-container">

        <div className="admin-brands-header">
          <div>
            <h1>Brands</h1>
            <p>Manage your store brands</p>
          </div>

          <div className="admin-brands-count">
            {brands.length} Brands
          </div>
        </div>

        <section className="brand-form-card">
          <h2>
            {editingId
              ? "Update Brand"
              : "Add New Brand"}
          </h2>

          <form
            className="brand-form"
            onSubmit={handleSubmit}
          >
            <div className="brand-form-group">
              <label htmlFor="brandName">
                Brand Name
              </label>

              <input
                id="brandName"
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter brand name"
                disabled={loading}
              />
            </div>

            <div className="brand-form-group">
              <label htmlFor="brandImage">
                Brand Image
              </label>

              <input
                id="brandImage"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImage(e.target.files[0] || null)
                }
                disabled={loading}
              />
            </div>

            <div className="brand-form-actions">
              <button
                type="submit"
                className="brand-submit-button"
                disabled={
                  loading || !name.trim()
                }
              >
                {loading
                  ? "Saving..."
                  : editingId
                    ? "Update Brand"
                    : "Add Brand"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="brand-cancel-button"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {error && (
          <div className="brands-error">
            {error}
          </div>
        )}

        <section className="brands-list-section">
          <div className="brands-list-header">
            <h2>All Brands</h2>
          </div>

          {loading && brands.length === 0 ? (
            <div className="brands-message">
              Loading brands...
            </div>
          ) : brands.length === 0 ? (
            <div className="brands-message">
              No brands found.
            </div>
          ) : (
            <div className="brands-table-wrapper">
              <table className="brands-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Brand Image</th>
                    <th>Brand Name</th>
                    <th>Slug</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {brands.map(
                    (brand, index) => (
                      <tr key={brand._id}>
                        <td>{index + 1}</td>

                        <td>
                          {brand.image ? (
                            <img
                              src={brand.image}
                              alt={brand.name}
                              className="brand-table-image"
                            />
                          ) : (
                            "-"
                          )}
                        </td>

                        <td>
                          <strong>
                            {brand.name}
                          </strong>
                        </td>

                        <td>
                          {brand.slug || "-"}
                        </td>

                        <td>
                          {brand.createdAt
                            ? new Date(
                                brand.createdAt
                              ).toLocaleDateString()
                            : "-"}
                        </td>

                        <td>
                          <div className="brand-actions">
                            <button
                              type="button"
                              className="brand-edit-button"
                              onClick={() =>
                                handleEdit(brand)
                              }
                              disabled={loading}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="brand-delete-button"
                              onClick={() =>
                                handleDelete(
                                  brand._id
                                )
                              }
                              disabled={loading}
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
        </section>

      </div>
    </main>
  );
}

export default Brands;