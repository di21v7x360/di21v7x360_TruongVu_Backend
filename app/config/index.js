const config = {
    app: {
        port: process.env.PORT || 3000
    },
    // Truy cập đến port 27017 của MongoDB 
    db: {
        uri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/contactbook"
    }
};

module.exports = config;
