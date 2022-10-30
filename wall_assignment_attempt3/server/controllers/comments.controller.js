'use strict';

import Path from "path";
import Moment from "moment";

import {validateFields} from "../helpers/form.helper";
import {renderTemplate} from "../helpers/views.helper";

import CommentModel from "../models/comments.model";

let commentModel = new CommentModel();

class CommentController{

    /**
     * DOCU: This function will trigger the creation of a new comment
     * @param {*} req - Required message_id and comment
     * @param {*} res 
     * @author Christian
     * Last Updated At: October 30, 2022
     */ 
    create = async function (req, res){
        let response_data = { status: false, result: {}, error: null };

        try{

            if(!req?.session?.user?.id){
                throw Error("session not found.");
            }

            let validated_fields_response = await validateFields(req.body, ["message_id", "comment"], []);

            if(validated_fields_response.status){
                let create_comment_record = await commentModel.createNewComment(
                    {
                        user_id: req.session.user.id,
                        message_id: validated_fields_response.result.message_id,
                        comment: validated_fields_response.result.comment,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                );

                if(create_comment_record.status){
                    response_data.result.message_id = validated_fields_response.result.message_id;
                    response_data.html_data = await renderTemplate(Path.join(__dirname, "../../views/partials/comment_item.partial.ejs"), {
                        comment: {
                            comment_id: validated_fields_response.result.id,
                            message_id: validated_fields_response.result.message_id,
                            content: validated_fields_response.result.comment,
                            comment_author: `${req.session.user.first_name} ${req.session.user.last_name}`,
                            comment_created_at: create_comment_record.result.created_at,
                        },
                        Moment
                    });
                    response_data.status = true;
                }
            }
            else{
                response_data.message = validated_fields_response;
            }
        }
        catch(error){
            response_data.error = error;
        }
 
        res.json(response_data);
    }

}

export default (function Comment(){
    return new CommentController();
})();