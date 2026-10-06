import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

import useBrands from "../../../features/brands/hooks/useBrands";

/* =========================================================
   CSS
   نفس شكل وتنسيق Users
   وكل القواعد متقيّدة بـ .brd-x
   ========================================================= */

const css = `
.brd-x {
  min-height: 100vh;
  padding: 32px;
  background: #f3f4f6;
  box-sizing: border-box;
  font-family: inherit;
  color: #111827;
}

.brd-x *,
.brd-x *::before,
.brd-x *::after {
  box-sizing: border-box;
}

.brd-x .brd-shell {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

/* =========================================================
   HEADER
   ========================================================= */

.brd-x .brd-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.brd-x .brd-topbar h1 {
  margin: 0;
  color: #111827;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;
}

.brd-x .brd-topbar p {
  margin: 8px 0 0;
  color: #6b7280;
  font-size: 15px;
}

.brd-x .brd-toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brd-x .brd-total {
  padding: 11px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

/* =========================================================
   ADD BUTTON
   ========================================================= */

.brd-x .brd-add {
  min-height: 42px;
  padding: 0 18px;
  border: 0;
  border-radius: 8px;
  background: #111827;
  color: #fff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
}

.brd-x .brd-add:hover:not(:disabled) {
  background: #1f2937;
  transform: translateY(-1px);
}

.brd-x .brd-add:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* =========================================================
   ERROR
   ========================================================= */

.brd-x .brd-error {
  margin-bottom: 20px;
  padding: 14px 16px;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 14px;
}

/* =========================================================
   CARD
   ========================================================= */

.brd-x .brd-card {
  width: 100%;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.brd-x .brd-card-head {
  display: flex;
  align-items: center;
  min-height: 64px;
  padding: 0 22px;
  border-bottom: 1px solid #e5e7eb;
}

.brd-x .brd-card-head h2 {
  margin: 0;
  color: #111827;
  font-size: 18px;
  font-weight: 650;
}

.brd-x .brd-status {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  padding: 24px;
  color: #6b7280;
  font-size: 15px;
  text-align: center;
}

/* =========================================================
   TABLE
   ========================================================= */

.brd-x .brd-table-box {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}

.brd-x .brd-table {
  width: 100%;
  min-width: 850px;
  border-collapse: collapse;
  table-layout: auto;
}

.brd-x .brd-table th {
  height: 52px;
  padding: 0 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
}

.brd-x .brd-table td {
  height: 70px;
  padding: 10px 16px;
  border-bottom: 1px solid #f0f0f0;
  color: #374151;
  font-size: 14px;
  vertical-align: middle;
  white-space: nowrap;
  text-align: left;
}

.brd-x .brd-table tbody tr:hover {
  background: #f9fafb;
}

.brd-x .brd-table tbody tr:last-child td {
  border-bottom: 0;
}

.brd-x .brd-index {
  color: #6b7280;
  font-variant-numeric: tabular-nums;
}

/* =========================================================
   BRAND CELL
   ========================================================= */

.brd-x .brd-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.brd-x .brd-avatar {
  flex-shrink: 0;
  width: 46px;
  height: 46px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  color: #6b7280;
  font-size: 17px;
  font-weight: 700;
}

.brd-x .brd-avatar img {
  width: 100%;
  height: 100%;
  padding: 4px;
  object-fit: contain;
  display: block;
}

.brd-x .brd-avatar.brd-fallback {
  background: #f3f4f6;
}

.brd-x .brd-brand-text {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.brd-x .brd-brand-text strong {
  max-width: 250px;
  overflow: hidden;
  color: #111827;
  font-size: 14px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.brd-x .brd-brand-text span {
  max-width: 250px;
  overflow: hidden;
  color: #6b7280;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.brd-x .brd-date {
  color: #6b7280;
  white-space: nowrap;
}

/* =========================================================
   ACTIONS
   ========================================================= */

.brd-x .brd-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.brd-x .brd-edit,
.brd-x .brd-delete {
  min-width: 68px;
  height: 34px;
  padding: 0 11px;
  border-radius: 6px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s ease;
  background: #fff;
}

.brd-x .brd-edit {
  border: 1px solid #d1d5db;
  color: #374151;
}

.brd-x .brd-edit:hover:not(:disabled) {
  border-color: #9ca3af;
  background: #f9fafb;
}

.brd-x .brd-delete {
  border: 1px solid #fecaca;
  color: #dc2626;
}

.brd-x .brd-delete:hover:not(:disabled) {
  border-color: #fca5a5;
  background: #fef2f2;
}

.brd-x .brd-edit:disabled,
.brd-x .brd-delete:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* =========================================================
   MODAL
   ========================================================= */

.brd-x .brd-layer {
  position: fixed;
  inset: 0;
  z-index: 9999;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px;

  background: rgba(17, 24, 39, 0.6);

  overflow-y: auto;
}

.brd-x .brd-modal {
  width: 100%;
  max-width: 540px;
  max-height: calc(100vh - 48px);

  margin: auto;

  border: 1px solid #e5e7eb;
  border-radius: 12px;

  background: #fff;

  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.16),
    0 8px 16px rgba(0, 0, 0, 0.08);

  overflow-y: auto;
}

/* =========================================================
   MODAL HEADER
   ========================================================= */

.brd-x .brd-modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;

  padding: 22px 24px;

  border-bottom: 1px solid #e5e7eb;
}

.brd-x .brd-modal-head h2 {
  margin: 0;
  color: #111827;
  font-size: 21px;
  font-weight: 700;
}

.brd-x .brd-modal-head p {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 13px;
}

.brd-x .brd-close {
  flex-shrink: 0;

  width: 34px;
  height: 34px;

  padding: 0;

  border: 1px solid #e5e7eb;
  border-radius: 7px;

  background: #fff;
  color: #6b7280;

  font-family: inherit;
  font-size: 24px;
  line-height: 1;

  cursor: pointer;
}

.brd-x .brd-close:hover:not(:disabled) {
  background: #f3f4f6;
  color: #111827;
}

.brd-x .brd-close:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* =========================================================
   FORM
   ========================================================= */

.brd-x .brd-form {
  display: flex;
  flex-direction: column;
  gap: 17px;
  padding: 24px;
}

.brd-x .brd-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.brd-x .brd-field > label,
.brd-x .brd-label {
  color: #374151;
  font-size: 13px;
  font-weight: 600;
}

.brd-x .brd-input {
  width: 100%;
  height: 44px;

  padding: 0 12px;

  border: 1px solid #d1d5db;
  border-radius: 7px;

  outline: none;

  background: #fff;
  color: #111827;

  font-family: inherit;
  font-size: 14px;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.brd-x .brd-input::placeholder {
  color: #9ca3af;
}

.brd-x .brd-input:focus {
  border-color: #6b7280;
  box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.12);
}

.brd-x .brd-input:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

/* =========================================================
   IMAGE UPLOAD
   ========================================================= */

.brd-x .brd-upload-wrap {
  position: relative;
}

.brd-x .brd-upload {
  position: relative;

  display: flex;
  align-items: center;
  gap: 14px;

  width: 100%;
  min-height: 82px;

  padding: 12px;

  border: 1.5px dashed #d1d5db;
  border-radius: 10px;

  background: #f9fafb;

  cursor: pointer;

  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}

.brd-x .brd-upload:hover {
  border-color: #6b7280;
  background: #f3f4f6;
}

.brd-x .brd-upload:focus-within {
  border-color: #6b7280;
  box-shadow: 0 0 0 3px rgba(107, 114, 128, 0.12);
}

.brd-x .brd-upload.brd-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.brd-x .brd-upload input[type="file"] {
  position: absolute;

  width: 1px;
  height: 1px;

  margin: -1px;
  padding: 0;

  overflow: hidden;
  clip: rect(0 0 0 0);

  border: 0;
  opacity: 0;
}

.brd-x .brd-preview {
  flex-shrink: 0;

  width: 56px;
  height: 56px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  border: 1px solid #e5e7eb;
  border-radius: 8px;

  background: #fff;

  color: #9ca3af;

  font-size: 22px;
}

.brd-x .brd-preview img {
  width: 100%;
  height: 100%;
  padding: 4px;
  object-fit: contain;
  display: block;
}

.brd-x .brd-upload-text {
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 3px;
}

.brd-x .brd-upload-text strong {
  color: #111827;
  font-size: 13px;
  font-weight: 600;
}

.brd-x .brd-upload-text span {
  max-width: 350px;

  overflow: hidden;

  color: #6b7280;
  font-size: 12px;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.brd-x .brd-remove-image {
  position: absolute;

  top: 50%;
  right: 10px;

  transform: translateY(-50%);

  width: 30px;
  height: 30px;

  padding: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid #fecaca;
  border-radius: 50%;

  background: #fff;
  color: #dc2626;

  font-family: inherit;
  font-size: 20px;
  line-height: 1;

  cursor: pointer;
}

.brd-x .brd-remove-image:hover:not(:disabled) {
  background: #fef2f2;
  border-color: #fca5a5;
}

.brd-x .brd-remove-image:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* =========================================================
   FORM BUTTONS
   ========================================================= */

.brd-x .brd-form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;

  margin-top: 6px;
  padding-top: 20px;

  border-top: 1px solid #e5e7eb;
}

.brd-x .brd-cancel,
.brd-x .brd-save {
  min-width: 110px;
  height: 42px;

  padding: 0 16px;

  border-radius: 7px;

  font-family: inherit;
  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  transition: 0.2s ease;
}

.brd-x .brd-cancel {
  border: 1px solid #d1d5db;
  background: #fff;
  color: #374151;
}

.brd-x .brd-cancel:hover:not(:disabled) {
  background: #f9fafb;
}

.brd-x .brd-save {
  border: 1px solid #111827;
  background: #111827;
  color: #fff;
}

.brd-x .brd-save:hover:not(:disabled) {
  background: #1f2937;
}

.brd-x .brd-cancel:disabled,
.brd-x .brd-save:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

/* =========================================================
   RESPONSIVE
   ========================================================= */

@media (max-width: 1110px) {
  .brd-x {
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .brd-x {
    padding: 18px 14px;
  }

  .brd-x .brd-topbar {
    align-items: flex-start;
    flex-direction: column;
    gap: 18px;
  }

  .brd-x .brd-topbar h1 {
    font-size: 25px;
  }

  .brd-x .brd-toolbar {
    width: 100%;
    justify-content: space-between;
  }

  .brd-x .brd-total {
    flex: 1;
  }

  .brd-x .brd-add {
    flex-shrink: 0;
  }

  .brd-x .brd-card-head {
    padding: 0 16px;
  }

  .brd-x .brd-layer {
    align-items: flex-start;
    padding: 14px;
  }

  .brd-x .brd-modal {
    max-height: calc(100vh - 28px);
    border-radius: 10px;
  }

  .brd-x .brd-modal-head {
    padding: 18px;
  }

  .brd-x .brd-form {
    gap: 15px;
    padding: 18px;
  }

  .brd-x .brd-form-actions {
    flex-direction: column-reverse;
  }

  .brd-x .brd-cancel,
  .brd-x .brd-save {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .brd-x {
    padding: 14px 10px;
  }

  .brd-x .brd-topbar h1 {
    font-size: 23px;
  }

  .brd-x .brd-topbar p {
    font-size: 13px;
  }

  .brd-x .brd-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .brd-x .brd-total {
    width: 100%;
    text-align: center;
  }

  .brd-x .brd-add {
    width: 100%;
  }

  .brd-x .brd-card-head {
    min-height: 58px;
  }

  .brd-x .brd-card-head h2 {
    font-size: 16px;
  }

  .brd-x .brd-layer {
    padding: 10px;
  }

  .brd-x .brd-modal {
    max-height: calc(100vh - 20px);
  }

  .brd-x .brd-modal-head {
    padding: 16px;
  }

  .brd-x .brd-modal-head h2 {
    font-size: 19px;
  }

  .brd-x .brd-form {
    padding: 16px;
  }

  .brd-x .brd-input {
    height: 42px;
  }

  .brd-x .brd-upload {
    min-height: 76px;
  }

  .brd-x .brd-preview {
    width: 50px;
    height: 50px;
  }
}
`;

