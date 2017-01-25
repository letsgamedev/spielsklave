/**
@author Tom Bleek
@youtube https://www.youtube.com/letsgamedev
@twitter https://twitter.com/letsgamedev
@patreon https://www.patreon.com/letsgamedev
@mail letsgamedev@gmx.de
*/

var Config = {
    controlls: {
        up: {k: Phaser.Keyboard.UP, p: null},
        down: {k: Phaser.Keyboard.DOWN, p: null},
        left: {k: Phaser.Keyboard.LEFT, p: null},
        right: {k: Phaser.Keyboard.RIGHT, p: null},
        jump: {k: Phaser.Keyboard.C, p: null},
        run: {k: Phaser.Keyboard.V, p: null},
        start: {k: Phaser.Keyboard.ENTER, p: null}
    }};
var Pad = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
    JUMP: 4,
    SHOOT: 5,
    START: 6,
    ESC: 7,

    refUP: {just:false,hold:false, count:0, timeOnDown:0},
    refLEFT: {just:false,hold:false, count:0, timeOnDown:0},
    refRIGHT: {just:false,hold:false, count:0, timeOnDown:0},
    refDOWN: {just:false,hold:false, count:0, timeOnDown:0},
    refSHOOT: {just:false,hold:false, count:0, timeOnDown:0},
    refJUMP: {just:false,hold:false, count:0, timeOnDown:0},
    refSTART: {just:false,hold:false, count:0, timeOnDown:0},
    refESC: {just:false,hold:false, count:0, timeOnDown:0},

    btnUP: null,
    btnDOWN: null,
    btnLEFT: null,
    btnRIGHT: null,
    btnJUMP: null,
    btnSHOOT: null,
    btnSTART: null,
    btnESC: null,

    pad: null,
    dPadLeft: null,
    dPadRight: null,
    dPadUp: null,
    dPadDown: null,
    dPadJump: null,
    dPadShoot: null,
    dPadStart: null,
    
    init: function(){
        console.log("pad init");

        this.setKeyboardKeys();


        game.input.gamepad.start();


        this.pad = game.input.gamepad.pad1;
        this.setButtons();
        this.pad.onConnectCallback = this.setButtons.bind(this);
        this.pad.onDisconnectCallback = function(){console.log("Controller DICONNECTED")};

        
    },

    setKeyboardKeys: function() {

        this.btnUP = game.input.keyboard.addKey(Config.controlls.up.k);
        this.btnDOWN = game.input.keyboard.addKey(Config.controlls.down.k);
        this.btnLEFT = game.input.keyboard.addKey(Config.controlls.left.k);
        this.btnRIGHT = game.input.keyboard.addKey(Config.controlls.right.k);

        this.btnJUMP = game.input.keyboard.addKey(Config.controlls.jump.k);
        this.btnSTART = game.input.keyboard.addKey(Config.controlls.start.k);
        this.btnSHOOT = game.input.keyboard.addKey(Config.controlls.run.k);
        
        this.btnESC = game.input.keyboard.addKey(Phaser.Keyboard.ESC);


    },

    resetKeyboardKeys: function() {
        this.removeKeys();
        this.setKeyboardKeys();
    },

    isConnected: function() {
        return this.pad.connected;
    },

    removeKeys: function() {
        game.input.keyboard.removeKey(this.btnUP.keyCode);
        game.input.keyboard.removeKey(this.btnLEFT.keyCode);
        game.input.keyboard.removeKey(this.btnRIGHT.keyCode);
        game.input.keyboard.removeKey(this.btnDOWN.keyCode);
        game.input.keyboard.removeKey(this.btnJUMP.keyCode);
        game.input.keyboard.removeKey(this.btnSHOOT.keyCode);
        game.input.keyboard.removeKey(this.btnSTART.keyCode);
        game.input.keyboard.removeKey(this.btnESC.keyCode);
    },

    resetGamePadKeys: function() {
        this.setButtons();
    },

    setButtons: function() {
        console.log("GAME PAD CONNECTED");

        var set = (keyCode) => {
            if (keyCode == null) return null;
            if (keyCode[0] == "P") {
                var code = parseInt(keyCode.substr(2));
                return this.setDPadListeners(code); 
            } else {
                return keyCode;
            }
        }

        this.dPadLeft = set(Config.controlls.left.p);
        this.dPadRight = set(Config.controlls.right.p);
        this.dPadUp = set(Config.controlls.up.p);
        this.dPadDown = set(Config.controlls.down.p);

        this.dPadJump = set(Config.controlls.jump.p);
        this.dPadShoot = set(Config.controlls.run.p);
        this.dPadStart = set(Config.controlls.start.p);
    },

    debugDPad: function() {
        console.log(this.dPadLeft.value, this.dPadRight.value, this.dPadUp.value, this.dPadDown.value, this.dPadJump.value, this.dPadShoot.value);
    },

    isDown: function(key) {
        switch (key) {
            case this.LEFT: 
                return this.refLEFT.just || this.refLEFT.hold;
                break;
            case this.RIGHT: 
                return this.refRIGHT.just || this.refRIGHT.hold;
                break;
            case this.UP: 
                return this.refUP.just || this.refUP.hold;
                break;
            case this.DOWN: 
                return this.refDOWN.just || this.refDOWN.hold;
                break;
            case this.JUMP: 
                return this.refJUMP.just || this.refJUMP.hold;
                break;
            case this.SHOOT: 
                return this.refSHOOT.just || this.refSHOOT.hold;
                break;
            case this.ESC: 
                return this.refESC.just || this.refESC.hold;
                break;
        }
    },

    checkJustDown: function() {
        var set = function(ref, key, padKey) {
            var kDown = key.isDown;
            var pDown = false;
            if (padKey != null) {
                if (typeof padKey == "string") {
                    pDown = Pad.pad.axis(padKey[1]) === (padKey[2] == "+" ? 1 : -1);
                } else {
                    pDown = padKey.isDown;
                }
            }
            
            var isDown = kDown || pDown;
            if (!ref.just && !ref.hold && !isDown) {ref.just = false; ref.hold = false; return;}
            if (!ref.just && !ref.hold && isDown)  {ref.just = true; ref.timeOnDown = game.time.time; ref.hold = false; key.count++; return;}
            if (!ref.just && ref.hold && !isDown)  {ref.just = false; ref.hold = false; return;}
            if (!ref.just && ref.hold && isDown)   {ref.just = false; ref.hold = true ; return;}
            if (ref.just && !ref.hold && !isDown)  {ref.just = false; ref.hold = false; return;}
            if (ref.just && !ref.hold && isDown)   {ref.just = false; ref.hold = true ; return;}
            if (ref.just && ref.hold && !isDown)   {ref.just = false; ref.hold = false; return;}
            if (ref.just && ref.hold && isDown)    {ref.just = false; ref.hold = true; return;}
        }
        set(this.refJUMP, this.btnJUMP, this.dPadJump);
        set(this.refSTART, this.btnSTART, this.dPadStart);
        set(this.refSHOOT, this.btnSHOOT, this.dPadShoot);
        set(this.refUP, this.btnUP, this.dPadUp);
        set(this.refRIGHT, this.btnRIGHT, this.dPadRight);
        set(this.refDOWN, this.btnDOWN, this.dPadDown);
        set(this.refLEFT, this.btnLEFT, this.dPadLeft);
        set(this.refESC, this.btnESC);
    },

    pressedInTime: function(key, timeInMillisec) {
        //timeInMillisec *= 1000;
        switch (key) {
            case this.LEFT: 
                return (game.time.time - timeInMillisec) < this.refLEFT.timeOnDown;
                break;
            case this.RIGHT: 
                return (game.time.time - timeInMillisec) < this.refRIGHT.timeOnDown;
                break;
            case this.DOWN: 
                return (game.time.time - timeInMillisec) < this.refDOWN.timeOnDown;
                break;
            case this.UP: 
                return (game.time.time - timeInMillisec) < this.refUP.timeOnDown;
                break;
            case this.JUMP: 
                return (game.time.time - timeInMillisec) < this.refJUMP.timeOnDown;
                break;
            case this.SHOOT: 
                return (game.time.time - timeInMillisec) < this.refSHOOT.timeOnDown;
                break;
            case this.START: 
                return (game.time.time - timeInMillisec) < this.refSTART.timeOnDown;
                break;
            case this.ESC: 
                return (game.time.time - timeInMillisec) < this.refESC.timeOnDown;
                break;
        }
    },

    justDown: function(key, time) {
        if (time && this.pressedInTime(key, time) == false) return false;
        switch (key) {
            case this.LEFT: 
                return this.refLEFT.just;
                break;
            case this.RIGHT: 
                return this.refRIGHT.just;
                break;
            case this.DOWN: 
                return this.refDOWN.just;
                break;
            case this.UP: 
                return this.refUP.just;
                break;
            case this.JUMP: 
                return this.refJUMP.just;
                break;
            case this.SHOOT: 
                return this.refSHOOT.just;
                break;
            case this.START: 
                return this.refSTART.just;
                break;
            case this.ESC: 
                return this.refESC.just;
                break;
        }
    },

    setDPadListeners: function(key) {
        btn = this.pad.getButton(key);
        if (btn == null) {
            console.log("no button found id: " + key);
            btn = {
                value: 0,
                justPressed: function() {return false;}
            };
        }
        return btn;
    }
}