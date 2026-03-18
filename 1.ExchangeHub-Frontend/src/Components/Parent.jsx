import "./Parent.css";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

const Parent = () => {
  const [parent, setParent] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  
  const [children, setChildren] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);


  // Load Staff Details
  const loadParent = async () => {
    const username = localStorage.getItem("username");
    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/parentdetails/?username=${username}`
    );
    setParent(res.data.parent);
  };
 
  const loadChildren = async () => {
  const username = localStorage.getItem("username");
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/parent/children/?username=${username}`
  );
  setChildren(res.data.children || []);
};
 
const loadAttendance = async (student_id) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/parent/child-attendance/?student_id=${student_id}`
  );
  setAttendance(res.data.attendance || []);
};

const loadGrades = async (student_id) => {
  const res = await axios.get(
    `${import.meta.env.VITE_API_URL}/api/parent/child-grades/?student_id=${student_id}`
  );
  setGrades(res.data.grades || []);
};

  useEffect(() => {
  loadParent();
  loadChildren();
}, []);

  return (
    <>
      <header>
        <div id="brand-name">
          <h1>Online Class Room</h1>
        </div>

        <div className="components">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/login">Logout</NavLink>
        </div>
      </header>
      <main >
        <div className="staff-layout2">
    
        <aside className="sidebar2">
          <button
            className={activeSection === "profile" ? "active" : ""}
            onClick={() => setActiveSection("profile")}
          >
            My Profile
          </button>
           <button
            className={activeSection === "children" ? "active" : ""}
            onClick={() => setActiveSection("children")}
          >
            My Children
          </button>

          <button
            className={activeSection === "childAttendance" ? "active" : ""}
            onClick={() => setActiveSection("childAttendance")}
          >
            Child Attendance
          </button>

          <button
            className={activeSection === "childGrades" ? "active" : ""}
            onClick={() => setActiveSection("childGrades")}
          >
            Child Marks
          </button>

        </aside>
        <section className="staff-content">
          {activeSection === "profile" && parent && (
            <div className="section-box2">
              <h2>My Profile</h2>
              <table border="1" id="provider-table">
                <tbody>
                  <tr><th>Parent name</th><td>{parent.username}</td></tr>
                   <tr><th>Password</th><td>{parent.password}</td></tr>
                  <tr><th>Email</th><td>{parent.email}</td></tr>
                  <tr><th>Mobile</th><td>{parent.mobile}</td></tr>
                  <tr><th>Address</th><td>{parent.address}</td></tr>
                </tbody>
              </table>
            </div>)}

          {activeSection === "children" && (
  <div className="section-box2">
    <h2>My Children</h2>

    <table id="provider-table">
      <thead>
        <tr>
          <th>Student name</th>
          <th>Email</th>
          <th>Mobile</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {children.map((c, i) => (
          <tr key={i}>
            <td>{c.username}</td>
            <td>{c.email}</td>
            <td>{c.mobile}</td>

            <td>
              <button
                className="progress-btn"
                onClick={() => {
                  setSelectedChild(c);
                  loadAttendance(c.student_id);
                  loadGrades(c.student_id);
                  setActiveSection("childProgress");
                }}
              >
                Progress
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
 
 {activeSection === "childProgress" && selectedChild && (
  <div className="section-box2">
    <h2>{selectedChild.username}'s Progress</h2>

    <h3 style={{ marginTop: "20px",textAlign:"center",padding:"1rem"}}>Attendance</h3>

    {attendance.length === 0 ? (
      <p>No attendance records found.</p>
    ) : (
      <table id="provider-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((a, i) => (
            <tr key={i}>
              <td>{a.date}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}

    <h3 style={{ marginTop: "20px",textAlign:"center",padding:"1rem"}}>Marks</h3>

    {grades.length === 0 ? (
      <p>No grades available.</p>
    ) : (
      <table id="provider-table">
        <thead>
          <tr>
            <th>Assignment</th>
            <th>Marks</th>
            <th>Feedback</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((g, i) => (
            <tr key={i}>
              <td>{g.assignment_title}</td>
              <td>{g.marks}</td>
              <td>{g.feedback}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}

  </div>
)}


           {activeSection === "childAttendance" && selectedChild && (
  <div className="section-box2">
    <h2>{selectedChild.username}'s Attendance</h2>

    {attendance.length === 0 ? (
      <p>No attendance records found.</p>
    ) : (
      <table id="provider-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.map((a, i) => (
            <tr key={i}>
              <td>{a.date}</td>
              <td>{a.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)}
{activeSection === "childGrades" && selectedChild && (
  <div className="section-box2">
    <h2>{selectedChild.username}'s Marks</h2>

    {grades.length === 0 ? (
      <p>No grades available.</p>
    ) : (
      <table id="provider-table">
        <thead>
          <tr>
            <th>Assignment</th>
            <th>Marks</th>
            <th>Feedback</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((g, i) => (
            <tr key={i}>
              <td>{g.assignment_title}</td>
              <td>{g.marks}</td>
              <td>{g.feedback}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </div>
)}


        </section>
        </div>
      </main>
      <footer>
        <h4>© 2025 All Rights Reserved SAK Informatics</h4>
      </footer>
    </>
  );
};
export default Parent;