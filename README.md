# Tiny Frida Scripts


 
## Writing Objective-C Frida Scripts
##### Setup
 I used `WebStorm` from Jetbrains to write `Frida Scripts`.  Quite a few other people wrote scripts in `Python` and passed in the `Javascript` as a script.  I liked `WebStorm` as:
 
  - Immediate Javascript `syntax feedback`
  - You can get `auto-complete` for `Frida`
 
##### Setup
![](.README_images/webstorm_setup_frida_autocomplete.png)
##### Lessons
 - `Module.findExportByName()` returns a `NativePointer`.
 - Ole, the creator of Frida, said: _"Never interact with Objective-C APIs without an `autorelease-pool`."_
 