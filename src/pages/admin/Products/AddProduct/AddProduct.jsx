import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import useCategories from "../../../../features/categories/hooks/useCategories";
import useSubCategories from "../../../../features/subcategories/hooks/useSubCategories";
import useBrands from "../../../../features/brands/hooks/useBrands";
import useProducts from "../../../../features/products/hooks/useProducts";

import "./AddProduct.css";

function AddProduct() {
  const navigate = useNavigate();

  const { fetchCategories } = useCategories();
  const { fetchSubCategoriesByCategory } =
    useSubCategories();
  const { fetchBrands } = useBrands();
  const { handleCreateProduct } = useProducts();

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useSelector((state) => state.categories);

  const {
    subCategories,
    loading: subCategoriesLoading,
    error: subCategoriesError,
  } = useSelector((state) => state.subCategories);

  const {
    brands,
    loading: brandsLoading,
    error: brandsError,
  } = useSelector((state) => state.brands);

  const {
    createLoading,
    error: productError,
  } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
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

  // =========================
  // Fetch Categories & Brands
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
  // Handle Input Change
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

  const handleCategoryChange = (e) => {
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
  // Cover Image
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
  // Product Images
  // =========================

  const handleImagesChange = (e) => {
  const selectedImages = Array.from(
    e.target.files || []
  );

  setFormData((prev) => {
    const existingImages = prev.image;

    const newImages = selectedImages.filter(
      (newImage) =>
        !existingImages.some(
          (existingImage) =>
            existingImage.name === newImage.name &&
            existingImage.size === newImage.size &&
            existingImage.lastModified ===
              newImage.lastModified
        )
    );

    return {
      ...prev,
      image: [
        ...existingImages,
        ...newImages,
      ],
    };
  });

  // Allow selecting the same file again
  e.target.value = "";
};

  // =========================
  // Remove Product Image
  // =========================

  const handleRemoveImage = (
    indexToRemove
  ) => {
    setFormData((prev) => ({
      ...prev,
      image: prev.image.filter(
        (_, index) =>
          index !== indexToRemove
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

    if (!formData.imageCover) {
      await Swal.fire({
        title: "Cover Image Required",
        text: "Please select a cover image.",
        icon: "warning",
        confirmButtonText: "OK",
      });

      return;
    }

    if (
      formData.priceAfterDiscount &&
      Number(
        formData.priceAfterDiscount
      ) > Number(formData.price)
    ) {
      await Swal.fire({
        title: "Invalid Discount Price",
        text: "Price after discount cannot be greater than the original price.",
        icon: "warning",
        confirmButtonText: "OK",
      });

      return;
    }

    const data = new FormData();

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

    if (formData.priceAfterDiscount) {
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

    if (formData.subCategory.length > 0) {
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

    data.append(
      "imageCover",
      formData.imageCover
    );

    formData.image.forEach(
      (image) => {
        data.append(
          "image",
          image
        );
      }
    );

    try {
      await handleCreateProduct(
        data
      );

      await Swal.fire({
        title: "Product Created!",
        text: "Product has been created successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });

      navigate("/admin/products");
    } catch (error) {
      console.log(
        "Add Product Error:",
        error
      );
    }
  };

  // =========================
  // Render
  // =========================

  return (
    <div className="admin-page">

      <div className="admin-page-header">

        <div>
          <h2>Add Product</h2>

          <p>
            Add a new product to your store.
          </p>
        </div>

      </div>

      <form
        className="admin-add-product-form"
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
              Enter the main product information.
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
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter product title"
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
              onChange={handleChange}
              placeholder="Enter product description"
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
              Set product price and available quantity.
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
              />

            </div>

          </div>

        </div>

        {/* =========================
            Categories & Brand
        ========================= */}

        <div className="admin-product-form-section">

          <div className="admin-product-form-section-header">
            <h3>
              Category & Brand
            </h3>

            <p>
              Organize your product.
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

                {!formData.category && (
                  <option value="">
                    Select a category first
                  </option>
                )}

                {formData.category &&
                  subCategories.length ===
                    0 &&
                  !subCategoriesLoading && (
                    <option value="">
                      No subcategories found
                    </option>
                  )}

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
              Add the available product colors.
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
              onChange={handleChange}
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
              Upload the cover image and additional product images.
            </p>
          </div>

          <div className="admin-form-row">

            <div className="admin-form-group">

              <label htmlFor="imageCover">
                Cover Image
              </label>

              <input
                id="imageCover"
                name="imageCover"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={
                  handleImageCoverChange
                }
                required
              />

              <small>
                JPG, JPEG, PNG or WEBP.
              </small>

            </div>

            <div className="admin-form-group">

              <label htmlFor="image">
                Product Images
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
                You can select multiple images.
              </small>

            </div>

          </div>

          {/* =========================
              Selected Images Preview
          ========================= */}

          {formData.image.length > 0 && (
            <div className="admin-selected-images">

              <div className="admin-selected-images-header">
                <strong>
                  Selected Product Images
                </strong>

                <span>
                  {formData.image.length}{" "}
                  {formData.image.length === 1
                    ? "image"
                    : "images"}
                </span>
              </div>

              <div className="admin-selected-images-grid">

                {formData.image.map(
                  (image, index) => (
                    <div
                      className="admin-selected-image-card"
                      key={`${image.name}-${image.lastModified}-${index}`}
                    >

                      <img
                        src={URL.createObjectURL(
                          image
                        )}
                        alt={image.name}
                        className="admin-selected-image-preview"
                      />

                      <div className="admin-selected-image-info">

                        <span
                          className="admin-selected-image-name"
                          title={image.name}
                        >
                          {image.name}
                        </span>

                        <button
                          type="button"
                          className="admin-remove-image-button"
                          onClick={() =>
                            handleRemoveImage(
                              index
                            )
                          }
                          disabled={
                            createLoading
                          }
                        >
                          ×
                        </button>

                      </div>

                    </div>
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
              createLoading
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="admin-primary-button"
            disabled={
              createLoading
            }
          >
            {createLoading
              ? "Creating Product..."
              : "Create Product"}
          </button>

        </div>

      </form>

    </div>
  );
}

export default AddProduct;
