const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isInMemory = false;
const storeFilePath = path.join(__dirname, '../data/store.json');

// Memory store state
let memoryStore = {
  admins: [],
  services: [],
  appointments: [],
  customers: [],
  gallery: [],
  settings: null
};

// Load saved store if exists
function loadMemoryStore() {
  try {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    if (fs.existsSync(storeFilePath)) {
      const content = fs.readFileSync(storeFilePath, 'utf8');
      memoryStore = JSON.parse(content);
    }
  } catch (err) {
    console.error('Error loading memory store file:', err.message);
  }
}

function saveMemoryStore() {
  try {
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(storeFilePath, JSON.stringify(memoryStore, null, 2));
  } catch (err) {
    console.error('Error saving memory store file:', err.message);
  }
}

const connectDB = async () => {
  try {
    // Attempt Mongoose connection with 3-second timeout
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/beauty_salon', {
      serverSelectionTimeoutMS: 3000
    });
    console.log('MongoDB Connected successfully to MongoDB Server.');
    isInMemory = false;
  } catch (err) {
    console.log('MongoDB local server connection failed/timed out. Switching to resilient local JSON store mode.');
    isInMemory = true;
    loadMemoryStore();
  }
};

const getMemoryStore = () => memoryStore;
const isInMemoryDB = () => isInMemory;

module.exports = {
  connectDB,
  getMemoryStore,
  saveMemoryStore,
  isInMemoryDB
};
