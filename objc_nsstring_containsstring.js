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

        if(this._needle != '-') {
            console.log(JSON.stringify({
                thread_id: this.threadId,
                needle: this._needle.toString()
            }));
        }
    }
});
