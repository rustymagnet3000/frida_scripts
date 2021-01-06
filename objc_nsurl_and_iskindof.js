/************************************************************************************/
// USAGE:  frida -l objc_nsurl_and_iskindof.js -U -f funky-chicken.com.app --no-pause
/************************************************************************************/
var NSAutoreleasePool = ObjC.classes.NSAutoreleasePool;
var NSURL = ObjC.classes.NSURL;

try {
    var pool = NSAutoreleasePool.alloc().init();
    var nsurl = NSURL.URLWithString_('www.foobar.com')
    if (nsurl.isKindOfClass_(ObjC.classes.NSURL)){
        console.log('url ' + nsurl + '\ttype:' + nsurl.$className);
    }
}
catch(err){
    console.error(err.message);
}
finally {
    pool.release();
}
