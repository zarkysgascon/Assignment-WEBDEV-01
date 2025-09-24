import express from "express"; // for HTTP requests
import cors from "cors"; // API data
import path from "path"; //for directory
import { fileURLToPath } from "url"; // url and parsing stuff

// 
const __filename = fileURLToPath(import.meta.url); // for modern ES modules 
const __dirname = path.dirname(__filename); // takes string representation for directory in the path

const app = express(); // creates them server
const PORT = 3000;

// In-memory "database" basket ahh
const users = [];
const items = []; // for future feature

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve everything inside /public (HTML, JS, CSS)
app.use(express.static(path.join(__dirname, "public")));

// SIGNUP ENDPOINT
app.post("/signup", (req, res) => {
  const { firstname, lastname, email, birthdate, password, repassword } =
    req.body;

  if (!firstname || !lastname || !email || !birthdate || !password || !repassword) {
    return res.json({ success: false, message: "All fields are required" });
  }

  if (password !== repassword) {
    return res.json({ success: false, message: "Passwords do not match" });
  }

  // Check if email exists
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.json({ success: false, message: "Email is already registered" });
  }

  // Age validation
  const birthDate = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  if (age < 13) {
    return res.json({
      success: false,
      message: "You must be at least 13 years old to use this platform",
    });
  }

  // Create user
  const newUser = {
    id: users.length + 1,
    firstname,
    lastname,
    email,
    birthdate,
    password, 
    joinDate: new Date().toISOString(),
    items: [],
  };

  users.push(newUser);
  console.log("✅ New user registered:", newUser.email);

  res.json({
    success: true,
    message: "Account created successfully! You can now login.",
  });
});

// LOGIN ENDPOINT
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find((user) => user.email === email);

  if (!user) {
    return res.json({ success: false, message: "Email not found" });
  }

  if (user.password !== password) {
    return res.json({ success: false, message: "Incorrect password" });
  }

  const userInfo = {
    id: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    birthdate: user.birthdate,
    joinDate: user.joinDate,
  };

  res.json({
    success: true,
    message: "Login successful!",
    user: userInfo,
  });
});


// Starts server
app.listen(PORT, () => {
  console.log(`🛒 ReSell Pro running at http://localhost:${PORT}`);
  console.log(`👤 Registered users: ${users.length}`);
});
// that would be all
