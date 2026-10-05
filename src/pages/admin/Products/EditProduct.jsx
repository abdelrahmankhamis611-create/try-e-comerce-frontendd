
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import Swal from "sweetalert2";

import useCategories from "../../../features/categories/hooks/useCategories";
import useSubCategories from "../../../features/subCategories/hooks/useSubCategories";
import useBrands from "../../../features/brands/hooks/useBrands";
import useProducts from "../../../features/products/hooks/useProducts";

import "./EditProduct.css";

function EditProduct() {
  const navigate = useNavigate();
  const { productId } = useParams();

  const {
    fetchCategories,
  } = useCategories();

  const {
    fetchSubCategoriesByCategory,
  } = useSubCategories();

  const {
    fetchBrands,
  } = useBrands();

  const {
    fetchProductById,
    handleUpdateProduct,
  } = useProducts();

  // =========================
  // Redux
  // =========================

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector(
    (state) => state.categories
  );

  const {
    subCategories,
    loading: subCategoriesLoading,
    error: subCategoriesError,
  } = useSelector(
    (state) => state.subCategories
  );

  const {
    brands,
    loading: brandsLoading,
    error: brandsError,
  } = useSelector(
    (state) => state.brands
  );

  const {
    product,
    loading: productLoading,
    updateLoading,
    error: productError,
  } = useSelector(
    (state) => state.products
  );

  // =========================
  // Form State
  // =========================

  const [formData, setFormData] =
    useState({
      title: "",
      description: "",
      quantity: "",
      price: "",
      priceAfterDiscount: "",
      category: "",
      subCategory: [],
      brand: "",
      colors: "",
      imageCover: null,
      image: [],
    });

  const [oldImageCover, setOldImageCover] =
    useState("");

  const [oldImages, setOldImages] =
    useState([]);

  // =========================
  // Fetch Basic Data
  // =========================

  useEffect(() => {
    fetchCategories({
      limit: 100,
    });

    fetchBrands({
      limit: 100,
    });
  }, [
    fetchCategories,
    fetchBrands,
  ]);

  // =========================
  // Fetch Product
  // =========================

  useEffect(() => {
    if (!productId) {
      return;
    }

    fetchProductById(productId);
  }, [
    productId,
    fetchProductById,
  ]);

  // =========================
  // Load Product Into Form
  // =========================

  useEffect(() => {
    if (!product) {
      return;
    }

    const categoryId =
      product.category?._id ||
      product.category ||
      "";

    const subCategoryIds =
      Array.isArray(
        product.subCategory
      )
        ? product.subCategory.map(
            (item) =>
              typeof item === "object"
                ? item._id
                : item
          )
        : [];

    const colorsValue =
      Array.isArray(product.colors)
        ? product.colors.join(", ")
        : "";

    setFormData({
      title:
        product.title || "",

      description:
        product.description || "",

      quantity:
        product.quantity ?? "",

      price:
        product.price ?? "",

      priceAfterDiscount:
        product.priceAfterDiscount ??
        "",

      category:
        categoryId,

      subCategory:
        subCategoryIds,

      brand:
        product.brand?._id ||
        product.brand ||
        "",

      colors:
        colorsValue,

      imageCover:
        null,

      image: [],
    });

    setOldImageCover(
      product.imageCover || ""
    );

    setOldImages(
      Array.isArray(product.image)
        ? product.image
        : []
    );
  }, [product]);

  // =========================
  // Fetch SubCategories
  // =========================

  useEffect(() => {
    if (!formData.category) {
      return;
    }

    fetchSubCategoriesByCategory(
      formData.category,
      {
        limit: 100,
      }
    );
  }, [
    formData.category,
    fetchSubCategoriesByCategory,
  ]);

  // =========================
  // Input Change
  // =========================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Category Change
  // =========================

  const handleCategoryChange = (
    e
  ) => {
    const categoryId =
      e.target.value;

    setFormData((prev) => ({
      ...prev,
      category: categoryId,
      subCategory: [],
    }));
  };

  // =========================
  // SubCategory Change
  // =========================

  const handleSubCategoryChange = (
    e
  ) => {
    const selectedOptions =
      Array.from(
        e.target.selectedOptions
      );

    const selectedIds =
      selectedOptions.map(
        (option) => option.value
      );

    setFormData((prev) => ({
      ...prev,
      subCategory: selectedIds,
    }));
  };

  // =========================
  // Cover Image Change
  // =========================

  const handleImageCoverChange = (
    e
  ) => {
    setFormData((prev) => ({
      ...prev,
      imageCover:
        e.target.files?.[0] ||
        null,
    }));
  };

  // =========================
  // Product Images Change
  // =========================

  const handleImagesChange = (
    e
  ) => {
    setFormData((prev) => ({
      ...prev,
      image: Array.from(
        e.target.files || []
      ),
    }));
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    if (!productId) {
      return;
    }

    if (
      formData.priceAfterDiscount &&
      Number(
        formData.priceAfterDiscount
      ) > Number(formData.price)
    ) {
      await Swal.fire({
        title:
          "Invalid Discount Price",
        text:
          "Price after discount cannot be greater than the original price.",
        icon: "warning",
        confirmButtonText:
          "OK",
      });

      return;
    }

    const data =
      new FormData();

    data.append(
      "title",
      formData.title.trim()
    );

    data.append(
      "description",
      formData.description.trim()
    );

    data.append(
      "quantity",
      formData.quantity
    );

    data.append(
      "price",
      formData.price
    );

    data.append(
      "category",
      formData.category
    );

    if (
      formData.priceAfterDiscount
    ) {
      data.append(
        "priceAfterDiscount",
        formData.priceAfterDiscount
      );
    }

    if (formData.brand) {
      data.append(
        "brand",
        formData.brand
      );
    }

    if (
      formData.subCategory.length >
      0
    ) {
      data.append(
        "subCategory",
        JSON.stringify(
          formData.subCategory
        )
      );
    }

    if (formData.colors.trim()) {
      const colorsArray =
        formData.colors
          .split(",")
          .map((color) =>
            color.trim()
          )
          .filter(Boolean);

      data.append(
        "colors",
        JSON.stringify(colorsArray)
      );
    }

    if (formData.imageCover) {
      data.append(
        "imageCover",
        formData.imageCover
      );
    }

    formData.image.forEach(
      (image) => {
        data.append(
          "image",
          image
        );
      }
    );

    try {
      await handleUpdateProduct(
        productId,
        data
      );

      await Swal.fire({
        title:
          "Product Updated!",
        text:
          "Product has been updated successfully.",
        icon: "success",
        confirmButtonText:
          "OK",
      });

      navigate(
        "/admin/products"
      );
    } catch (error) {
      console.log(
        "Edit Product Error:",
        error
      );
    }
  };

  // =========================
  // Loading Product
  // =========================

  if (
    productLoading &&
    !product
  ) {
    return (
      <div className="admin-page">

        <div className="admin-loading-message">
          Loading product...
        </div>

      </div>
    );
  }

  // =========================
  // Product Not Found
  // =========================

  if (
    !productLoading &&
    !product &&
    productError
  ) {
    return (
      <div className="admin-page">

        <div className="admin-error-message">
          {productError}
        </div>

        <button
          type="button"
          className="admin-secondary-button"
          onClick={() =>
            navigate(
              "/admin/products"
            )
          }
        >
          Back to Products
        </button>

      </div>
    );
  }

  // =========================
  // Render
  // =========================

  return (
    <div className="admin-page">

      <div className="admin-page-header">

        <div>
          <h2>
            Edit Product
          </h2>

          <p>
            Update your product information.
          </p>
        </div>

      </div>

      <form
        className="admin-edit-product-form"
        onSubmit={handleSubmit}
      >

        {/* =========================
            Basic Information
        ========================= */}

        <div className="admin-product-form-section">

          <div className="admin-product-form-section-header">

            <h3>
              Basic Information
            </h3>

            <p>
              Update the main product information.
            </p>

          </div>

          <div className="admin-form-group">

            <label htmlFor="title">
              Product Title
            </label>

            <input
              id="title"
              name="title"
              type="text"
              value={
                formData.title
              }
              onChange={
                handleChange
              }
              minLength={3}
              maxLength={30}
              required
            />

          </div>

          <div className="admin-form-group">

            <label htmlFor="description">
              Description
            </label>

            <textarea
              id="description"
              name="description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              rows={6}
              minLength={3}
              maxLength={2000}
              required
            />

          </div>

        </div>

        {/* =========================
            Pricing & Stock
        ========================= */}

        <div className="admin-product-form-section">

          <div className="admin-product-form-section-header">

            <h3>
              Pricing & Stock
            </h3>

            <p>
              Update product price and quantity.
            </p>

          </div>

          <div className="admin-form-row">

            <div className="admin-form-group">

              <label htmlFor="quantity">
                Quantity
              </label>

              <input
                id="quantity"
                name="quantity"
                type="number"
                min="0"
                value={
                  formData.quantity
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <div className="admin-form-group">

              <label htmlFor="price">
                Price
              </label>

              <input
                id="price"
                name="price"
                type="number"
                min="0"
                max="100000"
                step="0.01"
                value={
                  formData.price
                }
                onChange={
                  handleChange
                }
                required
              />

            </div>

            <div className="admin-form-group">

              <label htmlFor="priceAfterDiscount">
                Price After Discount
              </label>

              <input
                id="priceAfterDiscount"
                name="priceAfterDiscount"
                type="number"
                min="0"
                max="100000"
                step="0.01"
                value={
                  formData.priceAfterDiscount
                }
                onChange={
                  handleChange
                }
              />

            </div>

          </div>

        </div>

        {/* =========================
            Category & Brand
        ========================= */}

        <div className="admin-product-form-section">

          <div className="admin-product-form-section-header">

            <h3>
              Category & Brand
            </h3>

            <p>
              Update product organization.
            </p>

          </div>

          <div className="admin-form-row">

            {/* Category */}

            <div className="admin-form-group">

              <label htmlFor="category">
                Category
              </label>

              <select
                id="category"
                name="category"
                value={
                  formData.category
                }
                onChange={
                  handleCategoryChange
                }
                required
              >

                <option value="">
                  {categoriesLoading
                    ? "Loading categories..."
                    : "Select Category"}
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={
                        category._id
                      }
                      value={
                        category._id
                      }
                    >
                      {category.name}
                    </option>
                  )
                )}

              </select>

              {categoriesError && (
                <small className="admin-field-error">
                  {categoriesError}
                </small>
              )}

            </div>

            {/* SubCategory */}

            <div className="admin-form-group">

              <label htmlFor="subCategory">
                SubCategory
              </label>

              <select
                id="subCategory"
                name="subCategory"
                multiple
                value={
                  formData.subCategory
                }
                onChange={
                  handleSubCategoryChange
                }
                disabled={
                  !formData.category ||
                  subCategoriesLoading
                }
              >

                {subCategories.map(
                  (subCategory) => (
                    <option
                      key={
                        subCategory._id
                      }
                      value={
                        subCategory._id
                      }
                    >
                      {
                        subCategory.name
                      }
                    </option>
                  )
                )}

              </select>

              <small>
                Hold Ctrl to select multiple subcategories.
              </small>

              {subCategoriesError && (
                <small className="admin-field-error">
                  {
                    subCategoriesError
                  }
                </small>
              )}

            </div>

            {/* Brand */}

            <div className="admin-form-group">

              <label htmlFor="brand">
                Brand
              </label>

              <select
                id="brand"
                name="brand"
                value={
                  formData.brand
                }
                onChange={
                  handleChange
                }
              >

                <option value="">
                  {brandsLoading
                    ? "Loading brands..."
                    : "Select Brand"}
                </option>

                {brands.map(
                  (brand) => (
                    <option
                      key={
                        brand._id
                      }
                      value={
                        brand._id
                      }
                    >
                      {brand.name}
                    </option>
                  )
                )}

              </select>

              {brandsError && (
                <small className="admin-field-error">
                  {brandsError}
                </small>
              )}

            </div>

          </div>

        </div>

        {/* =========================
            Colors
        ========================= */}

        <div className="admin-product-form-section">

          <div className="admin-product-form-section-header">

            <h3>
              Colors
            </h3>

            <p>
              Update available product colors.
            </p>

          </div>

          <div className="admin-form-group">

            <label htmlFor="colors">
              Product Colors
            </label>

            <input
              id="colors"
              name="colors"
              type="text"
              value={
                formData.colors
              }
              onChange={
                handleChange
              }
              placeholder="Red, Blue, Black"
            />

            <small>
              Separate colors with commas.
            </small>

          </div>

        </div>

        {/* =========================
            Images
        ========================= */}

        <div className="admin-product-form-section">

          <div className="admin-product-form-section-header">

            <h3>
              Product Images
            </h3>

            <p>
              Keep the current images or upload new ones.
            </p>

          </div>

          {/* Current Cover */}

          {oldImageCover && (
            <div className="admin-current-cover">

              <div className="admin-current-image-title">
                Current Cover Image
              </div>

              <img
                src={
                  oldImageCover
                }
                alt={
                  formData.title
                }
                className="admin-current-cover-image"
              />

            </div>
          )}

          <div className="admin-form-row">

            <div className="admin-form-group">

              <label htmlFor="imageCover">
                New Cover Image
              </label>

              <input
                id="imageCover"
                name="imageCover"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={
                  handleImageCoverChange
                }
              />

              <small>
                Leave empty to keep the current cover image.
              </small>

            </div>

            <div className="admin-form-group">

              <label htmlFor="image">
                New Product Images
              </label>

              <input
                id="image"
                name="image"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                multiple
                onChange={
                  handleImagesChange
                }
              />

              <small>
                Leave empty to keep the current images.
              </small>

            </div>

          </div>

          {/* Current Images */}

          {oldImages.length >
            0 && (
            <div className="admin-current-images">

              <div className="admin-current-image-title">
                Current Product Images
              </div>

              <div className="admin-current-images-grid">

                {oldImages.map(
                  (
                    image,
                    index
                  ) => (
                    <img
                      key={`${image}-${index}`}
                      src={image}
                      alt={`Product ${index + 1}`}
                      className="admin-current-product-image"
                    />
                  )
                )}

              </div>

            </div>
          )}

        </div>

        {/* =========================
            Error
        ========================= */}

        {productError && (
          <div className="admin-error-message">
            {productError}
          </div>
        )}

        {/* =========================
            Actions
        ========================= */}

        <div className="admin-product-form-actions">

          <button
            type="button"
            className="admin-secondary-button"
            onClick={() =>
              navigate(
                "/admin/products"
              )
            }
            disabled={
              updateLoading
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={
              updateLoading
            }
          >
            {updateLoading
              ? "Updating Product..."
              : "Update Product"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default EditProduct;

