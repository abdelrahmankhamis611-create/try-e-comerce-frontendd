import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Dashboard.css";

import { getProducts } from "../../../features/products/api/productApi";
import { getUsers } from "../../../features/adminUsers/api/userAdminApi";
import { getOrders } from "../../../features/orders/api/orderApi";
import { getCategories } from "../../../features/categories/api/categoryApi";
import { getBrands } from "../../../features/brands/api/brandApi";
import { getSubCategories } from "../../../features/subCategories/api/subCategoryApi";

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    categories: 0,
    brands: 0,
    subCategories: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true);

        const [
          productsResponse,
          usersResponse,
          ordersResponse,
          categoriesResponse,
          brandsResponse,
          subCategoriesResponse,
        ] = await Promise.allSettled([
          getProducts({ page: 1, limit: 10000 }),
          getUsers({ page: 1, limit: 10000 }),
          getOrders({ page: 1, limit: 10000 }),
          getCategories({ page: 1, limit: 10000 }),
          getBrands({ page: 1, limit: 10000 }),
          getSubCategories({ page: 1, limit: 10000 }),
        ]);

        setStats({
          products:
            productsResponse.status === "fulfilled"
              ? productsResponse.value?.data?.length || 0
              : 0,

          users:
            usersResponse.status === "fulfilled"
              ? usersResponse.value?.data?.length || 0
              : 0,

          orders:
            ordersResponse.status === "fulfilled"
              ? ordersResponse.value?.data?.length || 0
              : 0,

          categories:
            categoriesResponse.status === "fulfilled"
              ? categoriesResponse.value?.data?.length || 0
              : 0,

          brands:
            brandsResponse.status === "fulfilled"
              ? brandsResponse.value?.data?.length || 0
              : 0,

          subCategories:
            subCategoriesResponse.status === "fulfilled"
              ? subCategoriesResponse.value?.data?.length || 0
              : 0,
        });
      } catch (error) {
        console.log("Dashboard Stats Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div>
          <h2>Dashboard</h2>

          <p>
            Welcome to the admin dashboard.
          </p>
        </div>
      </div>

      <div className="admin-dashboard-cards">
        <div
          className="admin-dashboard-card"
          onClick={() => navigate("/admin/products")}
        >
          <span>Products</span>

          <strong>
            {loading ? "..." : stats.products}
          </strong>
        </div>

        <div
          className="admin-dashboard-card"
          onClick={() => navigate("/admin/users")}
        >
          <span>Users</span>

          <strong>
            {loading ? "..." : stats.users}
          </strong>
        </div>

        <div
          className="admin-dashboard-card"
          onClick={() => navigate("/admin/orders")}
        >
          <span>Orders</span>

          <strong>
            {loading ? "..." : stats.orders}
          </strong>
        </div>

        <div
          className="admin-dashboard-card"
          onClick={() => navigate("/admin/categories")}
        >
          <span>Categories</span>

          <strong>
            {loading ? "..." : stats.categories}
          </strong>
        </div>

        <div
          className="admin-dashboard-card"
          onClick={() => navigate("/admin/brands")}
        >
          <span>Brands</span>

          <strong>
            {loading ? "..." : stats.brands}
          </strong>
        </div>

        <div
          className="admin-dashboard-card"
          onClick={() => navigate("/admin/subcategories")}
        >
          <span>SubCategories</span>

          <strong>
            {loading ? "..." : stats.subCategories}
          </strong>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;