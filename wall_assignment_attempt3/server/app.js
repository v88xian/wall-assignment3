import BodyParser from "body-parser";
import CookieParser from 'cookie-parser';
import Express from 'express';
import Path from "path";
import Session from "express-session";
import MemoryStore from "memorystore";


import { SESSION_NAME, SERVER, PORT } from "../server/config/constants/app.constants";

import ViewRoutes from "../server/routes/views.routes";
import APIRoutes from "../server/routes/api.routes";

const App = Express();
const memoryStore = MemoryStore(Session);

App.use(Session({
    secret: SESSION_NAME,
    store: new memoryStore({ checkPeriod: 9999999 }),
    resave: true,
    name: "wall-assignment",
    saveUninitialized: true,
    cookie: {
        domain: SERVER,
        expires: new Date( Date.now() + 60 * 60 * 1000 * 24 ),
        secure: false,
        httpOnly: true,
        maxAge: 36000000
    }
}));


App.use(BodyParser.json({limit: '50mb'}));
App.use(BodyParser.urlencoded({limit: '50mb', extended: true}));
App.use(CookieParser(SESSION_NAME));
App.set('views', Path.join(__dirname, "..", "views"));
App.set("view engine", "ejs");
App.use('/assets', Express.static(Path.join(__dirname,"..", "/assets")));


App.use("/", ViewRoutes);

APIRoutes(App);

App.use(function(req, res, next){
    next();
})

App.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}, process id ${process.pid}`);
})