 var L = function (key) {// eslint-disable-line
   var replacer = function (input) {
     if (input.includes('{') === false) return input
     input = input.replace('{VERSION}', 'v0.16.1')
     return input
   }

   if (Config.lang == null) Config.lang = navigator.language.indexOf('de') !== -1 ? 'de' : 'en'
   Config.lang = 'de' // delete this when english texts are there
   var result = LangKeys[Config.lang][key]
   if (result) return replacer(result)
   return 'undefined!'
 }

 var LangKeys = {
   de: {
     LEFT: 'Links',
     RIGHT: 'Rechts',
     UP: 'Hoch',
     DOWN: 'Runter',

     VERSION: '{VERSION}',

     NAME_PLAYER: 'Foobar',
     NAME_NPC01: 'Homunkulus',

     TEXT01: "Hallo! Drücke 'N' und es geht weiter! So kannst du auch Grabinschriften lesen!",
     TEXT02: 'Hier liegt ein Junge mit grüner Zipfelmütze.',
     TEXT03: 'Letzte Worte:\nDie Schriftart der Textbox ist scheiße!',
     TEXT04: 'Alles muss, nichts kann.',
     TEXT05: 'Hier liegt Berta.',
     TEXT06: 'Seine letzten Worte: Gurg gra huunnnn',
     TEXT07: 'Kauft bei Amazon nur über Let\'s GameDevs Links!',
     TEXT08: 'lol',
     TEXT09: 'rofl',
     TEXT10: 'Die Lindenstrasse fängt gleich an!',
     TEXT11: 'Ich liege rechts aussen...'

   },

   en: {
    // NOTHING HERE
   }
 }
