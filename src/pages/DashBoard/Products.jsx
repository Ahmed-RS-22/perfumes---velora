import { useOutletContext } from "react-router-dom";
import {
  addProduct,
  updateProduct,
  deleteProduct,
} from "@/redux/slices/productSlice";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { X } from "lucide-react";
import ImageUploader from "../../components/ui/ImageUploader";

const ProductsPage = () => {
  const { products } = useOutletContext();
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    quantity: "",
    image_url: "",
  });

  const dispatch = useDispatch();

  // Keep filtered products in sync
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  // Search
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setFilteredProducts(
      products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      )
    );
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
      };
      if (editing) {
        await dispatch(updateProduct({ id: editing, updates: payload }));
        setEditing(null);
      } else {
        await dispatch(addProduct(payload));
      }
      setForm({
        name: "",
        category: "",
        price: "",
        quantity: "",
        image_url: "",
      });
      setShowForm(false);
    } catch (err) {
      console.error("Error submitting product:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = (id) => dispatch(deleteProduct(id));
  const handleEdit = (p) => {
    setShowForm(true);
    setEditing(p.id);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      quantity: p.quantity,
      image_url: p.image_url,
    });
  };

  return (
    <div className="w-full px-4 min-h-screen py-6 overflow-y-auto">
      {/* MODAL */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg mx-4 relative scrollbar-hide overflow-y-auto max-h-[90vh] transition-all duration-200">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-text hover:text-primary transition"
              onClick={() => {
                setShowForm(false);
                setEditing(null);
                setForm({
                  name: "",
                  category: "",
                  price: "",
                  quantity: "",
                  image_url: "",
                });
              }}
            >
              <X size={22} />
            </button>

            <h3 className="text-2xl font-semibold text-heading mb-5 text-center">
              {editing ? "Edit Product" : "Add New Product"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div>
                  <label className="block mb-1 font-medium text-sm">Name</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={loading}
                    required
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block mb-1 font-medium text-sm">
                    Category
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, category: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block mb-1 font-medium text-sm">
                    Price
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, price: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={loading}
                    required
                  />
                </div>

                {/* Quantity */}
                <div>
                  <label className="block mb-1 font-medium text-sm">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, quantity: e.target.value }))
                    }
                    className="w-full px-4 py-2 border border-border rounded-lg bg-bg focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* ImageUploader */}
              <div>
                <label className="block mb-1 font-medium text-sm">
                  Product Image
                </label>
                <div className="border border-border rounded-lg p-3 bg-bg-alt">
                  <ImageUploader
                    onUploadComplete={(url) =>
                      setForm((prev) => ({ ...prev, image_url: url }))
                    }
                  />
                  {form.image_url && (
                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="mt-3 w-24 h-24 object-cover rounded-lg border mx-auto"
                    />
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between gap-3 pt-3">
                <button
                  type="button"
                  className="flex-1 border border-border text-text hover:bg-bg-alt rounded-full py-2 transition-all"
                  onClick={() => setShowForm(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-1 bg-primary text-bg rounded-full py-2 font-medium transition-all ${
                    loading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-primary/90"
                  }`}
                >
                  {loading
                    ? editing
                      ? "Updating..."
                      : "Adding..."
                    : editing
                    ? "Update Product"
                    : "Add Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="w-full bg-bg-alt p-6 rounded-2xl shadow-lg2 h-full">
        <h2 className="dash-title">Products Management</h2>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
          <button
            className="px-6 py-3 rounded-full bg-primary text-bg hover:bg-primary/90 transition-all font-medium"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? "Close Form" : "Add New Product"}
          </button>
          <input
            onChange={handleSearch}
            type="text"
            placeholder="Search products..."
            className="px-4 py-2 border border-primary rounded-lg w-full max-w-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {products?.length > 0 ? (
          <>
            <div className="bg-card mt-5 md:px-6 px-2 py-5 max-h-100 scrollbar-hide overflow-auto rounded-2xl shadow-inner2">
              <div className="overflow-x-auto rounded-xl min-w-120 border border-border shadow-sm">
                <table className="min-w-full border-collapse">
                  <thead className="bg-bg-alt sticky top-0 z-10">
                    <tr className="text-left text-sm text-text-muted">
                      <th className="py-3 px-4">Name</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Quantity</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="transition-all hover:bg-primary-light/40"
                      >
                        <td className="py-3 px-4 font-medium text-heading">
                          {product.name}
                        </td>
                        <td className="py-3 px-4 text-text">
                          {product.category}
                        </td>
                        <td className="py-3 px-4 text-primary">
                          ${product.price}
                        </td>
                        <td className="py-3 px-4">{product.quantity}</td>
                        <td className="py-3 px-4 flex gap-4">
                          <button
                            className="text-info bg-info-bg hover:text-info-bg hover:bg-info cursor-pointer px-3 py-1 rounded-full"
                            onClick={() => handleEdit(product)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-error bg-error-bg hover:text-error-bg hover:bg-error cursor-pointer px-3 py-1 rounded-full"
                            onClick={() => handleDeleteProduct(product.id)}
                            disabled={loading}
                          >
                            {
                              loading ? "Deleting..." : "Delete"
                            }
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center py-10 text-text-muted">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;
