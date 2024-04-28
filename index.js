const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const eventRepo = require("./repositories/repository.event");
const logger = require("./tools/logger");
const morganMiddleware = require("./middlewares/middleware.logging");
const { default: helmet } = require("helmet");

const port = 1340;
const app = express();

// Middleware
app.use(morganMiddleware);
app.use(helmet);
app.use(bodyParser.json());

// Endpoint
app.post("/events", eventRepo.addEvent);
app.get("/events", eventRepo.getAllEvents);
app.put("/events/:id", eventRepo.updateEvent);
app.delete("/events/:id", eventRepo.deleteEvent);

app.post("/events/bulk", eventRepo.bulk);
app.get("/events/country", eventRepo.country);
app.get("/events/paginate", eventRepo.paginate);

app.listen(port, () => {
  logger.info("Server is running!!!");
});
