import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

import useAdminUsers from "../../../features/adminUsers/hooks/useAdminUsers";

/* =========================================================
   الـ CSS هنا جوه الملف نفسه (بيتحمّل مع الـ JS دايماً)
   كل القواعد متقيّدة بـ .usr-x عشان محدش يعمل لها override
   ========================================================= */
const css = `
.usr-x {
  min-height: 100vh;
  padding: 32px;
  background: #f3f4f6;
  box-sizing: border-box;
  font-family: inherit;
}

.usr-x *,
.usr-x *::before,
.usr-x *::after {
  box-sizing: border-box;
}

.usr-x .usr-shell {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.usr-x .usr-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 28px;
}

.usr-x .usr-topbar h1 {
  margin: 0;
  color: #111827;
  font-size: 30px;
  font-weight: 700;
  line-height: 1.2;
}

.usr-x .usr-topbar p {
  margin: 8px 0 0;
  color: #6b7280;
  font-size: 15px;
}

.usr-x .usr-toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
}

.usr-x .usr-total {
  padding: 11px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.usr-x .usr-add {
  min-height: 42px;
  padding: 0 18px;
  border: 0;
  border-radius: 8px;
  background: #111827;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: .2s ease;
}

.usr-x .usr-add:hover:not(:disabled) {
  background: #1f2937;
  transform: translateY(-1px);
}

.usr-x .usr-add:disabled {
  opacity: .55;
  cursor: not-allowed;
}

.usr-x .usr-error {
  margin-bottom: 20px;
  padding: 14px 16px;
  border: 1px solid #fecaca;
  border-radius: 8px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 14px;
}

.usr-x .usr-card {
  width: 100%;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
}

.usr-x .usr-card-head {
  display: flex;
  align-items: center;
  min-height: 64px;
  padding: 0 22px;
  border-bottom: 1px solid #e5e7eb;
}

.usr-x .usr-card-head h2 {
  margin: 0;
  color: #111827;
  font-size: 18px;
  font-weight: 650;
}

.usr-x .usr-status {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 180px;
  padding: 24px;
  color: #6b7280;
  font-size: 15px;
}

.usr-x .usr-table-box {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
}

.usr-x .usr-table {
  width: 100%;
  min-width: 1050px;
  border-collapse: collapse;
  table-layout: auto;
}

.usr-x .usr-table th {
  height: 52px;
  padding: 0 16px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  color: #6b7280;
  font-size: 12px;
  font-weight: 700;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
}

.usr-x .usr-table td {
  height: 62px;
  padding: 10px 16px;
  border-bottom: 1px solid #f0f0f0;
  color: #374151;
  font-size: 14px;
  vertical-align: middle;
  white-space: nowrap;
  text-align: left;
}

.usr-x .usr-table tbody tr:hover {
  background: #f9fafb;
}

.usr-x .usr-table tbody tr:last-child td {
  border-bottom: 0;
}

.usr-x .usr-table td strong {
  color: #111827;
  font-weight: 600;
}

.usr-x .usr-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.usr-x .usr-edit,
.usr-x .usr-delete {
  min-width: 68px;
  height: 34px;
  padding: 0 11px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: .2s ease;
  background: #fff;
}

.usr-x .usr-edit {
  border: 1px solid #d1d5db;
  color: #374151;
}

.usr-x .usr-edit:hover:not(:disabled) {
  border-color: #9ca3af;
  background: #f9fafb;
}

.usr-x .usr-delete {
  border: 1px solid #fecaca;
  color: #dc2626;
}

.usr-x .usr-delete:hover:not(:disabled) {
  border-color: #fca5a5;
  background: #fef2f2;
}

.usr-x .usr-edit:disabled,
.usr-x .usr-delete:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.usr-x .usr-layer {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(17,24,39,.6);
  overflow-y: auto;
}

.usr-x .usr-modal {
  width: 100%;
  max-width: 540px;
  max-height: calc(100vh - 48px);
  margin: auto;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  box-shadow:
    0 20px 40px rgba(0,0,0,.16),
    0 8px 16px rgba(0,0,0,.08);
  overflow-y: auto;
}

.usr-x .usr-modal-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.usr-x .usr-modal-head h2 {
  margin: 0;
  color: #111827;
  font-size: 21px;
  font-weight: 700;
}

.usr-x .usr-modal-head p {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 13px;
}

.usr-x .usr-close {
  flex-shrink: 0;
  width: 34px;
  height: 34px;
  padding: 0;
  border: 1px solid #e5e7eb;
  border-radius: 7px;
  background: #fff;
  color: #6b7280;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}

.usr-x .usr-close:hover:not(:disabled) {
  background: #f3f4f6;
  color: #111827;
}

.usr-x .usr-close:disabled {
  opacity: .5;
  cursor: not-allowed;
}

.usr-x .usr-form {
  display: flex;
  flex-direction: column;
  gap: 17px;
  padding: 24px;
}

.usr-x .usr-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.usr-x .usr-field label {
  color: #374151;
  font-size: 13px;
  font-weight: 600;
}

.usr-x .usr-field input,
.usr-x .usr-field select {
  width: 100%;
  height: 44px;
  padding: 0 12px;
  border: 1px solid #d1d5db;
  border-radius: 7px;
  outline: none;
  background: #fff;
  color: #111827;
  font-family: inherit;
  font-size: 14px;
  transition: border-color .2s ease, box-shadow .2s ease;
}

.usr-x .usr-field input::placeholder {
  color: #9ca3af;
}

.usr-x .usr-field input:focus,
.usr-x .usr-field select:focus {
  border-color: #6b7280;
  box-shadow: 0 0 0 3px rgba(107,114,128,.12);
}

.usr-x .usr-field input:disabled,
.usr-x .usr-field select:disabled {
  background: #f3f4f6;
  cursor: not-allowed;
}

.usr-x .usr-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 6px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.usr-x .usr-cancel,
.usr-x .usr-save {
  min-width: 110px;
  height: 42px;
  padding: 0 16px;
  border-radius: 7px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: .2s ease;
}

.usr-x .usr-cancel {
  border: 1px solid #d1d5db;
  background: #fff;
  color: #374151;
}

.usr-x .usr-cancel:hover:not(:disabled) {
  background: #f9fafb;
}

.usr-x .usr-save {
  border: 1px solid #111827;
  background: #111827;
  color: #fff;
}

.usr-x .usr-save:hover:not(:disabled) {
  background: #1f2937;
}

.usr-x .usr-cancel:disabled,
.usr-x .usr-save:disabled {
  opacity: .55;
  cursor: not-allowed;
}

/* =========================================================
   SweetAlert فوق الـ Modal
   ========================================================= */

.swal2-container {
  z-index: 100000 !important;
}

@media (max-width: 1110px) {
  .usr-x {
    padding: 24px;
  }
}

@media (max-width: 768px) {
  .usr-x {
    padding: 18px 14px;
  }

  .usr-x .usr-topbar {
    align-items: flex-start;
    flex-direction: column;
    gap: 18px;
  }

  .usr-x .usr-topbar h1 {
    font-size: 25px;
  }

  .usr-x .usr-toolbar {
    width: 100%;
    justify-content: space-between;
  }

  .usr-x .usr-total {
    flex: 1;
  }

  .usr-x .usr-add {
    flex-shrink: 0;
  }

  .usr-x .usr-card-head {
    padding: 0 16px;
  }

  .usr-x .usr-layer {
    align-items: flex-start;
    padding: 14px;
  }

  .usr-x .usr-modal {
    max-height: calc(100vh - 28px);
    border-radius: 10px;
  }

  .usr-x .usr-modal-head {
    padding: 18px;
  }

  .usr-x .usr-form {
    gap: 15px;
    padding: 18px;
  }

  .usr-x .usr-buttons {
    flex-direction: column-reverse;
  }

  .usr-x .usr-cancel,
  .usr-x .usr-save {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .usr-x {
    padding: 14px 10px;
  }

  .usr-x .usr-topbar h1 {
    font-size: 23px;
  }

  .usr-x .usr-topbar p {
    font-size: 13px;
  }

  .usr-x .usr-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .usr-x .usr-total {
    width: 100%;
    text-align: center;
  }

  .usr-x .usr-add {
    width: 100%;
  }

  .usr-x .usr-card-head {
    min-height: 58px;
  }

  .usr-x .usr-card-head h2 {
    font-size: 16px;
  }

  .usr-x .usr-layer {
    padding: 10px;
  }

  .usr-x .usr-modal {
    max-height: calc(100vh - 20px);
  }

  .usr-x .usr-modal-head {
    padding: 16px;
  }

  .usr-x .usr-modal-head h2 {
    font-size: 19px;
  }

  .usr-x .usr-form {
    padding: 16px;
  }

  .usr-x .usr-field input,
  .usr-x .usr-field select {
    height: 42px;
  }
}
`;

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  role: "user",
  password: "",
  passwordConfirm: "",
};

