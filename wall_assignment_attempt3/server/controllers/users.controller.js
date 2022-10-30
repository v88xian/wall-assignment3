'use strict';

import { validateFields } from "../helpers/form.helper";
import { encryptPassword } from "../helpers/user.helper";

import UserModel from "../models/user.model";
let userModel = new UserModel();

class UserController{

    /**
     * DOCU: This function will trigger the registration of user
     * @param {*} req - Required first_name, last_name, email_address, password
     * @param {*} res 
     * @author Christian
     * Last Updated At: October 30, 2022
     */       
    register = async function (req, res){
        let response_data = { status: false, result: {}, error: null };

        try{
            let validated_fields_response = await validateFields(req.body, ["first_name", "last_name", "email_address", "password"], []);

            if(validated_fields_response.status){
    
                /* We will check if the email address is already existing in the database */
                let {status: fetch_user_record_status, result: [user_record], error: fetch_user_record_error} = await userModel.fetchUserRecord({email: validated_fields_response?.result?.email_address})

                if(fetch_user_record_status){

                    if(user_record?.id){
                        response_data.message = "Email address is already exist.";
                    }
                    else{
                        let password = validated_fields_response.result.password;

                        /* check password characters */
                        if(password.length >= 8 && password.length <= 16){
                            /* Encrypt the password */
                            let encrypt_response =  await encryptPassword(password);

                            if(encrypt_response.status){
                                /* Save user data in database */
                                let save_user_data = await userModel.createUserRecord({
                                    first_name: validated_fields_response.result.first_name,
                                    last_name: validated_fields_response.result.last_name,
                                    email: validated_fields_response.result.email_address,
                                    password: encrypt_response.result.encypted_password,
                                    created_at: new Date(),
                                    updated_at: new Date()
                                });

                                response_data.status = !!save_user_data?.result?.id;
                                response_data.message = "User successfully registered.";
                            }
                        }
                        else{
                            response_data.message = "Password must be greater than or equal to 16 and not less than 8 characters";
                        }
                    }

                }
                else{
                    response_data.message = fetch_user_record_error
                }
            }
            else{
                response_data.message = "Missing fields";
            }
        }
        catch(error){
            response_data.error = error;
        }
 
        res.json(response_data);
    }

    /**
     * DOCU: This function will trigger the login of user
     * @param {*} req - Required email_address, password
     * @param {*} res 
     * @author Christian
     * Last Updated At: October 30, 2022
     */           
    login = async function (req, res){
        let response_data = { status: false, result: {}, error: null };

        try{
            let validated_fields_response = await validateFields(req.body, ["email_address", "password"], []);

            if(validated_fields_response.status){
                /* Check if the email address is existing in the database */

                /* We will check if the email address is already existing in the database */
                let {status: fetch_user_record_status, result: [user_record], error: fetch_user_record_error} = await userModel.fetchUserRecord({email: validated_fields_response?.result?.email_address})

                if(fetch_user_record_status && user_record?.id){
                    /* Check password if the same in the database */

                    let encrypt_response =  await encryptPassword(validated_fields_response?.result?.password);

                    if(encrypt_response.status && encrypt_response.result.encypted_password === user_record?.password){
                        /* trigger saving the session */
                        req.session.user = {
                            id: user_record.id,
                            first_name: user_record.first_name,
                            last_name: user_record.last_name
                        };

                        req.session.save();

                        response_data.status = true;
                    }
                    else{
                        response_data.message = "Incorrect Password";
                    }
                }
                else{
                    response_data.message = "Email Address not existing in the database";
                }
            }
            else{

            }
        }
        catch(error){
            response_data.error = "Failed to login user.";
        }

        res.json(response_data);
    }
}

export default (function User(){
    return new UserController();
})();