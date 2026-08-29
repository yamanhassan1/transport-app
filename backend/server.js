const http = require("http");
const app = require("./app");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Kill the process on port ${PORT} or change PORT in .env.`);
    } else {
        throw err;
    }
    process.exit(1);
});
