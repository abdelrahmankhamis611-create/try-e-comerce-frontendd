import { Outlet } from "react-router-dom";

import Navbar from "../../components/common/Navbar/Navbar";
import Footer from "../../components/common/Footer/Footer";

function StoreLayout() {
  return (
    <div className="store-layout">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default StoreLayout;