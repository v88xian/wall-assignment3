'use strict';

import Ejs from "ejs";

class ViewHelper{

    constructor(){}

    renderTemplate = async (template, template_data) => {
        return new Promise( (resolve, reject) => {
            if(template){
                Ejs.renderFile(template, template_data, (error, html_data) => {
                    if(error){
                        return reject(error);
                    }

                    resolve(html_data);
                });
            }
        });
    }

}

module.exports = (function initViewHelper(){
    return new ViewHelper();
})();