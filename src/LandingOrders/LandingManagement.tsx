import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./LandingManagement.module.scss";
const cx = classNames.bind(styles);

import { Link, Routes, Route, Navigate, useLocation } from "react-router-dom";
import ShopOrders from "./ShopOrders";
import { useProductStore } from "../zustand/productStore";
import { useShopOrderStore } from "../zustand/shopOrderStore";

export default function LandingManagement() {
  const { products, fetchProducts } = useProductStore();
  const { orders } = useShopOrderStore();
  const [currentProduct, setCurrentProduct] = useState<string | undefined>(undefined);
  const location = useLocation();

  // fetch products
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // fetch orders from the store (call directly on the store to avoid double deps)
  useEffect(() => {
    useShopOrderStore.getState().fetchOrders();
  }, []);

  // build normalized products (memoized)
  const normalizedProducts = useMemo(() => {
    return (products || []).map((p, i) => {
      const productId = p.productId;
      const dataOrders = (orders || []).filter((item) => item.productId === productId);
      const raw = p.endpointUrl ?? `product-${i}`;
      const endpoint = String(raw).replace(/^\/+|\/+$/g, ""); // strip leading/trailing slashes
      return {
        ...p,
        _endpoint: endpoint,
        dataOrders,
      };
    });
  }, [products, orders]);

  // derive current product from pathname (last segment)
  useEffect(() => {
    if (normalizedProducts.length === 0) {
      setCurrentProduct(undefined);
      return;
    }

    const path = location.pathname.replace(/\/+$/, ""); // remove trailing slash
    const parts = path.split("/").filter(Boolean);
    const last = parts.length ? parts[parts.length - 1] : "";

    if (!last || last === "landing") {
      setCurrentProduct(normalizedProducts[0].name);
      return;
    }

    const match = normalizedProducts.find((p) => p._endpoint === last);
    if (match) {
      setCurrentProduct(match.name);
    } else {
      setCurrentProduct(normalizedProducts[0].name);
    }
  }, [location.pathname, normalizedProducts]);

  return (
    <div className={cx("landing-management-main")}>
      {/* Navigation buttons - use absolute paths so they don't append to current deep path */}
      <div className={cx("group-navigate-btn")}>
        {normalizedProducts.map((product) => (
          <Link
            key={product._endpoint}
            to={`/landing/${product._endpoint}`} // <-- absolute link prevents "appending"
            style={{ textDecoration: "none" }}
          >
            <button
              className={cx("btn-decor")}
              style={{
                backgroundColor: currentProduct === product.name ? "orange" : "gainsboro",
              }}
            >
              {product.name}
            </button>
          </Link>
        ))}
      </div>

      {/* Child routes (relative paths under /landing/*) */}
      <Routes>
        {normalizedProducts.length > 0 ? (
          // Use absolute navigate target to avoid relative confusion
          <Route
            index
            element={<Navigate to={`/landing/${normalizedProducts[0]._endpoint}`} replace />}
          />
        ) : (
          <Route index element={<div>Loading products...</div>} />
        )}

        {normalizedProducts.map((product) => (
          <Route
            key={product._endpoint}
            path={product._endpoint} // relative path under /landing/*
            element={<ShopOrders productDetail={product} dataOrders={product.dataOrders} />}
          />
        ))}

        <Route path="*" element={<div>Page not found: {location.pathname}</div>} />
      </Routes>
    </div>
  );
}
