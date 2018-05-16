import rust_lua from './rust-lua/src/main.rs'
import Vue from 'vue'

export default class LuaEngine {
    constructor() {
        this.EventBus = new Vue()

        this.output = ''
        this.error = ''
        this.input = []
        this.scriptIndex = 0

        rust_lua.initialize({
            noFSInit: true
        }).then(mod => {
            console.log(mod)
            this.FS = mod.FS
            this.FS.mkdir('/data')
            this.FS.mount(this.FS.filesystems.IDBFS, {}, '/data')
            window.syncfs = this.FS.syncfs//
            this.FS.syncfs(true, function(err) {
                if(err) throw err
            })

            let wait = (seconds) => 
            new Promise(resolve => 
               setTimeout(() => resolve(), seconds * 1000)
            );

            let stdin = () => {
                if(this.input.length == 0) {
                    let promptres = window.prompt('Please enter your input. Press "cancel" when finished.')
                    if(promptres == null) {
                        return null
                    }
                    this.input = (promptres + '\n').split('')
                }
                let char = this.input.shift()
                return char.charCodeAt(0)
            }
            let stdout = ascii => {
                this.EventBus.$emit('STDOUT', String.fromCharCode(ascii))
            }
            let stderr = ascii => {
                this.EventBus.$emit('STDERR', String.fromCharCode(ascii))
            }
            
            this.FS.init(stdin, stdout, stderr)
            this.Module = mod
            this._executeLua = mod.cwrap('execute_lua', 'void', ['string'])
            this.executeLua = (code) => {
                this.scriptIndex++
                `\nRunning script (${this.scriptIndex})...\n`.split('').forEach(c => this.EventBus.$emit('STDOUT', c, 'green'))
                this._executeLua(code)
            }
        })
    }

    executeLua(luastr) {
        console.error('Lua VM not initialized yet')
    }
}

LuaEngine.install = function(Vue) {
    Object.defineProperty(Vue.prototype, '$lua', {
        get() {
            return this.$root._luaEngine
        }
    })

    Vue.mixin({
        beforeCreate() {
            if(this.$options.luaEngine) {
                this._luaEngine = this.$options.luaEngine
            }
        }
    })
}