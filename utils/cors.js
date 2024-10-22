import cors from "cors";

const whiteList = process.env.CORS_WHITELIST.split(",");
// trigger deploy

const corsOptions = {
  origin: function (origin, callback) {
    console.log("WhiteList:", whiteList);
    console.log("Request from origin:", origin);

    if (!origin) {
      console.log("No origin specified");
      return callback(null, true);
    }

    const isWhitelisted = whiteList.some((domain) => {
      const match = origin === domain;
      console.log(origin, domain, match);
      console.log(`Checking ${origin} against ${domain}: ${match}`);
      return match;
    });

    if (isWhitelisted) {
      console.log("Origin is whitelisted");
      callback(null, true);
    } else {
      console.log("Origin is not whitelisted");
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default cors(corsOptions);
