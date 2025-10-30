import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProfiles, deleteUserByAdmin } from "@/redux/slices/profileSlice";
import { Loader2, UserPlus, Search, X } from "lucide-react";
import { EmptyState } from "../../components/ui/EmptyState";

export default function UsersPage() {
  const dispatch = useDispatch();
  const { allProfiles, loading, error } = useSelector((state) => state.profile);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchAllProfiles());
  }, [dispatch]);

  useEffect(() => {
    setFilteredUsers(allProfiles || []);
  }, [allProfiles]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setFilteredUsers(
      allProfiles?.filter(
        (u) =>
          u.username?.toLowerCase().includes(query) ||
          u.email?.toLowerCase().includes(query) ||
          u.role?.toLowerCase().includes(query)
      ) || []
    );
  };

  const handleConfirmDelete = () => {
    if (selectedUser) {
      dispatch(deleteUserByAdmin(selectedUser.id));
      setShowDeleteModal(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-primary size-12" />
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-error font-semibold">
        ⚠️ {error}
      </div>
    );

  return (
    <div className="w-full px-4 min-h-screen py-6 overflow-y-auto">
      {/* ===== Add User Modal ===== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-lg mx-4 relative transition-all duration-200">
            <button
              className="absolute top-4 right-4 text-text hover:text-primary transition"
              onClick={() => setShowAddModal(false)}
            >
              <X size={22} />
            </button>
            <h3 className="text-2xl font-semibold text-heading mb-4 text-center">
              Add New User
            </h3>
            <p className="text-center text-text-muted mb-6">
              User creation form coming soon!
            </p>
            <div className="flex justify-center">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2 bg-primary text-bg rounded-full font-medium hover:bg-primary/90 transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== Delete Confirmation Modal ===== */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md mx-4 relative transition-all duration-200">
            <button
              className="absolute top-4 right-4 text-text hover:text-primary transition"
              onClick={() => setShowDeleteModal(false)}
            >
              <X size={22} />
            </button>
            <h3 className="text-xl font-semibold text-heading mb-4 text-center">
              Confirm Deletion
            </h3>
            <p className="text-center text-text-muted mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-error">
                {selectedUser.username || selectedUser.email}
              </span>
              ?
            </p>
            <div className="flex justify-between gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 border border-border text-text hover:bg-bg-alt rounded-full py-2 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-error text-bg rounded-full py-2 font-medium hover:bg-error/90 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="w-full bg-bg-alt p-6 rounded-2xl shadow-lg2 h-full">

      {/* ===== Page Header ===== */}
      <h2 className="dash-title">Users Management</h2>

      {/* ===== Top Controls ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-6">
        <button
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-bg hover:bg-primary/90 transition-all font-medium"
          onClick={() => setShowAddModal(true)}
        >
          <UserPlus size={18} /> Add New User
        </button>

        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-2.5 text-text-muted size-5" />
          <input
            onChange={handleSearch}
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm bg-bg-alt"
          />
        </div>
      </div>

      {/* ===== Users Table ===== */}
      <div className="w-full p-6 rounded-2xl shadow-inner mt-6">
        {filteredUsers?.length > 0 ? (
          <div className="bg-card mt-3 md:px-6 px-2 py-5 scrollbar-hide overflow-auto rounded-2xl shadow-inner2">
            <div className="overflow-x-auto rounded-xl scrollbar-hide border border-border shadow-sm">
              <table className="min-w-full border-collapse">
                <thead className="bg-bg-alt sticky top-0 z-10">
                  <tr className="text-left text-sm text-text-muted">
                    <th className="py-3 px-4">#</th>
                    <th className="py-3 px-4">Username</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Joined</th>
                    <th className="py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user, index) => (
                    <tr
                      key={user.id}
                      className="transition-all hover:bg-primary-light/40"
                    >
                      <td className="py-3 px-4">{index + 1}</td>
                      <td className="py-3 px-4 font-medium text-heading">
                        {user.username || "—"}
                      </td>
                      <td className="py-3 px-4">{user.email || "—"}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.role === "admin"
                              ? "bg-success-bg text-success"
                              : "bg-info-bg text-info"
                          }`}
                        >
                          {user.role || "user"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-text-muted">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString()
                          : "—"}
                      </td>
                      <td className="py-3 px-4 flex gap-4">

                        <button
                          disabled={user.role === "admin"}
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                          className="text-error bg-error-bg hover:text-error-bg hover:bg-error cursor-pointer px-3 py-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState/>
        )}
      </div>

    </div>
    </div>
  );
}