/* =========================================================
   Brands
   ========================================================= */

function Brands() {
  const {
    fetchBrands,
    handleCreateBrand,
    handleUpdateBrand,
    handleDeleteBrand,
  } = useBrands();

  const { brands, loading, error } = useSelector(
    (state) => state.brands
  );

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

  const busy = loading || saving;

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  /* =========================================================
     Image preview
     ========================================================= */

  const previewUrl = useMemo(
    () => (image ? URL.createObjectURL(image) : null),
    [image]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const editingBrand = editingId
    ? brands.find((brand) => brand._id === editingId)
    : null;

  const shownImage =
    previewUrl || editingBrand?.image || null;

  const fileInputRef = useRef(null);

  /* =========================================================
     Clear selected image
     ========================================================= */

  const clearImage = () => {
    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* =========================================================
     Reset form
     ========================================================= */

  const resetForm = () => {
    setName("");
    setEditingId(null);
    clearImage();
  };

  /* =========================================================
     Close form
     ========================================================= */

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleCloseClick = () => {
    if (saving) {
      return;
    }

    closeForm();
  };

  /* =========================================================
     Escape
     ========================================================= */

  useEffect(() => {
    if (!showForm) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape" && !saving) {
        closeForm();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [showForm, saving]);

  /* =========================================================
     Open Create
     ========================================================= */

  const handleOpenCreate = () => {
    resetForm();
    setShowForm(true);
  };

  /* =========================================================
     Open Edit
     ========================================================= */

  const handleEdit = (brand) => {
    setEditingId(brand._id);
    setName(brand.name || "");
    clearImage();
    setShowForm(true);
  };

  /* =========================================================
     Submit
     ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      await Swal.fire({
        icon: "warning",
        title: "Brand name is required",
      });

      return;
    }

    const formData = new FormData();

    formData.append("name", name.trim());

    if (image) {
      formData.append("image", image);
    }

    const isEditing = Boolean(editingId);

    try {
      setSaving(true);

      if (isEditing) {
        await handleUpdateBrand(editingId, formData);
      } else {
        await handleCreateBrand(formData);
      }

      closeForm();

      await Swal.fire({
        icon: "success",
        title: isEditing
          ? "Brand Updated"
          : "Brand Created",
        text: isEditing
          ? "Brand has been updated successfully."
          : "Brand has been created successfully.",
      });
    } catch (err) {
      closeForm();

      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text:
          err.response?.data?.message ||
          err.response?.data?.errors?.[0]?.msg ||
          "Something went wrong.",
      });
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     Delete
     ========================================================= */

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
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text:
          err.response?.data?.message ||
          "Failed to delete brand.",
      });
    }
  };

  /* =========================================================
     Render
     ========================================================= */

  return (
    <div className="brd-x">
      <style>{css}</style>

      <div className="brd-shell">

        {/* =====================================================
            TOP BAR
            ===================================================== */}

        <div className="brd-topbar">
          <div>
            <h1>Brands</h1>
            <p>Manage the brands in your store</p>
          </div>

          <div className="brd-toolbar">
            <div className="brd-total">
              {brands.length}{" "}
              {brands.length === 1 ? "Brand" : "Brands"}
            </div>

            <button
              type="button"
              className="brd-add"
              onClick={handleOpenCreate}
              disabled={busy}
            >
              + Add Brand
            </button>
          </div>
        </div>

        {/* =====================================================
            ERROR
            ===================================================== */}

        {error && (
          <div className="brd-error">
            {error}
          </div>
        )}

        {/* =====================================================
            BRANDS CARD
            ===================================================== */}

        <section className="brd-card">

          <div className="brd-card-head">
            <h2>All Brands</h2>
          </div>

          {loading && brands.length === 0 ? (
            <div className="brd-status">
              Loading brands...
            </div>
          ) : brands.length === 0 ? (
            <div className="brd-status">
              No brands found.
            </div>
          ) : (
            <div className="brd-table-box">
              <table className="brd-table">

                <thead>
                  <tr>
                    <th>#</th>
                    <th>Brand</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {brands.map((brand, index) => (
                    <tr key={brand._id}>

                      <td className="brd-index">
                        {index + 1}
                      </td>

                      <td>
                        <div className="brd-brand">

                          {brand.image ? (
                            <div className="brd-avatar">
                              <img
                                src={brand.image}
                                alt={brand.name}
                              />
                            </div>
                          ) : (
                            <div className="brd-avatar brd-fallback">
                              {(brand.name || "?")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}

                          <div className="brd-brand-text">
                            <strong>
                              {brand.name}
                            </strong>

                            <span>
                              {brand.slug || "-"}
                            </span>
                          </div>

                        </div>
                      </td>

                      <td className="brd-date">
                        {brand.createdAt
                          ? new Date(
                              brand.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        <div className="brd-actions">

                          <button
                            type="button"
                            className="brd-edit"
                            onClick={() =>
                              handleEdit(brand)
                            }
                            disabled={busy}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="brd-delete"
                            onClick={() =>
                              handleDelete(brand._id)
                            }
                            disabled={busy}
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}
        </section>
      </div>

      {/* =======================================================
          ADD / EDIT MODAL

          مش موجود في الصفحة نهائيًا إلا لما showForm = true
          ======================================================= */}

      {showForm && (
        <div className="brd-layer">

          <div className="brd-modal">

            {/* =================================================
                MODAL HEADER
                ================================================= */}

            <div className="brd-modal-head">

              <div>
                <h2>
                  {editingId
                    ? "Edit Brand"
                    : "Add Brand"}
                </h2>

                <p>
                  {editingId
                    ? "Update brand information"
                    : "Create a new brand"}
                </p>
              </div>

              <button
                type="button"
                className="brd-close"
                onClick={handleCloseClick}
                disabled={saving}
                aria-label="Close"
              >
                ×
              </button>

            </div>

            {/* =================================================
                FORM
                ================================================= */}

            <form
              className="brd-form"
              onSubmit={handleSubmit}
            >

              {/* BRAND NAME */}

              <div className="brd-field">

                <label htmlFor="brandName">
                  Brand Name
                </label>

                <input
                  id="brandName"
                  className="brd-input"
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter brand name"
                  disabled={busy}
                  autoFocus
                />

              </div>

              {/* BRAND IMAGE */}

              <div className="brd-field">

                <span className="brd-label">
                  Brand Image
                </span>

                <div className="brd-upload-wrap">

                  <label
                    htmlFor="brandImage"
                    className={
                      busy
                        ? "brd-upload brd-disabled"
                        : "brd-upload"
                    }
                  >

                    <div className="brd-preview">

                      {shownImage ? (
                        <img
                          src={shownImage}
                          alt="Brand preview"
                        />
                      ) : (
                        "🖼"
                      )}

                    </div>

                    <div className="brd-upload-text">

                      <strong>
                        {image
                          ? "Change image"
                          : "Choose an image"}
                      </strong>

                      <span>
                        {image
                          ? image.name
                          : editingBrand?.image
                            ? "Keeping the current image"
                            : "PNG, JPG or WEBP"}
                      </span>

                    </div>

                    <input
                      id="brandImage"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setImage(
                          e.target.files[0] || null
                        )
                      }
                      disabled={busy}
                    />

                  </label>

                  {image && (
                    <button
                      type="button"
                      className="brd-remove-image"
                      onClick={clearImage}
                      disabled={busy}
                      aria-label="Remove selected image"
                      title="Remove image"
                    >
                      ×
                    </button>
                  )}

                </div>

              </div>

              {/* BUTTONS */}

              <div className="brd-form-actions">

                <button
                  type="button"
                  className="brd-cancel"
                  onClick={handleCloseClick}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="brd-save"
                  disabled={
                    busy || !name.trim()
                  }
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Create Brand"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}
    </div>
  );
}

export default Brands;