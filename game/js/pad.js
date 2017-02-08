/**
@author Tom Bleek
@youtube https://www.youtube.com/letsgamedev
@twitter https://twitter.com/letsgamedev
@patreon https://www.patreon.com/letsgamedev
@mail letsgamedev@gmx.de
*/

var Config = {
    controlls: {
        up: {k: Phaser.Keyboard.UP, ka: Phaser.Keyboard.W, p: null},
        down: {k: Phaser.Keyboard.DOWN, ka: Phaser.Keyboard.S, p: null},
        left: {k: Phaser.Keyboard.LEFT, ka: Phaser.Keyboard.A, p: null},
        right: {k: Phaser.Keyboard.RIGHT, ka: Phaser.Keyboard.D, p: null},
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
    refBTNs: [],

    btnUP: null,
    btnDOWN: null,
    btnLEFT: null,
    btnRIGHT: null,
    btnJUMP: null,
    btnSHOOT: null,
    btnSTART: null,
    btnESC: null,
    btnALL:[],

    pad: null,
    dPadLeft: null,
    dPadRight: null,
    dPadUp: null,
    dPadDown: null,
    dPadJump: null,
    dPadShoot: null,
    dPadStart: null,
    dPadAll: [],
    
    init: function(){
        console.log("pad init");

        this.setKeyboardKeys();

        this.refBTNs = [this.refUP, this.refDOWN, this.refLEFT, this.refRIGHT, this.refJUMP, this.refSHOOT, this.refSTART,this.refESC];
        this.btnALL = [this.btnUP, this.btnDOWN, this.btnLEFT, this.btnRIGHT, this.btnJUMP, this.btnSHOOT, this.btnSTART,this.btnESC];
        this.dPadAll = [this.dPadUp, this.dPadDown, this.dPadLeft, this.dPadRight, this.dPadJump, this.dPadShoot, this.dPadStart];

        game.input.gamepad.start();


        this.pad = game.input.gamepad.pad1;
        this.setButtons();
        this.pad.onConnectCallback = this.setButtons.bind(this);
        this.pad.onDisconnectCallback = function(){console.log("Controller DICONNECTED")};

        
    },

    setKeyboardKeys: function() {

        this.btnUP = game.input.keyboard.addKey(Config.controlls.up.k);
        this.btnUP.alternateKey = game.input.keyboard.addKey(Config.controlls.up.ka);
        
        this.btnDOWN = game.input.keyboard.addKey(Config.controlls.down.k);
        this.btnDOWN.alternateKey = game.input.keyboard.addKey(Config.controlls.down.ka);
        
        this.btnLEFT = game.input.keyboard.addKey(Config.controlls.left.k);
        this.btnLEFT.alternateKey = game.input.keyboard.addKey(Config.controlls.left.ka);
        
        this.btnRIGHT = game.input.keyboard.addKey(Config.controlls.right.k);
        this.btnRIGHT.alternateKey = game.input.keyboard.addKey(Config.controlls.right.ka);

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
        for (var i = 0; i < this.btnALL.length; i++) {
            game.input.keyboard.removeKey(this.btnALL[i].keyCode);
        };
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
        return this.refBTNs[key].just || this.refBTNs[key].hold;
    },

    checkJustDown: function() {
        var set = function(ref, key, padKey) {
            var kDown = key.isDown;
            if (key.alternateKey) kDown = key.isDown || key.alternateKey.isDown;
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
            if (!ref.just && !ref.hold && isDown)  {ref.just = true; ref.timeOnDown = game.time.time; ref.hold = false; key.count++; if(key.alternateKey)key.alternateKey.count++ ; return;}
            if (!ref.just && ref.hold && !isDown)  {ref.just = false; ref.hold = false; return;}
            if (!ref.just && ref.hold && isDown)   {ref.just = false; ref.hold = true ; return;}
            if (ref.just && !ref.hold && !isDown)  {ref.just = false; ref.hold = false; return;}
            if (ref.just && !ref.hold && isDown)   {ref.just = false; ref.hold = true ; return;}
            if (ref.just && ref.hold && !isDown)   {ref.just = false; ref.hold = false; return;}
            if (ref.just && ref.hold && isDown)    {ref.just = false; ref.hold = true; return;}
        }

        for (var i = 0; i < this.dPadAll.length; i++) {
            set(this.refBTNs[i], this.btnALL[i], this.dPadAll[i]);
        };
    },

    pressedInTime: function(key, timeInMillisec) {
        return (game.time.time - timeInMillisec) < this.refBTNs[key].timeOnDown;
    },

    justDown: function(key, time) {
        if (time && this.pressedInTime(key, time) == false) return false;
        return this.refBTNs[key].just;
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