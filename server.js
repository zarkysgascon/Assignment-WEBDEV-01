const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());

// 
let users = [];


function generateRandomUsers(count = 1) {
  const newUsers = [];
  for (let i = 0; i < count; i++) {
    newUsers.push({
      gender: Math.random() > 0.5 ? 'male' : 'female',
      name: {
        title: Math.random() > 0.5 ? 'Mr' : 'Ms',
        first: `First${i}`,
        last: `Last${i}`
      },
      location: {
        street: {
          number: Math.floor(Math.random() * 1000),
          name: `Street ${i}`
        },
        city: `City ${i}`,
        state: `State ${i}`,
        country: `Country ${i}`,
        postcode: `${10000 + i}`
      },
      email: `user${i}@example.com`,
      dob: {
        date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
        age: Math.floor(Math.random() * 50) + 18
      },
      phone: `555-${1000 + i}`,
      cell: `555-${2000 + i}`,
      picture: {
        large: `https://picsum.photos/200/200?random=${i}`,
        medium: `https://picsum.photos/100/100?random=${i}`,
        thumbnail: `https://picsum.photos/50/50?random=${i}`
      }
    });
  }
  return newUsers;
}

// Initialize with some users
users = generateRandomUsers(100);

// Routes
app.get('/api', (req, res) => {
  const results = parseInt(req.query.results) || 1;
  const count = Math.min(Math.max(1, results), 1000); // Limit to 1000 users
  
  if (count === 1) {
    // Return a single random user
    const randomIndex = Math.floor(Math.random() * users.length);
    res.json({
      results: [users[randomIndex]],
      info: {
        seed: 'your-seed',
        results: 1,
        page: 1,
        version: '1.4'
      }
    });
  } else {
    // Return mult users
    const selectedUsers = [];
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * users.length);
      selectedUsers.push(users[randomIndex]);
    }
    
    res.json({
      results: selectedUsers,
      info: {
        seed: 'your-seed',
        results: count,
        page: 1,
        version: '1.4'
      }
    });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});