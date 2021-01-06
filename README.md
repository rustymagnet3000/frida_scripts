# Tiny Frida Scripts


 
## Writing Objective-C Frida Scripts
##### Setup
 I used `WebStorm` from Jetbrains to write `Frida Scripts`.  Other people wrote scripts in `Python` and passed in the `Javascript`.  I liked `WebStorm` as:
 
  - Immediate Javascript `syntax feedback`
  - You got `auto-complete` for `Frida`
 
##### Enable auto-complete
![](.README_images/webstorm_setup_frida_autocomplete.png)
##### Tops for writing Frida Scripts
 - `Module.findExportByName()` returns a `NativePointer`.
 - To find a `Objective-C method` you can use: `ObjC.classes.NSString.$ownMethods`
 - To find a `C function` you can use: `DebugSymbol.fromAddress(Module.findExportByName(null, 'strstr'))`
 - Ole, the creator of Frida, said: _"Never interact with Objective-C APIs without an `autorelease-pool`."
 - When `foobar` is created like this `const foobar = new ObjC.Object(retval);` it has special properties:
 
    -`foobar.$className`
 
    -`foobar.$moduleName`
 
    -`foobar.$kind`
    
    ......and more


##### Cheat sheets
https://github.com/iddoeldor/frida-snippets