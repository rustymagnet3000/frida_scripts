/*****************************************************************************
ObjC.classes.NSURLQueryItem.$ownMethods
    // "+ queryItemWithName:value:"
    // "- initWithName:value:"
*****************************************************************************/

console.log('[*] listening For NSURLQueryItem requests...');

const NSString = ObjC.classes.NSURLQueryItem;

if (ObjC.available) {

    try {
        const className = "NSURLQueryItem";
        const funcName = "- initWithName:value:";
        const hook = eval('ObjC.classes.' + className + '["' + funcName + '"]');

        Interceptor.attach(hook.implementation, {
            onEnter: function(args) {
                const queryParamName = new ObjC.Object(args[2]);
                const queryParamValue = new ObjC.Object(args[3]);
                const keyStr = queryParamName.toString();
                const valStr = queryParamValue.toString();
                console.log("Query parameter: " + keyStr + " " + valStr);
            }
        });
    } catch (error) {
        console.log("[!] Exception: " + error.message);
    }
} else {
    console.log("[!] Objective-C Runtime is not available!");
}