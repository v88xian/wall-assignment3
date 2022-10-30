'use strict';

import Moment from "moment";

import MessageModel from "../models/messages.model";

let messageModel = new MessageModel();

class ViewController{
    #req;
    #res;

    constructor(req, res){
        this.#req = req;
        this.#res = res;
    }

    isAuthorizedUser = async () => {

        if(!this.#req?.session?.user?.id){
            throw Error("SEssion not found");
        }

    }

    index = async () => {
        try{

            if(this.#req?.session?.user?.id){
                this.#res.redirect("/home");
            }
            else{

                this.#res.render("index.ejs");
            }
        }
        catch(error){
            this.#res.redirect("/");
        }
    }

    home = async () => {
        try{
            await this.isAuthorizedUser();

            let {result: all_messages} = await messageModel.fetchAllMessages();

            this.#res.render("home.ejs", {
                CURRENT_USER: {first_name: this.#req?.session?.user?.first_name, last_name: this.#req?.session?.user?.last_name}, 
                DATA: {all_messages},
                HELPER: { Moment }
            });
        }
        catch(error){
            this.#res.redirect("/");
        }
    }

}

export default ViewController;