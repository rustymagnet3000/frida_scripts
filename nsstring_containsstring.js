/*****************************************************************************
-[NSString containsSubstring:]
 Returns a Boolean value indicating whether the string contains a given string by performing a case-sensitive, locale-unaware search.

(lldb) po $arg1
haystack

(lldb) po (char *)$arg2
"containsString:"

(lldb) po $arg3
needle <-- where the "frida" string will appear

USAGE:  frida -l nsstring_containsstring.js -U -f appname --no-pause
******************************************************************************/
var NSAutoreleasePool = ObjC.classes.NSAutoreleasePool;
var containsSubString = ObjC.classes.NSString['- containsSubstring:'];

try {
    var pool = NSAutoreleasePool.alloc().init();
    if (!containsSubString.implementation) {
        throw new Error('Cannot find method');
    }
}
catch(err){
    console.error(err.message);
}
finally {
    console.log('\"-[NSString containsSubstring:]\" pointer:\t' + containsSubString.implementation);
    pool.release();
}

Interceptor.attach(containsSubString.implementation, {
    onEnter: function (args) {
        console.log('Context  : ' + JSON.stringify(this.context));
        console.log('ThreadId : ' + this.threadId);
        this._needle = ObjC.Object(args[3]);
        console.log('[*]Needle:' + this._needle.toString());
    }
});
