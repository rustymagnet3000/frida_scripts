# Tiny Frida Scripts


 
## Writing Objective-C Frida Scripts
##### Setup
 I used `WebStorm` from Jetbrains to write `Frida Scripts`.  Other people wrote scripts in `Python` and passed in the `Javascript`.  I liked `WebStorm` as:
 
  - Immediate Javascript `syntax feedback`
  - You got `auto-complete` for `Frida`
 
##### Enable auto-complete
![](.README_images/webstorm_setup_frida_autocomplete.png)
##### Lessons
 - `Module.findExportByName()` returns a `NativePointer`.
 - Ole, the creator of Frida, said: _"Never interact with Objective-C APIs without an `autorelease-pool`."
 - When `foobar` is created like this `const foobar = new ObjC.Object(retval);` it has special properties:
 
    -`foobar.$className`
 
    -`foobar.$moduleName`
 
    -`foobar.$kind`
    
    -......and more

