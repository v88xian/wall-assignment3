'use strict';

import { Router } from "express";

const ViewRoute = Router();

import ViewController from "../controllers/views.controller";

ViewRoute.get("/", (req, res) => {
    return new ViewController(req, res).index();
});

ViewRoute.get("/home", (req, res) => {
    return new ViewController(req, res).home();
});

module.exports = ViewRoute;