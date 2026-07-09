import http from "node:http";

const options = {
  hostname: "localhost",
  port: 3000,
  path: "/api/health",
  timeout: 5000,
};

const req = http.request(options, (res) => {
  process.exit(res.statusCode === 200 ? 0 : 1);
});

req.on("error", () => process.exit(1));
req.end();
