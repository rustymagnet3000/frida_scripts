/*****************************************************************************
-[NSString containsString:]
 Returns a Boolean value indicating whether the string contains a given string by performing a case-sensitive, locale-unaware search.

(lldb) po $arg1
haystack

(lldb) po (char *)$arg2
"containsString:"

(lldb) po $arg3
needle <-- where the "frida" string will appear

USAGE:  frida -l objc_nsstring_containsstring.js -U -f appname --no-pause
******************************************************************************/
var NSAutoreleasePool = ObjC.classes.NSAutoreleasePool;
var methodPointer = ObjC.classes.NSString['- containsString:'].implementation;


try {
    var pool = NSAutoreleasePool.alloc().init();
    if (!methodPointer) {
        throw new Error('Cannot find method');
    }
}
catch(err){
    console.error(err.message);
}
finally {
    console.log('\"-[NSString containsString:]\" pointer:\t' + methodPointer);
    pool.release();
}

Interceptor.attach(methodPointer, {
    onEnter: function (args) {
        this._needle = new ObjC.Object(args[2]);
    },

    onLeave: function (retval) {
        if(this._needle != '-' && retval.equals(ptr(0x1))) {
            console.log(JSON.stringify({
                needle: this._needle.toString(),
                retval: 'found'
            }));
        }
    }
});


/*

    "-[NSString containsString:]" pointer:	0x184c7dd8c
    {"needle":"frida","retval":"found"}
    {"needle":"frida-gadget","retval":"found"}
    {"needle":"gdbus","retval":"found"}
    {"needle":"gum-js-loop","retval":"found"}

 */