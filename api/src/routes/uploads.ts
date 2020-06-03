import express from "express";
import path from "path";

const routes = express.static(path.resolve(__dirname, "../", "../", "uploads"));

export default routes;
