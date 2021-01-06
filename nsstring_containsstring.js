/***********************************************************************************
 At Frida prompt:  ObjC.classes.NSString.$classMethods;
    "-[NSString containsSubstring:]"

 Returns a Boolean value indicating whether the string contains a given string by performing a case-sensitive, locale-unaware search.

 USAGE:  frida -l nsstring_containsstring.js -U -f appname --no-pause
******************************************************************************/

var NSString = ObjC.classes.NSString;

Interceptor.attach(NSString['- containsSubstring:'].implementation, {
    onEnter: function (args) {
        console.log('Context  : ' + JSON.stringify(this.context));
        console.log('ThreadId : ' + this.threadId);
        this._needle = ObjC.Object(args[2]);
        console.log('[*]Needle:' + this._needle.toString());
    }
});
