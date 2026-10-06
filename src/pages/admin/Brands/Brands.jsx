import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

import useBrands from "../../../features/brands/hooks/useBrands";

/* =========================================================
   الـ CSS جوه الملف نفسه، وكل القواعد متقيّدة بـ .brd-x
   ========================================================= */
const css = `
.brd-x {
  --ink: #0f172a;
  --muted: #64748b;
  --line: #e2e8f0;
  --soft: #f8fafc;
  --accent: #2563eb;
  --accent-dark: #1d4ed8;
  --accent-tint: #eff6ff;
  --danger: #dc2626;
  --danger-tint: #fef2f2;

  min-height: 100vh;
  padding: 32px;
  background: #f1f5f9;
  color: var(--ink);
  font-family: inherit;
}
.brd-x *, .brd-x *::before, .brd-x *::after { box-sizing: border-box; }
.brd-x .brd-shell { max-width: 1280px; margin: 0 auto; }

/* ---------- header ---------- */
.brd-x .brd-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 26px; }
.brd-x .brd-header h1 { margin: 0; font-size: 30px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.15; color: var(--ink); }
.brd-x .brd-header p { margin: 6px 0 0; font-size: 15px; color: var(--muted); }
.brd-x .brd-count { display: flex; align-items: baseline; gap: 6px; padding: 10px 16px; border: 1px solid var(--line); border-radius: 999px; background: #fff; white-space: nowrap; }
.brd-x .brd-count b { font-size: 20px; font-weight: 800; color: var(--ink); }
.brd-x .brd-count span { font-size: 13px; color: var(--muted); }

.brd-x .brd-error { margin-bottom: 20px; padding: 14px 16px; border: 1px solid #fecaca; border-radius: 12px; background: var(--danger-tint); color: #b91c1c; font-size: 14px; }

/* ---------- layout ---------- */
.brd-x .brd-layout { display: grid; grid-template-columns: 340px minmax(0, 1fr); gap: 24px; align-items: start; }

/* ---------- form panel ---------- */
.brd-x .brd-panel { position: sticky; top: 24px; padding: 24px; border: 1px solid var(--line); border-radius: 16px; background: #fff; }
.brd-x .brd-panel.brd-editing { border-color: var(--accent); box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.08); }
.brd-x .brd-panel h2 { margin: 0 0 4px; font-size: 18px; font-weight: 700; color: var(--ink); }
.brd-x .brd-panel .brd-hint { margin: 0 0 20px; font-size: 13px; color: var(--muted); }

.brd-x .brd-form { display: flex; flex-direction: column; gap: 18px; }
.brd-x .brd-field { display: flex; flex-direction: column; gap: 8px; }
.brd-x .brd-field > label, .brd-x .brd-field > .brd-label { font-size: 13px; font-weight: 600; color: #334155; }

.brd-x .brd-input { width: 100%; height: 46px; padding: 0 14px; border: 1px solid #cbd5e1; border-radius: 10px; outline: none; background: #fff; color: var(--ink); font-family: inherit; font-size: 14px; transition: border-color .15s ease, box-shadow .15s ease; }
.brd-x .brd-input::placeholder { color: #94a3b8; }
.brd-x .brd-input:focus { border-color: var(--accent); box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12); }
.brd-x .brd-input:disabled { background: #f1f5f9; cursor: not-allowed; }

/* upload */
.brd-x .brd-upload-wrap { position: relative; }
.brd-x .brd-upload-wrap .brd-upload { padding-right: 52px; }
.brd-x .brd-remove-image { position: absolute; top: 50%; right: 12px; transform: translateY(-50%); width: 30px; height: 30px; padding: 0; display: flex; align-items: center; justify-content: center; border: 1px solid #fecaca; border-radius: 50%; background: #fff; color: var(--danger); font-family: inherit; font-size: 20px; line-height: 1; cursor: pointer; transition: background .15s ease, border-color .15s ease; }
.brd-x .brd-remove-image:hover:not(:disabled) { background: var(--danger-tint); border-color: #fca5a5; }
.brd-x .brd-remove-image:focus-visible { outline: none; box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.15); }
.brd-x .brd-remove-image:disabled { opacity: .5; cursor: not-allowed; }
.brd-x .brd-upload { position: relative; display: flex; align-items: center; gap: 14px; padding: 12px; border: 1.5px dashed #cbd5e1; border-radius: 12px; background: var(--soft); cursor: pointer; transition: border-color .15s ease, background .15s ease; }
.brd-x .brd-upload:hover { border-color: var(--accent); background: var(--accent-tint); }
.brd-x .brd-upload:focus-within { border-color: var(--accent); box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12); }
.brd-x .brd-upload.brd-disabled { opacity: .6; cursor: not-allowed; }
.brd-x .brd-upload input[type="file"] { position: absolute; width: 1px; height: 1px; margin: -1px; padding: 0; overflow: hidden; clip: rect(0 0 0 0); border: 0; opacity: 0; }
.brd-x .brd-preview { flex-shrink: 0; width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--line); border-radius: 12px; background: #fff; overflow: hidden; color: #94a3b8; font-size: 22px; }
.brd-x .brd-preview img { width: 100%; height: 100%; padding: 4px; object-fit: contain; }
.brd-x .brd-upload-text { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.brd-x .brd-upload-text strong { font-size: 13px; font-weight: 600; color: var(--ink); }
.brd-x .brd-upload-text span { font-size: 12px; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.brd-x .brd-form-actions { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
.brd-x .brd-btn { height: 46px; padding: 0 18px; border-radius: 10px; font-family: inherit; font-size: 14px; font-weight: 600; cursor: pointer; transition: background .15s ease, border-color .15s ease, transform .15s ease; }
.brd-x .brd-btn:disabled { opacity: .5; cursor: not-allowed; }
.brd-x .brd-btn-primary { border: 1px solid var(--accent); background: var(--accent); color: #fff; }
.brd-x .brd-btn-primary:hover:not(:disabled) { background: var(--accent-dark); border-color: var(--accent-dark); }
.brd-x .brd-btn-ghost { border: 1px solid #cbd5e1; background: #fff; color: #334155; }
.brd-x .brd-btn-ghost:hover:not(:disabled) { background: var(--soft); border-color: #94a3b8; }

/* ---------- list ---------- */
.brd-x .brd-list { overflow: hidden; border: 1px solid var(--line); border-radius: 16px; background: #fff; }
.brd-x .brd-list-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid var(--line); }
.brd-x .brd-list-head h2 { margin: 0; font-size: 18px; font-weight: 700; color: var(--ink); }
.brd-x .brd-message { display: flex; align-items: center; justify-content: center; min-height: 220px; padding: 24px; color: var(--muted); font-size: 15px; text-align: center; }

.brd-x .brd-table-wrap { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; }
.brd-x .brd-table { width: 100%; min-width: 640px; border-collapse: collapse; }
.brd-x .brd-table th { padding: 12px 22px; background: var(--soft); border-bottom: 1px solid var(--line); color: var(--muted); font-size: 13px; font-weight: 600; text-align: left; white-space: nowrap; }
.brd-x .brd-table td { padding: 14px 22px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 14px; text-align: left; vertical-align: middle; }
.brd-x .brd-table tbody tr { transition: background .15s ease; }
.brd-x .brd-table tbody tr:hover { background: var(--soft); }
.brd-x .brd-table tbody tr:last-child td { border-bottom: 0; }
.brd-x .brd-table tbody tr.brd-row-active { background: var(--accent-tint); box-shadow: inset 3px 0 0 var(--accent); }

.brd-x .brd-index { color: #94a3b8; font-variant-numeric: tabular-nums; }

.brd-x .brd-brand { display: flex; align-items: center; gap: 14px; min-width: 0; }
.brd-x .brd-avatar { flex-shrink: 0; width: 48px; height: 48px; display: flex; align-items: center; justify-content: center; border: 1px solid var(--line); border-radius: 12px; background: #fff; overflow: hidden; color: var(--accent); font-size: 18px; font-weight: 800; }
.brd-x .brd-avatar img { width: 100%; height: 100%; padding: 5px; object-fit: contain; display: block; }
.brd-x .brd-avatar.brd-fallback { background: var(--accent-tint); border-color: transparent; }
.brd-x .brd-brand-text { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.brd-x .brd-brand-text strong { color: var(--ink); font-size: 14px; font-weight: 700; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.brd-x .brd-brand-text span { color: var(--muted); font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.brd-x .brd-date { white-space: nowrap; color: var(--muted); }

.brd-x .brd-actions { display: flex; align-items: center; gap: 8px; }
.brd-x .brd-edit, .brd-x .brd-delete { height: 34px; padding: 0 14px; border: 1px solid transparent; border-radius: 8px; font-family: inherit; font-size: 13px; font-weight: 600; cursor: pointer; transition: background .15s ease; }
.brd-x .brd-edit { background: var(--accent-tint); color: var(--accent); }
.brd-x .brd-edit:hover:not(:disabled) { background: #dbeafe; }
.brd-x .brd-delete { background: var(--danger-tint); color: var(--danger); }
.brd-x .brd-delete:hover:not(:disabled) { background: #fee2e2; }
.brd-x .brd-edit:disabled, .brd-x .brd-delete:disabled { opacity: .5; cursor: not-allowed; }

/* ---------- responsive ---------- */
@media (max-width: 1024px) {
  .brd-x { padding: 24px; }
  .brd-x .brd-layout { grid-template-columns: 1fr; }
  .brd-x .brd-panel { position: static; }
}

@media (max-width: 600px) {
  .brd-x { padding: 16px 12px; }
  .brd-x .brd-header { align-items: flex-start; flex-direction: column; gap: 14px; }
  .brd-x .brd-header h1 { font-size: 25px; }
  .brd-x .brd-panel { padding: 18px; }
  .brd-x .brd-list-head { padding: 16px; }
  .brd-x .brd-table th, .brd-x .brd-table td { padding: 12px 14px; }
}
`;

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

  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  /* معاينة الصورة المختارة، وتنضيف الـ URL لما تتغير */
  const previewUrl = useMemo(
    () => (image ? URL.createObjectURL(image) : null),
    [image]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const editingBrand = editingId
    ? brands.find((brand) => brand._id === editingId)
    : null;

  const shownImage = previewUrl || editingBrand?.image || null;

  const fileInputRef = useRef(null);

  /* بيمسح الصورة المختارة (قبل الحفظ) ويفضّي الـ input
     عشان تقدر تختار نفس الصورة تاني لو حبيت */
  const clearImage = () => {
    setImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setName("");
    setEditingId(null);
    clearImage();
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
        await handleUpdateBrand(editingId, formData);

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
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text:
          err.response?.data?.message || "Something went wrong.",
      });
    }
  };

  const handleEdit = (brand) => {
    setEditingId(brand._id);
    setName(brand.name);
    clearImage();
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
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text:
          err.response?.data?.message || "Failed to delete brand.",
      });
    }
  };

  return (
    <div className="brd-x">
      <style>{css}</style>

      <div className="brd-shell">
        <div className="brd-header">
          <div>
            <h1>Brands</h1>
            <p>Manage the brands in your store</p>
          </div>

          <div className="brd-count">
            <b>{brands.length}</b>
            <span>{brands.length === 1 ? "brand" : "brands"}</span>
          </div>
        </div>

        {error && <div className="brd-error">{error}</div>}

        <div className="brd-layout">
          {/* ---------- form ---------- */}
          <section
            className={
              editingId ? "brd-panel brd-editing" : "brd-panel"
            }
          >
            <h2>{editingId ? "Update brand" : "Add new brand"}</h2>

            <p className="brd-hint">
              {editingId
                ? "Change the name or pick a new logo."
                : "Give the brand a name and a logo."}
            </p>

            <form className="brd-form" onSubmit={handleSubmit}>
              <div className="brd-field">
                <label htmlFor="brandName">Brand name</label>

                <input
                  id="brandName"
                  className="brd-input"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter brand name"
                  disabled={loading}
                />
              </div>

              <div className="brd-field">
                <span className="brd-label">Brand image</span>

                <div className="brd-upload-wrap">
                  <label
                    htmlFor="brandImage"
                    className={
                      loading
                        ? "brd-upload brd-disabled"
                        : "brd-upload"
                    }
                  >
                    <div className="brd-preview">
                      {shownImage ? (
                        <img src={shownImage} alt="Brand preview" />
                      ) : (
                        "🖼"
                      )}
                    </div>

                    <div className="brd-upload-text">
                      <strong>
                        {image ? "Change image" : "Choose an image"}
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
                        setImage(e.target.files[0] || null)
                      }
                      disabled={loading}
                    />
                  </label>

                  {image && (
                    <button
                      type="button"
                      className="brd-remove-image"
                      onClick={clearImage}
                      disabled={loading}
                      aria-label="Remove selected image"
                      title="Remove image"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>

              <div className="brd-form-actions">
                <button
                  type="submit"
                  className="brd-btn brd-btn-primary"
                  disabled={loading || !name.trim()}
                >
                  {loading
                    ? "Saving..."
                    : editingId
                      ? "Update brand"
                      : "Add brand"}
                </button>

                {editingId && (
                  <button
                    type="button"
                    className="brd-btn brd-btn-ghost"
                    onClick={resetForm}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          {/* ---------- list ---------- */}
          <section className="brd-list">
            <div className="brd-list-head">
              <h2>All brands</h2>
            </div>

            {loading && brands.length === 0 ? (
              <div className="brd-message">Loading brands...</div>
            ) : brands.length === 0 ? (
              <div className="brd-message">
                No brands yet. Add your first one from the form.
              </div>
            ) : (
              <div className="brd-table-wrap">
                <table className="brd-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Brand</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {brands.map((brand, index) => (
                      <tr
                        key={brand._id}
                        className={
                          editingId === brand._id
                            ? "brd-row-active"
                            : undefined
                        }
                      >
                        <td className="brd-index">{index + 1}</td>

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
                              <strong>{brand.name}</strong>
                              <span>{brand.slug || "-"}</span>
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
                              onClick={() => handleEdit(brand)}
                              disabled={loading}
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="brd-delete"
                              onClick={() =>
                                handleDelete(brand._id)
                              }
                              disabled={loading}
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
      </div>
    </div>
  );
}

export default Brands;
