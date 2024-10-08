console.log('[*] listening For requests...');
let totalUrls = 0;
const NSString = ObjC.classes.NSString;
const evilServer = "https://[server hostname]/images/charizard.png"

if (ObjC.available) {

    try {
        const className = "NSURL";
        const funcName = "- initWithString:";
        const hook = eval('ObjC.classes.' + className + '["' + funcName + '"]');

        Interceptor.attach(hook.implementation, {
            onEnter: function(args) {
                const urlObj = new ObjC.Object(args[2]);
                const urlStr = urlObj.toString();

                if(urlStr.endsWith('.png')) {
                    args[2] = NSString.stringWithString_(evilServer);
                    console.log("target:", urlStr, "\nmodified:" , evilServer);
                }

                totalUrls++;
                console.log(`totalUrls=${totalUrls}`);
            }
        });
    } catch (error) {
        console.log("[!] Exception: " + error.message);
    }
} else {
    console.log("[!] Objective-C Runtime is not available!");
}