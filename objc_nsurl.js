
console.log('Listening For Requests...');

if (ObjC.available) {

    try {

        var className = "NSURL";
        var funcName = "- initWithString:";
        var hook = eval('ObjC.classes.' + className + '["' + funcName + '"]');

        // function (a1) { return retType.fromNative.call(this, objc_msgSend(this, sel, argTypes[0].toNative.call(this, a1)));

        Interceptor.attach(hook.implementation, {
            onEnter: function(args) {
                // ObjectiveC method:
                // 0. 'self'
                // 1. The selector
                // 2. The first argument
                // https://github.com/frida/frida/issues/121
                var url = new ObjC.Object(args[2]);
                console.log('URL -> ' + url.toString())
            }
        });
    } catch (error) {
        console.log("[!] Exception: " + error.message);
    }
} else {
    console.log("Objective-C Runtime is not available!");
}