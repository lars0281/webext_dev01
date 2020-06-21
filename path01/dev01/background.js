


let salt;

let db;

let indexedDB;

//browser.contextMenus.create({
//    id: "log-selection",
//    title: "Log '%s' to the console",
//    contexts: ["selection"]
//});

//browser.contextMenus.create({
//    id: "glovebox-encrypt",
//    title: "encrypt selected text",
//    contexts: ["selection"]
//});

//browser.contextMenus.create({
//    id: "glovebox-decrypt",
//    title: "decrypt selected text",
//    contexts: ["selection"]
//});

//
browser.contextMenus.create({
    id: "glovebox-testencrypttextonly",
    title: "testencrypt_textonly",
    contexts: ["selection"]
});

browser.contextMenus.create({
    id: "glovebox-testencrypthtml",
    title: "testencrypt_html",
    contexts: ["selection"]
});

browser.contextMenus.create({
    id: "glovebox-testdecrypttextonly",
    title: "testdecrypt textonly",
    contexts: ["selection"]
});

browser.contextMenus.create({
    id: "glovebox-testdecrypthtml",
    title: "testdecrypt html",
    contexts: ["selection"]
});

browser.contextMenus.create({
    id: "glovebox-pastedecryptiontoken",
    title: "paste decryptiontoken",
    contexts: ["selection"]
});

browser.contextMenus.create({
    id: "glovebox-acceptdecryptiontoken_open",
    title: "accept decryptiontoken",
    contexts: ["selection"]
});

// Add a context menu action on every image element in the page.
browser.contextMenus.create({
    id: "glovebox-key",
    title: "Add to the collected keys",
    contexts: ["image"],
});

browser.browserAction.onClicked.addListener(() => {
    // use this functionality to get a full tabpage
    browser.tabs.create({
        url: "/navigate-collection.html"
    });
    // can replace this with a direct referal to this html from the manifest
    // "browser_action": {
    // "default_popup": "navigate-collection.html"

});

if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}

let pendingCollectedUrls = [];

