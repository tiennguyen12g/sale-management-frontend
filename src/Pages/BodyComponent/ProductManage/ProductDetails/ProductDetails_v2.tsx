import React, { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./ProductDetails.module.scss";

const cx = classNames.bind(styles);
import { FaRegClone } from "react-icons/fa6";
import ProductTable from "./ProductTable";
import { type ProductType, type ProductDetailsType } from "../../../../zustand/productStore";
import { useProductStore } from "../../../../zustand/productStore";
import { UploadProductImage_API } from "../../../../configs/api";
const ProductTypeName = ["Quần/áo", "Thiết bị điện tử", "Đồ gia dụng", "Đồ ăn", "Tranh ảnh"];
const templateProduct: Omit<ProductType, "_id"> = {
  // _id: "",
  productId: "",
  name: "",
  typeProduct: "",
  sizeAvailable: [],
  colorAvailable: [],
  productDetailed: [],
  imageUrl: [],
  endpointUrl: "",
};
export default function ProductDetails() {
  const { products, fetchProducts, updateProduct, addProduct, deleteProduct } = useProductStore();
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [product, setProduct] = useState<Omit<ProductType, "_id">>({ ...templateProduct });
  const [editProduct, setEditProduct] = useState<ProductType>({ ...templateProduct, _id: "" });

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // ---- IMAGE HANDLING ----
  const handleAddImage = (whatBox: "new-form" | "edit-form") => {
    if (whatBox === "new-form") {
      setProduct((prev) => ({
        ...prev,
        imageUrl: [...prev.imageUrl, { name: "", color: "", url: "" }],
      }));
    } else if (whatBox === "edit-form") {
      setEditProduct((prev) => ({
        ...prev,
        imageUrl: [...prev.imageUrl, { name: "", color: "", url: "" }],
      }));
    }
  };

  const handleImageChange = (whatBox: "new-form" | "edit-form", index: number, field: keyof ProductType["imageUrl"][0], value: string) => {
    if (whatBox === "new-form") {
      const newImgs = [...product.imageUrl];
      newImgs[index][field] = value;
      setProduct({ ...product, imageUrl: newImgs });
    } else if (whatBox === "edit-form") {
      const newImgs = [...editProduct.imageUrl];
      newImgs[index][field] = value;
      setEditProduct({ ...editProduct, imageUrl: newImgs });
    }
  };

  const handleRemoveImage = (whatBox: "new-form" | "edit-form", index: number) => {
    if (whatBox === "new-form") {
      const newImgs = [...product.imageUrl];
      newImgs.splice(index, 1);
      setProduct({ ...product, imageUrl: newImgs });
    } else if (whatBox === "edit-form") {
      const newImgs = [...editProduct.imageUrl];
      newImgs.splice(index, 1);
      setEditProduct({ ...editProduct, imageUrl: newImgs });
    }
  };

  const handleFileUpload = async (whatBox: "new-form" | "edit-form", index: number, file: File | null) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(UploadProductImage_API, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (whatBox === "new-form") {
        const newImgs = [...product.imageUrl];
        newImgs[index].url = data.url; // ✅ backend URL instead of blob
        newImgs[index].name = data.name;
        setProduct({ ...product, imageUrl: newImgs });
      } else if (whatBox === "edit-form") {
        const newImgs = [...editProduct.imageUrl];
        newImgs[index].url = data.url;
        newImgs[index].name = data.name;
        setEditProduct({ ...editProduct, imageUrl: newImgs });
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  // ---- PRODUCT DETAIL HANDLING ----
  const handleAddDetail = (whatBox: "new-form" | "edit-form") => {
    if (whatBox === "new-form") {
      setProduct((prev) => ({
        ...prev,
        productDetailed: [...prev.productDetailed, { name: "", stock: 0, color: "", size: "", price: 0, weight: 0, breakEvenPrice: 0 }],
      }));
    } else if (whatBox === "edit-form") {
      setEditProduct((prev) => ({
        ...prev,
        productDetailed: [...prev.productDetailed, { name: "", stock: 0, color: "", size: "", price: 0, weight: 0, breakEvenPrice: 0 }],
      }));
    }
  };

  const handleDetailChange = (whatBox: "new-form" | "edit-form", index: number, field: keyof ProductDetailsType, value: any) => {
    // if(field === "sizeAvailable" as keyof ProductDetailsType){

    // }

    if (whatBox === "new-form") {
      const newDetails = [...product.productDetailed];
      (newDetails[index] as any)[field] = value;
      setProduct({ ...product, productDetailed: newDetails });
    } else if (whatBox === "edit-form") {
      const newDetails = [...editProduct.productDetailed];
      (newDetails[index] as any)[field] = value;
      setEditProduct({ ...editProduct, productDetailed: newDetails, _id: editProduct._id });
    }
  };

  // clone handler
  const handleCloneDetail = (whatBox: "new-form" | "edit-form", idx: number) => {
    if (whatBox === "new-form") {
      setProduct((prev) => {
        const copyDetails = [...prev.productDetailed];
        const clonedItem = { ...copyDetails[idx] };
        copyDetails.splice(idx + 1, 0, clonedItem);
        return { ...prev, productDetailed: copyDetails };
      });
    } else if (whatBox === "edit-form") {
      setEditProduct((prev) => {
        const copyDetails = [...prev.productDetailed];
        const clonedItem = { ...copyDetails[idx] };
        copyDetails.splice(idx + 1, 0, clonedItem);
        return { ...prev, productDetailed: copyDetails };
      });
    }
  };

  const handleRemoveDetail = (whatBox: "new-form" | "edit-form", index: number) => {
    if (whatBox === "new-form") {
      const newDetails = [...product.productDetailed];
      newDetails.splice(index, 1);
      setProduct({ ...product, productDetailed: newDetails });
    } else if (whatBox === "edit-form") {
      const newDetails = [...editProduct.productDetailed];
      newDetails.splice(index, 1);
      setEditProduct({ ...editProduct, productDetailed: newDetails, _id: editProduct._id });
    }
  };

  const handleSubmit = async () => {
    console.log("product", product);
    try {
      const res = await addProduct(product);
      if (res?.status === "failed") throw new Error("Failed to add product");
      alert("Product added successfully!");
      setProduct({ ...templateProduct });
      // setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Error adding product");
    }
  };

  const handleEdit = (p: ProductType) => {
    setShowEditForm(true);
    setEditProduct(p);
  };

  const handleUpdateEditProduct = async () => {
    const res = await updateProduct(editProduct._id, {
      ...editProduct,
    });
    if (res?.status === "success") {
      alert("Update success");
      setShowEditForm(false);
      // setEditProduct({ ...templateProduct, _id: "" });
    } else {
      alert("Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    const res = await deleteProduct(id);
    if (res?.status === "success") {
      alert("Delete success");
    } else {
      alert("Delete failed");
    }
  };

  return (
    <div className={cx("product-details")}>

      {/* // -- Content */}

      <div className={cx("product-list")}>
        <h2>Danh sách sản phẩm</h2>
        <div>
          <button className={cx("btn-decor", "btn-add")} onClick={() => setShowForm(true)}>
            + Thêm sản phẩm
          </button>
        </div>
        <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
}
