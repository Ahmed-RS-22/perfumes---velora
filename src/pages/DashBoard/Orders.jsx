// src/pages/dashboard/OrdersPage.jsx
import { updateOrderStatus, fetchAllOrders } from "@/redux/slices/ordersSlice";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  X,
} from "lucide-react";
import { fetchAllProfiles } from "../../redux/slices/profileSlice";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const {
    adminList: orders,
    adminLoading: loading,
    error,
  } = useSelector((state) => state.orders);

  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [updatingOrder, setUpdatingOrder] = useState(null);
  const { allProfiles } = useSelector((state) => state.profile);
  useEffect(() => {
    dispatch(fetchAllProfiles());
  }, [dispatch]);
  // Fetch all orders on component mount
  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);
  // Keep filtered orders in sync
  useEffect(() => {
    setFilteredOrders(orders || []);
  }, [orders]);

  // Search and filter
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    applyFilters(query, statusFilter);
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    applyFilters("", status);
  };

  const applyFilters = (query = "", status = statusFilter) => {
    let filtered = orders || [];

    // Apply search filter
    if (query) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(query) ||
          order.shipping_snapshot?.address?.toLowerCase().includes(query) ||
          order.payment_method.toLowerCase().includes(query) ||
          order.profiles?.email?.toLowerCase().includes(query) ||
          order.profiles?.full_name?.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (status !== "all") {
      filtered = filtered.filter((order) => order.status === status);
    }

    setFilteredOrders(filtered);
  };

  // Update order status
  const handleStatusUpdate = async (orderId, newStatus) => {
    setUpdatingOrder(orderId);
    try {
      await dispatch(
        updateOrderStatus({ order_id: orderId, newStatus })
      ).unwrap();
      // Refresh orders to get updated data
      dispatch(fetchAllOrders());
    } catch (err) {
      console.error("Error updating order status:", err);
    } finally {
      setUpdatingOrder(null);
    }
  };

  // View order details
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
      confirmed: { color: "bg-blue-100 text-blue-800", icon: CheckCircle },
      shipped: { color: "bg-purple-100 text-purple-800", icon: Truck },
      delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle },
      cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}
      >
        <IconComponent size={14} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Status options for dropdown
  const statusOptions = [
    { value: "pending", label: "Pending", icon: Clock },
    { value: "confirmed", label: "Confirmed", icon: CheckCircle },
    { value: "shipped", label: "Shipped", icon: Truck },
    { value: "delivered", label: "Delivered", icon: CheckCircle },
    { value: "cancelled", label: "Cancelled", icon: XCircle },
  ];

  if (loading && orders.length === 0) {
    return (
      <div className="w-full px-4 min-h-screen py-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text-muted">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 min-h-screen py-6 overflow-y-auto">
      {/* Order Details Modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 relative scrollbar-hide overflow-y-auto max-h-[90vh] transition-all duration-200">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-text hover:text-primary transition"
              onClick={() => {
                setShowDetails(false);
                setSelectedOrder(null);
              }}
            >
              <X size={22} />
            </button>

            <h3 className="text-2xl font-semibold text-heading mb-5 text-center">
              Order Details - {selectedOrder.id.slice(0, 8)}...
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Order Information */}
              <div className="space-y-4">
                <div className="bg-bg-alt p-4 rounded-lg">
                  <h4 className="font-semibold text-heading mb-3">
                    Order Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Order ID:</span>
                      <span className="font-medium">{selectedOrder.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Date:</span>
                      <span className="font-medium">
                        {new Date(
                          selectedOrder.created_at
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Customer:</span>
                      <span className="font-medium">
                        {selectedOrder.profiles?.full_name ||
                          selectedOrder.profiles?.email ||
                          "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Status:</span>
                      <StatusBadge status={selectedOrder.status} />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Payment Method:</span>
                      <span className="font-medium">
                        {selectedOrder.payment_method}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Total Amount:</span>
                      <span className="font-medium text-primary">
                        ${selectedOrder.total_price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Information */}
                <div className="bg-bg-alt p-4 rounded-lg">
                  <h4 className="font-semibold text-heading mb-3">
                    Shipping Information
                  </h4>
                  {selectedOrder.shipping_snapshot?.address ? (
                    <p className="text-sm text-text">
                      {selectedOrder.shipping_snapshot.address}
                    </p>
                  ) : (
                    <p className="text-sm text-text-muted">
                      No shipping address provided
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-bg-alt p-4 rounded-lg">
                <h4 className="font-semibold text-heading mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.order_items?.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2 bg-card rounded-lg"
                    >
                      <img
                        src={item.products?.image_url || "/20.jpg"}
                        alt={item.products?.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">
                          {item.products?.name}
                        </p>
                        <p className="text-xs text-text-muted">
                          Qty: {item.quantity} × ${item.price_at_time}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-primary">
                          ${(item.quantity * item.price_at_time).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Update Status */}
            <div className="mt-6 bg-bg-alt p-4 rounded-lg">
              <h4 className="font-semibold text-heading mb-3">
                Update Order Status
              </h4>
              <div className="flex flex-wrap gap-2">
                {statusOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() =>
                        handleStatusUpdate(selectedOrder.id, option.value)
                      }
                      disabled={
                        updatingOrder === selectedOrder.id ||
                        selectedOrder.status === option.value
                      }
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedOrder.status === option.value
                          ? "bg-primary text-bg cursor-not-allowed"
                          : "bg-card text-text hover:bg-primary hover:text-bg border border-border"
                      } ${
                        updatingOrder === selectedOrder.id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                    >
                      <IconComponent size={16} />
                      {option.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="w-full bg-bg-alt p-6 rounded-2xl shadow-lg2 h-full">
        <h2 className="dash-title">Orders Management</h2>

        {/* Filters and Search */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-6">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleStatusFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                statusFilter === "all"
                  ? "bg-primary text-bg"
                  : "bg-card text-text hover:bg-primary hover:text-bg border border-border"
              }`}
            >
              All Orders
            </button>
            {statusOptions.map((option) => {
              const IconComponent = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => handleStatusFilter(option.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    statusFilter === option.value
                      ? "bg-primary text-bg"
                      : "bg-card text-text hover:bg-primary hover:text-bg border border-border"
                  }`}
                >
                  <IconComponent size={16} />
                  {option.label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full lg:max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted"
              size={20}
            />
            <input
              onChange={handleSearch}
              type="text"
              placeholder="Search by order ID, customer, address, or payment method..."
              className="w-full pl-10 pr-4 py-2 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-card"
            />
          </div>
        </div>

        {/* Orders Table */}
        {filteredOrders?.length > 0 ? (
          <>
            <div className="bg-card mt-5 md:px-6 px-2 py-5 max-h-100 scrollbar-hide overflow-auto rounded-2xl shadow-inner2">
              <div className="overflow-x-auto rounded-xl min-w-120 border border-border shadow-sm">
                <table className="min-w-full border-collapse">
                  <thead className="bg-bg-alt sticky top-0 z-10">
                    <tr className="text-left text-sm text-text-muted">
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="transition-all hover:bg-primary-light/40 border-b border-border"
                      >
                        <td className="py-3 px-4 font-medium text-heading">
                          {order.id.slice(0, 8)}...
                        </td>
                        <td className="py-3 px-4 text-text">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-text">
                          {allProfiles.find((p) => p.id === order.user_id)
                            .username || "N/A"}
                        </td>
                        <td className="py-3 px-4 text-primary font-semibold">
                          ${order.total_price}
                        </td>
                        <td className="py-3 px-4 text-text">
                          {order.payment_method}
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              className="flex items-center gap-1 text-info bg-info-bg hover:text-info-bg hover:bg-info cursor-pointer px-3 py-1 rounded-full text-sm"
                              onClick={() => handleViewDetails(order)}
                            >
                              <Eye size={14} />
                              View
                            </button>
                            <select
                              value={order.status}
                              onChange={(e) =>
                                handleStatusUpdate(order.id, e.target.value)
                              }
                              disabled={updatingOrder === order.id}
                              className="bg-card border border-border rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                            >
                              {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-10 text-text-muted">
            <Truck size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No orders found.</p>
            <p className="text-sm mt-2">
              {statusFilter !== "all"
                ? `No orders with status "${statusFilter}"`
                : "No orders have been placed yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
