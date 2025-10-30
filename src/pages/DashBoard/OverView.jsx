import { useOutletContext } from "react-router-dom";
import { EmptyState } from "../../components/ui/EmptyState";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchAllProfiles } from "../../redux/slices/profileSlice";
const OverviewPage = () => {
  const { orders, products } = useOutletContext();
  const { allProfiles} = useSelector((state) => state.profile);
  const dispatch =useDispatch()
  useEffect(() => {
    dispatch(fetchAllProfiles());
  }, [dispatch]);  
  return (
    <div className="w-full px-4 min-h-screen py-6 overflow-y-auto">
      <div className="w-full bg-bg-alt p-6 rounded-2xl shadow-lg2 h-full">
        <h1 className="dash-title mb-6">Dashboard Overview</h1>
        {/* ======= STATS CARDS ======= */}
        <div className="flex md:flex-wrap  justify-evenly gap-6 py-5 px-4 md:overflow-visible overflow-scroll  overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth scrollbar-hide rounded-2xl  shadow-inner2 ">
          {/* Card Template */}
          <div className="bg-gradient-to-br from-primary/10 to-card border border-border p-5 rounded-2xl shadow-md hover:shadow-lg transition-all min-w-40 duration-300 text-center">
            <h2 className="text-heading text-sm font-semibold mb-2">
              Total Products
            </h2>
            <p className="text-3xl font-bold text-primary-light">
              {products?.length || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-success-bg to-card border border-border p-5 rounded-2xl shadow-md hover:shadow-lg transition-all min-w-40 duration-300 text-center">
            <h2 className="text-heading text-sm font-semibold mb-2">
              Total Orders
            </h2>
            <p className="text-3xl font-bold text-success">
              {orders?.list?.length || 0}
            </p>
          </div>
          <div className="bg-gradient-to-br from-info-bg to-card border border-border p-5 rounded-2xl shadow-md hover:shadow-lg transition-all min-w-40 duration-300 text-center">
            <h2 className="text-heading text-sm font-semibold mb-2">
              Total Users
            </h2>
            <p className="text-3xl font-bold text-info">{allProfiles.length ||100}</p>
          </div>
          <div className="bg-gradient-to-br from-warning-bg to-card border border-border p-5 rounded-2xl shadow-md hover:shadow-lg transition-all min-w-40 duration-300 text-center">
            <h2 className="text-heading text-sm font-semibold mb-2">
              Total Revenue
            </h2>
            <p className="text-3xl font-bold text-warning">$9000</p>
          </div>
        </div>
        {/* ======= INVENTORY TABLE ======= */}
        <div className="bg-card mt-5 md:px-6 px-2 py-5 max-h-100 scrollbar-hide  overflow-auto rounded-2xl shadow-inner2">
          <h2 className="dash-title mb-4">Products Inventory</h2>
          <div className="overflow-x-auto rounded-xl min-w-120 border border-border shadow-sm">
            <table className="min-w-full border-collapse">
              <thead className="bg-bg-alt sticky top-0 z-10">
                <tr className="text-left text-sm text-text-muted">
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Quantity</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product) => (
                  <tr
                    key={product.id}
                    className={`transition-all hover:bg-bg-alt nth-[old]:bg-bg/50  nth-[even]:bg-bg-alt/50 `}
                  >
                    <td className="py-3 px-4 font-medium text-heading">
                      {product.name}
                    </td>
                    <td className="py-3 px-4 text-text">{product.category}</td>
                    <td className="py-3 px-4 text-primary">${product.price}</td>
                    <td className="py-3 px-4">{product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* ======= Recent orders ======= */}
          <div className="bg-card mt-5 md:px-6 px-2 py-5 max-h-100 scrollbar-hide  overflow-auto rounded-2xl shadow-inner2">
            <h2 className="dash-title mb-4">Recent Orders</h2>
        {orders.lenght>0 ? (
            <div className="overflow-x-auto rounded-xl min-w-120 border border-border shadow-sm">
              <table className="min-w-full border-collapse">
                <thead className="bg-bg-alt sticky top-0 z-10">
                  <tr className="text-left text-sm text-text-muted">
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Total Items</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.list.slice(0, 5).map((order) => (
                    <tr
                      key={order.id}
                      className={`transition-all hover:bg-bg-alt nth-[old]:bg-bg/50  nth-[even]:bg-bg-alt/50 `}
                    >
                      <td className="py-3 px-4 font-medium text-heading">
                        {order.id}
                      </td>
                      <td className="py-3 px-4 text-text">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-primary">
                        {order.status || "Pending"}
                      </td>
                      <td className="py-3 px-4">
                        {order.order_items?.length || 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        ) : (
          <>
          <EmptyState />
          </>
        )}
        </div>
      </div>
    </div>
  );
};
export default OverviewPage;
