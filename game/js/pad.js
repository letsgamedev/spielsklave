/**
@author Tom Bleek
@youtube https://www.youtube.com/letsgamedev
@twitter https://twitter.com/letsgamedev
@patreon https://www.patreon.com/letsgamedev
@mail letsgamedev@gmx.de
*/

var Config = {
    controlls: {
        up: {k: Phaser.Keyboard.UP, ka: Phaser.Keyboard.W, p: "A1-"},
        down: {k: Phaser.Keyboard.DOWN, ka: Phaser.Keyboard.S,  p: "A1+"},
        left: {k: Phaser.Keyboard.LEFT, ka: Phaser.Keyboard.A,  p: "A0-"},
        right: {k: Phaser.Keyboard.RIGHT, ka: Phaser.Keyboard.D,  p: "A0+"},
        a: {k: Phaser.Keyboard.N,  p: "P-1"},
        b: {k: Phaser.Keyboard.B,  p: "P-2"},
        x: {k: Phaser.Keyboard.H,  p: "P-0"},
        y: {k: Phaser.Keyboard.G,  p: "P-3"},
        l: {k: Phaser.Keyboard.Q,  p: "P-4"},
        r: {k: Phaser.Keyboard.E,  p: "P-5"},
        start: {k: Phaser.Keyboard.ENTER, p: 9},
        select: {k: Phaser.Keyboard.C, p: 8}
    }};
