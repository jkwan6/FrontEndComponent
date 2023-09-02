const PROXY_CONFIG = [
  {
    context: [
      "/api",
    ],
    target: "https://localhost:5700",
    secure: false
  }
]

module.exports = PROXY_CONFIG;
