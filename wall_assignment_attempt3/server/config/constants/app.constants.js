import Yaml from "js-yaml";
import Fs from "fs";

let App_constants = {};

try{

    let env_file = "development.env.yml";

    let file_contents = Fs.readFileSync(`${__dirname}/../${env_file}`, 'utf8');
    let data = Yaml.load(file_contents);

    for (let key in data) {
        App_constants[key] = data[key];
    }

}
catch(error){
    process.exit(1);
}


module.exports = App_constants;