var Pad = {
    UP: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
    A: 4,
    B: 5,
    X: 6,
    Y: 7,
    L: 8,
    R: 9,
    START: 10,
    SELECT: 11,
    ESC: 12,

    refUP: {just:false,hold:false, count:0, timeOnDown:0},
    refLEFT: {just:false,hold:false, count:0, timeOnDown:0},
    refRIGHT: {just:false,hold:false, count:0, timeOnDown:0},
    refDOWN: {just:false,hold:false, count:0, timeOnDown:0},
    refA: {just:false,hold:false, count:0, timeOnDown:0},
    refB: {just:false,hold:false, count:0, timeOnDown:0},
    refX: {just:false,hold:false, count:0, timeOnDown:0},
    refY: {just:false,hold:false, count:0, timeOnDown:0},
    refL: {just:false,hold:false, count:0, timeOnDown:0},
    refR: {just:false,hold:false, count:0, timeOnDown:0},
    refSTART: {just:false,hold:false, count:0, timeOnDown:0},
    refSELECT: {just:false,hold:false, count:0, timeOnDown:0},
    refESC: {just:false,hold:false, count:0, timeOnDown:0},
    refBTNs: [],

    btnUP: null,
    btnDOWN: null,
    btnLEFT: null,
    btnRIGHT: null,
    btnA: null,
    btnB: null,
    btnX: null,
    btnY: null,
    btnL: null,
    btnR: null,
    btnSTART: null,
    btnSELECT: null,
    btnESC: null,
    btnALL:[],

    pad: null,
    dPadLeft: null,
    dPadRight: null,
    dPadUp: null,
    dPadDown: null,
    dPadA: null,
    dPadB: null,
    dPadX: null,
    dPadY: null,
    dPadL: null,
    dPadR: null,
    dPadStart: null,
    dPadSelect: null,
    dPadAll: [],
    
    init: function(){
        console.log("pad init");

        this.setKeyboardKeys();

        this.refBTNs = [this.refUP, this.refDOWN, this.refLEFT, this.refRIGHT, this.refA, this.refB, this.refX, this.refY, this.refL, this.refR, this.refSTART, this.refSELECT,this.refESC];
        this.btnALL = [this.btnUP, this.btnDOWN, this.btnLEFT, this.btnRIGHT, this.btnA, this.btnB, this.btnX, this.btnY, this.btnL, this.btnR, this.btnSTART, this.btnSELECT,this.btnESC];
        this.dPadAll = [this.dPadUp, this.dPadDown, this.dPadLeft, this.dPadRight, this.dPadA, this.dPadB, this.dPadX, this.dPadY, this.dPadL, this.dPadR, this.dPadStart, this.dPadSelect];

        game.input.gamepad.start();


        this.pad = game.input.gamepad.pad1;
        this.setButtons();
        this.pad.onConnectCallback = this.setButtons.bind(this);
        this.pad.onDisconnectCallback = function(){console.log("Controller DISCONNECTED")};

        
    },

    addVirtualButtons: function(game) {
        var alpha = 0.5;
        var group = game.add.group();

        function add(x, y, name, ref) {
            var btn = game.add.sprite(x, y, "atlas_pad", name, group);
            btn.oriPos = {x: x, y: y};
            btn.inputEnabled = true;
            btn.alpha = alpha;
            btn.events.onInputDown.add(function(){
                btn.isDown = true;
                btn.y = btn.oriPos.y + 1;
            }, this);
            btn.events.onInputUp.add(function(){
                btn.isDown = false;
                btn.x = btn.oriPos.x;
                btn.y = btn.oriPos.y;
            }, this);

            ref.virtualBtn = btn;
        }

        group.fixedToCamera = true;

        add(game.width - 50 - 25, game.height - 50 - 25, "btn", this.btnX);
        add(game.width - 50 - 85, game.height - 50 - 25, "btn", this.btnY);

        var back = game.add.sprite(75, game.height - 75, "atlas_pad", "back", group);
        back.anchor.set(0.5);
        back.alpha = alpha;

        var circle = game.add.sprite(back.x, back.y, "atlas_pad", "btn");
            circle.oriPos = {x: circle.x, y: circle.y};
            circle.anchor.set(0.5);
            circle.alpha = alpha;
            circle.inputEnabled = true;
            circle.fixedToCamera = true;
            circle.input.enableDrag(true);

            circle.events.onDragUpdate.add(function(sprite, pointer){
                var angle = Math.PI * 0.2 - game.math.angleBetweenPoints(circle.oriPos, {x: sprite.cameraOffset.x, y: sprite.cameraOffset.y});
                this.btnRIGHT.virtualBtn.isDown = false; 
                this.btnLEFT.virtualBtn.isDown = false; 
                this.btnUP.virtualBtn.isDown = false; 
                this.btnDOWN.virtualBtn.isDown = false; 

                switch (Math.round(angle / Math.PI * 4)) {
                    case 1: console.log("right");
                        this.btnRIGHT.virtualBtn.isDown = true; 
                        break;
                    case 2: 
                        this.btnRIGHT.virtualBtn.isDown = true; 
                        this.btnUP.virtualBtn.isDown = true; 
                        break;
                    case 3: 
                        this.btnUP.virtualBtn.isDown = true;
                        break;
                    case 4: 
                        this.btnLEFT.virtualBtn.isDown = true; 
                        this.btnUP.virtualBtn.isDown = true; 
                        break;
                    case 5: 
                    case -3: 
                        this.btnLEFT.virtualBtn.isDown = true;
                        break;
                    case -2: 
                        this.btnLEFT.virtualBtn.isDown = true; 
                        this.btnDOWN.virtualBtn.isDown = true; 
                        break;
                    case -1: 
                        this.btnDOWN.virtualBtn.isDown = true; 
                        break;
                    case 0: 
                        this.btnRIGHT.virtualBtn.isDown = true; 
                        this.btnDOWN.virtualBtn.isDown = true; 
                        break;
                }
            }, this);
            circle.events.onDragStop.add(function(sprite, pointer){
                this.btnRIGHT.virtualBtn.isDown = false; 
                this.btnLEFT.virtualBtn.isDown = false; 
                this.btnUP.virtualBtn.isDown = false; 
                this.btnDOWN.virtualBtn.isDown = false; 
                circle.x = circle.oriPos.x;
                circle.y = circle.oriPos.y;
            }, this);
            circle.events.onInputUp.add(function(){
                circle.isDown = false;
                circle.cameraOffset.x = circle.oriPos.x;
                circle.cameraOffset.y = circle.oriPos.y;
            }, this);

            this.btnUP.virtualBtn = {isDown: false};
            this.btnDOWN.virtualBtn = {isDown: false};
            this.btnLEFT.virtualBtn = {isDown: false};
            this.btnRIGHT.virtualBtn = {isDown: false};

            game.input.maxPointers = 2;
            game.input.addPointer();

        
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

        this.btnA = game.input.keyboard.addKey(Config.controlls.a.k);
        this.btnB = game.input.keyboard.addKey(Config.controlls.b.k);
        this.btnX = game.input.keyboard.addKey(Config.controlls.x.k);
        this.btnY = game.input.keyboard.addKey(Config.controlls.y.k);
        this.btnL = game.input.keyboard.addKey(Config.controlls.l.k);
        this.btnR = game.input.keyboard.addKey(Config.controlls.r.k);
        this.btnSTART = game.input.keyboard.addKey(Config.controlls.start.k);
        this.btnSELECT = game.input.keyboard.addKey(Config.controlls.select.k);
        
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

        var set = function(keyCode) {
            if (keyCode == null) return null;
            if (keyCode[0] == "P") {
                var code = parseInt(keyCode.substr(2));
                console.log(keyCode, code)
                return Pad.setDPadListeners(code); 
            } else {
                return keyCode;
            }
        }

        this.dPadLeft = set(Config.controlls.left.p);
        this.dPadRight = set(Config.controlls.right.p);
        this.dPadUp = set(Config.controlls.up.p);
        this.dPadDown = set(Config.controlls.down.p);

        this.dPadA = set(Config.controlls.a.p);
        this.dPadB = set(Config.controlls.b.p);
        this.dPadX = set(Config.controlls.x.p);
        this.dPadY = set(Config.controlls.y.p);
        this.dPadL = set(Config.controlls.l.p);
        this.dPadR = set(Config.controlls.r.p);
        this.dPadStart = set(Config.controlls.start.p);
        this.dPadSelect = set(Config.controlls.select.p);
        this.dPadAll = [this.dPadUp, this.dPadDown, this.dPadLeft, this.dPadRight, this.dPadA, this.dPadB, this.dPadX, this.dPadY, this.dPadL, this.dPadR, this.dPadStart, this.dPadSelect];

        //game.input.gamepad.onDownCallback = function(btnCode) {
        //    console.log(btnCode)
        //}

        //game.input.gamepad.onAxisCallback = function(btnCode, axis, direction) {
        //    console.log(btnCode,b,c)
        //}
    },

    debugDPad: function() {
        console.log(this.dPadLeft.value, this.dPadRight.value, this.dPadUp.value, this.dPadDown.value, this.dPadA.value, this.dPadB.value, this.dPadX.value, this.dPadY.value, this.dPadL.value, this.dPadR.value, this.dPadStart.value, this.dPadSelect.value);
    },

    isDown: function(key) {
        return this.refBTNs[key].just || this.refBTNs[key].hold;
    },

    checkJustDown: function() {
        var set = function(ref, key, padKey) {
            var kDown = key.isDown;
            if (key.alternateKey) kDown = kDown || key.alternateKey.isDown;
            if (key.virtualBtn) kDown = kDown || key.virtualBtn.isDown;
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
};