browser.contextMenus.onClicked.addListener((info, tab) => {
    console.log("background.js: browser.contextMenus.onClicked.addListener");
    console.log("background.js: browser.contextMenus.onClicked.addListener:info:" + JSON.stringify(info));
    console.log("background.js: browser.contextMenus.onClicked.addListener:tab:" + JSON.stringify(tab));

    if (info.menuItemId === "glovebox-key") {
        // use the selected text to read out the key for this user from the database


        console.log("glovebox-key");

        //   try {
        //      browser.runtime.sendMessage({
        //          type: "new-collected-images",
        //          url: info.srcUrl,
        //      });
        //  } catch (err) {
        //    if (err.message.includes("Could not establish connection. Receiving end does not exist.")) {
        // Add the url to the pending urls and open a popup.
        //       pendingCollectedUrls.push(info.srcUrl);

        try {
            browser.windows.create({
                type: "popup",
                url: "/popup.html",
                top: 0,
                left: 0,
                width: 300,
                height: 400,
            });
        } catch (err) {
            console.error(err);
        }
        return;
        //     }

    }

    if (info.menuItemId === "glovebox-acceptdecryptiontoken_open") {
        console.log("background.js: glovebox-acceptdecryptiontoken_open");
        // accepts a decryption token of type "open", into the database
        // suitable for use in a chat window


        indexedDB = window.indexedDB || window.webkitIndexedDB ||
            window.mozIndexedDB || window.msIndexedDB;

        var request = indexedDB.open("trustedDecryptionKeys", 1);
        request.onupgradeneeded = function (event) {
            db = event.target.result;
            db.onerror = function (event) {};
            // Create an objectStore in this database to keep trusted decryption keys
            console.log("background.js: create objectstore decryptionKeys in trustedDecryptionKeys");
            var objectStore2 = db.createObjectStore("decryptionKeys", {
                    keyPath: "keyId"
                });

            objectStore2.createIndex("keyId", "keyId", {
                unique: true
            });
        };
        request.onerror = function (event) {
            console.log("background.js: dp open request error 201");
        };
        request.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                console.log("background.js: db open request error 2");
            };
            db.onsuccess = function (event) {
                console.log("background.js: db open request success 2");
            };
        };

        var request2 = indexedDB.open("encryptionKeys", 1);
        request2.onupgradeneeded = function (event) {
            db = event.target.result;
            db.onerror = function (event) {};
            // Create an objectStore in this database to keep trusted decryption keys
            console.log("background.js: create objectstore encryptionKeys in encryptionKeys");
            var objectStore2 = db.createObjectStore("encryptionKeys", {
                    keyPath: "keyId"
                });

            objectStore2.createIndex("keyId", "keyId", {
                unique: true
            });
        };
        request2.onerror = function (event) {
            console.log("background.js: dp open request error 201");
        };
        request2.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                console.log("background.js: db open request error 2");
            };
            db.onsuccess = function (event) {
                console.log("background.js: db open request success 2");
            };
        };

        // execute script in active tab
        // colllect the token
        console.log("###calling AcceptToken_open.js");

        browser.tabs.executeScript({
            file: "AcceptToken_open.js",
            allFrames: true
        }).then(function (result) {
            console.log("background.js:onExecuted4: We made it ....");
            // console.log("background.js:onExecuted4: result: " + result);
            // console.log("backgroupd.js:onExecuted4:selected_text: " + selected_text);
            // console.log("backgroupd.js:onExecuted4:replacement_text: " + replacement_text);
            // query for the one active tab
            return browser.tabs.query({
                active: true,
                currentWindow: true
            });
        }).then(function (tabs) {
            // send message to the active tab
            return browser.tabs.sendMessage(tabs[0].id, {
                replacement: "Glovebox token read."
            });
        }).then(function (res) {
            console.log("###### getHTML response " + JSON.stringify(res));
            glovebox_token_ciphertext = res.response.token;

            // get info out of token
            var decryptkey_uuid_regex = /:GloveboxToken:[^:]*:([^:]*):/g;
            var decryptkey_uuid = "";
            var decryptkey_username_regex = /:GloveboxToken:([^:]*):/g;
            var decryptkey_username = "";
            var decryptkey_key_regex = /:GloveboxToken:[^:]*:[^:]*:([^:]*):/g;
            var decryptkey_key = "";
            if ((match3 = decryptkey_uuid_regex.exec(glovebox_token_ciphertext)) != null) {
                decryptkey_uuid = match3[1];
                console.log("###### getHTML decryptkey id: " + decryptkey_uuid);
            }
            if ((match3 = decryptkey_username_regex.exec(glovebox_token_ciphertext)) != null) {
                decryptkey_username = match3[1];
                console.log("###### getHTML decryptkey_username: " + decryptkey_username);
            }
            if ((match3 = decryptkey_key_regex.exec(glovebox_token_ciphertext)) != null) {
                decryptkey_key = match3[1];
                console.log("###### getHTML decryptkey_key: " + decryptkey_key);
            }

            newItem = {
                "keyId": decryptkey_uuid,
                "uuid": decryptkey_uuid,
                "jwk": {
                    "alg": "A128GCM",
                    "ext": true,
                    "k": decryptkey_key,
                    "key_ops": ["decrypt"],
                    "kty": "oct"
                },
                "format": "jwk",
                "username": decryptkey_username,
                "ext": true
            };

            // insert key into the database of trusted decryption keys
            saveToIndexedDB('trustedDecryptionKeys', 'decryptionKeys', 'keyId', newItem).then(function (response) {});

        });

    }

    if (info.menuItemId === "glovebox-pastedecryptiontoken") {
        console.log("background.js: glovebox-pastedecryptiontoken");
        // insert an importabe decryption token
        // suitable for use in a chat window


        indexedDB = window.indexedDB || window.webkitIndexedDB ||
            window.mozIndexedDB || window.msIndexedDB;

        var request = indexedDB.open("trustedDecryptionKeys", 1);
        request.onupgradeneeded = function (event) {
            db = event.target.result;
            db.onerror = function (event) {};
            // Create an objectStore in this database to keep trusted decryption keys
            console.log("background.js: create objectstore decryptionKeys in trustedDecryptionKeys");
            var objectStore2 = db.createObjectStore("decryptionKeys", {
                    keyPath: "keyId"
                });

            objectStore2.createIndex("keyId", "keyId", {
                unique: true
            });
        };
        request.onerror = function (event) {
            console.log("background.js: dp open request error 201");
        };
        request.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                console.log("background.js: db open request error 2");
            };
            db.onsuccess = function (event) {
                console.log("background.js: db open request success 2");
            };
        };

        var request2 = indexedDB.open("encryptionKeys", 1);
        request2.onupgradeneeded = function (event) {
            db = event.target.result;
            db.onerror = function (event) {};
            // Create an objectStore in this database to keep trusted decryption keys
            console.log("background.js: create objectstore encryptionKeys in encryptionKeys");
            var objectStore2 = db.createObjectStore("encryptionKeys", {
                    keyPath: "keyId"
                });

            objectStore2.createIndex("keyId", "keyId", {
                unique: true
            });
        };
        request2.onerror = function (event) {
            console.log("background.js: dp open request error 201");
        };
        request2.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                console.log("background.js: db open request error 2");
            };
            db.onsuccess = function (event) {
                console.log("background.js: db open request success 2");
            };
        };

        //


        // generate a Globebox descryption token form the default encryption key
        var glovebox_key_token_openform = "";
        //getDefaultSecretKey
        getDefaultSecretKey().then(function (obj) {
            // use the key

            console.log("default key: " + JSON.stringify(obj));
            // Glovebox keytoken open syntax:":CloveboxToken:<username>:<keyuuid>:<base64(decryptionkey)>:"
            // Glovebox keytoken open sample:":CloveboxToken:username01@domain.org:asasd-bb-erw-w45gvs-5asd:fsdawwefwrwtgRgevWefsfsetg3563rgvegreRErgvE==:"


            glovebox_key_token_openform = ':GloveboxToken:username01@domain.org:' + obj.uuid + ':' + obj.key + ':';

            console.log(" created token " + glovebox_key_token_openform);
            console.log("###calling InsertDecyrptionToken.js");

            return browser.tabs.executeScript({
                file: "InsertDecyrptionToken.js"
            });
        }).then(
            function (result) {
            console.log("backgroupd.js:onExecuted4:glovebox_key_token_openform: " + glovebox_key_token_openform);
            return browser.tabs.query({
                active: true,
                currentWindow: true
            });
        }).then(function (tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                token: glovebox_key_token_openform
            });
        }).then(function (r) {
            // call to remove page listener
            console.log("###calling RemoveTabOnMessageListenerInsertDecyrptionToken.js");

            browser.tabs.executeScript({
                file: "RemoveTabOnMessageListenerInsertDecyrptionToken.js",
                allFrames: true
            });

        });

    }

    if (info.menuItemId === "glovebox-testencrypttextonly") {
        console.log("glovebox-testencrypttextonly");
        indexedDB = window.indexedDB || window.webkitIndexedDB ||
            window.mozIndexedDB || window.msIndexedDB;

        var request = indexedDB.open("trustedDecryptionKeys", 1);
        request.onupgradeneeded = function (event) {
            db = event.target.result;
            db.onerror = function (event) {};
            // Create an objectStore in this database to keep trusted decryption keys
            console.log("background.js: create objectstore decryptionKeys in trustedDecryptionKeys");
            var objectStore2 = db.createObjectStore("decryptionKeys", {
                    keyPath: "keyId"
                });

            objectStore2.createIndex("keyId", "keyId", {
                unique: true
            });
        };
        request.onerror = function (event) {
            console.log("background.js: dp open request error 201");
        };
        request.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                console.log("background.js: db open request error 2");
            };
            db.onsuccess = function (event) {
                console.log("background.js: db open request success 2");
            };
        };

        var request2 = indexedDB.open("encryptionKeys", 1);
        request2.onupgradeneeded = function (event) {
            db = event.target.result;
            db.onerror = function (event) {};
            // Create an objectStore in this database to keep trusted decryption keys
            console.log("background.js: create objectstore encryptionKeys in encryptionKeys");
            var objectStore2 = db.createObjectStore("encryptionKeys", {
                    keyPath: "keyId"
                });

            objectStore2.createIndex("keyId", "keyId", {
                unique: true
            });
        };
        request2.onerror = function (event) {
            console.log("background.js: dp open request error 201");
        };
        request2.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                console.log("background.js: db open request error 2");
            };
            db.onsuccess = function (event) {
                console.log("background.js: db open request success 2");
            };
        };

        console.log("info = " + JSON.stringify(info));
        console.log("info.selectionText = " + info.selectionText);

        var selected_text = new String(info.selectionText);
        console.log("backgroupd.js:selected_text: " + selected_text);

        // pull out the complete html of the selection


        console.log("background.js:selected_text: " + selected_text);
        // ok, make call to tab to grab the complete selection html
        var replacement_text = new String("");
        var usekey;
        var usekey_uuid;
        console.log('attempt 2 key loaded OK: ');

        // pickup default encryption key from database
        //loadFromIndexedDB('encryptionKeys', 'encryptionKeys', 'defaultSecretKey').then(function (response) {
        getDefaultSecretKey().then(function (response) {

            console.log('2 default encryption key loaded OK: ' + JSON.stringify(response));

            usekey = response.jwk;
            usekey_uuid = response.uuid;

            console.log("##usethiskey: " + usekey.k);
            console.log("##usethiskey(uuid): " + usekey_uuid);
            // proceed with encryption


            /*
            Store the calculated ciphertext and counter here, so we can decrypt the message later.
             */
            let ciphertext;
            let counter;

            var algoKeyGen = {
                name: 'AES-GCM',
                //          length: 256
                length: 128
            };
            //        var iv = window.crypto.getRandomValues(new Uint8Array(12));
            var iv = new Uint8Array(12);
            var algoEncrypt = {
                name: 'AES-GCM',
                iv: iv,
                tagLength: 128
            };

            console.log('algoEncrypt: ' + JSON.stringify(algoEncrypt));

            var keyUsages = [
                'encrypt',
                'decrypt'
            ];
            console.log('keyUsages: ' + JSON.stringify(keyUsages));

            var secretKey;
            var exportedKey;
            var encryptedText;

            //window.crypto.subtle.generateKey(algoKeyGen, true, keyUsages).then(function (key) {

            console.log('import: ' + JSON.stringify(usekey));

            window.crypto.subtle.importKey("jwk", usekey, {
                name: 'AES-GCM'
            }, true, keyUsages).then(function (key) {
                secretKey = key;
                console.log('background.js:0' + key);
                console.log('background.js:0: ' + usekey.k);

                console.log('background.js:0: source text length: ' + selected_text.length);
                var shorty_out = new Shorty();
                var compressed_plaintext = shorty_out.deflate(selected_text);

                console.log('background.js:0: compressed text: ' + compressed_plaintext);
                console.log('background.js:0: compressed text length: ' + compressed_plaintext.length);

                console.log('background.js:0: compressed text arraybuffer: ' + strToArrayBuffer(compressed_plaintext));
                console.log('background.js:0: compressed text arraybuffer: ' + JSON.stringify(strToArrayBuffer(compressed_plaintext)));
                console.log('background.js:0: compressed text arraybuffer: ' + strToArrayBuffer(compressed_plaintext));

                return window.crypto.subtle.encrypt(algoEncrypt, key, strToArrayBuffer(compressed_plaintext));

            }).then(function (cipherText) {

                encryptedText = cipherText;
                console.log('Cipher Text1: ' + arrayBufferToString(cipherText));
                console.log('background.js:secretKey 1' + secretKey);
                console.log('background.js:secretKey 1' + JSON.stringify(secretKey));
                return window.crypto.subtle.exportKey("jwk", secretKey);
            }).then(function (expkey) {
                console.log('background.js:secretKey 2' + secretKey);
                exportedKey = expkey.kgene
                    console.log('key export: ' + JSON.stringify(expkey));
                exportedKey = expkey.k;
                return expkey.k;
            }).catch(e => {
                console.log('There has been a problem with your key export operation: ' + e.message);
            }).then(function (expkeybase64) {
                // carry on the rewriting

// rewrite the base64 text to somethng that looks less suspicious
 var psuedo_text = convertBase64ToPsuedoText(usekey_uuid + ":" + _arrayBufferToBase64(encryptedText));

                console.log("psuedo_text: " + psuedo_text);
                console.log("psuedo_text(resolved: " + convertPsuedoTextToBase64(psuedo_text));


                // the replacement text is a concatenation of the cipher text and additional referecens. These references are there to both uniquely identify the text content as having been encrypted by Glovebox and provide whatever information is required to identify the key needed to decrypt it.

                //  var replacement_text = new String("Glovebox:" + exported key in base 64 + _arrayBufferToBase64(cipherText));

                // create the replacement text
                //replacement_text = replacement_text + ":Glovebox:" + SHA1(exportedKey) + ":" + _arrayBufferToBase64(encryptedText) + ":" + exportedKey + ":";
                replacement_text = replacement_text + ":Glovebox:" + psuedo_text + ':';

               
                console.log("usethiskey(uuid): " + usekey_uuid);

                console.log('Cipher Text (base64 enc): ' + _arrayBufferToBase64(encryptedText));
                console.log('Psuedo Text (base64 enc): ' + psuedo_text);
                console.log("###calling TextToCiphertext.js");

                return browser.tabs.executeScript({
                    file: "TextToCiphertext.js"
                });
            }).then(function (result) {
                console.log("background.js:onExecuted4: We made it ....");
                console.log("background.js:onExecuted4: result: " + result);
                console.log("backgroupd.js:onExecuted4:selected_text: " + selected_text);
                console.log("backgroupd.js:onExecuted4:replacement_text: " + replacement_text);
                return browser.tabs.query({
                    active: true,
                    currentWindow: true
                });
            }).then(function (tabs) {
                browser.tabs.sendMessage(tabs[0].id, {
                    text_replacement_text: replacement_text,
                    regex: selected_text
                });

            }).then(function (r) {
                // call to remove page listener
                console.log("###calling RemoveTabOnMessageListenerTextToCiphertext.js");

                browser.tabs.executeScript({
                    file: "RemoveTabOnMessageListenerTextToCiphertext.js",
                    allFrames: true
                });

            });

        });

    }

    if (info.menuItemId === "glovebox-testencrypthtml") {
        // use the selected text to read out the key for this user from the database
        console.log("glovebox-testencrypthtml");
        indexedDB = window.indexedDB || window.webkitIndexedDB ||
            window.mozIndexedDB || window.msIndexedDB;

        var request = indexedDB.open("trustedDecryptionKeys", 1);
        request.onupgradeneeded = function (event) {
            db = event.target.result;
            db.onerror = function (event) {};
            // Create an objectStore in this database to keep trusted decryption keys
            console.log("background.js: create objectstore decryptionKeys in trustedDecryptionKeys");
            var objectStore2 = db.createObjectStore("decryptionKeys", {
                    keyPath: "keyId"
                });

            objectStore2.createIndex("keyId", "keyId", {
                unique: true
            });
        };
        request.onerror = function (event) {
            console.log("background.js: dp open request error 201");
        };
        request.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                console.log("background.js: db open request error 2");
            };
            db.onsuccess = function (event) {
                console.log("background.js: db open request success 2");
            };
        };

        var request2 = indexedDB.open("encryptionKeys", 1);
        request2.onupgradeneeded = function (event) {
            db = event.target.result;
            db.onerror = function (event) {};
            // Create an objectStore in this database to keep trusted decryption keys
            console.log("background.js: create objectstore encryptionKeys in encryptionKeys");
            var objectStore2 = db.createObjectStore("encryptionKeys", {
                    keyPath: "keyId"
                });

            objectStore2.createIndex("keyId", "keyId", {
                unique: true
            });
        };
        request2.onerror = function (event) {
            console.log("background.js: dp open request error 201");
        };
        request2.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                console.log("background.js: db open request error 2");
            };
            db.onsuccess = function (event) {
                console.log("background.js: db open request success 2");
            };
        };

        // call out to the tab to collect the complete html selected
        var replacement_text = new String("");

        var selection_html;
        var usekey;
        var usekey_uuid;

        console.log("###calling GetSelectedHTML.js");

        // execute script in active tab
        browser.tabs.executeScript({
            file: "GetSelectedHTML.js",
            allFrames: true
        }).then(function (result) {
            console.log("background.js:onExecuted: result: " + JSON.stringify(result));
            // query for the one active tab
            return browser.tabs.query({
                active: true,
                currentWindow: true
            });
        }).then(function (tabs) {
            console.log("###### GetSelectedHTML response " + JSON.stringify(tabs));
            // send message to the active tab
            return browser.tabs.sendMessage(tabs[0].id, {
                GetSelectedHTML: "Glbx_marker"
            });
        }).then(function (res) {
            //  console.log("###### getHTML response " + res);
            console.log("###### GetSelectedHTML response " + JSON.stringify(res));
            selection_html = res.response.doc;
            // procceed with compression and encryption
            console.log("###### GetSelectedHTML response: " + selection_html);
            //  console.log("###### GetSelectedHTML response: " + JSON.stringify(selection_html));

            return getDefaultSecretKey();
        }).then(function (response) {

            console.log('2 default encryption key loaded OK: ' + JSON.stringify(response));

            usekey = response.jwk;
            usekey_uuid = response.uuid;

            console.log("##usethiskey: " + usekey.k);
            console.log("##usethiskey(uuid): " + usekey_uuid);
            // proceed with encryption

            let ciphertext;
            let counter;

            //        var iv = window.crypto.getRandomValues(new Uint8Array(12));

            var keyUsages = [
                'encrypt',
                'decrypt'
            ];

            var secretKey;
            var exportedKey;
            var encryptedText;

            return window.crypto.subtle.importKey("jwk", usekey, {
                name: 'AES-GCM'
            }, true, keyUsages);
        }).then(function (key) {
            secretKey = key;
            console.log('background.js:0' + key);
            console.log('background.js:0: ' + usekey.k);

            console.log('background.js:0: source text length: ' + selection_html.length);
            var shorty_out = new Shorty();
            var compressed_plaintext = shorty_out.deflate(selection_html);

            console.log('background.js:0: compressed text: ' + compressed_plaintext);
            console.log('background.js:0: compressed text length: ' + compressed_plaintext.length);

            console.log('background.js:0: compressed text arraybuffer: ' + strToArrayBuffer(compressed_plaintext));
            console.log('background.js:0: compressed text arraybuffer: ' + JSON.stringify(strToArrayBuffer(compressed_plaintext)));
            console.log('background.js:0: compressed text arraybuffer: ' + strToArrayBuffer(compressed_plaintext));
            var iv = new Uint8Array(12);

            var algoEncrypt = {
                name: 'AES-GCM',
                iv: iv,
                tagLength: 128
            };
            //    return window.crypto.subtle.encrypt(algoEncrypt, key, strToArrayBuffer(plaintext));
            return window.crypto.subtle.encrypt(algoEncrypt, key, strToArrayBuffer(compressed_plaintext));

        }).then(function (cipherText) {

            // the replacement text is a concatenation of the cipher text and additional referecens. These references are there to both uniquely identify the text content as having been encrypted by Glovebox and provide whatever information is required to identify the key needed to decrypt it.

            replacement_text = replacement_text + ":Glovebox:" + convertBase64ToPsuedoText(usekey_uuid + ":" + _arrayBufferToBase64(cipherText)) + ':';

            console.log("usethiskey(uuid): " + usekey_uuid);

            console.log('Cipher Text (base64 enc): ' + _arrayBufferToBase64(cipherText));
            console.log("### calling HTMLToCiphertext.js");
            return browser.tabs.executeScript({
                file: "HTMLToCiphertext.js"
            });
        }).then(function (result) {
            console.log("background.js:onExecuted4: We made it ....");
            console.log("background.js:onExecuted4: result: " + result);
            console.log("backgroupd.js:onExecuted4:selected_text: " + selected_text);
            console.log("backgroupd.js:onExecuted4:replacement_text: " + replacement_text);

            return browser.tabs.query({
                active: true,
                currentWindow: true
            });
        }).then(function (tabs) {
            browser.tabs.sendMessage(tabs[0].id, {
                html_to_ciphertext_replacement: replacement_text,
                regex: selected_text
            });
        }).then(function (r) {
            // call to remove page listener

            browser.tabs.executeScript({
                file: "RemoveTabOnMessageListenerGetSelectedHTML.js",
                allFrames: true
            });

        }).then(function (r) {
            // call to remove page listener

            browser.tabs.executeScript({
                file: "RemoveTabOnMessageListenerHTMLToCiphertext.js",
                allFrames: true
            });

        });

    }

    if (info.menuItemId === "glovebox-testdecrypttextonly") {
        console.log("glovebox-testdecrypttextonly");
        indexedDB = window.indexedDB || window.webkitIndexedDB ||
            window.mozIndexedDB || window.msIndexedDB;

        // recreate datastore if needed - fix this later
        var request = indexedDB.open("trustedDecryptionKeys", 1);
        request.onupgradeneeded = function (event) {
            db = event.target.result;
            db.onerror = function (event) {};
            // Create an objectStore in this database to keep trusted decryption keys
            console.log("background.js: create objectstore decryptionKeys in trustedDecryptionKeys");
            var objectStore2 = db.createObjectStore("decryptionKeys", {
                    keyPath: "keyId"
                });

            objectStore2.createIndex("keyId", "keyId", {
                unique: true
            });
        };
        request.onerror = function (event) {
            console.log("background.js: dp open request error 201");
        };
        request.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                console.log("background.js: db open request error 2");
            };
            db.onsuccess = function (event) {
                console.log("background.js: db open request success 2");
            };
        };

        var request2 = indexedDB.open("encryptionKeys", 1);
        request2.onupgradeneeded = function (event) {
            db = event.target.result;
            db.onerror = function (event) {};
            // Create an objectStore in this database to keep trusted decryption keys
            console.log("background.js: create objectstore encryptionKeys in encryptionKeys");
            var objectStore2 = db.createObjectStore("encryptionKeys", {
                    keyPath: "keyId"
                });

            objectStore2.createIndex("keyId", "keyId", {
                unique: true
            });
        };
        request2.onerror = function (event) {
            console.log("background.js: dp open request error 201");
        };
        request2.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                console.log("background.js: db open request error 2");
            };
            db.onsuccess = function (event) {
                console.log("background.js: db open request success 2");
            };
        };

        // the selection likely contains only a part for the Glovebox text. Or possibly more than the Glovebox text. Expand or narrow as required.

        // call out to the tab to get the complete text
        var glovebox_token_ciphertext = "";
        var replacement_text = "";
        console.log("background.js:decrypt: call to GetHTML");
        console.log("###calling GetGloveboxCiphertext.js");

        // execute script in active tab
        browser.tabs.executeScript({
            file: "GetGloveboxCiphertext.js",
            allFrames: true
        }).then(
            function (result) {
            console.log("background.js:onExecuted4: result: " + JSON.stringify(result));
            // query for the one active tab
            browser.tabs.query({
                active: true,
                currentWindow: true
            }).then(function (tabs) {
                // send message to the active tab
                browser.tabs.sendMessage(tabs[0].id, {
                    GetGloveboxCiphertext: "Glbx_marker"
                }).then(function (res) {
                    console.log("###### GetGloveboxCiphertext response " + JSON.stringify(res));
                    
										
					glovebox_token_ciphertext = convertPsuedoTextToBase64(res.response.doc);
                    console.log("###### glovebox_token_ciphertext " + glovebox_token_ciphertext);

                    // which key to use for decryption


                    // get info out of token
                    const decryptkey_uuid_regex = new RegExp(':Glovebox:([^:]*):', 'm');

                    //        var decryptkey_uuid_regex = /:Glovebox:([^:]*):/g;
                    var decryptkey_uuid = "";
                    if ((match3 = decryptkey_uuid_regex.exec(glovebox_token_ciphertext)) != null) {
                        decryptkey_uuid = match3[1];
                        console.log("decryptkey id: " + decryptkey_uuid);
                    }

                    // get the deckryption key

                    return loadFromIndexedDB('trustedDecryptionKeys', 'decryptionKeys', decryptkey_uuid);
                }).then(function (response) {
                    console.log("got key object: " + response);
                    console.log("got key object: " + JSON.stringify(response));

                    var usekey = response.jwk;
                    var keyUsages = [
                        'encrypt',
                        'decrypt'
                    ];
                    // import the key
                    return window.crypto.subtle.importKey("jwk", usekey, {
                        name: 'AES-GCM'
                    }, true, keyUsages);

                }).catch(function (status) {

                    console.log("handle error when decryotion key is not found ");

                }).then(function (key) {

                    console.log("key imported, use it" + key);

                    // which key to use for decryption
                    var ciphertext_raw_regex = /:([^:]*):$/g;
                    var ciphertext_raw = "";
                    if ((match3 = ciphertext_raw_regex.exec(glovebox_token_ciphertext)) != null) {

                        console.log("###### getHTML response count " + match3.length);

                        var ciphertextlength = match3[0].length;
                        //:Glovebox:47b83c2c-5d3b-3823-2fc2-d8256aeb7f73:JfBMxr2rcjZwSogJfVU/SGBEv5igNXyakVdaLoohqN7V6M2mVW8Y2Xqjw13+ch1rVX7K16STX/4yktRsJnHImkQ3LynnTPpW7YnAEpt5AnfrDgNZxSH03dipy0CZDs7m/eJU+Fwvixw=:
                        console.log("start: " + match3.index);
                        //                        console.log("end: " + ciphertext_raw);
                        console.log("length: " + match3[0].length);

                        var text_end_pos = match3.index + match3[0].length;
                        var text_start_pos = match3.index;

                        ciphertext_raw = match3[0].substring(1, match3[0].length - 1);
                        console.log("######  ciphertext_raw: " + ciphertext_raw);

                    }

                    console.log('attempt to decrypt: ' + ciphertext_raw.replace(/[^\w\s\+=\/]/gi, ''));
                    console.log('attempt to decrypt: ' + ciphertext_raw.replace(/[^\w\s\+=\/]/gi, '').length);
                    console.log('attempt to decrypt: ' + ciphertext_raw);
                    console.log('attempt to decrypt: ' + ciphertext_raw.length);

                    return window.crypto.subtle.decrypt({
                        name: "AES-GCM",
                        iv: new Uint8Array(12)
                    },
                        key,
                        _base64ToArrayBuffer(ciphertext_raw.replace(/[^\w\s\+=\/]/gi, '')));
                }).then(function (compressed_plaintext) {

                    console.log('the decryption operation completed OK');
                    console.log('decrypted data: ' + compressed_plaintext);
                    console.log("decrypted1: " + arrayBufferToString(compressed_plaintext));
                    var shorty_2 = new Shorty();
                    replacement_text = shorty_2.inflate(arrayBufferToString(compressed_plaintext));

                    console.log("replacement text: " + replacement_text);

                    // send the decrypted text back to the tab

                    console.log("###calling CiphertextToText.js");

                    // execute script in active tab
                    return browser.tabs.executeScript({
                        file: "CiphertextToText.js",
                        allFrames: true
                    });

                }).then(function (result) {

                    return browser.tabs.query({
                        active: true,
                        currentWindow: true
                    });
                }).then(function (tabs) {
                    // send message to the active tab
                    console.log("replace" + glovebox_token_ciphertext);
                    console.log("with" + replacement_text);

                    browser.tabs.sendMessage(tabs[0].id, {
                        ciphertext_replacement_text: replacement_text,
                        regex: glovebox_token_ciphertext
                    });

                }).then(function (a) {
                    console.log("###calling RemoveTabOnMessageListenerGetGloveboxCiphertext.js");
                    browser.tabs.executeScript({
                        file: "RemoveTabOnMessageListenerGetGloveboxCiphertext.js",
                        allFrames: true
                    });
                }).then(function (a) {
                    console.log("###calling RemoveTabOnMessageListenerCiphertextToText.js");
                    browser.tabs.executeScript({
                        file: "RemoveTabOnMessageListenerCiphertextToText.js",
                        allFrames: true
                    });
                });

            }).then(function (responsefromtab) {

                console.log("background.js:decrypt: responsefromtab:" + responsefromtab);
            });

        });

    }

    if (info.menuItemId === "glovebox-testdecrypthtml") {
        console.log("glovebox-testdecrypthtml");
        indexedDB = window.indexedDB || window.webkitIndexedDB ||
            window.mozIndexedDB || window.msIndexedDB;

        // recreate datastore if needed - fix this later
        var request = indexedDB.open("trustedDecryptionKeys", 1);
        request.onupgradeneeded = function (event) {
            db = event.target.result;
            db.onerror = function (event) {};
            // Create an objectStore in this database to keep trusted decryption keys
            console.log("background.js: create objectstore decryptionKeys in trustedDecryptionKeys");
            var objectStore2 = db.createObjectStore("decryptionKeys", {
                    keyPath: "keyId"
                });

            objectStore2.createIndex("keyId", "keyId", {
                unique: true
            });
        };
        request.onerror = function (event) {
            console.log("background.js: dp open request error 201");
        };
        request.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                console.log("background.js: db open request error 2");
            };
            db.onsuccess = function (event) {
                console.log("background.js: db open request success 2");
            };
        };

        var request2 = indexedDB.open("encryptionKeys", 1);
        request2.onupgradeneeded = function (event) {
            db = event.target.result;
            db.onerror = function (event) {};
            // Create an objectStore in this database to keep trusted decryption keys
            console.log("background.js: create objectstore encryptionKeys in encryptionKeys");
            var objectStore2 = db.createObjectStore("encryptionKeys", {
                    keyPath: "keyId"
                });

            objectStore2.createIndex("keyId", "keyId", {
                unique: true
            });
        };
        request2.onerror = function (event) {
            console.log("background.js: dp open request error 201");
        };
        request2.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                console.log("background.js: db open request error 2");
            };
            db.onsuccess = function (event) {
                console.log("background.js: db open request success 2");
            };
        };

        // the selection likely contains only a part for the Glovebox text. Or possibly more than the Glovebox text. Expand or narrow as required.

        // call out to the tab to get the complete text
        var glovebox_token_ciphertext = "";
        var replacement_html = "";
        // console.log("background.js:decrypt: call to GetHTML");
        console.log("###calling GetGloveboxCiphertext.js");

        // execute script in active tab
        browser.tabs.executeScript({
            file: "GetGloveboxCiphertext.js",
            allFrames: true
        }).then(
            function (result) {
            console.log("background.js:onExecuted: result: " + JSON.stringify(result));
            // query for the one active tab
            browser.tabs.query({
                active: true,
                currentWindow: true
            }).then(function (tabs) {
                // send message to the active tab
                browser.tabs.sendMessage(tabs[0].id, {
                    GetGloveboxCiphertext: "Glbx_marker"
                }).then(function (res) {
                    console.log("###### GetGloveboxCiphertext response " + JSON.stringify(res));
                    glovebox_token_ciphertext = convertPsuedoTextToBase64(res.response.doc);
                    console.log("###### glovebox_token_ciphertext " + glovebox_token_ciphertext);

                    // which key to use for decryption

                    // get info out of token
                    const decryptkey_uuid_regex = new RegExp(':Glovebox:([^:]*):', 'm');

                    //        var decryptkey_uuid_regex = /:Glovebox:([^:]*):/g;
                    var decryptkey_uuid = "";
                    if ((match3 = decryptkey_uuid_regex.exec(glovebox_token_ciphertext)) != null) {
                        decryptkey_uuid = match3[1];
                        console.log("decryptkey id: " + decryptkey_uuid);
                    }

                    // get the deckryption key

                    return loadFromIndexedDB('trustedDecryptionKeys', 'decryptionKeys', decryptkey_uuid);
                }).then(function (response) {
                    console.log("got key object: " + response);
                    console.log("got key object: " + JSON.stringify(response));

                    var usekey = response.jwk;
                    var keyUsages = [
                        'encrypt',
                        'decrypt'
                    ];
                    // import the key
                    return window.crypto.subtle.importKey("jwk", usekey, {
                        name: 'AES-GCM'
                    }, true, keyUsages);

                }).catch(function (status) {

                    console.log("handle error when decryotion key is not found ");

                }).then(function (key) {

                    console.log("key imported, use it" + key);

                    // which key to use for decryption
                    var ciphertext_raw_regex = /:([^:]*):$/g;
                    var ciphertext_raw = "";
                    if ((match3 = ciphertext_raw_regex.exec(glovebox_token_ciphertext)) != null) {

                        console.log("###### getHTML response count " + match3.length);

                        var ciphertextlength = match3[0].length;
                        //:Glovebox:47b83c2c-5d3b-3823-2fc2-d8256aeb7f73:JfBMxr2rcjZwSogJfVU/SGBEv5igNXyakVdaLoohqN7V6M2mVW8Y2Xqjw13+ch1rVX7K16STX/4yktRsJnHImkQ3LynnTPpW7YnAEpt5AnfrDgNZxSH03dipy0CZDs7m/eJU+Fwvixw=:
                        console.log("start: " + match3.index);
                        //                        console.log("end: " + ciphertext_raw);
                        console.log("length: " + match3[0].length);

                        var text_end_pos = match3.index + match3[0].length;
                        var text_start_pos = match3.index;

                        ciphertext_raw = match3[0].substring(1, match3[0].length - 1);
                        console.log("######  ciphertext_raw: " + ciphertext_raw);

                    }

                    console.log('glovebox-testdecrypthtml:attempt to decrypt: ' + ciphertext_raw.replace(/[^\w\s\+=\/]/gi, ''));
                    console.log('glovebox-testdecrypthtml:attempt to decrypt: ' + ciphertext_raw.replace(/[^\w\s\+=\/]/gi, '').length);
                    console.log('glovebox-testdecrypthtml:attempt to decrypt: ' + ciphertext_raw);
                    console.log('glovebox-testdecrypthtml:attempt to decrypt: ' + ciphertext_raw.length);

                    return window.crypto.subtle.decrypt({
                        name: "AES-GCM",
                        iv: new Uint8Array(12)
                    },
                        key, _base64ToArrayBuffer(ciphertext_raw.replace(/[^\w\s\+=\/]/gi, '')));
                }).then(function (compressed_plaintext) {

                    console.log('the decryption operation completed OK');
                    console.log('decrypted data: ' + compressed_plaintext);
                    console.log("decrypted1: " + arrayBufferToString(compressed_plaintext));
                    var shorty_2 = new Shorty();
                    replacement_html = shorty_2.inflate(arrayBufferToString(compressed_plaintext));

                    console.log("replacement text: " + replacement_html);

                    // send the decrypted text back to the tab

                    console.log("###calling CiphertextToHTML.js");

                    // execute script in active tab
                    return browser.tabs.executeScript({
                        file: "CiphertextToHTML.js",
                        allFrames: true
                    });

                }).then(function (result) {

                    return browser.tabs.query({
                        active: true,
                        currentWindow: true
                    });
                }).then(function (tabs) {
                    // send message to the active tab
                    console.log("replace" + glovebox_token_ciphertext);
                    console.log("with" + replacement_html);

                    browser.tabs.sendMessage(tabs[0].id, {
                        ciphertext_replacement_html: replacement_html,
                        regex: glovebox_token_ciphertext
                    });

                }).then(function (a) {
                    console.log("###calling RemoveTabOnMessageListenerGetGloveboxCiphertext.js");
                    browser.tabs.executeScript({
                        file: "RemoveTabOnMessageListenerGetGloveboxCiphertext.js",
                        allFrames: true
                    });
                }).then(function (a) {
                    console.log("###calling RemoveTabOnMessageListenerCiphertextToHTML.js");
                    browser.tabs.executeScript({
                        file: "RemoveTabOnMessageListenerCiphertextToHTML.js",
                        allFrames: true
                    });
                });

            }).then(function (responsefromtab) {

                console.log("background.js:decrypt: responsefromtab:" + responsefromtab);
            });

        });

    }

});

