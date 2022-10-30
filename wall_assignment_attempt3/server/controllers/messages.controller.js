'use strict';

import Path from "path";
import Moment from "moment";

import {validateFields} from "../helpers/form.helper";
import {renderTemplate} from "../helpers/views.helper";

import MessageModel from "../models/messages.model";
import e, { response } from "express";

let messageModel = new MessageModel();

class MessageController{


    /**
     * DOCU: This function will trigger the creation of a new message
     * @param {*} req - Required message
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
            
            let validated_fields_response = await validateFields(req.body, ["message"], []);

            if(validated_fields_response.status){
                let create_message_record = await messageModel.createNewMessage(
                    {
                        user_id: req.session.user.id,
                        message: validated_fields_response.result.message,
                        created_at: new Date(),
                        updated_at: new Date()
                    }
                );

                if(create_message_record.status){
                    response_data.html_data = await renderTemplate(Path.join(__dirname, "../../views/partials/message_item.partial.ejs"), {
                        message: {
                            message_id: create_message_record.result.id,
                            content: validated_fields_response.result.message,
                            message_author: `${req.session.user.first_name} ${req.session.user.last_name}`,
                            message_created_at: create_message_record.result.created_at,
                            comments: []
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


    /**
     * DOCU: This function will trigger the deletion of a message
     * @param {*} req - Required message_id
     * @param {*} res 
     * @author Christian
     * Last Updated At: October 30, 2022
     */   
    delete = async function (req, res){
        let response_data = { status: false, result: {}, error: null };

        try{

            if(!req?.session?.user?.id){
                throw Error("session not found.");
            }

            let validated_fields_response = await validateFields(req.body, ["message_id"], []);

            if(validated_fields_response.status){
                
                // fetchMessageRecord

                let fetch_message_result = await messageModel.fetchMessageRecord({id: validated_fields_response.result.message_id});

                if(fetch_message_result.status && fetch_message_result.result?.id){

                    if(fetch_message_result.result?.user_id !== req.session.user.id){
                        response_data.message = "failed to delete message.";
                    }
                    else{
                        response_data = await messageModel.deleteMessageByRecordId(validated_fields_response.result.message_id);
                        response_data.result.message_id = validated_fields_response.result.message_id
                    }
                }
                else{
                    response_data.message = "Message not found";
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

export default (function Message(){
    return new MessageController();
})();