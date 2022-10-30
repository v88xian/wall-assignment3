'use strict';

import { Router } from "express";

import MessageController from "../../controllers/messages.controller";

const MessageRoute = Router();

MessageRoute.post("/create", MessageController.create)
MessageRoute.post("/delete", MessageController.delete)

MessageRoute.options("*", function(req, res, next){
    next();
});

module.exports = MessageRoute;