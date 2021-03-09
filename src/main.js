(async function() {
    const warframestatGet = require('./warframestatGet')

    let state = await warframestatGet.updatePlatformState();
})();