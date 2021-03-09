const https = require('https');

async function getPlatformState () {
    var state = ''
    var url = 'https://api.warframestat.us/pc'
    try{
        let request = new Promise((resolve, reject) => {
            https.get(url, (response) => {
                let chunks_of_data = [];
        
                response.on('data', (fragments) => {
                    chunks_of_data.push(fragments);
                });
        
                response.on('end', () => {
                    let response_body = Buffer.concat(chunks_of_data);
                    resolve(JSON.parse(response_body));
                });
        
                response.on('error', (error) => {
                    console.log('API response error:', error)
                    reject(error);
                });
            });
        });

        state = await request;
        console.log('Retrieved state at:', state.timestamp);
        return state;
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {
    updatePlatformState: async function () {
        let state = await getPlatformState();
        return state;
    }
}
