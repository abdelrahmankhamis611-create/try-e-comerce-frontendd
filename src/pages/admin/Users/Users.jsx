import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

import useAdminUsers from "../../../features/adminUsers/hooks/useAdminUsers";

import "./Users.css";

function Users() {
const {
fetchUsers,
handleCreateUser,
handleUpdateUser,
handleDeleteUser,
} = useAdminUsers();

const {
users,
loading,
error,
} = useSelector(
(state) => state.adminUsers
);

const [showEditModal, setShowEditModal] = useState(false);
const [selectedUser, setSelectedUser] = useState(null);

const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [role, setRole] = useState("user");

const [saving, setSaving] = useState(false);

const [showCreateModal, setShowCreateModal] = useState(false);

const [createName, setCreateName] = useState("");
const [createEmail, setCreateEmail] = useState("");
const [createPassword, setCreatePassword] = useState("");
const [createPasswordConfirm, setCreatePasswordConfirm] =
useState("");
const [createPhone, setCreatePhone] = useState("");
const [createRole, setCreateRole] = useState("user");

const [creating, setCreating] = useState(false);

const [deletingUserId, setDeletingUserId] = useState(null);

useEffect(() => {
fetchUsers();
}, [fetchUsers]);

const openEditModal = (user) => {
setSelectedUser(user);


setName(user.name || "");
setEmail(user.email || "");
setPhone(user.phone || "");
setRole(user.role || "user");

setShowEditModal(true);


};

const closeEditModal = () => {
if (saving) {
return;
}


setShowEditModal(false);

setSelectedUser(null);

setName("");
setEmail("");
setPhone("");
setRole("user");


};

const handleSubmit = async (event) => {
event.preventDefault();


if (!selectedUser) {
  return;
}

if (!name.trim()) {
  Swal.fire({
    icon: "warning",
    title: "Name is required",
  });

  return;
}

if (!email.trim()) {
  Swal.fire({
    icon: "warning",
    title: "Email is required",
  });

  return;
}

const userData = {
  name: name.trim(),
  email: email.trim(),
  phone: phone.trim(),
  role,
};

try {
  setSaving(true);

  await handleUpdateUser(
    selectedUser._id,
    userData
  );

  Swal.fire({
    icon: "success",
    title: "User updated successfully",
    timer: 1500,
    showConfirmButton: false,
  });

  setShowEditModal(false);
  setSelectedUser(null);

  setName("");
  setEmail("");
  setPhone("");
  setRole("user");
} catch (error) {
  Swal.fire({
    icon: "error",
    title: "Update failed",
    text:
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      "Failed to update user",
  });
} finally {
  setSaving(false);
}


};

const openCreateModal = () => {
setCreateName("");
setCreateEmail("");
setCreatePassword("");
setCreatePasswordConfirm("");
setCreatePhone("");
setCreateRole("user");


setShowCreateModal(true);


};

const closeCreateModal = () => {
if (creating) {
return;
}


setShowCreateModal(false);

setCreateName("");
setCreateEmail("");
setCreatePassword("");
setCreatePasswordConfirm("");
setCreatePhone("");
setCreateRole("user");


};

const handleCreateSubmit = async (event) => {
event.preventDefault();


if (!createName.trim()) {
  Swal.fire({
    icon: "warning",
    title: "Name is required",
  });

  return;
}

if (!createEmail.trim()) {
  Swal.fire({
    icon: "warning",
    title: "Email is required",
  });

  return;
}

if (!createPassword) {
  Swal.fire({
    icon: "warning",
    title: "Password is required",
  });

  return;
}

if (createPassword.length < 6) {
  Swal.fire({
    icon: "warning",
    title: "Password must be at least 6 characters",
  });

  return;
}

if (!createPasswordConfirm) {
  Swal.fire({
    icon: "warning",
    title: "Password confirmation is required",
  });

  return;
}

if (createPassword !== createPasswordConfirm) {
  Swal.fire({
    icon: "warning",
    title: "Passwords do not match",
  });

  return;
}

const userData = {
  name: createName.trim(),
  email: createEmail.trim(),
  password: createPassword,
  passwordConfirm: createPasswordConfirm,
  phone: createPhone.trim(),
  role: createRole,
};

try {
  setCreating(true);

  await handleCreateUser(userData);

  Swal.fire({
    icon: "success",
    title: "User created successfully",
    timer: 1500,
    showConfirmButton: false,
  });

  closeCreateModal();
} catch (error) {
  Swal.fire({
    icon: "error",
    title: "Create user failed",
    text:
      error.response?.data?.message ||
      error.response?.data?.errors?.[0]?.msg ||
      "Failed to create user",
  });
} finally {
  setCreating(false);
}


};

const handleDelete = async (user) => {
const result = await Swal.fire({
icon: "warning",
title: "Delete user?",
text: `Are you sure you want to delete ${user.name}?`,
showCancelButton: true,
confirmButtonText: "Yes, delete",
cancelButtonText: "Cancel",
});

if (!result.isConfirmed) {
  return;
}

try {
  setDeletingUserId(user._id);

  await handleDeleteUser(user._id);

  Swal.fire({
    icon: "success",
    title: "User deleted successfully",
    timer: 1500,
    showConfirmButton: false,
  });
} catch (error) {
  Swal.fire({
    icon: "error",
    title: "Delete failed",
    text:
      error.response?.data?.message ||
      "Failed to delete user",
  });
} finally {
  setDeletingUserId(null);
}


};

return ( <main className="admin-users-css-test"> <div className="admin-users-container">


    <div className="admin-users-header">

      <div>
        <h1>Users</h1>

        <p>
          Manage store users
        </p>
      </div>

      <div className="admin-users-header-actions">

        <div className="admin-users-count">
          {users.length} Users
        </div>

        <button
          type="button"
          className="admin-user-add-button"
          onClick={openCreateModal}
          disabled={
            creating ||
            saving ||
            deletingUserId !== null
          }
        >
          + Add User
        </button>

      </div>

    </div>

    {error && (
      <div className="users-error">
        {error}
      </div>
    )}

    <section className="users-list-section">

      <div className="users-list-header">
        <h2>All Users</h2>
      </div>

      {loading && users.length === 0 ? (
        <div className="users-message">
          Loading users...
        </div>
      ) : users.length === 0 ? (
        <div className="users-message">
          No users found.
        </div>
      ) : (
        <div className="users-table-wrapper">

          <table className="users-table">

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
              {users.map(
                (currentUser, index) => (
                  <tr key={currentUser._id}>

                    <td>
                      {index + 1}
                    </td>

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
                      <div className="user-actions">

                        <button
                          type="button"
                          className="user-edit-button"
                          onClick={() =>
                            openEditModal(currentUser)
                          }
                          disabled={
                            saving ||
                            creating ||
                            deletingUserId !== null
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="user-delete-button"
                          onClick={() =>
                            handleDelete(currentUser)
                          }
                          disabled={
                            saving ||
                            creating ||
                            deletingUserId !== null
                          }
                        >
                          {deletingUserId === currentUser._id
                            ? "Deleting..."
                            : "Delete"}
                        </button>

                      </div>
                    </td>

                  </tr>
                )
              )}
            </tbody>

          </table>

        </div>
      )}

    </section>

  </div>

  {showCreateModal && (
    <div className="admin-user-modal-overlay">

      <div className="admin-user-modal">

        <div className="admin-user-modal-header">

          <div>
            <h2>
              Add User
            </h2>

            <p>
              Create a new user account
            </p>
          </div>

          <button
            type="button"
            className="admin-user-modal-close"
            onClick={closeCreateModal}
            disabled={creating}
          >
            ×
          </button>

        </div>

        <form
          className="admin-user-form"
          onSubmit={handleCreateSubmit}
        >

          <div className="admin-user-form-group">

            <label htmlFor="create-user-name">
              Name
            </label>

            <input
              id="create-user-name"
              type="text"
              value={createName}
              onChange={(event) =>
                setCreateName(event.target.value)
              }
              placeholder="Enter user name"
              disabled={creating}
            />

          </div>

          <div className="admin-user-form-group">

            <label htmlFor="create-user-email">
              Email
            </label>

            <input
              id="create-user-email"
              type="email"
              value={createEmail}
              onChange={(event) =>
                setCreateEmail(event.target.value)
              }
              placeholder="Enter user email"
              disabled={creating}
            />

          </div>

          <div className="admin-user-form-group">

            <label htmlFor="create-user-password">
              Password
            </label>

            <input
              id="create-user-password"
              type="password"
              value={createPassword}
              onChange={(event) =>
                setCreatePassword(event.target.value)
              }
              placeholder="Enter password"
              disabled={creating}
            />

          </div>

          <div className="admin-user-form-group">

            <label htmlFor="create-user-password-confirm">
              Confirm Password
            </label>

            <input
              id="create-user-password-confirm"
              type="password"
              value={createPasswordConfirm}
              onChange={(event) =>
                setCreatePasswordConfirm(
                  event.target.value
                )
              }
              placeholder="Confirm password"
              disabled={creating}
            />

          </div>

          <div className="admin-user-form-group">

            <label htmlFor="create-user-phone">
              Phone
            </label>

            <input
              id="create-user-phone"
              type="text"
              value={createPhone}
              onChange={(event) =>
                setCreatePhone(event.target.value)
              }
              placeholder="Enter phone number"
              disabled={creating}
            />

          </div>

          <div className="admin-user-form-group">

            <label htmlFor="create-user-role">
              Role
            </label>

            <select
              id="create-user-role"
              value={createRole}
              onChange={(event) =>
                setCreateRole(event.target.value)
              }
              disabled={creating}
            >
              <option value="user">
                User
              </option>

              <option value="manager">
                Manager
              </option>

              <option value="admin">
                Admin
              </option>

            </select>

          </div>

          <div className="admin-user-modal-actions">

            <button
              type="button"
              className="admin-user-cancel-button"
              onClick={closeCreateModal}
              disabled={creating}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-user-save-button"
              disabled={creating}
            >
              {creating
                ? "Creating..."
                : "Create User"}
            </button>

          </div>

        </form>

      </div>

    </div>
  )}

  {showEditModal && (
    <div className="admin-user-modal-overlay">

      <div className="admin-user-modal">

        <div className="admin-user-modal-header">

          <div>
            <h2>
              Edit User
            </h2>

            <p>
              Update user information
            </p>
          </div>

          <button
            type="button"
            className="admin-user-modal-close"
            onClick={closeEditModal}
            disabled={saving}
          >
            ×
          </button>

        </div>

        <form
          className="admin-user-form"
          onSubmit={handleSubmit}
        >

          <div className="admin-user-form-group">

            <label htmlFor="user-name">
              Name
            </label>

            <input
              id="user-name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Enter user name"
              disabled={saving}
            />

          </div>

          <div className="admin-user-form-group">

            <label htmlFor="user-email">
              Email
            </label>

            <input
              id="user-email"
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="Enter user email"
              disabled={saving}
            />

          </div>

          <div className="admin-user-form-group">

            <label htmlFor="user-phone">
              Phone
            </label>

            <input
              id="user-phone"
              type="text"
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              placeholder="Enter phone number"
              disabled={saving}
            />

          </div>

          <div className="admin-user-form-group">

            <label htmlFor="user-role">
              Role
            </label>

            <select
              id="user-role"
              value={role}
              onChange={(event) =>
                setRole(event.target.value)
              }
              disabled={saving}
            >
              <option value="user">
                User
              </option>

              <option value="manager">
                Manager
              </option>

              <option value="admin">
                Admin
              </option>

            </select>

          </div>

          <div className="admin-user-modal-actions">

            <button
              type="button"
              className="admin-user-cancel-button"
              onClick={closeEditModal}
              disabled={saving}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-user-save-button"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  )}

</main>

);
}

export default Users;
