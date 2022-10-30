import MD5 from "md5";

import { ENCRYPTION } from "../config/constants/app.constants"

class UserHelper{

    encryptPassword = async (password) => {
        let response_data = {status: false, result: {encypted_password: null}, error: null};
    
        try{
            let {passkey: { start: passkey_start, end: passkey_end }} = ENCRYPTION;
            response_data.result.encypted_password = MD5(`${MD5(`${passkey_start}${password}${passkey_end}`)}_ccian_wall`);
            response_data.status = (response_data.result.encypted_password) ? true : false;
        }
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }

}

module.exports = (function initUserHelper(){
    return new UserHelper;
})();