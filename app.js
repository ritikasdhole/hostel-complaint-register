const express = require("express");
const app = express();

const commitSha = (
  process.env.RENDER_GIT_COMMIT ||
  process.env.GIT_SHA ||
  "local"
).slice(0, 7);

app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Temporary in-memory complaint data
const complaints = [
  {
    id: 1,
    studentName: "Demo Student",
    roomNumber: "A-101",
    category: "Electrical",
    description: "Tube light is not working",
    status: "Pending",
  },
];

// Escape user input before displaying it as HTML
const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });

// Home page
app.get("/", (req, res) => {
  const totalComplaints = complaints.length;

  const pendingComplaints = complaints.filter(
    (complaint) => complaint.status === "Pending",
  ).length;

  const resolvedComplaints = complaints.filter(
    (complaint) => complaint.status === "Resolved",
  ).length;

  const complaintRows = complaints
    .map(
      (complaint) => `
        <tr>
          <td>${complaint.id}</td>
          <td>${escapeHtml(complaint.studentName)}</td>
          <td>${escapeHtml(complaint.roomNumber)}</td>
          <td>${escapeHtml(complaint.category)}</td>
          <td>${escapeHtml(complaint.description)}</td>
          <td class="status ${complaint.status === "Pending" ? "pending" : "resolved"}">
              ${escapeHtml(complaint.status)}
          </td>
          <td>
            ${
              complaint.status === "Pending"
                ? `
                  <form method="POST" action="/complaints/${complaint.id}/resolve">
                    <button class="resolve-btn" type="submit">Mark Resolved</button>
                  </form>
                `
                : "Completed"
            }
          </td>
        </tr>
      `,
    )
    .join("");

  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Hostel Complaint Register</title>
        <link rel="stylesheet" href="/style.css">
      </head>

      <body>
        <main class="container">
        <h1>Hostel Complaint Register</h1>
        <p class="subtitle">Hostel maintenance and complaint tracking system</p>

        <h2>Complaint Summary</h2>

        <div class="dashboard">
          <div class="card">
            <h3>Total Complaints</h3>
            <p>${totalComplaints}</p>
          </div>

          <div class="card">
            <h3>Open Complaints</h3>
            <p>${pendingComplaints}</p>
          </div>

          <div class="card">
            <h3>Resolved Complaints</h3>
            <p>${resolvedComplaints}</p>
          </div>
        </div>

        <hr>

        <section class="section">
        <h2>Raise a Complaint</h2>

        <form method="POST" action="/complaints">
          <div class="form-grid">

            <div class="form-group">
              <label for="studentName">Student Name</label>
              <input id="studentName" name="studentName" type="text" required>
            </div>
            <br><br>

            <div class="form-group">
              <label for="roomNumber">Room Number:</label>
              <input id="roomNumber" name="roomNumber" type="text" required>
            </div>
            <br><br>

            <div class="form-group">
              <label for="category">Category:</label>
              <select id="category" name="category" required>
                <option value="">Select category</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Cleanliness">Cleanliness</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Wi-Fi">Wi-Fi</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <br><br>

            <div class="form-group full">
              <label for="description">Description</label>
              <textarea id="description" name="description" rows="4" required></textarea>
            </div>
            <br><br>

            <div class="form-group full">
              <button class="submit-btn" type="submit">Submit Complaint</button>
            </div>

          </div>
        </form>
        </section>

        <hr>

        <section class="section">
        <h2>Complaints</h2>

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Student</th>
              <th>Room</th>
              <th>Category</th>
              <th>Description</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            ${complaintRows}
          </tbody>
        </table>
        </section>

        <hr>

        <footer>
          Running Commit: <strong>${escapeHtml(commitSha)}</strong>
        </footer>
        </main>
      </body>
    </html>
  `);
});

// Add a new complaint
app.post("/complaints", (req, res) => {
  const studentName = req.body.studentName?.trim();
  const roomNumber = req.body.roomNumber?.trim();
  const category = req.body.category?.trim();
  const description = req.body.description?.trim();

  // Server-side validation
  if (!studentName || !roomNumber || !category || !description) {
    return res.status(400).send("All complaint fields are required.");
  }

  const newComplaint = {
    id: complaints.length + 1,
    studentName,
    roomNumber,
    category,
    description,
    status: "Pending",
  };

  complaints.push(newComplaint);

  res.redirect("/");
});

// JSON API - return all complaints
app.get("/api/complaints", (req, res) => {
  res.json(complaints);
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Mark a complaint as resolved
app.post("/complaints/:id/resolve", (req, res) => {
  const complaintId = Number(req.params.id);

  const complaint = complaints.find(
    (item) => item.id === complaintId,
  );

  if (!complaint) {
    return res.status(404).send("Complaint not found.");
  }

  complaint.status = "Resolved";

  res.redirect("/");
});

module.exports = app;