import express from "express";
import cors from "cors";
import { errors } from "celebrate";

import items from "./routes/items";
import points from "./routes/points";
import uploads from "./routes/uploads";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/items", items);
app.use("/points", points);
app.use("/uploads", uploads);

app.use(errors());

export default app;
