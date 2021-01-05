/************************************************************************************/
// USAGE:  frida -l nsurlprotectionspace_host.js -U -f funky-chicken.com.app --no-pause
/************************************************************************************/
const NSAutoreleasePool = ObjC.classes.NSAutoreleasePool;
const protectionSpace = ObjC.classes.NSURLProtectionSpace['- host'];

try {
    var pool = NSAutoreleasePool.alloc().init();
    if (!protectionSpace) {
        throw new Error('Cannot find Export');
    }
}
catch(err){
    console.error(err.message);
}
finally {
    pool.release();
}

Interceptor.attach(protectionSpace.implementation, {

    onLeave: function (retval) {
        const hostname_objc_nsstr = new ObjC.Object(retval);

        console.log(JSON.stringify({
            function: 'NSURLProtectionSpace onLeave()',
            hostname: hostname_objc_nsstr.toString(),
            type: typeof hostname_objc_nsstr,
            frida_type: hostname_objc_nsstr.$className,
            source_modile: hostname_objc_nsstr.$moduleName,
            retval_addr: retval
        }));

        if(hostname_objc_nsstr.equals(retval)){
            console.log('successful cast');
        }
    }
});