function handleMessage(request, sender, sendResponse) {
    console.log("######### Message from the content script: " +
        request.greeting);
    sendResponse({
        response: "Response from background script"
    });
}

browser.runtime.onMessage.addListener(handleMessage);

// create a new encryption key and place it both in the encryption and decryption key databases
// return the key object
async function generate_encryption_key() {
    console.log("background.js: generate_encryption_key");

    // uuid of generated key;
    var uuid;

    var key;
    var jwk;

    var algoKeyGen = {
        name: 'AES-GCM',
        //          length: 256
        length: 128
    };

    //console.log('background.js:algoKeyGen: ' + JSON.stringify(algoKeyGen));

    var keyUsages = [
        'encrypt',
        'decrypt'
    ];

    return new Promise(
        function (resolve, reject) {

        window.crypto.subtle.generateKey(algoKeyGen, true, keyUsages)
        .then(function (key) {
            // secretKey = key;
            console.log('background.js:generate_encryption_key:2');
            // put key into encryption key store

            return window.crypto.subtle.exportKey("jwk", key);
        })
        .then(function (expkey) {

            console.log('background.js: expkey: ' + JSON.stringify(expkey));

            key = expkey.k;
            jwk = expkey;

            //generates random id;
            let guid = () => {
                let s4 = () => {
                    return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
                }
                //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
                console.log('backgroupnd.js: about to return ');

                return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
            }

            var id = guid();
            uuid = id;

        })
        .then(function (a) {

            console.log('background.js:generate_encryption_key:generated 1:' + uuid);
            console.log('background.js:generate_encryption_key:generated 1:' + key);
            console.log('background.js:generate_encryption_key:generated 1:' + jwk);
            var newItem = {
                keyId: uuid,
                uuid: uuid,
                "key": key,
                "jwk": jwk,
                "ext": true
            };

            console.log('data to be saved 1: ' + JSON.stringify(newItem));
            //  '{"keyId":"one","uuid":"two"}'
            saveToIndexedDB('encryptionKeys', 'encryptionKeys', 'keyId', newItem)

            .then(function (b) {
                console.log('background.js:generate_encryption_key:generated 2:' + uuid);
                console.log('background.js:generate_encryption_key:generated 2:' + key);
                console.log('background.js:generate_encryption_key:generated 2:' + jwk);

                var newItem = {
                    keyId: uuid,
                    uuid: uuid,
                    "key": key,
                    "jwk": jwk,
                    "ext": true
                };
                console.log('data to be saved 2: ' + JSON.stringify(newItem));

                saveToIndexedDB('trustedDecryptionKeys', 'decryptionKeys', 'keyId', newItem).then(function (response) {
                    console.log('data saved on ' + uuid);
                    resolve(newItem);
                }).catch(function (error) {
                    console.log(error.message);
                    resolve("blank");
                });
            });
        });
    });
}