const getErrorMessage = (error, fallback) =>
  error.response?.data?.message ||
  error.response?.data?.errors?.[0]?.msg ||
  fallback;

const warn = (title) => Swal.fire({ icon: "warning", title });

/* =========================================================
   Modal (بيتستخدم للإضافة والتعديل)
   ========================================================= */
function UserModal({
  mode,
  form,
  setForm,
  busy,
  onClose,
  onSubmit,
}) {
  const isCreate = mode === "create";

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  return (
    <div className="usr-layer">
      <div className="usr-modal">
        <div className="usr-modal-head">
          <div>
            <h2>{isCreate ? "Add User" : "Edit User"}</h2>

            <p>
              {isCreate
                ? "Create a new user account"
                : "Update user information"}
            </p>
          </div>

          <button
            type="button"
            className="usr-close"
            onClick={onClose}
            disabled={busy}
          >
            ×
          </button>
        </div>

        <form className="usr-form" onSubmit={onSubmit}>
          <div className="usr-field">
            <label htmlFor={`${mode}-name`}>Name</label>

            <input
              id={`${mode}-name`}
              type="text"
              value={form.name}
              onChange={update("name")}
              placeholder="Enter user name"
              disabled={busy}
            />
          </div>

          <div className="usr-field">
            <label htmlFor={`${mode}-email`}>Email</label>

            <input
              id={`${mode}-email`}
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="Enter user email"
              disabled={busy}
            />
          </div>

          {isCreate && (
            <>
              <div className="usr-field">
                <label htmlFor="create-password">Password</label>

                <input
                  id="create-password"
                  type="password"
                  value={form.password}
                  onChange={update("password")}
                  placeholder="Enter password"
                  disabled={busy}
                />
              </div>

              <div className="usr-field">
                <label htmlFor="create-password-confirm">
                  Confirm Password
                </label>

                <input
                  id="create-password-confirm"
                  type="password"
                  value={form.passwordConfirm}
                  onChange={update("passwordConfirm")}
                  placeholder="Confirm password"
                  disabled={busy}
                />
              </div>
            </>
          )}

          <div className="usr-field">
            <label htmlFor={`${mode}-phone`}>Phone</label>

            <input
              id={`${mode}-phone`}
              type="text"
              value={form.phone}
              onChange={update("phone")}
              placeholder="Enter phone number"
              disabled={busy}
            />
          </div>

          <div className="usr-field">
            <label htmlFor={`${mode}-role`}>Role</label>

            <select
              id={`${mode}-role`}
              value={form.role}
              onChange={update("role")}
              disabled={busy}
            >
              <option value="user">User</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="usr-buttons">
            <button
              type="button"
              className="usr-cancel"
              onClick={onClose}
              disabled={busy}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="usr-save"
              disabled={busy}
            >
              {isCreate
                ? busy
                  ? "Creating..."
                  : "Create User"
                : busy
                ? "Saving..."
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   Users Page
   ========================================================= */
function Users() {
  const {
    fetchUsers,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
  } = useAdminUsers();

  const { users, loading, error } = useSelector(
    (state) => state.adminUsers
  );

  // modal: null | "create" | "edit"
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [selectedUser, setSelectedUser] = useState(null);

  const [saving, setSaving] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState(null);

  const busy = saving || deletingUserId !== null;

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* ---------- open / close ---------- */

  const closeModal = () => {
    if (saving) return;

    setModal(null);
    setSelectedUser(null);
    setForm(emptyForm);
  };

  const openCreateModal = () => {
    setForm(emptyForm);
    setSelectedUser(null);
    setModal("create");
  };

  const openEditModal = (user) => {
    setSelectedUser(user);

    setForm({
      ...emptyForm,
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      role: user.role || "user",
    });

    setModal("edit");
  };

  /* ---------- update ---------- */

  const submitEdit = async () => {
    if (!selectedUser) return;

    if (!form.name.trim()) return warn("Name is required");
    if (!form.email.trim()) return warn("Email is required");

    const userData = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      role: form.role,
    };

    try {
      setSaving(true);

      await handleUpdateUser(selectedUser._id, userData);

      Swal.fire({
        icon: "success",
        title: "User updated successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      setModal(null);
      setSelectedUser(null);
      setForm(emptyForm);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update failed",
        text: getErrorMessage(err, "Failed to update user"),
      });
    } finally {
      setSaving(false);
    }
  };

  /* ---------- create ---------- */

  const submitCreate = async () => {
    if (!form.name.trim()) return warn("Name is required");
    if (!form.email.trim()) return warn("Email is required");
    if (!form.password) return warn("Password is required");

    if (form.password.length < 6) {
      return warn("Password must be at least 6 characters");
    }

    if (!form.passwordConfirm) {
      return warn("Password confirmation is required");
    }

    if (form.password !== form.passwordConfirm) {
      return warn("Passwords do not match");
    }

    const userData = {
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      passwordConfirm: form.passwordConfirm,
      phone: form.phone.trim(),
      role: form.role,
    };

    try {
      setSaving(true);

      await handleCreateUser(userData);

      Swal.fire({
        icon: "success",
        title: "User created successfully",
        timer: 1500,
        showConfirmButton: false,
      });

      setModal(null);
      setForm(emptyForm);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Create user failed",
        text: getErrorMessage(err, "Failed to create user"),
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (modal === "create") {
      submitCreate();
    } else {
      submitEdit();
    }
  };

  /* ---------- delete ---------- */

  const handleDelete = async (user) => {
    const result = await Swal.fire({
      icon: "warning",
      title: "Delete user?",
      text: `Are you sure you want to delete ${user.name}?`,
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      setDeletingUserId(user._id);

      await handleDeleteUser(user._id);

      Swal.fire({
        icon: "success",
        title: "User deleted successfully",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Delete failed",
        text:
          err.response?.data?.message ||
          "Failed to delete user",
      });
    } finally {
      setDeletingUserId(null);
    }
  };

  /* ---------- render ---------- */

  return (
    <div className="usr-x">
      <style>{css}</style>

      <div className="usr-shell">
        <div className="usr-topbar">
          <div>
            <h1>Users</h1>
            <p>Manage store users</p>
          </div>

          <div className="usr-toolbar">
            <div className="usr-total">
              {users.length} Users
            </div>

            <button
              type="button"
              className="usr-add"
              onClick={openCreateModal}
              disabled={busy}
            >
              + Add User
            </button>
          </div>
        </div>

        {error && (
          <div className="usr-error">
            {error}
          </div>
        )}

        <section className="usr-card">
          <div className="usr-card-head">
            <h2>All Users</h2>
          </div>

          {loading && users.length === 0 ? (
            <div className="usr-status">
              Loading users...
            </div>
          ) : users.length === 0 ? (
            <div className="usr-status">
              No users found.
            </div>
          ) : (
            <div className="usr-table-box">
              <table className="usr-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((currentUser, index) => (
                    <tr key={currentUser._id}>
                      <td>{index + 1}</td>

                      <td>
                        <strong>
                          {currentUser.name}
                        </strong>
                      </td>

                      <td>
                        {currentUser.email}
                      </td>

                      <td>
                        {currentUser.phone || "-"}
                      </td>

                      <td>
                        {currentUser.role}
                      </td>

                      <td>
                        {currentUser.active
                          ? "Active"
                          : "Inactive"}
                      </td>

                      <td>
                        {currentUser.createdAt
                          ? new Date(
                              currentUser.createdAt
                            ).toLocaleDateString()
                          : "-"}
                      </td>

                      <td>
                        <div className="usr-actions">
                          <button
                            type="button"
                            className="usr-edit"
                            onClick={() =>
                              openEditModal(currentUser)
                            }
                            disabled={busy}
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            className="usr-delete"
                            onClick={() =>
                              handleDelete(currentUser)
                            }
                            disabled={busy}
                          >
                            {deletingUserId ===
                            currentUser._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {modal && (
        <UserModal
          mode={modal}
          form={form}
          setForm={setForm}
          busy={saving}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default Users;