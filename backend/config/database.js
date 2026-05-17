const mongoose = require('mongoose');

module.exports = function connectDB() {
  mongoose.set('bufferCommands', false);
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.error('Error MongoDB:', err));
};
