require('dotenv').config()
const https = require('https');

//TODO - error handling for non 200 responses?

module.exports = {
    getPlatformState: function () {
        try{
            return new Promise((resolve, reject) => {
                https.get(process.env.API_URL, (response) => {
                    let chunks_of_data = [];
            
                    response.on('data', (fragments) => {
                        chunks_of_data.push(fragments);
                    });
            
                    response.on('end', () => {
                        console.log("API fetch resolved")
                        let response_body = Buffer.concat(chunks_of_data);
                        resolve(JSON.parse(response_body));
                    });
            
                    response.on('error', (error) => {
                        console.log('API fetch failed:', error)
                        reject(error);
                    });
                });
            });
        }
        catch(err){
            console.log(err);
        }
    }
}
