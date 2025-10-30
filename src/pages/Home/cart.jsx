import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Plus, Minus, Trash2, X } from "lucide-react";
import {
  fetchCart,
  updateCartItem,
  removeFromCart,
} from "@/redux/slices/cartSlice";
import { cn } from "../../lib/utils";
import { PlaceOrderModal } from "../../components/ui/PlaceOrderModal";

export const Cart = () => {
  const dispatch = useDispatch();
  const { data: cartItems, loading } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const [cartData, setCartData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCart(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    setCartData(cartItems);
  }, [cartItems]);

  const handleQuantityChange = (item, type) => {
    const newQuantity = type === "inc" ? item.quantity + 1 : item.quantity - 1;
    if (newQuantity < 1) return;
    dispatch(updateCartItem({ id: item.id, quantity: newQuantity }));
  };

  const handleRemove = (item) => {
    dispatch(removeFromCart(item.id));
  };

  const { subtotal, shipping, total } = useMemo(() => {
    const subtotal = (cartItems || []).reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );
    const shipping = subtotal > 0 ? 15 : 0;
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  }, [cartItems]);

  return (
    <section className="container page mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-5 mb-12">
        <h1 className="text-4xl md:text-6xl font-cinzel font-bold text-heading">
          Your <span className="text-primary">Cart</span>
        </h1>
        <p className="text-text-muted max-w-2xl mx-auto text-lg leading-relaxed">
          Review your selected products and get ready to complete your purchase.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <p className="text-lg text-text-muted">Loading your cart...</p>
        </div>
      ) : !cartItems?.length ? (
        <div className="text-center py-20">
          <p className="text-text-muted text-lg">
            Your cart is empty. Start exploring our collection!
          </p>
          <Link
            to="/shop"
            className="inline-block mt-6 px-6 py-3 rounded-full bg-primary text-bg hover:bg-primary/90 transition-all font-medium"
          >
            Back to Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* 🧺 Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartData.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row bg-card border border-border rounded-3xl overflow-hidden shadow-md2 hover:shadow-lg2 transition-all duration-300"
              >
                {/* Image */}
                <div className="w-full sm:w-48 h-56 sm:h-auto overflow-hidden">
                  <img
                    src={item.image_url || "/20.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-col justify-between flex-1 p-6">
                  <div>
                    <p className="text-sm uppercase tracking-widest text-primary/70 mb-1">
                      {item.category || "Product"}
                    </p>
                    <h3 className="text-lg font-semibold text-heading mb-2">
                      {item.name}
                    </h3>
                    <p className="text-primary font-bold text-xl mb-3">
                      ${item.price}
                    </p>
                  </div>

                  {/* Quantity & Remove */}
                  <div className="flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(item, "dec")}
                        className="p-2 rounded-full bg-border hover:bg-primary/20 transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-heading font-medium text-lg">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item, "inc")}
                        className="p-2 rounded-full bg-border hover:bg-primary/20 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemove(item)}
                      className="p-2 rounded-full bg-error/10 text-error hover:bg-error hover:text-bg transition-all duration-300"
                      title="Remove item"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 🧾 Summary */}
          <div className="bg-card border border-border rounded-3xl shadow-md2 p-8 h-fit sticky top-24">
            <h3 className="text-2xl font-cinzel font-semibold text-heading mb-6">
              Order Summary
            </h3>

            <div className="space-y-3 text-text-muted">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                        <span>${shipping.toFixed(2)}</span>
                      </div>
                      <div className="w-full h-px bg-border my-4"></div>
                      <div className="flex justify-between text-heading font-semibold">
                        <span>Total</span>
                        <span className="text-primary">${total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="mt-8 flex flex-col gap-3">
                      <button
                        className="w-full py-3 rounded-full bg-primary text-bg font-semibold hover:bg-primary/90 transition-all duration-300"
                        onClick={() => setIsModalOpen(true)}
                      >
                        Proceed to Checkout
                      </button>

                      <Link
                        to="/shop"
                        className="w-full text-center py-3 rounded-full border border-primary text-primary hover:bg-primary hover:text-bg font-medium transition-all duration-300"
                      >
                        Continue Shopping
                      </Link>
                    </div>
                  </div>
                </div>
              )}
      
      {/* ✅ PlaceOrderModal should be OUTSIDE all conditionals */}
      <PlaceOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        cartItems={cartItems || []}
        total={total}
        onOrderSuccess={() => {
          // Optional: Add any success callback logic here
          console.log('Order placed successfully!');
        }}
      />
    </section>
  );
};