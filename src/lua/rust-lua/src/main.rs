extern crate lua_rs;
extern crate libc;
extern crate nphysics2d;
#[macro_use]
extern crate stdweb;

use std::ffi::CStr;
use std::str;

use libc::c_char;

use { lua_rs::ffi::lua, lua_rs::ffi::lualib, lua_rs::ffi::lauxlib };

extern "C" {
	// emscripten.h#55
	// `EM_ASM` macro expands to this fn
	// Use this fn to make a call that returns `void`
	pub fn emscripten_asm_const(s: *const c_char);
	// emscripten.h#56
	// `EM_ASM_` macro expands to this fn
	// Use this fn to make a call that returns a ptr to a value
    pub fn emscripten_asm_const_int(s: *const c_char, ...) -> i32;
}

unsafe extern "C" fn print(l: *mut lua::lua_State) -> libc::c_int {
    let numargs = lua::lua_gettop(l);
    println!("There are {} arguments.", numargs);
    for _i in 0..numargs {
        let c_buf = lua::lua_tostring(l, _i+1);
        let c_str: &CStr = CStr::from_ptr(c_buf);
        let str_slice = c_str.to_str().unwrap();
        
        println!("  Argument #{}: \"{}\"", _i+1, str_slice);
    }
    0
}

unsafe extern "C" fn alert(l: *mut lua::lua_State) -> libc::c_int {
    let numargs = lua::lua_gettop(l);
    for _i in 0..numargs {
        stdweb::initialize();
        let c_buf = lua::lua_tostring(l, _i+1);
        let c_str: &CStr = CStr::from_ptr(c_buf);
        let str_slice: String = c_str.to_str().unwrap().to_owned();
        js! {
            alert(@{str_slice})
        }
    }
    0
}

unsafe fn load_libraries(l: *mut lua::lua_State) {
    //lua::lua_pushcfunction(l, Some(print));
    //lua::lua_setglobal(l, b"print".as_ptr() as *const libc::c_char);

    lua::lua_pushcfunction(l, Some(alert));
    lua::lua_setglobal(l, b"alert".as_ptr() as *const libc::c_char);
}

#[no_mangle]
pub fn execute_lua(i: *mut c_char) {
    unsafe { 
        let l = lauxlib::luaL_newstate();
        lualib::luaL_openlibs(l);

        load_libraries(l);

        lauxlib::luaL_loadstring(l, i);
        lua::lua_call(l, 0, lua_rs::ffi::lua::LUA_MULTRET);
    };
}

fn main() {
    let mut world: nphysics2d::world::World<f32>  = nphysics2d::world::World::new();
}
