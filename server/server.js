const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const paintingRoutes = require("./routes/paintings");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/paintings", paintingRoutes);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
