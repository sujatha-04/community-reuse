import "./User.css";
import axios from "axios";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const User = () => {
  const username = localStorage.getItem("username");

  const [user, setUser] = useState(null);
  const [section, setSection] = useState("profile");

  const [items, setItems] = useState([]);
  const [myItems, setMyItems] = useState([]);
  const [requests, setRequests] = useState([]);

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [requestedItems, setRequestedItems] = useState([]);

  /* ================= LOAD USER PROFILE ================= */
  const loadUser = async () => {
    if (!username) return;

    const res = await axios.get(
      `http://127.0.0.1:8000/api/userdetails/?username=${username}`
    );
    setUser(res.data.user);
  };

  /* ================= LOAD ALL ITEMS (EXCEPT MINE) ================= */
  const loadItems = async () => {
  if (!username) return;

  const res = await axios.get(
    `http://127.0.0.1:8000/api/items/?username=${username}`
  );

  setItems(res.data.items || []);
};
  /* ================= LOAD MY ITEMS ================= */
  const loadMyItems = async () => {
    if (!username) return;

    const res = await axios.get(
      `http://127.0.0.1:8000/api/user/my-items/?username=${username}`
    );
    setMyItems(res.data.items || []);
  };

  /* ================= LOAD REQUESTS (OWNER SIDE) ================= */
  const loadRequests = async () => {
    const res = await axios.get(
      `http://127.0.0.1:8000/api/item-requests/?username=${username}`
    );
    setRequests(res.data.requests || []);
  };

  /* ================= ADD ITEM ================= */
  const addItem = async () => {
    if (!itemName || !description) {
      alert("All fields required");
      return;
    }

    await axios.post("http://127.0.0.1:8000/api/add-item/", {
      username,
      item_name: itemName,
      description,
    });

    alert("Item added successfully");
    setItemName("");
    setDescription("");
    loadMyItems();
    loadItems();
  };

  /* ================= REQUEST ITEM ================= */
  const requestItem = async (itemId) => {
    await axios.post("http://127.0.0.1:8000/api/request-item/", {
      username,
      item_id: itemId,
    });

    alert("Request sent to owner");
  };

  /* ================= APPROVE / REJECT REQUEST ================= */
  const updateRequest = async (id, status) => {
    await axios.post("http://127.0.0.1:8000/api/update-request/", {
      request_id: id,
      status,
    });

    loadRequests();
  };

  const loadRequestedItems = async () => {
  if (!username) return;

  const res = await axios.get(
    `http://127.0.0.1:8000/api/user/requested-items/?username=${username}`
  );

  setRequestedItems(res.data.items || []);
};
const hasRequested = (itemId) => {
  return requestedItems.some(r => r.item_id === itemId);
};


  useEffect(() => {
    loadUser();
    loadItems();
    loadMyItems();
    loadRequests();
    loadRequestedItems(); 
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
        <div className="user-layout">

          {/* ================= SIDEBAR ================= */}
          <aside className="user-sidebar">
            <button
              className={section === "profile" ? "active" : ""}
              onClick={() => setSection("profile")}
            >
              My Profile
            </button>

            <button
              className={section === "add" ? "active" : ""}
              onClick={() => setSection("add")}
            >
              Add Item
            </button>

            <button
              className={section === "items" ? "active" : ""}
              onClick={() => setSection("items")}
            >
              Browse Items
            </button>

            <button
              className={section === "myitems" ? "active" : ""}
              onClick={() => setSection("myitems")}
            >
              My Items
            </button>
            <button
              className={section === "requested" ? "active" : ""}
              onClick={() => setSection("requested")}
            >
              Requested Items
            </button>

          </aside>

          {/* ================= CONTENT ================= */}
          <section className="user-content">

            {/* PROFILE */}
            {section === "profile" && user && (
              <div className="user-box">
                <h2>My Profile</h2>
                <table className="user-table">
                  <tbody>
                    <tr><th>Username</th><td>{user.username}</td></tr>
                    <tr><th>Email</th><td>{user.email}</td></tr>
                    <tr><th>Mobile</th><td>{user.mobile}</td></tr>
                    <tr><th>Address</th><td>{user.address}</td></tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* ADD ITEM */}
            {section === "add" && (
              <div className="user-box">
                <h2>Add Item</h2>

                <input
                  type="text"
                  placeholder="Item Name"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />

                <textarea
                  placeholder="Item Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <button className="submit-btn" onClick={addItem}>
                  Add Item
                </button>
              </div>
            )}

            {/* BROWSE ITEMS (EXCEPT OWN ITEMS) */}
           {section === "items" && (
  <div className="user-box">
    <h2>Available Items</h2>

    <table className="user-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Description</th>
          <th>Posted By</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {items.map((i, idx) => (
          <tr key={idx}>
            <td>{i.item_name}</td>
            <td>{i.description}</td>
            <td>{i.username}</td>
            <td>
              <button
                className="submit-btn"
                disabled={hasRequested(i.id)}
                onClick={() => requestItem(i.id)}
              >
                {hasRequested(i.id) ? "Requested" : "Request"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}

                

            {/* MY ITEMS + REQUESTS */}
            {section === "myitems" && (
              <div className="user-box">
                <h2>My Items</h2>

                <table className="user-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Description</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {myItems.map((i, idx) => (
                      <tr key={idx}>
                        <td>{i.item_name}</td>
                        <td>{i.description}</td>
                        <td>{i.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <h3>Item Requests</h3>

                <table className="user-table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Requester</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {requests.map((r, i) => (
                      <tr key={i}>
                        <td>{r.item_name}</td>
                        <td>{r.requester}</td>
                        <td>{r.status}</td>
                        <td>
                          {r.status === "pending" && (
                            <>
                              <button onClick={() => updateRequest(r.id, "approved")}>
                                Approve
                              </button>
                              <button onClick={() => updateRequest(r.id, "rejected")}>
                                Reject
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
           
           {/* REQUESTED ITEMS (MY REQUEST STATUS) */}
      {section === "requested" && (
        <div className="user-box">
          <h2>My Requested Items</h2>

          <table className="user-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Contact</th>
              </tr>
            </thead>
              <tbody>
                {requestedItems.map((r, i) => (
                  <tr key={i}>
                    <td>{r.item_name}</td>
                    <td>{r.owner}</td>
                    <td>{r.status}</td>

                    <td>
                      {r.status === "approved" ? (
                        <>
                          📞 {r.owner_mobile}
                          <br />
                          📍 {r.owner_address}
                        </>
                      ) : (
                        "Not available"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
          </section>
        </div>
      </main>

      <footer>
        <h4>&copy; 2025 All Rights Reserved SAK Informatics</h4>
      </footer>
    </>
  );
};

export default User;
