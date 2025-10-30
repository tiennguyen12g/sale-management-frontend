import React, { useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./LandingManagement2.module.scss";
const cx = classNames.bind(styles);

import ShopOrders from "./ShopOrders";
import ShopOrders_v2 from "./ShopOrders_v2";
import { useProductStore } from "../zustand/productStore";
import { useShopOrderStore } from "../zustand/shopOrderStore";
import { useStaffStore } from "../zustand/staffStore";
import { io } from "socket.io-client";
import StaffHeartbeat from "./StaffHeartBeat";
import StaffNotification from "./StaffNotification";
import { useAuthStore } from "../zustand/authStore";
import ShopOrders_v3 from "./ShopOrders_v3";
export default function LandingManagemen_v2() {
  // const {user, token} = useAuthStore();
  const { products, fetchProducts } = useProductStore();
  const { orders } = useShopOrderStore();
  const { staffID } = useStaffStore();
  const [currentProduct, setCurrentProduct] = useState<string | undefined>(undefined);

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
      return {
        ...p,
        dataOrders,
      };
    });
  }, [products, orders]);

  useEffect(() => {
    if (products.length > 0 && orders.length > 0 && currentProduct === undefined) {
      setCurrentProduct(products[0].name);
    }
  }, [products, orders]);

  return (
    <div className={cx("landing-management-main")}>
      {normalizedProducts.map((product, k) => {
        return (
          <React.Fragment key={k}>
            {currentProduct === product.name && <ShopOrders_v3 productDetail={product} dataOrders={product.dataOrders} productName={currentProduct} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}





{
  /* Navigation buttons - use absolute paths so they don't append to current deep path */
}
{
  /* <StaffHeartbeat /> */
}
{
  /* <div className={cx("group-navigate-btn")}>
        {normalizedProducts.map((product, i) => (
          <button
            className={cx("btn-decor")}
            key={i}
            style={{
              backgroundColor: currentProduct === product.name ? "orange" : "gainsboro",
            }}
            onClick={() => setCurrentProduct(product.name)}
          >
            {product.name}
          </button>
        ))}
      </div> */
}
