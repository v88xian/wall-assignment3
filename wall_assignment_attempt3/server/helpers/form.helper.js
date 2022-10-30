class FormHelper{

    validateFields = async (req_body, required_fields = [], optional_fields = []) => {
        let response_data = { status: false, result: {}, error: null }

        try{
            /* Check if the arguments has the correct format */
            if(!Array.isArray(required_fields) || !Array.isArray(optional_fields)){
                throw Error("Arguments data types are not provided properly");
            }
            
            let all_fields = [...required_fields, ...optional_fields];
            let missing_fields = [];
            let sanitized_data = {};

            for(let index in all_fields){
                let current_key = all_fields[index];
                let current_value = req_body?.[current_key] || "";

                if(current_value.trim() === "" && required_fields.includes(current_key)){
                    missing_fields.push(current_key);
                }
                else{
                    sanitized_data[current_key] = current_value;
                }
            }

            response_data.status = missing_fields.length === 0;
            response_data.result = (missing_fields.length === 0) ? sanitized_data : [missing_fields];
        } 
        catch(error){
            response_data.error = error;
        }

        return response_data;
    }
}

module.exports = (function initFormHelper(){
    return new FormHelper();
})();