// Takes base64 text and recasts it into something that looks like plain written text
function convertBase64ToPsuedoText(base64_text) {
    console.log("background.js: convertBase64ToPsuedoText");
    // insert spaces and punktuation at random intervals.

    // replace non-aphabetic with words.

var base_text_rewritten = new String();
     base_text_rewritten = base64_text.replace(new RegExp("\\/", "gm"), " slash ").replace(new RegExp("\\+", "gm"), " pluss ").replace(new RegExp("=", "gm"), " equals ").replace(new RegExp("-", "gm"), " minus ");

    console.log(base_text_rewritten);
    var n = '';
	
	var res = base_text_rewritten.split("");
	
    for (i = 0; i < res.length; i++) {

           n = n + res[i];

        // console.log(Math.floor((Math.random() * 13) + 1));
        if (Math.floor((Math.random() * 13) + 1) > 12) {
            n = n +  " ";
        } else {
 
        }

if (Math.floor((Math.random() * 20) + 1) > 19) {
            n = n +  ". ";
        } else {
 
        }

    }

    console.log(n);

    return n ;

}

function convertPsuedoTextToBase64(psuedo_text) {
 
    console.log("convert psuedo text to base64: " + psuedo_text);
 
 
 var b = '';
 
b = psuedo_text.replace(new RegExp("[ \.]", "gm"), "").replace(new RegExp("slash", "gm"), "/").replace(new RegExp("pluss", "gm"), "+").replace(new RegExp("equals", "gm"), "=").replace(new RegExp("minus", "gm"), "-");

 
 return b;
 
 
}




