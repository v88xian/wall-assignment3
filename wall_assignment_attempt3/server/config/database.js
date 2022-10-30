import Mysql from "mysql";

import { DATABASE } from "../config/constants/app.constants"

let Connection = Mysql.createConnection(DATABASE);

Connection.connect(function(error){
    if(error){
        throw error;
    }
});

module.exports = Connection;