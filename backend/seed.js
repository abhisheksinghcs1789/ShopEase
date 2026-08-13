// One-off script to populate a fresh database with an admin account and a
// handful of sample products, so the app isn't empty on first run.
// Usage: node seed.js
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const User = require('./models/User');
const Product = require('./models/Product');

const sampleProducts = [
  { name: 'Wireless Earbuds', description: 'Bluetooth 5.3 earbuds with 24h battery life', price: 1499, category: 'Electronics', stock: 40, image: '' },
  { name: 'Cotton Crew T-Shirt', description: '100% cotton, regular fit, everyday wear', price: 499, category: 'Clothing', stock: 120, image: '' },
  { name: 'Stainless Steel Bottle', description: '1L double-walled bottle, keeps drinks cold 24h', price: 699, category: 'Home', stock: 75, image: '' },
  { name: 'Notebook Set (3-pack)', description: 'A5 ruled notebooks, 100 pages each', price: 299, category: 'Stationery', stock: 200, image: '' },
  { name: 'Running Shoes', description: 'Lightweight mesh running shoes, cushioned sole', price: 2199, category: 'Footwear', stock: 30, image: '' },
  { name: 'Desk Lamp', description: 'LED desk lamp with 3 brightness levels', price: 899, category: 'Home', stock: 55, image: '' },
];

const run = async () => {
  await connectDB();

  const adminEmail = 'admin@shopease.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: 'admin123', // change this immediately after first login
      role: 'admin',
    });
    console.log(`Admin created -> ${adminEmail} / admin123`);
  } else {
    console.log('Admin already exists, skipping');
  }

  const count = await Product.countDocuments();
  if (count === 0) {
    await Product.insertMany(sampleProducts);
    console.log(`Inserted ${sampleProducts.length} sample products`);
  } else {
    console.log('Products already exist, skipping seed');
  }

  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