// designate an encryption key as default
function makeDefaultEncryptionKey(uuid) {
    console.log("background.js: makeDefaultEncryptionKey" + uuid);

    // get tne existing default key and give it a new keyId


    loadFromIndexedDB("encryptionKeys", "encryptionKeys", 'defaultSecretKey').then(function (currentdefaultkey) {

        console.log("ibackground.js: makeDefaultEncryptionKey read default from db:" + currentdefaultkey);
        console.log("ibackground.js: makeDefaultEncryptionKey read default from db:" + JSON.stringify(currentdefaultkey));
        // make the UUID of the object the new keyId
        currentdefaultkey.keyId = currentdefaultkey.uuid;

        saveToIndexedDB('encryptionKeys', 'encryptionKeys', currentdefaultkey.keyId, currentdefaultkey).then(function (response) {
            console.log("ibackground.js: makeDefaultEncryptionKey save to db:" + response);

        });

    });

    loadFromIndexedDB("encryptionKeys", "encryptionKeys", uuid).then(function (obj) {

        console.log("ibackground.js: makeDefaultEncryptionKey read from db:" + obj);
        console.log("ibackground.js: makeDefaultEncryptionKey read from db:" + JSON.stringify(obj));
        // reinsert with a new reference -
        obj.uuid = obj.keyId;

        // make defaultSecretKey the new keyid
        obj.keyId = "defaultSecretKey";

        saveToIndexedDB('encryptionKeys', 'encryptionKeys', 'defaultSecretKey', obj).then(function (response) {
            console.log("ibackground.js: makeDefaultEncryptionKey save to db:" + response);
        });

    });
}

