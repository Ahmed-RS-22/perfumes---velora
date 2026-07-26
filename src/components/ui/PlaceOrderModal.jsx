// src/components/orders/PlaceOrderModal.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "@/redux/slices/ordersSlice";
import { clearCart } from "@/redux/slices/cartSlice"; // ✅ Import clearCart
import { notify } from "@/utils/notify";
import { Dialog } from "@headlessui/react";
import { Loader2 } from "lucide-react";

export const PlaceOrderModal = ({ 
  isOpen, 
  onClose = () => {},
  cartItems = [],
  total = 0,
  onOrderSuccess 
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.orders);

  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [address, setAddress] = useState("");

  const handleConfirmOrder = async () => {
    if (!user) {
      notify.error("Please login to place an order.");
      return;
    }
    
    if (!address.trim()) {
      notify.error("Please enter a shipping address.");
      return;
    }
    
    if (cartItems.length === 0) {
      notify.error("Your cart is empty.");
      return;
    }

    try {
      const shipping_snapshot = {
        address: address.trim(),
        date: new Date().toISOString(),
      };

      // Ensure cart items have the required properties
      const orderItems = cartItems.map(item => ({
        product_id: item.product_id || item.id,
        quantity: item.quantity,
        price: item.price || item.unit_price,
      }));

      console.log('Processed Order Items:', orderItems);

      const result = await dispatch(
        createOrder({
          user_id: user.id,
          items: orderItems,
          total_price: total,
          payment_method: paymentMethod,
          shipping_snapshot,
          status: "pending"
        })
      ).unwrap();

      console.log('Order created successfully:', result);
      
      notify.success("✅ Order placed successfully!");
      
      // ✅ Clear cart after successful order - pass user ID
      await dispatch(clearCart(user.id)).unwrap();
      
      if (onOrderSuccess) {
        onOrderSuccess();
      }
      
      onClose();
      
      // Clear form
      setAddress("");
      setPaymentMethod("Cash on Delivery");
      
    } catch (err) {
      console.error('Order creation error:', err);
      notify.error("❌ Failed to place order: " + (err.message || 'Unknown error'));
    }
  };

  // ✅ Safe close handler that won't break if onClose is undefined
  const handleClose = () => {
    if (!loading && onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <Dialog.Panel className="bg-white dark:bg-card rounded-2xl p-6 w-[95%] max-w-md shadow-xl relative">
        <Dialog.Title className="text-xl font-semibold mb-4 text-center">
          Confirm Your Order
        </Dialog.Title>

        <div className="space-y-4">
          {/* Order Summary */}
          <div className="border rounded-xl p-3 bg-muted/40">
            <p className="font-medium mb-1">Items: {cartItems.length}</p>
            <p className="font-medium mb-1">Total: ${total.toFixed(2)}</p>
            <div className="text-xs text-muted-foreground mt-2">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name || `Product ${item.product_id}`} x {item.quantity}</span>
                  <span>${((item.price || item.unit_price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Shipping Address</label>
            <textarea
              rows="3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your full shipping address including street, city, zip code"
              className="w-full border rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              disabled={loading}
            />
          </div>

          {/* Payment */}
          <div>
            <label className="block text-sm font-medium mb-1">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full border rounded-xl p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={loading}
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg border border-border hover:bg-muted/40 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmOrder}
              disabled={loading || !address.trim()}
              className="px-5 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 flex items-center gap-2 transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Processing...
                </>
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

// ✅ Add default props for better safety
PlaceOrderModal.defaultProps = {
  onClose: () => {},
  cartItems: [],
  total: 0,
  onOrderSuccess: () => {}
};