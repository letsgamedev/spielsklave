
var L = function(key) {
	var getPadCode = function(code) {
		return "";
		if (code == null) return "";
		if (typeof code == "string") return "/" + code;
		return "/P-" + code;
	}
	var replacer = function(input) {
		if (input.includes('{') == false) return input;
		input = input.replace('{VERSION}', 'v0.12.2');
		//input = input.replace('{LEFT}', keyToString(Config.controlls.left.k) + getPadCode(Config.controlls.left.p));
		return input;
	} 

	if (Config.lang == null) Config.lang = navigator.language.indexOf("de") != -1 ? 'de' : 'en';
	Config.lang = "de"; //delete this when english texts are there
	var result = LangKeys[Config.lang][key];
	if (result) return replacer(result);
	return "undefined!";
}

var LangKeys = {
	de : {
		LEFT: "Links",
		RIGHT: "Rechts",
		UP: "Hoch",
		DOWN: "Runter",

		VERSION: "{VERSION}",

		NAME_PLAYER: "Foobar",
		NAME_NPC01: "Homunkulus",

		TEXT01: "Hallo! Drücke 'N' und es geht weiter! So kannst du auch Grabinschriften lesen!",
		TEXT02: "Hier liegt ein Junge mit grüner Zipfelmütze.",
		TEXT03: "Letzte Worte:\nDie Schriftart der Textbox ist scheiße!",
		TEXT04: "Alles muss, nichts kann.",
		
	},

	en : {
		//NOTHING HERE
	}
}