// create a new encryption key and set it as default, as well as returning the key object
async function makeNewDefaultEncryptionKey() {
    console.log("background.js: makeNewDefaultEncryptionKey");

    //generate new key

    return new Promise(
        function (resolve, reject) {

        var genereated_key_id = "";
        generate_encryption_key().then(function (genereated_key) {
            console.log("gen keys res 6: " + genereated_key);
            // get tne existing default key and give it a new keyId
            // loadFromIndexedDB("encryptionKeys", "encryptionKeys", genereated_key_id).then(function (obj) {

            //console.log("background.js: makeNewDefaultEncryptionKey read from db:" + obj);
            console.log("background.js: makeNewDefaultEncryptionKey1: " + JSON.stringify(genereated_key));
            // reinsert with a new reference -
            //genereated_key.uuid = genereated_key.keyId;

            // make defaultSecretKey the new keyid
            genereated_key.keyId = "defaultSecretKey";

            console.log("background.js: makeNewDefaultEncryptionKey2: " + JSON.stringify(genereated_key));

            saveToIndexedDB('encryptionKeys', 'encryptionKeys', 'defaultSecretKey', genereated_key).then(function (response) {
                console.log("background.js: makeNewDefaultEncryptionKey save to db:" + response);
            });
            resolve(genereated_key);

            // });
        });
    });
}

// set up a default private key to be used if no other is available
async function addDefaultKeys() {
    console.log("background.js: ## addDefaultKeys");

    // check if there is a default key already.
    //only if not, add one
    var isone;
    try {
        console.log("### check if already is a default key");
        loadFromIndexedDB("encryptionKeys", "encryptionKeys", 'defaultSecretKey').then(function (currentdefaultkey) {

            console.log("background.js: addDefaultKeys:found=" + currentdefaultkey);
            console.log("background.js: addDefaultKeys:found=" + JSON.stringify(currentdefaultkey));

            // make a new default encryption key
            let one = makeNewDefaultEncryptionKey();
            console.log("background.js: addDefaultKeys:one=" + one);

        });

    } catch (e) {

        console.log("### check if already default key:error=" + e);

    }

    console.log("### check if already default key:succ=" + isone);

    //var genereated_key_id = "";
    // genereated_key_id = await generate_encryption_key()
    //     console.log("gen keys res 5: " + genereated_key_id);


}

// set up a default private key to be used if no other is available
async function getDefaultSecretKey() {
    console.log("background.js: getDefaultSecretKey");

    return new Promise(
        function (resolve, reject) {
        console.log("getDefaultSecretKey:### check if there is a default key");

        loadFromIndexedDB("encryptionKeys", "encryptionKeys", 'defaultSecretKey').then(function (currentdefaultkey) {

            console.log("background.js: getDefaultSecretKey:found=" + currentdefaultkey);
            console.log("background.js: getDefaultSecretKey:found=" + JSON.stringify(currentdefaultkey));
            resolve(currentdefaultkey);

        }).catch(function (err) {
            console.log("background.js: getDefaultSecretKey:err=" + err);

            if (err == "Error: object not found: encryptionKeys:defaultSecretKey") {
                console.log("background.js: defaultkey not found, create it");
                // make a new default encryption key
                makeNewDefaultEncryptionKey().then(function (key) {
                    console.log("background.js: key: " + key);
                });

            }
            if (err == "Error: objectstore_error") {
                console.log("background.js: respond to objectstore error");

                var request4 = indexedDB.open("encryptionKeys", 1);
                request4.onupgradeneeded = function (event) {
                    db = event.target.result;
                    db.onerror = function (event) {};
                    // Create an objectStore in this database to keep trusted decryption keys
                    console.log("background.js: getDefaultSecretKey: create objectstore encryptionKeys in encryptionKeys");
                    console.log("background.js: attempt to create objectstore");
                    var objectStore2 = db.createObjectStore("encryptionKeys", {
                            keyPath: "keyId"
                        });

                    objectStore2.createIndex("keyId", "keyId", {
                        unique: true
                    });
                    console.log("background.js: attempt to create objectstore");

                };
                console.log("background.js: 4" + request4);
                console.log("background.js: 4" + JSON.stringify(request4));

                request4.onerror = function (event) {
                    console.log("background.js:getDefaultSecretKey: dp open request error 201");
                };
                console.log("background.js: 5");
                request4.onsuccess = function (event) {
                    console.log("background.js: 6" + event);
                    var db_1;
                    db_1 = event.target.result;
                    console.log("background.js: 7" + db_1);
                    db_1.onerror = function (event) {
                        console.log("background.js:getDefaultSecretKey: db open request error 2");
                    };
                    //   db_1.onsuccess = function (event) {
                    console.log("background.js:getDefaultSecretKey: db open request success 2");

                    console.log("background.js: attempt to create objectstore");
                    var objectStore2 = db_1.createObjectStore("encryptionKeys", {
                            keyPath: "keyId"
                        });

                    objectStore2.createIndex("keyId", "keyId", {
                        unique: true
                    });
                    console.log("background.js: attempt to create objectstore");

                    console.log("create new default key");
                    makeNewDefaultEncryptionKey().then(function (res) {
                        console.log("created new default key result:" + res);
                        resolve(res);

                    });

                    //  };
                };

            }

        });

    });

}

// set up a default private key to be used if no other is available
function getDefaultSecretKey_Bak(idb) {
    console.log("background.js: getDefaultSecretKey");
    console.log("background.js: getDefaultSecretKey db:" + idb);

    // open a read/write db transaction, ready for adding the data
    var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
    // var transaction = idb.transaction(["toDoList"], "readwrite");
    var transaction = idb.transaction(["toDoList"], IDBTransaction.READ);

    // report on the success of the transaction completing, when everything is done
    transaction.oncomplete = function (event) {
        console.log("background.js:getDefaultSecretKey db transaction request 119");
    };

    transaction.onerror = function (event) {
        console.log("background.js:getDefaultSecretKey db write transaction error 123 " + JSON.stringify(event));
    };
    transaction.onsuccess = function (event) {
        console.log("background.js: getDefaultSecretKeydb read transaction success 123 " + JSON.stringify(event));

    };

    // create an object store on the transaction
    var objectStore = transaction.objectStore("toDoList");

    objectStore.onerror = function (event) {
        console.log("background.js: getDefaultSecretKey: objectStore error " + event);
    }
    objectStore.onsuccess = function (event) {
        console.log("background.js: getDefaultSecretKey: objectStore success " + event);
    }

    var objectStoreRequest = objectStore.get("defaultSecretKey");

    objectStoreRequest.onsuccess = function (event) {
        let data = objectStoreRequest.result;
        console.log("background.js: getDefaultSecretKey: db object store read successful " + JSON.stringify(data));
        console.log("background.js: getDefaultSecretKey: db object store read successful " + JSON.stringify(data.jwk));
        //let data = objectStoreTitleRequest.result;
        return data.jwk;

    }
    objectStoreRequest.onerror = function (event) {
        console.log("background.js: getDefaultSecretKey: db object store read error " + event);
    }

    // {"alg":"A128GCM","ext":true,"k":"5-c_gisskJa5lsX6W5Yj8g","key_ops":["encrypt","decrypt"],"kty":"oct"}


}

