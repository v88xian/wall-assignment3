import QueryModel from "./database/query.model";

import {format as mysqlFormat} from "mysql";

let queryModel = new QueryModel();

class MessageModel{

    constructor(){}

    fetchAllMessages = async () => {
        let response_data = {status: false, result: {}, error: null };

        try{

            let fetch_all_messages_query = mysqlFormat(`
                SELECT JSON_ARRAYAGG(message_object) AS messages
                FROM (
                    SELECT 
                        messages.id AS message_id,
                        JSON_OBJECT(
                            "message_id", messages.id ,
                            "content", message,
                            "message_author_id", users.id,
                            "message_author", CONCAT(users.first_name, " ", users.last_name),
                            "message_created_at", messages.created_at,
                            "comments", IFNULL(comments, JSON_ARRAY())
                        ) AS message_object
                    FROM messages
                    INNER JOIN users ON users.id = messages.user_id
                    LEFT JOIN (
                        SELECT 
                            message_id, JSON_ARRAYAGG(comment_object) AS comments
                        FROM (
                            SELECT 
                                comments.message_id,
                                JSON_OBJECT(
                                    "comment_id", comments.id,
                                    "message_id", message_id,
                                    "comment_author", CONCAT(users.first_name, " ", users.last_name),
                                    "content", comment,
                                    "comment_created_at", comments.created_at
                                ) AS comment_object
                            FROM comments
                            INNER JOIN users ON users.id = comments.user_id		        
                        ) AS derived_comments
                        GROUP BY message_id
                    ) AS derived_comments1 ON derived_comments1.message_id = messages.id
                    GROUP BY messages.id
                    ORDER BY messages.id DESC
                ) AS derived_table
            `, []);

            let fetch_all_messages_result = await queryModel.executeQuery(fetch_all_messages_query);
            
            response_data.result = (fetch_all_messages_result?.[0]?.messages) ? JSON.parse(fetch_all_messages_result?.[0]?.messages) : [];
            response_data.status = true;

        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }


    fetchMessageRecord = async (post_data, fields_to_select = null) => {
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

                let fetch_user_record_query = mysqlFormat(`SELECT ${fields_to_select} FROM messages WHERE ${where_statements.join(" AND ")}`);
                let [fetch_user_record_response] = await queryModel.executeQuery(fetch_user_record_query);

                response_data.status = true;
                response_data.result = fetch_user_record_response;
            }
            else{
                response_data.message = "Failed to fetch message record. missing post data";
            }
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    createNewMessage = async (message_data) => {
        let response_data = {status: false, result: {}, error: null};

        try{

            let create_message_record_query = mysqlFormat(`
                INSERT INTO messages SET ?
            `, [message_data]);

            let create_message_record_result = await queryModel.executeQuery(create_message_record_query);

            response_data.status = !!create_message_record_result.insertId;
            response_data.result = {...create_message_record_result, id: create_message_record_result.insertId};
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

    deleteMessageByRecordId = async (message_id) => {
        let response_data = {status: false, result: {}, error: null};

        try{

            let delete_message_record_query = mysqlFormat(`
                DELETE FROM messages WHERE id = ?
            `, [message_id]);

            let delete_message_record_result = await queryModel.executeQuery(delete_message_record_query);

            response_data.status = !!delete_message_record_result.affectedRows;
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;        
    }
}

export default MessageModel;