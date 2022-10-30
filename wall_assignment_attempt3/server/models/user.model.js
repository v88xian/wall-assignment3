import {format as mysqlFormat} from "mysql";
import QueryModel from "./database/query.model";

let query_model = new QueryModel();

class UserModel{

    fetchUserRecord = async (post_data, fields_to_select = null) => {
        let response_data = {status: false, result: {}, error: null}

        try{
            if(post_data && Object.keys(post_data).length){
                let object_keys = Object.keys(post_data);
                let where_statements = [];

                for(let index = 0; index < object_keys.length; index++){
                    let current_key = object_keys[0];
                    let current_value = post_data[current_key];

                    where_statements.push(mysqlFormat(`${current_key} = ?`, [current_value]));
                }

                fields_to_select = fields_to_select || "*";

                let fetch_user_record_query = mysqlFormat(`SELECT ${fields_to_select} FROM users WHERE ${where_statements.join(" AND ")}`);
                let fetch_user_record_response = await query_model.executeQuery(fetch_user_record_query);

                response_data.status = true;
                response_data.result = fetch_user_record_response;
            }
            else{
                response_data.message = "Failed to fetch user record. missing post data";
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }


    createUserRecord = async (user_data) => {
        let response_data = { status: false, result: {}, error: null }

        try{
            let create_user_record_query = mysqlFormat(`
                INSERT INTO users SET ?
            `, [user_data]);

            let create_user_record_response = await query_model.executeQuery(create_user_record_query);

            response_data.status = !!create_user_record_response?.insertId;
            response_data.result = {...user_data, id: create_user_record_response?.insertId};
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

}

export default UserModel;