// function for creating the notification
function createNotification(title, db) {
    console.log("background.js: createNotification");
    // Create and show the notification
    let img = '/to-do-notifications/img/icon-128.png';
    let text = 'HEY! Your task "' + title + '" is now overdue.';
    let notification = new Notification('To do list', {
            body: text,
            icon: img
        });

    // we need to update the value of notified to "yes" in this particular data object, so the
    // notification won't be set off on it again

    console.log("background.js: createNotification 2");

    // first open up a transaction as usual
    let objectStore = db.transaction(['toDoList'], "readwrite").objectStore('toDoList');
    console.log("background.js: createNotification 3");

    // get the to-do list object that has this title as it's title
    let objectStoreTitleRequest = objectStore.get(title);

    console.log("background.js: createNotification 4");

    objectStoreTitleRequest.onsuccess = function () {
        // grab the data object returned as the result
        let data = objectStoreTitleRequest.result;

        // update the notified value in the object to "yes"
        data.notified = "yes";

        // create another request that inserts the item back into the database
        let updateTitleRequest = objectStore.put(data);

        // when this new request succeeds, run the displayData() function again to update the display
        updateTitleRequest.onsuccess = function () {
            // displayData();
        }
    }
}

function isDoubleByte(str) {
    for (var i = 0, n = str.length; i < n; i++) {
        if (str.charCodeAt(i) > 255) {
            return true;
        }
    }
    return false;
}

async function importKey(objectKey) {
    console.log("importKey:begin");
    // const objectKey = window.location.hash.slice("#key=".length);
    const key = await window.crypto.subtle.importKey(
            "jwk", {
            k: objectKey,
            alg: "A128GCM",
            ext: true,
            key_ops: ["encrypt", "decrypt"],
            kty: "oct",
        }, {
            name: "AES-GCM",
            length: 128
        },
            false, // extractable
            ["decrypt"]);

    console.log("importKey:end");
    return key;

}

async function encryptText(content, key) {
    console.log("encryptText:begin");

    const encrypted = await window.crypto.subtle.encrypt({
            name: "AES-GCM",
            iv: new Uint8Array(12) /* don't reuse key! */
        },
            key,
            new TextEncoder().encode(JSON.stringify(content)));

    console.log("encryptText:end");

}

function messageTab(tabs) {
    browser.tabs.sendMessage(tabs[0].id, {
        replacement: "option1",
        regex: "reg1"

    });
}

function onExecuted(result) {
    console.log("background.js:onExecuted: We made it ....");
    console.log("background.js:onExecuted: result: " + result);
    console.log("backgroupd.js:onExecute:selected_text: " + selected_text);

    var querying = browser.tabs.query({
            active: true,
            currentWindow: true
        });
    querying.then(messageTab);
}

function onError(error) {
    console.log("Error: ${error}");
}

function replaceSelectedText(replacementText) {
    var sel,
    range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(replacementText));
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        range.text = replacementText;
    }
}

