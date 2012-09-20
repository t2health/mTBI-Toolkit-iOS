/**
 * 
 * 
 * All actions here get sent to FlurryPlugin.execute and pass the action name.
 * 
 * @return Instance of FlurryPlugin
 */
var pluginFlurry = {
    logEvent: function(types, success, fail) {
        return PhoneGap.exec(success, fail, "PluginFlurry", "logEvent", types);
    }
};


function logAnalytics(tag){
    pluginFlurry.logEvent(
        [tag],
        function(result){
            console.log('Success : ' + result);
        },
        function(result){
            console.log('Error : ' + result);
        }
        );
}