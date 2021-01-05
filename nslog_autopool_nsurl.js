/************************************************************************************/
// USAGE:  frida -l task_thread.js -U -f appname.com --no-pause
// Ole's guidance: https://github.com/frida/frida/issues/279
/************************************************************************************/


var NSAutoreleasePool = ObjC.classes.NSAutoreleasePool;
var NSString = ObjC.classes.NSString;
var protectionSpace = ObjC.classes.NSURLProtectionSpace['- host'];

if (!protectionSpace) {
    console.error('Cannot find Export');
    throw new Error("Stop script");
}

Interceptor.attach(protectionSpace.implementation, {

    onEnter: function(args) {
        console.log("[*]NSURLProtectionSpace onEnter()");
        var pool = NSAutoreleasePool.alloc().init();
        try {
            var NSLog = new NativeFunction(Module.findExportByName('Foundation', 'NSLog'), 'void', ['pointer', '...']);
            var nsurl = new ObjC.Object(args[2]);
            console.log('nsurl type:' + nsurl.$className)
            var str = NSString.stringWithString_(nsurl.toString());
            NSLog("🐝woohoo");
            console.log(str);
        }
        catch(err){
            console.error(err.message);
        }
        finally {
            console.log("[*]NSURLProtectionSpace onEnter() script complete");
            pool.release();
        }
    }
});