function strToArrayBuffer(str) {
    var buf = new ArrayBuffer(str.length * 2);
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function arrayBufferToString(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function encryptPlaintext(sessionKey, plaintext) {
    // The plaintext is in an enclosing scope, called plaintext
    console.log("5.encryptPlaintext");
    var iv = window.crypto.getRandomValues(new Uint8Array(16));
    return window.crypto.subtle.encrypt({
        name: "AES-CBC",
        iv: iv
    }, sessionKey, plaintext).
    then(function (ciphertext) {
        return [iv, new Uint8Array(ciphertext)];
    });
}

function decryptMessage(key, ciphertext, counter) {
    let decrypted = window.crypto.subtle.decrypt({
            name: "AES-CTR",
            counter,
            length: 64
        },
            key,
            ciphertext);

    console.log(dec.decode(decrypted));
}

function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
}

function str2ab(str) {
    var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

function _arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    const buffer = new ArrayBuffer(8);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

/*
Get some key material to use as input to the deriveKey method.
The key material is a password supplied by the user.
 */
function getKeyMaterial() {
    const password = window.prompt("Enter your password");
    const enc = new TextEncoder();
    return window.crypto.subtle.importKey(
        "raw",
        enc.encode(password), {
        name: "PBKDF2"
    },
        false,
        ["deriveBits", "deriveKey"]);
}

/*
Given some key material and some random salt
derive an AES-KW key using PBKDF2.
 */
function getKey(keyMaterial, salt) {
    return window.crypto.subtle.deriveKey({
        "name": "PBKDF2",
        salt: salt,
        "iterations": 100000,
        "hash": "SHA-256"
    },
        keyMaterial, {
        "name": "AES-KW",
        "length": 256
    },
        true,
        ["wrapKey", "unwrapKey"]);
}

/*
Wrap the given key.
 */
async function wrapCryptoKey(keyToWrap) {
    // get the key encryption key
    const keyMaterial = await getKeyMaterial();
    salt = window.crypto.getRandomValues(new Uint8Array(16));
    const wrappingKey = await getKey(keyMaterial, salt);

    return window.crypto.subtle.wrapKey(
        "raw",
        keyToWrap,
        wrappingKey,
        "AES-KW");

}

async function createSymetricKey() {
    console.log("createSymetricKey:start");
    let a = await createSymetricKey2()
        .catch(e => {
            console.log('There has been a problem with your key create operation: ' + e.message);
        })
        console.log("createSymetricKey:a" + a);
    console.log("createSymetricKey:end");
}

async function createSymetricKey2() {
    console.log("createSymetricKey2:start");
    let key = await window.crypto.subtle.generateKey({
            name: "AES-GCM",
            length: 128
        },
            true, // extractable
            ["encrypt", "decrypt"]);

    console.log("createSymetricKey2:key:" + key);

    //  let result1 = await Promise.all([key]);

    let objectKey = (await window.crypto.subtle.exportKey("jwk", key)).k;

    console.log("createSymetricKey2:objectKey:" + objectKey);
    // let result2 = await Promise.all([ objectKey]);
    console.log("createSymetricKey2:objectKey:" + objectKey);
    console.log("createSymetricKey2:objectKey(json):" + JSON.stringify(objectKey));

    if (objectKey === undefined) {

        console.log("createSymetricKey2:objectKey(json):2:undefinED");

    }

    //while(true){
    //      if (objectKey === undefined) continue;
    //      else {
    //            $("#output").append(result);
    console.log("createSymetricKey:objectKey(json):2:" + JSON.stringify(objectKey));

    //      return;
    //       }
    // }


    //return JSON.stringify(key);

}

async function createSymetricKey3() {
    console.log("createSymetricKey3:start");

    let key = await window.crypto.subtle.generateKey({
            name: "AES-GCM",
            length: 128
        },
            true, // extractable
            ["encrypt", "decrypt"]);

    //  let objectKey = (await window.crypto.subtle.exportKey("jwk", key)).k;

    let result = await Promise.all([key]);
    //console.log("createSymetricKey3:key:" + objectKey);
    console.log("createSymetricKey3:key(json):" + JSON.stringify(key));

    return JSON.stringify(key);

}

const getSymKey = async() => {
    console.log("getSymKey:start");

    const key = await window.crypto.subtle.generateKey({
            name: "AES-GCM",
            length: 128
        },
            true, // extractable
            ["encrypt", "decrypt"]);

    const objectKey = (await window.crypto.subtle.exportKey("jwk", key)).k;
    console.log("getSymKey:objectKey:" + objectKey);
    console.log("getSymKey:objectKey:" + JSON.stringify(objectKey));

    console.log("getSymKey:keys:" + JSON.stringify(key));
    const symKey = await window.crypto.subtle.exportKey('jwk', key);
    console.log("getSymKey:symKey:" + JSON.stringify(symKey));

    return JSON.stringify(symKey);
    //    let body = window.btoa(String.fromCharCode(...new Uint8Array(symKey)));
    //   body = body.match(/.{1,64}/g).join('\n');

    //  return `-----BEGIN KEY-----\n${body}\n-----END KEY-----`;
};

const getPublicKey = async() => {
    console.log("getPublicKey:start");

    const options = {
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: {
            name: 'SHA-256'
        },
    };

    const keys = await window.crypto.subtle.generateKey(
            options,
            true, // non-exportable (public key still exportable)
            ['sign', 'verify'], );

    console.log("getPublicKey:keys:" + JSON.stringify(keys));

    const publicKey = await window.crypto.subtle.exportKey('spki', keys.publicKey);

    let body = window.btoa(String.fromCharCode(...new Uint8Array(publicKey)));
    body = body.match(/.{1,64}/g).join('\n');

    return `-----BEGIN PUBLIC KEY-----\n${body}\n-----END PUBLIC KEY-----`;
};

//from https://stackoverflow.com/questions/41586400/using-indexeddb-asynchronously

function loadFromIndexedDB(dbName, storeName, id) {
    //console.log("loadFromIndexedDB:0");
    console.log("loadFromIndexedDB:1 " + dbName);
    console.log("loadFromIndexedDB:2 " + storeName);
    console.log("loadFromIndexedDB:3 " + id);

    return new Promise(
        function (resolve, reject) {

        try {
            var dbRequest = indexedDB.open(dbName);

            dbRequest.onerror = function (event) {
                reject(Error("Error text"));
            };

            dbRequest.onupgradeneeded = function (event) {
                // Objectstore does not exist. Nothing to load
                event.target.transaction.abort();
                // start process of creating default object stores
                //addDefaultKeys();

                //makeNewDefaultEncryptionKey();

                reject(Error('Not found'));
            };

            dbRequest.onsuccess = function (event) {
                var database = event.target.result;
                console.log("loadFromIndexedDB:database " + JSON.stringify(database));

                var transaction;
                try {
                    transaction = database.transaction([storeName]);
                } catch (e) {
                    console.log("loadFromIndexedDB:database failed to open datastore" + JSON.stringify(e));
                    console.log("loadFromIndexedDB:database failed to open datastore" + [storeName]);
                }

                var objectStore;
                try {
                    objectStore = transaction.objectStore(storeName);
                } catch (f) {
                    console.log("loadFromIndexedDB:database failed to open objectstore" + JSON.stringify(f));
                    console.log("loadFromIndexedDB:database failed to open objectstore" + [storeName]);
                }

                try {
                    var objectRequest = objectStore.get(id);

                    objectRequest.onerror = function (event) {
                        reject(Error('Error text'));
                    };

                    objectRequest.onsuccess = function (event) {
                        if (objectRequest.result)
                            resolve(objectRequest.result);
                        else
                            if (id == "defaultSecretKey") {
                                // if default key is missing, add it
                                console.log("## missing defaults");
                                //           addDefaultKeys();
                            }

                        reject(Error('object not found: ' + storeName + ":" + id));
                    };
                } catch (f) {
                    console.log("objectstore error:");
                    reject(Error('objectstore_error'));
                }
            };

        } catch (e) {
            console.log("loadFromIndexedDB:error:" + e);
        }
    });
}

//from https://stackoverflow.com/questions/41586400/using-indexeddb-asynchronously


// sample call to this function:
//
// saveToIndexedDB('dn\bname', 'objectstoreName', data).then(function (response) {
//   alert('data saved');
// }).catch(function (error) {
//   alert(error.message);
// });


function saveToIndexedDB(dbName, storeName, keyId, object) {
    console.log("saveToIndexedDB: " + dbName + " " + storeName + "" + keyId);
    //  console.log("saveToIndexedDB:1 " + dbName);
    //  console.log("saveToIndexedDB:2 " + storeName);
    //  console.log("saveToIndexedDB:3 " + keyId);
    // console.log("saveToIndexedDB:4 " + JSON.stringify(object));

    indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

    return new Promise(
        function (resolve, reject) {

        var dbRequest = indexedDB.open(dbName);

        dbRequest.onerror = function (event) {
            reject(Error("IndexedDB database error"));
        };

        dbRequest.onupgradeneeded = function (event) {
            var database = event.target.result;
            var objectStore = database.createObjectStore(storeName, {
                    keyId: keyId
                });
        };

        dbRequest.onsuccess = function (event) {
            console.log("saveToIndexedDB: 31")
            var database = event.target.result;
            var transaction = database.transaction([storeName], 'readwrite');
            var objectStore = transaction.objectStore(storeName);
            var objectRequest = objectStore.put(object); // Overwrite if exists

            objectRequest.onerror = function (event) {
                //      console.log("saveToIndexedDB:error: " + storeName);

                reject(Error('Error text'));
            };

            objectRequest.onsuccess = function (event) {
                //     console.log("saveToIndexedDB:success: " + storeName);
                resolve('Data saved OK');
            };
        };
    });
}

/**
 * Secure Hash Algorithm (SHA1)
 * http://www.webtoolkit.info/
 **/
function SHA1(msg) {
    console.log("navigate-collection:SHA1");
    function rotate_left(n, s) {
        var t4 = (n << s) | (n >>> (32 - s));
        return t4;
    };
    function lsb_hex(val) {
        var str = '';
        var i;
        var vh;
        var vl;
        for (i = 0; i <= 6; i += 2) {
            vh = (val >>> (i * 4 + 4)) & 0x0f;
            vl = (val >>> (i * 4)) & 0x0f;
            str += vh.toString(16) + vl.toString(16);
        }
        return str;
    };
    function cvt_hex(val) {
        var str = '';
        var i;
        var v;
        for (i = 7; i >= 0; i--) {
            v = (val >>> (i * 4)) & 0x0f;
            str += v.toString(16);
        }
        return str;
    };
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, '\n');
        var utftext = '';
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    var blockstart;
    var i,
    j;
    var W = new Array(80);
    var H0 = 0x67452301;
    var H1 = 0xEFCDAB89;
    var H2 = 0x98BADCFE;
    var H3 = 0x10325476;
    var H4 = 0xC3D2E1F0;
    var A,
    B,
    C,
    D,
    E;
    var temp;
    msg = Utf8Encode(msg);
    var msg_len = msg.length;
    var word_array = new Array();
    for (i = 0; i < msg_len - 3; i += 4) {
        j = msg.charCodeAt(i) << 24 | msg.charCodeAt(i + 1) << 16 |
            msg.charCodeAt(i + 2) << 8 | msg.charCodeAt(i + 3);
        word_array.push(j);
    }
    switch (msg_len % 4) {
    case 0:
        i = 0x080000000;
        break;
    case 1:
        i = msg.charCodeAt(msg_len - 1) << 24 | 0x0800000;
        break;
    case 2:
        i = msg.charCodeAt(msg_len - 2) << 24 | msg.charCodeAt(msg_len - 1) << 16 | 0x08000;
        break;
    case 3:
        i = msg.charCodeAt(msg_len - 3) << 24 | msg.charCodeAt(msg_len - 2) << 16 | msg.charCodeAt(msg_len - 1) << 8 | 0x80;
        break;
    }
    word_array.push(i);
    while ((word_array.length % 16) != 14)
        word_array.push(0);
    word_array.push(msg_len >>> 29);
    word_array.push((msg_len << 3) & 0x0ffffffff);
    for (blockstart = 0; blockstart < word_array.length; blockstart += 16) {
        for (i = 0; i < 16; i++)
            W[i] = word_array[blockstart + i];
        for (i = 16; i <= 79; i++)
            W[i] = rotate_left(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
        A = H0;
        B = H1;
        C = H2;
        D = H3;
        E = H4;
        for (i = 0; i <= 19; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        for (i = 20; i <= 39; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        for (i = 40; i <= 59; i++) {
            temp = (rotate_left(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        for (i = 60; i <= 79; i++) {
            temp = (rotate_left(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
            E = D;
            D = C;
            C = rotate_left(B, 30);
            B = A;
            A = temp;
        }
        H0 = (H0 + A) & 0x0ffffffff;
        H1 = (H1 + B) & 0x0ffffffff;
        H2 = (H2 + C) & 0x0ffffffff;
        H3 = (H3 + D) & 0x0ffffffff;
        H4 = (H4 + E) & 0x0ffffffff;
    }
    var temp = cvt_hex(H0) + cvt_hex(H1) + cvt_hex(H2) + cvt_hex(H3) + cvt_hex(H4);

    return temp.toLowerCase();
}

async function find_tabs(queryyy) {
    console.log("background.js: find_tabs");
    // locate all Tabs, windows and popups
    let this_tab_url = browser.runtime.getURL("find.html");
    let tabs = await browser.tabs.query({});
    console.log("background.js: find_tabs:" + tabs.length);
    for (let tab of tabs) {
        // Iterate through the tabs, but exclude the current tab.
        console.log("background.js: found tabs> " + tab.url);
        console.log("background.js: found tabs> " + tab.id);
        if (tab.url === this_tab_url) {
            continue;
        }

        // Call the find API on each tab. We'll wait for the results for each
        // tab before progressing onto the next one by using await.
        //
        // After getting the results, send a message back to the query page
        // and highlight the tab if any results are found.
        //      let result = await browser.find(queryyy, { tabId: tab.id });
        //       browser.runtime.sendMessage({
        //           msg: "found-result",
        //           id: tab.id,
        //           url: tab.url,
        //            count: result.count
        //        });

        //      if (result.count) {
        //     browser.find.highlightResults({
        //        tabId: tab.id
        //     });
        //  }
    }
    return tabs.length;
}

function shorty_out() {}
