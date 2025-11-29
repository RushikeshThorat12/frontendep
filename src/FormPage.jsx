import React from "react";
import { useNavigate } from "react-router-dom";

// Move styles outside the component so they're not recreated on every render
const styles = {
  page: {
    fontFamily: "Arial, sans-serif",
    background: "#eef2f3",
    minHeight: "100vh",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#fff",
    borderBottom: "1px solid #ddd",
    padding: "1rem 1.5rem",
    height: "80px",
    boxSizing: "border-box",
  },
  govLabel: {
    fontWeight: "bold",
    color: "#0b3d91",
    fontSize: "1.2rem",
  },
  topButtons: { display: "flex", gap: "1rem" },
  navBar: {
    background: "#0b3d91",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    padding: "0.5rem 2rem",
    gap: "1rem",
    flexWrap: "wrap",
  },
  navItem: { cursor: "pointer" },
  bannerContainer: {
    position: "relative",
    overflow: "hidden",
    background: "#d9534f",
    padding: "0.72rem 0",
    width: "100%",
    boxSizing: "border-box",
  },
  bannerText: {
    position: "absolute",
    top: 0,
    left: "100%",
    whiteSpace: "nowrap",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1.08rem",
    animation: "slide 16s linear infinite",
  },
  main: { display: "flex", padding: "1.5rem 2rem", gap: "1rem", boxSizing: "border-box" },
  sidebar: {
    width: "220px",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "1rem",
    boxSizing: "border-box",
    height: "fit-content",
  },
  sidebarItem: { display: "flex", alignItems: "center", marginBottom: "1rem", cursor: "pointer", color: "#0b3d91" },
  sidebarIcon: { marginRight: "0.5rem" },
  formWrapper: {
    flex: 1,
    background: "#fff",
    padding: "1.5rem",
    borderRadius: "4px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
    marginTop: "1rem",
    boxSizing: "border-box",
  },
  noticePanel: {
    width: "270px",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "1rem",
    boxSizing: "border-box",
    height: "fit-content",
  },
  noticeHeader: { display: "flex", alignItems: "center", marginBottom: "0.75rem" },
  noticeIcon: { marginRight: "0.5rem", color: "#dc3545" },
  section: { marginBottom: "1.5rem", borderBottom: "1px solid #ddd", paddingBottom: "1.5rem" },
  inputGroup: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #aaa",
    borderRadius: "4px",
    marginBottom: "1rem",
    padding: "0.5rem",
    background: "#fafafa",
    gap: "0.5rem",
  },
  icon: { color: "#0b3d91", marginRight: "0.5rem", minWidth: "22px" },
  input: { flex: 1, border: "none", outline: "none", fontSize: "0.95rem", padding: "0.25rem 0" },
  textarea: { width: "100%", border: "1px solid #aaa", borderRadius: "4px", padding: "0.5rem", fontSize: "0.95rem", resize: "none" },
  buttonGroup: { display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "flex-start", marginTop: "1rem" },
  button: { background: "#0b3d91", color: "#fff", border: "none", borderRadius: "4px", padding: "0.75rem 1.5rem", cursor: "pointer", transition: "background 0.2s" },

  smallContainer: {
    maxWidth: "500px",
    margin: "0 auto",
    background: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  labelSmall: { display: "block", marginBottom: "0.25rem", fontSize: "0.9rem", color: "#333" },
  submitButton: {
    background: "#0b3d91",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.5rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
};

export default function FormPage({ formData, setFormData }) {
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Form submitted! Check console for data.");
  };

  // Use actual navigation so buttons go to /extract etc.
  const tryNavigate = (to) => {
    if (to && to.startsWith('/')) navigate(to);
    else console.log('navigate ->', to);
  };

  return (
    <div style={styles.page}>
      {/* TOP BAR */}
      <div style={styles.topBar}>
        <div style={styles.govLabel}>🇮🇳 भारत सरकार / Government of India</div>

        {/* center placeholder keeps spacing similar to original */}
        <div style={{ textAlign: "center", flex: 1 }} />

        <div style={styles.topButtons}>
          <button onClick={() => tryNavigate("/")} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
            Home
          </button>
          <button onClick={() => tryNavigate("/marathi")} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
            मराठी
          </button>
          <button onClick={() => tryNavigate("/accessibility")} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
            A+
          </button>
          <button onClick={() => tryNavigate("/accessibility-minus")} style={{ background: "transparent", border: "none", cursor: "pointer" }}>
            A-
          </button>
        </div>
      </div>

      {/* NAV BAR */}
      <nav style={styles.navBar}>
        {[
          "How to Apply Online?",
          "Benefit Schemes",
          "Post Matric Scholarship",
          "Pre Matric Scholarship",
          "Pension Schemes",
          "Farmer Schemes",
          "Labour Schemes",
          "Special Assistance Schemes",
        ].map((item) => (
          <div key={item} style={styles.navItem}>
            {item}
          </div>
        ))}
      </nav>

      {/* BANNER MARQUEE */}
      <div style={styles.bannerContainer}>
        <div style={styles.bannerText}>आवेदन की अंतिम तिथि: 31 जुलाई, 2025 | Apply by: 31 July, 2025</div>
      </div>

      {/* MAIN LAYOUT */}
      <div style={styles.main}>
        {/* SIDEBAR */}
        <aside style={styles.sidebar}>
          <div style={{ marginBottom: "1rem", fontWeight: "bold", color: "#0b3d91" }}>Menu / मेन्यू</div>
          {[
            { to: "/dashboard", icon: "📊", label: "Dashboard" },
            { to: "/submissions", icon: "📁", label: "My Submissions" },
            { to: "/login", icon: "🔐", label: "Applicant Login" },
            { to: "/seats", icon: "💺", label: "Seat Availability" },
            { to: "/schedule", icon: "📅", label: "Exam Schedule" },
            { to: "/admit-card", icon: "🆔", label: "Admit Card Download" },
            { to: "/instructions", icon: "📋", label: "Exam Instructions" },
            { to: "/support", icon: "✉️", label: "Contact Support" },
          ].map(({ to, icon, label }) => (
            <div key={to} style={styles.sidebarItem} onClick={() => tryNavigate(to)}>
              <span style={styles.icon}>{icon}</span>
              <span>{label}</span>
            </div>
          ))}

          {/* placeholders for images skipped as requested */}
          <div style={{ marginTop: "1rem", textAlign: "center", color: "#666", fontSize: "0.9rem" }}>
            [logos omitted]
          </div>
        </aside>

        {/* FORM AREA */}
        <div style={styles.formWrapper}>
          <h2>सहायक लिपिक आवेदन / Assistant Clerk Application Form</h2>

          <form onSubmit={handleSubmit}>
            <section style={styles.section}>
              {/* Input groups - preserved bindings from your original App */}
              <div style={styles.inputGroup}>
                <span style={styles.icon}>👤</span>
                <div style={{ flex: 1 }}>
                  <label style={styles.labelSmall} htmlFor="name">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Full Name"
                    style={styles.input}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <span style={styles.icon}>📇</span>
                <div style={{ flex: 1 }}>
                  <label style={styles.labelSmall} htmlFor="aadhaarNumber">Aadhaar Number</label>
                  <input
                    id="aadhaarNumber"
                    name="aadhaarNumber"
                    type="text"
                    inputMode="numeric"
                    maxLength={12}
                    placeholder="Aadhaar Number"
                    style={styles.input}
                    value={formData.aadhaarNumber}
                    onChange={(e) =>
                      setFormData(prev => ({ ...prev, aadhaarNumber: e.target.value.replace(/\D/g, "").slice(0, 12) }))
                    }
                    required
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <span style={styles.icon}>🧾</span>
                <div style={{ flex: 1 }}>
                  <label style={styles.labelSmall} htmlFor="panNumber">PAN Number</label>
                  <input
                    id="panNumber"
                    name="panNumber"
                    type="text"
                    placeholder="PAN Number"
                    style={styles.input}
                    value={formData.panNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, panNumber: e.target.value.toUpperCase().slice(0,10) }))}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <span style={styles.icon}>👨</span>
                <div style={{ flex: 1 }}>
                  <label style={styles.labelSmall} htmlFor="fatherName">Father’s Name</label>
                  <input
                    id="fatherName"
                    name="fatherName"
                    type="text"
                    placeholder="Father’s Name"
                    style={styles.input}
                    value={formData.fatherName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <span style={styles.icon}>👩</span>
                <div style={{ flex: 1 }}>
                  <label style={styles.labelSmall} htmlFor="motherName">Mother’s Name</label>
                  <input
                    id="motherName"
                    name="motherName"
                    type="text"
                    placeholder="Mother’s Name"
                    style={styles.input}
                    value={formData.motherName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <span style={styles.icon}>🎂</span>
                <div style={{ flex: 1 }}>
                  <label style={styles.labelSmall} htmlFor="dob">Date of Birth</label>
                  <input
                    id="dob"
                    name="dob"
                    type="date"
                    style={styles.input}
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <span style={styles.icon}>🏷️</span>
                <div style={{ flex: 1 }}>
                  <label style={styles.labelSmall} htmlFor="caste">Caste</label>
                  <input
                    id="caste"
                    name="caste"
                    type="text"
                    placeholder="Caste"
                    style={styles.input}
                    value={formData.caste}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </section>

            <section style={styles.section}>
              <div style={styles.inputGroup}>
                <span style={styles.icon}>📚</span>
                <div style={{ flex: 1 }}>
                  <label style={styles.labelSmall} htmlFor="subjects">Subjects</label>
                  <input
                    id="subjects"
                    name="subjects"
                    type="text"
                    placeholder="Comma-separated"
                    style={styles.input}
                    value={formData.subjects.join(", ")}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        subjects: e.target.value ? e.target.value.split(",").map((s) => s.trim()) : [],
                      }))
                    }
                  />
                </div>
              </div>

              <div style={{ marginTop: "0.5rem" }}>
                <label style={styles.labelSmall} htmlFor="percentage">Percentage</label>
                <textarea
                  id="percentage"
                  name="percentage"
                  placeholder="Percentage"
                  style={styles.textarea}
                  value={formData.percentage}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </section>

            <div style={styles.buttonGroup}>
              <button type="button" style={styles.button} onClick={() => tryNavigate("/extract")}>
                Extract Aadhaar Text
              </button>
              <button type="button" style={styles.button} onClick={() => tryNavigate("/extract-pancard")}>
                Extract PAN Details
              </button>
              <button type="button" style={styles.button} onClick={() => tryNavigate("/extract-marksheet")}>
                Extract Marksheet
              </button>
              <button type="button" style={styles.button} onClick={() => tryNavigate("/extract-living-certificate")}>
                Extract Living Certificate
              </button>
              <button type="button" style={styles.button} onClick={() => tryNavigate("/chat")}>
                Chat with RAG Bot
              </button>
            </div>

            <div style={{ marginTop: "1.25rem" }}>
              <button type="submit" style={styles.submitButton}>
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* NOTICE PANEL */}
        <aside style={styles.noticePanel}>
          <div style={styles.noticeHeader}>
            <span style={styles.noticeIcon}>🔔</span>
            <strong>Notifications</strong>
          </div>
          <ul style={{ paddingLeft: "1.1rem", margin: 0 }}>
            <li>Form deadline extended till 31st July 2025</li>
            <li>New scheme for backward class students</li>
            <li>Marksheet upload available now</li>
            <li>ID cards will be emailed—please enter your correct email address</li>
            <li>Download your admit card by 25th July 2025</li>
            <li>Exam centre guidelines released; check before reporting</li>
            <li>Upload your recent photograph by 20th July 2025</li>
            <li>Contact support@exam.gov.in for any issues</li>
            <li>Helpline: +91-1800-123-456 for queries</li>
          </ul>
        </aside>
      </div>

      {/* marquee keyframes */}
      <style>{`
        @keyframes slide {
          0% { left: 100%; }
          100% { left: -100%; }
        }
      `}</style>
    </div>
  );
}
