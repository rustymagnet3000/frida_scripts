/************************************************************************************/
// USAGE:  frida -l objc_nslog.js -U -f funky-chicken.com.app --no-pause -q
// Ole's guidance: https://github.com/frida/frida/issues/279
/************************************************************************************/
var NSAutoreleasePool = ObjC.classes.NSAutoreleasePool;
var NSString = ObjC.classes.NSString;
var pool = NSAutoreleasePool.alloc().init();

try {
    var NSLog = new NativeFunction(Module.findExportByName('Foundation', 'NSLog'), 'void', ['pointer', '...']);
    var str = NSString.stringWithFormat_('[*]foo ' + 'bar ' + 'lives');     // fails with unicode chars
    if (str.isKindOfClass_(ObjC.classes.NSString)){
        console.log('str ' + str + '\ttype:' + str.$className);
        NSLog(str);
    }
}
catch(err){
    console.error(err.message);
}
finally {
    pool.release();
}


