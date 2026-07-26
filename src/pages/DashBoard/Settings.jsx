import { useState } from "react";
import { Loader2, Lock, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { ThemeToggle } from "../../utils/ThemeToggle";

export default function SettingsPage() {
  const { data:user } = useSelector((state) => state.profile);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSaveChanges = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert("Settings saved successfully!");
    }, 1000);
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    alert("Account deleted (demo action)");
  };

  return (
    <div className="w-full px-4 py-6 min-h-screen">
              <div className="w-full bg-bg-alt p-6 rounded-2xl shadow-lg2 h-full">

      <h2 className="dash-title">Settings</h2>

      <div className="grid gap-6 mt-8">
        {/* General Info */}
        <section className="bg-bg-alt p-6 rounded-2xl shadow-inner2">
          <h3 className="text-lg font-semibold text-heading mb-4">General</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-text-muted">Username</label>
              <input
                disabled
                value={user?.username || ""}
                className="w-full p-2 rounded-lg border border-border bg-bg text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-text-muted">Email</label>
              <input
                disabled
                value={user?.email || ""}
                className="w-full p-2 rounded-lg border border-border bg-bg text-sm"
              />
            </div>
          </div>
        </section>

        {/* Password Change */}
        <section className="bg-bg-alt p-6 rounded-2xl shadow-inner2">
          <h3 className="text-lg font-semibold text-heading mb-4 flex items-center gap-2">
            <Lock size={18} /> Password
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="password"
              placeholder="Current password"
              className="w-full p-2 rounded-lg border border-border bg-bg text-sm focus:border-primary outline-none"
            />
            <input
              type="password"
              placeholder="New password"
              className="w-full p-2 rounded-lg border border-border bg-bg text-sm focus:border-primary outline-none"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full p-2 rounded-lg border border-border bg-bg text-sm focus:border-primary outline-none"
            />
          </div>
          <button
            onClick={handleSaveChanges}
            className="mt-4 bg-primary text-bg font-medium px-6 py-2 rounded-full hover:bg-primary/90 transition-all flex items-center gap-2"
            disabled={saving}
          >
            {saving ? <Loader2 className="animate-spin size-4" /> : "Save Changes"}
          </button>
        </section>

        {/* Theme Switcher */}
        <section className="bg-bg-alt p-6 rounded-2xl shadow-inner2 flex items-center justify-between">

<ThemeToggle>fhi</ThemeToggle>
        </section>

        {/* Danger Zone */}
        <section className="bg-bg-alt p-6 rounded-2xl shadow-inner2">
          <h3 className="text-lg font-semibold text-error flex items-center gap-2">
            <Trash2 size={18} /> Danger Zone
          </h3>
          <p className="text-sm text-text-muted mt-2">
            Deleting your account will permanently remove all data.
          </p>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="mt-4 bg-error text-bg px-6 py-2 rounded-full font-medium hover:bg-error/90 transition-all"
          >
            Delete Account
          </button>
        </section>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-bg-alt p-6 rounded-2xl shadow-lg2 w-[90%] max-w-md">
            <h3 className="text-lg font-semibold text-heading mb-2">
              Confirm Account Deletion
            </h3>
            <p className="text-sm text-text-muted">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-full border border-border text-text-muted hover:bg-bg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 rounded-full bg-error text-bg hover:bg-error/90 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
