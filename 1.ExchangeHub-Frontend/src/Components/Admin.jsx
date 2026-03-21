import "./Admin.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const Admin = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);

  /* ================= LOAD USERS ================= */
  const loadUsers = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/`
      );
      setUsers(res.data.users || []);
    } catch (err) {
      console.error("User load error", err);
    }
  };

  /* ================= APPROVE USER ================= */
  const approveUser = async (username) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/approve/`,
        { username }
      );
      alert("User approved successfully");
      loadUsers();
    } catch (err) {
      console.error("Approve error", err);
    }
  };

  /* ================= LOAD ITEMS ================= */
  const loadItems = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/items/`
      );
      setItems(res.data.items || []);
    } catch (err) {
      console.error("Items load error", err);
    }
  };

  /* ================= REMOVE ITEM ================= */
  const removeItem = async (id) => {
    if (!window.confirm("Remove this item?")) return;

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/remove-item/`,
        { item_id: id }
      );
      alert("Item removed");
      loadItems();
    } catch (err) {
      console.error("Remove item error", err);
    }
  };

  useEffect(() => {
    loadUsers();
    loadItems();
  }, []);

  return (
    <>
      <header>
        <div id="brand-name">
          <h1>Community Reuse & Exchange Hub</h1>
        </div>
        <div className="components">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/login">Logout</NavLink>
        </div>
      </header>

      <main>
        <div className="adminPage-layout">

          {/* ================= SIDEBAR ================= */}
          <aside className="adminPage-sidebar">
            <button
              className={activeSection === "dashboard" ? "active" : ""}
              onClick={() => setActiveSection("dashboard")}
            >
              Dashboard
            </button>

            <button
              className={activeSection === "users" ? "active" : ""}
              onClick={() => setActiveSection("users")}
            >
              Approve Users
            </button>

            <button
              className={activeSection === "items" ? "active" : ""}
              onClick={() => setActiveSection("items")}
            >
              Manage Items
            </button>
          </aside>

          {/* ================= CONTENT ================= */}
          <section className="adminPage-content">

            {/* ================= DASHBOARD ================= */}
            {activeSection === "dashboard" && (
              <>
                <h2>Admin Dashboard</h2>
                <div className="adminPage-cards">
                  <div className="adminPage-card">
                    <h3>Total Users</h3>
                    <p>{users.length}</p>
                  </div>

                  <div className="adminPage-card">
                    <h3>Total Items</h3>
                    <p>{items.length}</p>
                  </div>
                </div>
              </>
            )}

            {/* ================= USERS ================= */}
            {activeSection === "users" && (
              <>
                <h2>User Approvals</h2>

                <table className="adminPage-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Approved</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.map((u, i) => (
                      <tr key={i}>
                        <td>{u.username}</td>
                        <td>{u.email}</td>
                        <td>N/A</td>
                        <td>
                          <span className={`badge ${u.is_approved ? 'badge-success' : 'badge-pending'}`}>
                            {u.is_approved ? '✓ Approved' : '⏳ Pending'}
                          </span>
                        </td>
                        <td>
                          {!u.is_approved ? (
                            <button
                              className="adminPage-approveBtn"
                              onClick={() => approveUser(u.username)}
                              title="Click to approve this user"
                            >
                              Approve
                            </button>
                          ) : (
                            <span className="badge badge-success">Verified</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {/* ================= ITEMS ================= */}
            {activeSection === "items" && (
              <>
                <h2>Manage Items</h2>

                <table className="adminPage-table">
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Description</th>
                      <th>Posted By</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i}>
                        <td>{item.item_name}</td>
                        <td>{item.description}</td>
                        <td>{item.username}</td>
                        <td>Active</td>
                        <td>
                          <button
                            className="adminPage-approveBtn"
                            onClick={() => removeItem(item.id)}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

          </section>
        </div>
      </main>

      <footer>
        <h4>2025@ ALL RIGHTS RESERVED TO BATCH-10_CREH</h4>
      </footer>
    </>
  );
};

export default Admin;
