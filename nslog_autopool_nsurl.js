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

            var str = ObjC.classes.NSString.stringWithFormat_('[*]foo ' + 'bar ' + 'lives');     // fails with unicode chars
            if (str.isKindOfClass_(ObjC.classes.NSString)){
                console.log('str ' + str + '\ttype:' + str.$className);
                NSLog(str);
            }
        }
        catch(err){
            console.error(err.message);
        }
        finally {
            console.log("[*]NSURLProtectionSpace onEnter() script complete");
            pool.release();
        }
    },

    onLeave: function (retValue) {
        var nsurl = ObjC.classes.NSURL.URLWithString_('www.foobar.com')
        if (nsurl.isKindOfClass_(ObjC.classes.NSURL)){
            console.log('url ' + nsurl + '\ttype:' + nsurl.$className);
        }
        console.log(JSON.stringify({
            function: 'NSURLProtectionSpace onLeave()',
            urlStr: nsurl,
            return_value: retValue
        }));
    }
});
