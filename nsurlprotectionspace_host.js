/************************************************************************************/
// USAGE:  frida -l nsurlprotectionspace_host.js -U -f funky-chicken.com.app --no-pause
// Ole's guidance: https://github.com/frida/frida/issues/279
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
        const host_name_str = new ObjC.Object(retval);
        console.log(JSON.stringify({
            function: 'NSURLProtectionSpace onLeave()',
            hostname: host_name_str.toString(),
            type: typeof host_name_str,
            retval_addr: retval
        }));
    }
});
