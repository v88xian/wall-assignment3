'use strict';

import Connection from "../../config/database";


class QueryModel{

    constructor(){

    }

    executeQuery = async (query) => {
        return new Promise((resolve, reject) => {
            Connection.query(query, function(error, result){
                if(error){
                    reject(error);
                }
                else{
                    resolve(result);
                }
            });
        })
    }

}

export default QueryModel;