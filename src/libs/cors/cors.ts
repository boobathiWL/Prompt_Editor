import Cors from "cors";

Cors({
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  origin: "*",
});
