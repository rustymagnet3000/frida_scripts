/***********************************************************************************/
// USAGE:  work in progress
/************************************************************************************/
const blockArray = [];

Interceptor.attach(ObjC.classes.YDURLSessionDel['- URLSession:didReceiveChallenge:completionHandler:'].implementation, {
    onEnter(args) {
        const bl = new ObjC(block.implementation);
        const blockPtr = new ObjC.Block(args[4]);
        console.log("[*] block ptr");
        var origBlock = new ObjC.Block(blockPtr);
        console.log(origBlock);
        blockArray.push(origBlock);
    }
});
