import QueryModel from "./database/query.model";

import {format as mysqlFormat} from "mysql";

let queryModel = new QueryModel();

class CommentModel{

    constructor(){}

    /**
     * DOCU: This function will create the new comment
     * @param {*} comment_data - Required comment_data
     * @author Christian
     * Last Updated At: October 30, 2022
     */     
    createNewComment = async (comment_data) => {
        let response_data = {status: false, result: {}, error: null};

        try{

            let create_comment_record_query = mysqlFormat(`
                INSERT INTO comments SET ?
            `, [comment_data]);

            let create_comment_record_result = await queryModel.executeQuery(create_comment_record_query);

            response_data.status = !!create_comment_record_result.insertId;
            response_data.result = {...create_comment_record_result, id: create_comment_record_result.insertId};
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }
}

export default CommentModel;