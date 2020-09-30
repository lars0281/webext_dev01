/* global loadStoredImages, removeStoredImages, saveToIndexedDB */

// cd /cygdrive/c/users/lars_/git/repository01/path01/dev01

"use strict";

class NavigateCollectionUI {
    constructor(containerEl) {
        this.containerEl = containerEl;

        this.state = {
            storedImages: [],
        };

        // setup database "tables"
        //  indexedDB = window.indexedDB || window.webkitIndexedDB ||
        //           window.mozIndexedDB || window.msIndexedDB;
        let db;

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

        // ########
        // ########
        var request3 = indexedDB.open("encryptionKeysSecureOffers", 1);
        request3.onupgradeneeded = function (event) {
            db = event.target.result;
            db.onerror = function (event) {};
            // Create an objectStore in this database to keep offers to passout decryption keys in a secure way.
            console.log("background.js: create objectstore for secure key offers");
            var objectStore2 = db.createObjectStore("createdKeyOffers", {
                    keyPath: "refId"
                });

            objectStore2.createIndex("refId", "refId", {
                unique: true
            });
        };
        request3.onerror = function (event) {
            console.log("background.js: dp open request error 201");
        };
        request3.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                console.log("background.js: db open request error 2");
            };
            db.onsuccess = function (event) {
                console.log("background.js: db open request success 2");
            };
        };

        // ########
        // ########
        var request7 = indexedDB.open("acceptedKeyOffers", 1);
        request7.onupgradeneeded = function (event) {
            db = event.target.result;
            db.onerror = function (event) {};
            // Create an objectStore in this database to keep offers to passout decryption keys in a secure way.
            console.log("background.js: create objectstore for secure key offers");
            var objectStore = db.createObjectStore("acceptedKeyOffers", {
                    keyPath: "refId"
                });

            objectStore.createIndex("refId", "refId", {
                unique: true
            });
        };
        request7.onerror = function (event) {
            console.log("background.js: dp open request error 201");
        };
        request7.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                console.log("background.js: db open request error 2");
                var objectStore = db.createObjectStore("acceptedKeyOffers", {
                        keyPath: "refId"
                    });

                objectStore.createIndex("refId", "refId", {
                    unique: true
                });
            };
            db.onsuccess = function (event) {
                console.log("background.js: db open request success 2");
                var objectStore = db.createObjectStore("acceptedKeyOffers", {
                        keyPath: "refId"
                    });

                objectStore.createIndex("refId", "refId", {
                    unique: true
                });
            };
        };

        // ##########
        var request4 = indexedDB.open("privateKeys", 1);
        request4.onupgradeneeded = function (event) {
            db = event.target.result;
            db.onerror = function (event) {};
            // Create an objectStore
            console.log("background.js: create objectstore for public+private key pairs");
            var objectStore2 = db.createObjectStore("keyPairs", {
                    keyPath: "keyId"
                });

            objectStore2.createIndex("keyId", "keyId", {
                unique: true
            });
        };
        request4.onerror = function (event) {
            console.log("background.js: dp open request error 201");
        };
        request4.onsuccess = function (event) {
            db = event.target.result;
            db.onerror = function (event) {
                console.log("background.js: db open request error 2");
            };
            db.onsuccess = function (event) {
                console.log("background.js: db open request success 2");
            };
        };

        // end DB setup


        document.querySelector("form.scan-tabs").addEventListener("submit", submitScanTabs);

        document.querySelector("button.scan-tabs").onclick = this.scanTabs;

        // using two event listeners, on on the form and one on the button, along with e.preventDefault(); on the function being called, saves a page reload
        //document.querySelector("form.generate-encryption-key").addEventListener("submit", submitGenerateEncryptionKey);
        //document.querySelector("button.generate-encryption-key").onclick = this.generateEncryptionKey;
        // use this instead - which causes a page reload. This to show the newly created key immediately.
        document.querySelector("button.generate-encryption-key").addEventListener('click', function () {
            console.log("button.generate-encryption-key.Begin");
            //make sure of
            //const call2Promise= generate_encryption_key_2();
            //Promise.all([call2Promise]);

            
            // Get default signing key
            // If there is on presente, use it, otherwise create one. 
            
            
            // call to backgroup.js to create a new encryption key
            browser.runtime.sendMessage({request:"generate_encryption_key"},function(response){
            	console.log("message sent to backgroup.js with response: " + JSON.stringify(response));

			});
            
browser.runtime.onMessage.addListener(function(message,sender,sendResponse){
	console.log("response received from background.js");
	console.log("message: " + message);
	console.log("sender: " + sender);
	console.log("sendResponse: " + sendResponse);
	str = JSON.stringify(message.data);
	console.log(str);
});


            console.log("button.generate-encryption-key.Completed");

        });

        document.querySelector("button.generate-private-key").addEventListener('click', function () {
            console.log("### generate_private_key.being");

            generate_privatepublickey();
            console.log("### generate_private_key.end");

        });

        document.querySelector("button.backup-all-keys").addEventListener('click', function () {
            backup_all_keys();
        });

        //document.querySelector("button.import-all-keys").addEventListener('click', function () {
        //            import_all_keys();
        //       });

        document.getElementById('contentFile').onchange = function (evt) {
            console.log("### reading file");
            try {
                let files = evt.target.files;
                if (!files.length) {
                    alert('No file selected!');
                    return;
                }
                let file = files[0];
                let reader = new FileReader();
                const self = this;
                reader.onload = (event) => {
                    console.log('FILE CONTENT', event.target.result);
                    import_all_keys(event.target.result);
                };
                reader.readAsText(file);
            } catch (err) {
                console.error(err);
            }
        }

        // ##########
        // setup table showing issued secure key offers
        // #########

        {
            const securekeyofferstable = document.querySelector("ul.keysecureoffers");

            var table_conf = [{
                    "id": "1",
                    "width": "100px"
                }, {
                    "id": "1",
                    "width": "100px"
                }, {
                    "id": "1",
                    "width": "100px"
                }, {
                    "id": "1",
                    "width": "330px"
                }, {
                    "id": "1",
                    "width": "100px"
                }, {
                    "id": "1",
                    "width": "100px"
                }
            ];

            const tb_for_keysecureoffers = createTable(table_conf);

            securekeyofferstable.appendChild(tb_for_keysecureoffers);

            // setup column headers for table
            var header_conf = [{
                    "id": "1",
                    "text": "ref id"
                }, {
                    "id": "2",
                    "text": "offer id"
                }, {
                    "id": "2",
                    "text": "createtime"
                }, {
                    "id": "2",
                    "text": "jwk"
                }, {
                    "id": "2",
                    "text": "recipientusername"
                }
            ];

            tb_for_keysecureoffers.appendChild(writeTableHeaderRow(header_conf));

            var dbRequest_0 = indexedDB.open("encryptionKeysSecureOffers");

            dbRequest_0.onerror = function (event) {
                reject(Error("Error text"));
            };

            dbRequest_0.onupgradeneeded = function (event) {
                // Objectstore does not exist. Nothing to load
                event.target.transaction.abort();
                reject(Error('Not found'));
            };

            dbRequest_0.onsuccess = function (event) {
                var database = event.target.result;
                var transaction = database.transaction('createdKeyOffers', 'readonly');
                var objectStore = transaction.objectStore('createdKeyOffers');

                if ('getAll' in objectStore) {
                    // IDBObjectStore.getAll() will return the full set of items in our store.
                    objectStore.getAll().onsuccess = function (event) {
                        const res = event.target.result;
                        //   console.log(res);

                        // setup column headers for table
                        var column_conf = [{
                                "id": "1",
                                "attribute": "refId"
                            }, {
                                "id": "2",
                                "attribute": "offeredKeyId"
                            }, {
                                "id": "2",
                                "attribute": "createTime"
                            }, {
                                "id": "2",
                                "attribute": "jwk"
                            }, {
                                "id": "2",
                                "attribute": "recipientusername"
                            }, {
                                "id": "2",
                                "node": {
                                    "name": "button",
                                    "text": "extende this offer",
                                    "class": "extend-keyoffer",
                                    "EventListener": {
                                        "type": "click",
                                        "func": "extendKeyOffer",
                                        "parameter": "click"
                                    }
                                }
                            }, {
                                "id": "2",
                                "node": {
                                    "name": "button",
                                    "text": "delete offer",
                                    "class": "delete-key-offer",
                                    "EventListener": {
                                        "type": "click",
                                        "func": "deleteKeyOffer",
                                        "parameter": "click"
                                    }
                                }
                            }, {
                                "id": "2",
                                "node": {
                                    "name": "button",
                                    "text": "present key offer",
                                    "class": "show-key-offer",
                                    "EventListener": {
                                        "type": "click",
                                        "func": "showKeyOffer",
                                        "parameter": "click"
                                    }
                                }
                            },

                        ];

                        for (const url of res) {

                            // create table row
                            //           const tr = document.createElement("tr");
                            //  console.log("column_conf " + JSON.stringify(column_conf));

                            const tr = writeTableRow(url, column_conf);

                            // create add row to table
                            tb_for_keysecureoffers.appendChild(tr);

                        }

                    };
                    // add a line where information on a new key can be added to the database.
                    // document.querySelector("button.onAddDecryptionKey").onclick = this.onAddDecryptionKey;

                } else {
                    // Fallback to the traditional cursor approach if getAll isn't supported.
                    var timestamps = [];
                    objectStore.openCursor().onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            console.log(cursor.value);
                            //        timestamps.push(cursor.value);
                            cursor.continue();
                        } else {
                            //        logTimestamps(timestamps);
                        }
                    };

                    //     document.querySelector("button.onAddEncryptionKey").onclick = this.onAddEncryptionKey;
                    //    const tr_last = document.createElement("tr");
                    //    const td = document.createElement("td");
                    //    td.innerHTML = "key name";
                    //    tr_last.appendChild(td);
                    //    const td2 = document.createElement("td");
                    //    td2.innerHTML = "key";
                    //    tr_last.appendChild(td2);
                    //    const td3 = document.createElement("td");
                    //    td3.innerHTML = "jwk";
                    //    tr_last.appendChild(td3);
                    //    tb_for_keysecureoffers.appendChild(tr_last);

                }

            };

            //

        }

        // ##########
        // setup table showing accepted secure key offers
        // #########

        {
            const securekeyofferstable = document.querySelector("ul.acceptedsecurekeyoffers");

            var table_conf = [{
                    "id": "1",
                    "width": "100px"
                }, {
                    "id": "1",
                    "width": "100px"
                }, {
                    "id": "1",
                    "width": "100px"
                }, {
                    "id": "1",
                    "width": "330px"
                }, {
                    "id": "1",
                    "width": "100px"
                }, {
                    "id": "1",
                    "width": "100px"
                }
            ];

            const tb_for_acceptedsecurekeyoffers = createTable(table_conf);

            securekeyofferstable.appendChild(tb_for_acceptedsecurekeyoffers);

            // setup column headers for table
            var header_conf = [{
                    "id": "1",
                    "text": "ref id"
                }, {
                    "id": "2",
                    "text": "offer id"
                }, {
                    "id": "2",
                    "text": "createtime"
                }, {
                    "id": "2",
                    "text": "jwk"
                }, {
                    "id": "2",
                    "text": "recipientusername"
                }
            ];

            tb_for_acceptedsecurekeyoffers.appendChild(writeTableHeaderRow(header_conf));

            var dbRequest_0 = indexedDB.open("acceptedKeyOffers");

            dbRequest_0.onerror = function (event) {
                reject(Error("Error text"));
            };

            dbRequest_0.onupgradeneeded = function (event) {
                // Objectstore does not exist. Nothing to load
                event.target.transaction.abort();
                reject(Error('Not found'));
            };

            dbRequest_0.onsuccess = function (event) {
                var database = event.target.result;
                var transaction = database.transaction('acceptedKeyOffers', 'readonly');
                var objectStore = transaction.objectStore('acceptedKeyOffers');

                if ('getAll' in objectStore) {
                    // IDBObjectStore.getAll() will return the full set of items in our store.
                    objectStore.getAll().onsuccess = function (event) {
                        const res = event.target.result;
                        //   console.log(res);

                        // setup column headers for table
                        var column_conf = [{
                                "id": "1",
                                "attribute": "refId"
                            }, {
                                "id": "2",
                                "attribute": "offeredKeyId"
                            }, {
                                "id": "2",
                                "attribute": "createTime"
                            }, {
                                "id": "2",
                                "attribute": "jwk"
                            }, {
                                "id": "2",
                                "attribute": "recipientusername"
                            }, {
                                "id": "2",
                                "node": {
                                    "name": "button",
                                    "text": "extende this offer",
                                    "class": "extend-keyoffer",
                                    "EventListener": {
                                        "type": "click",
                                        "func": "extendKeyOffer",
                                        "parameter": "click"
                                    }
                                }
                            }, {
                                "id": "2",
                                "node": {
                                    "name": "button",
                                    "text": "delete offer",
                                    "class": "delete-key-offer",
                                    "EventListener": {
                                        "type": "click",
                                        "func": "deleteKeyOffer",
                                        "parameter": "click"
                                    }
                                }
                            }, {
                                "id": "2",
                                "node": {
                                    "name": "button",
                                    "text": "present key offer",
                                    "class": "show-key-offer",
                                    "EventListener": {
                                        "type": "click",
                                        "func": "showKeyOffer",
                                        "parameter": "click"
                                    }
                                }
                            },

                        ];

                        for (const url of res) {

                            // create table row
                            //           const tr = document.createElement("tr");
                            //  console.log("column_conf " + JSON.stringify(column_conf));

                            const tr = writeTableRow(url, column_conf);

                            // create add row to table
                            tb_for_acceptedsecurekeyoffers.appendChild(tr);

                        }

                    };
                    // add a line where information on a new key can be added to the database.
                    // document.querySelector("button.onAddDecryptionKey").onclick = this.onAddDecryptionKey;

                } else {
                    // Fallback to the traditional cursor approach if getAll isn't supported.
                    var timestamps = [];
                    objectStore.openCursor().onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            console.log(cursor.value);
                            //        timestamps.push(cursor.value);
                            cursor.continue();
                        } else {
                            //        logTimestamps(timestamps);
                        }
                    };

                }

            };

            //

        }

        // ##########
        // setup table showing encryptionkeys
        // #########

        {
            const encryptionkeytable = document.querySelector("ul.encryptionkeys");

            var table_conf = [{
                    "id": "1",
                    "width": "100px"
                }, {
                    "id": "1",
                    "width": "100px"
                }, {
                    "id": "1",
                    "width": "290px"
                }, {
                    "id": "1",
                    "width": "290px"
                }, {
                    "id": "1",
                    "width": "100px"
                }, {
                    "id": "1",
                    "width": "100px"
                }, {
                    "id": "1",
                    "width": "100px"
                }
            ];

            const tb_for_encryptionKeys = createTable(table_conf);

            encryptionkeytable.appendChild(tb_for_encryptionKeys);

            // setup column headers for table
            var header_conf = [{
                    "id": "1",
                    "text": "key id"
                }, {
                    "id": "2",
                    "text": "uuid"
                }, {
                    "id": "2",
                    "text": "user"
                }, {
                    "id": "2",
                    "text": "key"
                }, {
                    "id": "2",
                    "text": "jwk"
                }
            ];

            tb_for_encryptionKeys.appendChild(writeTableHeaderRow(header_conf));

            var dbRequest_0 = indexedDB.open("encryptionKeys");

            dbRequest_0.onerror = function (event) {
                reject(Error("Error text"));
            };

            dbRequest_0.onupgradeneeded = function (event) {
                // Objectstore does not exist. Nothing to load
                event.target.transaction.abort();
                reject(Error('Not found'));
            };

            dbRequest_0.onsuccess = function (event) {
                var database = event.target.result;
                var transaction = database.transaction('encryptionKeys', 'readonly');
                var objectStore = transaction.objectStore('encryptionKeys');

                if ('getAll' in objectStore) {
                    // IDBObjectStore.getAll() will return the full set of items in our store.
                    objectStore.getAll().onsuccess = function (event) {
                        const res = event.target.result;
                        //   console.log(res);

                        // setup column headers for table
                        var column_conf = [{
                                "id": "1",
                                "attribute": "keyId"
                            }, {
                                "id": "2",
                                "attribute": "uuid"
                            }, {
                                "id": "2",
                                "attribute": "username"
                            }, {
                                "id": "2",
                                "attribute": "key"
                            }, {
                                "id": "2",
                                "attribute": "jwk"
                            }, {
                                "id": "2",
                                "node": {
                                    "name": "form",
                                    "class": "designate-default-encryption-key",
                                    "subnodes": [{
                                            "name": "button",
                                            "text": "make default",
                                            "class": "designate-default-encryption-key",
                                            "EventListener": {
                                                "type": "click",
                                                "func": "makeDefaultEncryptionKey",
                                                "parameter": "click"
                                            }
                                        }
                                    ]
                                }
                            }, {
                                "id": "2",
                                "node": {
                                    "name": "button",
                                    "text": "make update to enc key",
                                    "class": "update-encryption-key",
                                    "EventListener": {
                                        "type": "click",
                                        "func": "updateEncryptionKey",
                                        "parameter": "click"
                                    }
                                }
                            }, {
                                "id": "2",
                                "node": {
                                    "name": "button",
                                    "text": "delete this 2 enc key",
                                    "class": "delete-encryption-key",
                                    "EventListener": {
                                        "type": "click",
                                        "func": "deleteEncryptionKey",
                                        "parameter": "click"
                                    }
                                }
                            }, {
                                "id": "2",
                                "node": {
                                    "name": "form",
                                    "class": "delete-encryption-key-form",
                                    "subnodes": [{
                                            "name": "button",
                                            "text": "delete this enc key",
                                            "class": "delete-encryption-key",
                                            "EventListener": {
                                                "type": "click",
                                                "func": "deleteEncryptionKey",
                                                "parameter": "click"
                                            }
                                        }
                                    ]
                                }
                            }, {
                                "id": "2",
                                "node": {
                                    "name": "button",
                                    "text": "export enc key",
                                    "class": "export-encryption-key",
                                    "EventListener": {
                                        "type": "click",
                                        "func": "exportEncryptionKey",
                                        "parameter": "click"
                                    }
                                }
                            },

                        ];

                        for (const url of res) {

                            // create table row
                            //           const tr = document.createElement("tr");
                            //     console.log("column_conf " + JSON.stringify(column_conf));
                            console.log(url);
                            const tr = writeTableRow(url, column_conf);

                            // create add row to table
                            tb_for_encryptionKeys.appendChild(tr);

                        }

                        const tr_last = document.createElement("tr");

                        const td = document.createElement("td");
                        td.setAttribute("colspan", "4");

                        tr_last.appendChild(td);
                        const new_key_form = document.createElement("form");

                        const tb_for_newdecryotionKey = document.createElement("table");
                        tb_for_newdecryotionKey.setAttribute("border", "1");

                        new_key_form.appendChild(tb_for_newdecryotionKey);

                        const tr = document.createElement("tr");

                        const td0 = document.createElement("td");

                        tr.appendChild(td0);

                        const td1 = document.createElement("td");
                        const input1 = document.createElement("input");
                        input1.setAttribute("type", "text");
                        input1.setAttribute("name", "username");
                        input1.setAttribute("value", "user name");
                        input1.setAttribute("id", "addnewdecryptionkeyusername");

                        td1.appendChild(input1);
                        tr.appendChild(td1);

                        const td2 = document.createElement("td");

                        const input2 = document.createElement("input");
                        input2.setAttribute("type", "text");
                        input2.setAttribute("name", "decryptionkey");
                        input2.setAttribute("value", "key (base64 encoded)");
                        input2.setAttribute("id", "addnewdecryptionkeykey");

                        td2.appendChild(input2);
                        tr.appendChild(td2);
                        const td3 = document.createElement("td");
                        const input3 = document.createElement("input");
                        input3.setAttribute("type", "text");
                        input3.setAttribute("name", "jwk");
                        input3.setAttribute("value", "jwk (plain)");
                        input3.setAttribute("id", "addnewdecryptionkeyjwk");

                        td3.appendChild(input3);
                        tr.appendChild(td3);

                        const td4 = document.createElement("td");

                        const btn = document.createElement("button");
                        btn.setAttribute("type", "submit");
                        btn.setAttribute("class", "onAddDecryptionKey");

                        var newContent = document.createTextNode("add this key");
                        btn.appendChild(newContent);
                        td4.appendChild(btn);
                        tr.appendChild(td4);

                        tb_for_newdecryotionKey.appendChild(tr);

                        //new_key_form.addEventListener("submit", saveNewKeyOptions);
                        // document.querySelector("form").addEventListener("submit", saveOptions);

                        const hidden_input = document.createElement("input");
                        hidden_input.setAttribute("type", "hidden");
                        hidden_input.setAttribute("name", "colour");
                        hidden_input.setAttribute("value", "orange");

                        new_key_form.appendChild(hidden_input);

                        td.appendChild(new_key_form);

                        tb_for_encryptionKeys.appendChild(tr_last);

                    };
                    // add a line where information on a new key can be added to the database.
                    // document.querySelector("button.onAddDecryptionKey").onclick = this.onAddDecryptionKey;

                } else {
                    // Fallback to the traditional cursor approach if getAll isn't supported.
                    var timestamps = [];
                    objectStore.openCursor().onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            console.log(cursor.value);
                            //        timestamps.push(cursor.value);
                            cursor.continue();
                        } else {
                            //        logTimestamps(timestamps);
                        }
                    };

                    document.querySelector("button.onAddEncryptionKey").onclick = this.onAddEncryptionKey;

                    const tr_last = document.createElement("tr");

                    const td = document.createElement("td");
                    td.innerHTML = "key name";
                    tr_last.appendChild(td);
                    const td2 = document.createElement("td");
                    td2.innerHTML = "key";
                    tr_last.appendChild(td2);
                    const td3 = document.createElement("td");
                    td3.innerHTML = "jwk";
                    tr_last.appendChild(td3);

                    tb_for_encryptionKeys.appendChild(tr_last);

                }

            };

            //

        }

        // ##########
        // list all private keys in db
        // ##########
        {

            const privatekeytable = document.querySelector("ul.privatekeys");

            var table_conf = [{
                    "id": "1",
                    "width": "100px"
                }, {
                    "id": "1",
                    "width": "100px"
                }, {
                    "id": "1",
                    "width": "290px"
                }, {
                    "id": "1",
                    "width": "290px"
                }, {
                    "id": "1",
                    "width": "100px"
                }, {
                    "id": "1",
                    "width": "100px"
                }, {
                    "id": "1",
                    "width": "100px"
                }
            ];

            const tb_for_privateKeys = createTable(table_conf);

            privatekeytable.appendChild(tb_for_privateKeys);

            // setup column headers for table
            var header_conf = [{
                    "id": "1",
                    "text": "key id"
                }, {
                    "id": "2",
                    "text": "uuid"
                }, {
                    "id": "2",
                    "text": "user"
                }, {
                    "id": "2",
                    "text": "key"
                }, {
                    "id": "2",
                    "text": "jwk"
                }
            ];

            tb_for_privateKeys.appendChild(writeTableHeaderRow(header_conf));

            var dbRequest = indexedDB.open("privateKeys");
            dbRequest.onerror = function (event) {
                reject(Error("Error text"));
            };

            dbRequest.onupgradeneeded = function (event) {
                // Objectstore does not exist. Nothing to load
                event.target.transaction.abort();
                reject(Error('Not found'));
            };

            dbRequest.onsuccess = function (event) {
                var database = event.target.result;
                var transaction = database.transaction('keyPairs', 'readonly');
                var objectStore = transaction.objectStore('keyPairs');

                if ('getAll' in objectStore) {
                    // IDBObjectStore.getAll() will return the full set of items in our store.
                    objectStore.getAll().onsuccess = function (event) {
                        const res = event.target.result;
                        // console.log(res);

                        // setup column headers for table
                        var column_conf = [{
                                "id": "1",
                                "attribute": "keyId"
                            }, {
                                "id": "2",
                                "attribute": "uuid"
                            }, {
                                "id": "2",
                                "attribute": "username"
                            }, {
                                "id": "2",
                                "attribute": "key"
                            }, {
                                "id": "2",
                                "attribute": "jwk"
                            }, {
                                "id": "2",
                                "node": {
                                    "name": "button",
                                    "text": "make default",
                                    "class": "designate-default-private-key",
                                    "EventListener": {
                                        "type": "click",
                                        "func": "makeDefaultPrivateKey",
                                        "parameter": "click"
                                    }
                                }
                            }, {
                                "id": "2",
                                "node": {
                                    "name": "form",
                                    "class": "delete-private-key-form",
                                    "subnodes": [{
                                            "name": "button",
                                            "text": "delete priv key",
                                            "class": "delete-private-key",
                                            "EventListener": {
                                                "type": "click",
                                                "func": "deletePrivateKey",
                                                "parameter": "click"
                                            }
                                        }
                                    ]
                                }
                            }, {
                                "id": "2",
                                "node": {
                                    "name": "button",
                                    "text": "export priv key",
                                    "class": "export-private-key",
                                    "EventListener": {
                                        "type": "click",
                                        "func": "exportPrivateKey",
                                        "parameter": "click"
                                    }
                                }
                            },

                        ];

                        for (const url of res) {

                            // create table row
                            //           const tr = document.createElement("tr");
                            // console.log("column_conf " + JSON.stringify(column_conf));

                            const tr = writeTableRow(url, column_conf);

                            // create add row to table

                            tb_for_privateKeys.appendChild(tr);

                        }

                        const tr_last = document.createElement("tr");

                        const td = document.createElement("td");
                        td.setAttribute("colspan", "4");

                        tr_last.appendChild(td);
                        const new_key_form = document.createElement("form");

                        const tb_for_newdecryotionKey = document.createElement("table");
                        tb_for_newdecryotionKey.setAttribute("border", "1");

                        new_key_form.appendChild(tb_for_newdecryotionKey);

                        const tr = document.createElement("tr");

                        const td0 = document.createElement("td");

                        tr.appendChild(td0);

                        const td1 = document.createElement("td");
                        const input1 = document.createElement("input");
                        input1.setAttribute("type", "text");
                        input1.setAttribute("name", "username");
                        input1.setAttribute("value", "user name");
                        input1.setAttribute("id", "addnewdecryptionkeyusername");

                        td1.appendChild(input1);
                        tr.appendChild(td1);

                        const td2 = document.createElement("td");

                        const input2 = document.createElement("input");
                        input2.setAttribute("type", "text");
                        input2.setAttribute("name", "decryptionkey");
                        input2.setAttribute("value", "key (base64 encoded)");
                        input2.setAttribute("id", "addnewdecryptionkeykey");

                        td2.appendChild(input2);
                        tr.appendChild(td2);
                        const td3 = document.createElement("td");
                        const input3 = document.createElement("input");
                        input3.setAttribute("type", "text");
                        input3.setAttribute("name", "jwk");
                        input3.setAttribute("value", "jwk (plain)");
                        input3.setAttribute("id", "addnewdecryptionkeyjwk");

                        td3.appendChild(input3);
                        tr.appendChild(td3);

                        const td4 = document.createElement("td");

                        const btn = document.createElement("button");
                        btn.setAttribute("type", "submit");
                        btn.setAttribute("class", "onAddDecryptionKey");

                        var newContent = document.createTextNode("add this key");
                        btn.appendChild(newContent);
                        td4.appendChild(btn);
                        tr.appendChild(td4);

                        tb_for_newdecryotionKey.appendChild(tr);

                        new_key_form.addEventListener("submit", submitAddNewDecryptionKey);
                        // document.querySelector("form").addEventListener("submit", saveOptions);

                        const hidden_input = document.createElement("input");
                        hidden_input.setAttribute("type", "hidden");
                        hidden_input.setAttribute("name", "colour");
                        hidden_input.setAttribute("value", "orange");

                        new_key_form.appendChild(hidden_input);

                        td.appendChild(new_key_form);

                        tb_for_privateKeys.appendChild(tr_last);

                    };
                    // add a line where information on a new key can be added to the database.
                    //   document.querySelector("button.onAddDecryptionKey").onclick = this.onAddDecryptionKey;

                } else {
                    // Fallback to the traditional cursor approach if getAll isn't supported.
                    var timestamps = [];
                    objectStore.openCursor().onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            console.log(cursor.value);
                            //        timestamps.push(cursor.value);
                            cursor.continue();
                        } else {
                            //        logTimestamps(timestamps);
                        }
                    };

                    document.querySelector("button.onAddDecryptionKey").onclick = this.onAddDecryptionKey;

                    const tr_last = document.createElement("tr");

                    const td = document.createElement("td");
                    td.innerHTML = "key name";
                    tr_last.appendChild(td);
                    const td2 = document.createElement("td");
                    td2.innerHTML = "key";
                    tr_last.appendChild(td2);
                    const td3 = document.createElement("td");
                    td3.innerHTML = "jwk";
                    tr_last.appendChild(td3);

                    tb_for_privateKeys.appendChild(tr_last);

                }

            };
        }
        // ########
        // list all decryption keys in db
        // ########
        {

            const decryptionkeytable = document.querySelector("ul.decryptionkeys");

            var table_conf = [{
                    "id": "1",
                    "width": "100px"
                }, {
                    "id": "1",
                    "width": "100px"
                }, {
                    "id": "1",
                    "width": "290px"
                }, {
                    "id": "1",
                    "width": "290px"
                }, {
                    "id": "1",
                    "width": "100px"
                }, {
                    "id": "1",
                    "width": "100px"
                }, {
                    "id": "1",
                    "width": "100px"
                }
            ];

            const tb_for_decryptionKeys = createTable(table_conf);
            tb_for_decryptionKeys.setAttribute("border", "1");

            decryptionkeytable.appendChild(tb_for_decryptionKeys);

            // setup column headers for table
            var header_conf = [{
                    "id": "1",
                    "text": "key id"
                }, {
                    "id": "2",
                    "text": "uuid"
                }, {
                    "id": "2",
                    "text": "user"
                }, {
                    "id": "2",
                    "text": "key"
                }, {
                    "id": "2",
                    "text": "jwk"
                }
            ];

            tb_for_decryptionKeys.appendChild(writeTableHeaderRow(header_conf));

            var dbRequest = indexedDB.open("trustedDecryptionKeys");

            dbRequest.onerror = function (event) {
                reject(Error("Error text"));
            };

            dbRequest.onupgradeneeded = function (event) {
                // Objectstore does not exist. Nothing to load
                event.target.transaction.abort();
                reject(Error('Not found'));
            };
            dbRequest.onsuccess = function (event) {
                var database = event.target.result;
                var transaction = database.transaction('decryptionKeys', 'readonly');
                var objectStore = transaction.objectStore('decryptionKeys');

                if ('getAll' in objectStore) {
                    // IDBObjectStore.getAll() will return the full set of items in our store.
                    objectStore.getAll().onsuccess = function (event) {
                        const res = event.target.result;
                        //   console.log(res);

                        // setup column headers for table
                        var column_conf = [{
                                "id": "1",
                                "attribute": "keyId"
                            }, {
                                "id": "2",
                                "attribute": "uuid"
                            }, {
                                "id": "2",
                                "attribute": "username"
                            }, {
                                "id": "2",
                                "attribute": "key"
                            }, {
                                "id": "2",
                                "attribute": "jwk"
                            }, {
                                "id": "2",
                                "node": {
                                    "name": "button",
                                    "text": "make update to dec key",
                                    "class": "update-decryption-key",
                                    "EventListener": {
                                        "type": "click",
                                        "func": "updateDecryptionKey",
                                        "parameter": "click"
                                    }
                                }
                            }, {
                                "id": "2",
                                "node": {
                                    "name": "form",
                                    "subnodes": [{
                                            "name": "button",
                                            "text": "delete dec key",
                                            "class": "ddelete-key",
                                            "EventListener": {
                                                "type": "click",
                                                "func": "deleteDecryptionKey",
                                                "parameter": "click"
                                            }
                                        }
                                    ]
                                }
                            }, {
                                "id": "2",
                                "node": {
                                    "name": "button",
                                    "text": "export dec key",
                                    "class": "export-decryption-key",
                                    "EventListener": {
                                        "type": "click",
                                        "func": "exportDecryptionKey",
                                        "parameter": "click"
                                    }
                                }
                            },

                        ];

                        for (const url of res) {
                            // create table row
                            //           const tr = document.createElement("tr");
                            // console.log("column_conf " + JSON.stringify(column_conf));

                            const tr = writeTableRow(url, column_conf);

                            // create add row to table
                            tb_for_decryptionKeys.appendChild(tr);

                        }

                        const tr_last = document.createElement("tr");

                        const td = document.createElement("td");
                        td.setAttribute("colspan", "4");

                        tr_last.appendChild(td);
                        const new_key_form = document.createElement("form");

                        const tb_for_newdecryotionKey = document.createElement("table");
                        tb_for_newdecryotionKey.setAttribute("border", "1");

                        new_key_form.appendChild(tb_for_newdecryotionKey);

                        const tr = document.createElement("tr");

                        const td0 = document.createElement("td");

                        tr.appendChild(td0);

                        const td1 = document.createElement("td");
                        const input1 = document.createElement("input");
                        input1.setAttribute("type", "text");
                        input1.setAttribute("name", "username");
                        input1.setAttribute("value", "user name");
                        input1.setAttribute("id", "addnewdecryptionkeyusername");

                        td1.appendChild(input1);
                        tr.appendChild(td1);

                        const td2 = document.createElement("td");

                        const input2 = document.createElement("input");
                        input2.setAttribute("type", "text");
                        input2.setAttribute("name", "decryptionkey");
                        input2.setAttribute("value", "key (base64 encoded)");
                        input2.setAttribute("id", "addnewdecryptionkeykey");

                        td2.appendChild(input2);
                        tr.appendChild(td2);
                        const td3 = document.createElement("td");
                        const input3 = document.createElement("input");
                        input3.setAttribute("type", "text");
                        input3.setAttribute("name", "jwk");
                        input3.setAttribute("value", "jwk (plain)");
                        input3.setAttribute("id", "addnewdecryptionkeyjwk");

                        td3.appendChild(input3);
                        tr.appendChild(td3);

                        const td4 = document.createElement("td");

                        const btn = document.createElement("button");
                        btn.setAttribute("type", "submit");
                        btn.setAttribute("class", "onAddDecryptionKey");

                        var newContent = document.createTextNode("add this key");
                        btn.appendChild(newContent);
                        td4.appendChild(btn);
                        tr.appendChild(td4);

                        tb_for_newdecryotionKey.appendChild(tr);

                        new_key_form.addEventListener("submit", submitAddNewDecryptionKey);
                        // document.querySelector("form").addEventListener("submit", saveOptions);

                        const hidden_input = document.createElement("input");
                        hidden_input.setAttribute("type", "hidden");
                        hidden_input.setAttribute("name", "colour");
                        hidden_input.setAttribute("value", "orange");

                        new_key_form.appendChild(hidden_input);

                        td.appendChild(new_key_form);

                        tb_for_decryptionKeys.appendChild(tr_last);

                    };
                    // add a line where information on a new key can be added to the database.
                    //   document.querySelector("button.onAddDecryptionKey").onclick = this.onAddDecryptionKey;

                } else {
                    // Fallback to the traditional cursor approach if getAll isn't supported.
                    var timestamps = [];
                    objectStore.openCursor().onsuccess = function (event) {
                        var cursor = event.target.result;
                        if (cursor) {
                            console.log(cursor.value);
                            //        timestamps.push(cursor.value);
                            cursor.continue();
                        } else {
                            //        logTimestamps(timestamps);
                        }
                    };

                    document.querySelector("button.onAddDecryptionKey").onclick = this.onAddDecryptionKey;

                    const tr_last = document.createElement("tr");

                    const td = document.createElement("td");
                    td.innerHTML = "key name";
                    tr_last.appendChild(td);
                    const td2 = document.createElement("td");
                    td2.innerHTML = "key";
                    tr_last.appendChild(td2);
                    const td3 = document.createElement("td");
                    td3.innerHTML = "jwk";
                    tr_last.appendChild(td3);

                    tb_for_decryptionKeys.appendChild(tr_last);

                }

            };
        }

    }

    componentDidMount() {
        // Load the stored image once the component has been rendered in the page.
        this.onFilterUpdated();
    }

    onDeleteEncryptionKey() {
        console.log("navigate-collection.js: onDeleteEncryptionKey");

        var keyId = browser.storage.sync.get('keyId');
        keyId.then((res) => {
            document.querySelector("#keyId").value = res.keyId || 'Firefox red';
        });

        console.log("navigate-collection.js: onDeleteEncryptionKey:keyId:" + document.querySelector("#keyId").value);

    }

    onAddDecryptionKey() {
        console.log("navigate-collection.js: onAddDecryptionKey");

    }

    onDeleteKey() {
        console.log("navigate-collection.js: onDeleteKey");

        console.log("navigate-collection.js: onDeleteKey:keyId:" + document.querySelector("#keyId").value);

    }
    onTest() {
        console.log("navigate-collection.js: onTest");

    }

    // add decryption key to database
    scanTabs() {
        console.log("navigate-collection.js: scanTabs");
        find_tabs("Glovebox:");

    }

    generateEncryptionKey() {
        console.log("navigate-collection.js: generateEncryptionKey");

        generate_encryption_key_2();

    }

    // add decryption key to database
    onAddEncryptionKey() {
        console.log("navigate-collection.js: onAddEncryptionKey");

    }

    onDelete() {
        const {
            storedImages
        } = this.state;
        this.setState({
            storedImages: []
        });

        removeStoredImages(storedImages).catch(console.error);
    }

    render() {
        const {
            storedImages
        } = this.state;

        const thumbnailsUl = this.containerEl.querySelector("ul.thumbnails");
        while (thumbnailsUl.firstChild) {
            thumbnailsUl.removeChild(thumbnailsUl.firstChild);
        }

        storedImages.forEach(({
                storedName,
                blobUrl
            }) => {
            const onClickedImage = () => {
                this.imageFilterValue = storedName;
                this.onFilterUpdated();
            };
            const li = document.createElement("li");
            const img = document.createElement("img");
            li.setAttribute("id", storedName);
            img.setAttribute("src", blobUrl);
            img.onclick = onClickedImage;

            li.appendChild(img);
            thumbnailsUl.appendChild(li);
        });
    }
}

// pass in a JSON with a descrition columns
// return

function createTable(table_conf) {
    // console.log("navigate-collection.js: createTableHeaderRow");

    var tb_for_encryptionKeys = document.createElement("table");
    tb_for_encryptionKeys.setAttribute("border", "1");

    for (var i = 0; i < table_conf.length; i++) {
        var obj = table_conf[i];
        // create a column for each

        //  console.log(JSON.stringify(obj));
        //   console.log("create column ");

        // setup column width for table
        var col_i = document.createElement("col");
        col_i.setAttribute("width", obj.width);
        tb_for_encryptionKeys.appendChild(col_i);

    }

    return tb_for_encryptionKeys;

}

// return table row (header) object
function writeTableHeaderRow(row_conf) {
    // console.log("navigate-collection.js: writeTableHeaderRow");

    var tr_top = document.createElement("tr");

    for (var i = 0; i < row_conf.length; i++) {
        var obj = row_conf[i];
        // create a column for each

        //  console.log(JSON.stringify(obj));
        //  console.log("create header ");

        var i_col = document.createElement("td");
        i_col.innerHTML = obj.text;
        tr_top.appendChild(i_col);

    }

    return tr_top;

}

// // accept data object and configuration object

// return tr object
function writeTableRow(url, column_conf) {
    //console.log("navigate-collection.js: writeTableRow");

    //console.log("url " + JSON.stringify(url));
    //console.log("column_conf " + JSON.stringify(column_conf));

    const tr = document.createElement("tr");

    for (var i = 0; i < column_conf.length; i++) {
        var obj = column_conf[i];

        var i_col = document.createElement("td");

        // console.log("" + obj.hasOwnProperty('attribute'));
        if (obj.hasOwnProperty('attribute')) {
            i_col.innerHTML = JSON.stringify(url[obj.attribute]);
            tr.appendChild(i_col);
        } else if (obj.hasOwnProperty('node')) {

            var n = obj.node;
            //     console.log("node definition " + JSON.stringify(n));

            var node = writeTableNode(url, n);

            // any eventlisteners defined ?

            i_col.appendChild(node);
            tr.appendChild(i_col);
        }
    }

    return tr;
}

function writeTableNode(url, node_conf) {
    console.log("writeTableNode ");
    var n = node_conf;
    //  console.log("node definition " + JSON.stringify(n));

    var node = document.createElement(n.name);

    // has sub nodes ?
    if (n.hasOwnProperty('subnodes')) {

        // console.log("###### has sub nodes ");

        //  console.log("###### has sub nodes " + JSON.stringify(n.subnodes));
        //  console.log("###### has sub nodes " + n.subnodes.length);

        for (var i = 0; i < n.subnodes.length; i++) {
            var obj = n.subnodes[i];

            //      console.log("###### has sub nodes " + JSON.stringify(obj));

            node.appendChild(writeTableNode(url, obj));
        }

    }

    if (n.hasOwnProperty('class')) {
        node.setAttribute("class", n['class']);
    }
    if (n.hasOwnProperty('text')) {
        node.appendChild(document.createTextNode(n.text));
    }
    if (n.hasOwnProperty('EventListener')) {

        var func = n.EventListener.func;

        //  console.log("node has event listener function:" + func);


        switch (func) {
        case "deleteDecryptionKey":
            //    console.log("####node has event listener deleteDecryptionKey:" + func);
            node.addEventListener('click', function () {
                deleteDecryptionKey(url.keyId)
            })
            break;
        case "deleteEncryptionKey":
            //   console.log("####node has event listener deleteEncryptionKey:" + func);
            node.addEventListener('click', function () {
                deleteEncryptionKey(url.keyId)
            })
            break;
        case "deletePrivateKey":
            //   console.log("####node has event listener deletePrivateKey:" + func);
            node.addEventListener('click', function () {
                deletePrivateKey(url.keyId)
            })
            break;
        case "updateEncryptionKey":
            //   console.log("####node has event listener updateEncryptionKey:" + func);
            node.addEventListener('click', function () {
                updateEncryptionKey(url.keyId)
            })
            break;
        case "updateEncryptionKey":
            //   console.log("####node has event listener updateEncryptionKey:" + func);
            node.addEventListener('click', function () {
                updateEncryptionKey(url.keyId)
            })
            break;
        case "deleteKeyOffer":
            //   console.log("####node has event listener deleteKeyOffer:" + func);
            node.addEventListener('click', function () {
                deleteKeyOffer(url.keyId)
            })
            break;
        case "makeDefaultEncryptionKey":
            //    console.log("####node has event listener makeDefaultEncryptionKey:" + func);
            node.addEventListener('click', function () {
                makeDefaultEncryptionKey(url.keyId)
            })
            break;
        case "makeDefaultPrivateKey":
            //   console.log("####node has event listener makeDefaultPrivateKey:" + func);
            node.addEventListener('click', function () {
                makeDefaultPrivateKey(url.keyId)
            })
            break;
        case "exportEncryptionKey":
            //   console.log("####node has event listener exportEncryptionKey:" + func);
            node.addEventListener('click', function () {
                exportEncryptionKey(url.keyId)
            })
            break;
        case "exportDecryptionKey":
            //   console.log("####node has event listener exportDecryptionKey:" + func);
            node.addEventListener('click', function () {
                exportDecryptionKey(url.keyId)
            })
            break;
        case "exportPrivateKey":
            //   console.log("####node has event listener exportPrivateKey:" + func);
            node.addEventListener('click', function () {
                exportPrivateKey(url.keyId)
            })
            break;
        }
    }
    return node;

}

// capture the form submission
function submitScanTabs(e) {
    console.log("navigate-collection.js: submitScanTabs");
    browser.storage.sync.set({
        //colour: document.querySelector("#colour").value
    });
    e.preventDefault();
}

// capture the form submission
function submitGenerateEncryptionKey(e) {
    console.log("navigate-collection.js: submitGenerateEncryptionKey");
    console.log("navigate-collection.js: submitGenerateEncryptionKey: e:" + JSON.stringify(e));

    browser.storage.sync.set({
        //colour: document.querySelector("#colour").value
    });
    e.preventDefault();
}

// capture the form submission
function submitDeleteEncryptionKey(e) {
    console.log("navigate-collection.js: submitDeleteEncryptionKey" + JSON.stringify(e));
    console.log("navigate-collection.js: submitDeleteEncryptionKey" + document.querySelector("#keyId").value);
    browser.storage.sync.set({
        keyId: document.querySelector("#keyId").value
    });

    e.preventDefault();
}

function deletePrivateKey(u) {
    console.log("navigate-collection.js: deletePrivateKey" + u);

    deleteFromIndexedDB('privateKeys', 'keyPairs', u);

}

function deleteEncryptionKey(u) {
    console.log("navigate-collection.js: deleteEncryptionKey" + u);

    deleteFromIndexedDB('encryptionKeys', 'encryptionKeys', u);

}

function deleteDecryptionKey(u) {
    console.log("navigate-collection.js: deleteDecryptionKey" + u);

    deleteFromIndexedDB('trustedDecryptionKeys', 'decryptionKeys', u);

}

// deleteKeyOffer
function deleteKeyOffer(uuid) {
    console.log("navigate-collection.js: deleteKeyOffer uuid:" + uuid);

}

// exportEncryptionKey
function exportEncryptionKey(keyId) {
    console.log("navigate-collection.js: exportEncryptionKey \"" + keyId + "\"");

    // objectStore:"encryptionKeys"
    // get data from database


    console.log("navigate-collection.js: exportEncryptionKey keyId:" + keyId);

    loadFromIndexedDB_async("encryptionKeys", "encryptionKeys", keyId).then(function (obj) {

        console.log("navigate-collection.js: exportEncryptionKey object:" + JSON.stringify(obj));
        // present a popup window

        var frog2 = window.open("", "exportkey", "width=800,height=300,scrollbars=1,resizable=1");

        // create the endryption key in importableform. The keytoken created here and presnted in the form, is readable wherever it is found.

        // the format of the key token is

        // The key tokens can be presented different formats:

        //"open"which is readbable to anyone. the symmetric key is not encrypted, just base64 encoded. The point here is not present any real security other than what is achieved through key distribution. Which may be adequate for many use cases.


        // Glovebox keytoken open syntax:":Clovebox:<username>:<keyuuid>:<base64(decryptionkey)>:"
        // Glovebox keytoken open sample:":Clovebox:username01@domain.org:asasd-bb-erw-w45gvs-5asd:fsdawwefwrwtgRgevWefsfsetg3563rgvegreRErgvE==:"


        //var enc_base = arrayBufferToBase64(keyId);
        var glovebox_key_token_openform = '';
        console.log("navigate-collection.js: exportEncryptionKey object:1" + glovebox_key_token_openform);

        // consider prompting for username in the popup.

        glovebox_key_token_openform = ':GloveboxToken:username01@domain.org:' + obj.keyId + ':' + obj.key + ':';
        console.log("navigate-collection.js: exportEncryptionKey object:2" + glovebox_key_token_openform);

        var html = "<html><head><title>export key</title></head><body>export key:" + keyId;

        html += '<form>';

        html += '<p/><textarea  name="jwk"type="textarea"id="exportedkey" rows="6"cols="80">' + glovebox_key_token_openform + '</textarea >';

        html += '</form>';

        html += '<script type="module"src="/export-encryption-key-popup.js"></script>';

        html += "</body></html>";

        //variable name of window must be included for all three of the following methods so that
        //javascript knows not to write the string to this window, but instead to the new window

        console.log("navigate-collection.js: exportEncryptionKey html" + html);

        frog2.document.open();
        frog2.document.write(html);
        frog2.document.close();
    });

}

// updateEncryptionKey
function updateEncryptionKey(uuid) {
    console.log("navigate-collection.js: updateEncryptionKey \"" + uuid + "\"");

    // objectStore:"encryptionKeys"
    // get data from database

    loadFromIndexedDB_async("encryptionKeys", "encryptionKeys", uuid).then(function (obj) {

        console.log("navigate-collection.js: updateEncryptionKey read from db:" + obj);
        console.log("navigate-collection.js: updateEncryptionKey read from db:" + JSON.stringify(obj));

        // present a popup window

        var frog = window.open("", "wildebeast", "width=500,height=300,scrollbars=1,resizable=1")

            //0b1a4cce-2945-7f21-aed2-bf8520ac0096:"{"keyId":"0b1a4cce-2945-7f21-aed2-bf8520ac0096","key":"m9vji9G1qthmCNdTbn9C5g","jwk":{"alg":"A128GCM","ext":true,"k":"m9vji9G1qthmCNdTbn9C5g","key_ops":["encrypt","decrypt"],"kty":"oct"},"ext":true}"

            var html = "<html><head><title>update key</title></head><body>Hello, <b> text </b>.";
        html += 'make any changes required<form class="update-encryption-key">';

        html += '<br/>username<input name="username"id="username"type="text"value="' + obj.username + '"></input>';
        html += '<br/>uuid<input name="uuid"id="uuid"type="text"value="' + obj.keyId + '"></input>';

        html += '<br/>key type<input name="keyObjectType"id="keyObjectType"type="text"value="' + obj.keyObjectType + '"></input>';
        html += '<br/>key<input name="key"type="text"id="key"value="' + obj.key + '"></input>';

        html += '<br/>jwk<textarea  name="jwk"type="textarea"id="jwk" rows="4"cols="50">' + JSON.stringify(obj.jwk) + '</textarea >';

        html += '<br/><input name="update-encryption-key"type="submit"id="update-encryption-key-button"class="update-encryption-key"value="submit updates">test7</input>';

        html += '</form>';

        //var text = document.form.input.value
        html += '<script type="module"src="/update-encryption-key-popup.js"></script>';

        html += "</body></html>";

        //variable name of window must be included for all three of the following methods so that
        //javascript knows not to write the string to this window, but instead to the new window

        frog.document.open();
        frog.document.write(html);
        frog.document.close();
    });
    //deleteFromIndexedDB('encryptionKeys', 'encryptionKeys', u);

}

// updateEncryptionKey
function updateDecryptionKey(uuid) {
    console.log("navigate-collection.js: updateDecryptionKey \"" + uuid + "\"");

    // objectStore:"encryptionKeys"
    // get data from database

    loadFromIndexedDB_async("trustedDecryptionKeys", "decryptionKeys", uuid).then(function (obj) {

        console.log("navigate-collection.js: updateDecryptionKey read from db:" + obj);
        //    console.log("navigate-collection.js: updateDecryptionKey read from db:"+ JSON.stringify(obj));

        // present a popup window

        var frog = window.open("", "wildebeast", "width=500,height=300,scrollbars=1,resizable=1")

            //0b1a4cce-2945-7f21-aed2-bf8520ac0096:"{"keyId":"0b1a4cce-2945-7f21-aed2-bf8520ac0096","key":"m9vji9G1qthmCNdTbn9C5g","jwk":{"alg":"A128GCM","ext":true,"k":"m9vji9G1qthmCNdTbn9C5g","key_ops":["encrypt","decrypt"],"kty":"oct"},"ext":true}"

            var html = "<html><head><title>update key</title></head><body>Hello, <b> text </b>.";
        html += 'make any changes required<form class="update-decryption-key">\n';

        html += '<br/>username<input name="username"id="username"type="text"value="' + obj.username + '"></input>\n';
        html += '<br/>uuid<input name="uuid"id="uuid"type="text"value="' + obj.keyId + '"></input>\n';

        html += '<br/>key type<input name="keyObjectType"id="keyObjectType"type="text"value="' + obj.keyObjectType + '"></input>\n';
        html += '<br/>key<input name="key"type="text"id="key"value="' + obj.key + '"></input>\n';

        html += '<br/>jwk<textarea  name="jwk"type="textarea"id="jwk" rows="4"cols="50">' + JSON.stringify(obj.jwk) + '</textarea >\n';

        html += '<br/><input name="update-decryption-key"type="submit"id="update-decryption-key-button"class="update-decryption-key"value="submit updates"></input>';

        html += '</form>';

        //var text = document.form.input.value
        html += '<script type="module"src="/update-decryption-key-popup.js"></script>';

        html += "</body></html>";

        //variable name of window must be included for all three of the following methods so that
        //javascript knows not to write the string to this window, but instead to the new window

        frog.document.open();
        frog.document.write(html);
        frog.document.close();
    });
    //deleteFromIndexedDB('encryptionKeys', 'encryptionKeys', u);

}

// designate an encryption key as default
function makeDefaultEncryptionKey(uuid) {
    console.log("navigate-collection.js: makeDefaultEncryptionKey" + uuid);

    // the default key should already exists as a publicate under the
    // get the existing default key and give it a new keyId


    //    loadFromIndexedDB_async("encryptionKeys", "encryptionKeys", 'defaultSecretKey').then(function (currentdefaultkey) {
    //        console.log("navigate-collection.js: makeDefaultEncryptionKey read default from db:" + currentdefaultkey);
    //        console.log("navigate-collection.js: makeDefaultEncryptionKey read default from db:" + JSON.stringify(currentdefaultkey));
    //        // make the UUID of the object the new keyId
    //        currentdefaultkey.keyId = currentdefaultkey.uuid;
    //        saveToIndexedDB('encryptionKeys', 'encryptionKeys', currentdefaultkey.keyId, currentdefaultkey).then(function (response) {
    //            console.log("navigate-collection.js: makeDefaultEncryptionKey save to db:" + response);
    //        });
    //    });

    // read out the key from the database
    var obj;

    loadFromIndexedDB_async("encryptionKeys", "encryptionKeys", uuid).then(function (o) {
        obj = o;
        return deleteFromIndexedDB('encryptionKeys', 'encryptionKeys', 'defaultSecretKey');
    }).then(function (res) {
        console.log("navigate-collection.js: makeDefaultEncryptionKey read from res:" + res);
        console.log("navigate-collection.js: makeDefaultEncryptionKey read from db:" + obj);
        console.log("navigate-collection.js: makeDefaultEncryptionKey read from db:" + JSON.stringify(obj));
        // re-insert with a new reference -
        obj.uuid = obj.keyId;

        // make defaultSecretKey the new keyid
        obj.keyId = "defaultSecretKey";

        console.log("navigate-collection.js: makeDefaultEncryptionKey write:" + JSON.stringify(obj));

        // and save it back in on the defaultkey id
        return saveToIndexedDB('encryptionKeys', 'encryptionKeys', 'defaultSecretKey', obj);
    }).then(function (response) {
        console.log("navigate-collection.js: makeDefaultEncryptionKey save to db:" + response);
    });
}

// designate an encryption key as default
function makeDefaultPrivateKey(uuid) {
    console.log("navigate-collection.js: makeDefaultPrivateKey uuid:" + uuid);

    // the default key should already exists as a publicate under the
    // get the existing default key and give it a new keyId


    //    loadFromIndexedDB_async("encryptionKeys", "encryptionKeys", 'defaultSecretKey').then(function (currentdefaultkey) {
    //        console.log("navigate-collection.js: makeDefaultPrivateKey read default from db:" + currentdefaultkey);
    //        console.log("navigate-collection.js: makeDefaultPrivateKey read default from db:" + JSON.stringify(currentdefaultkey));
    //        // make the UUID of the object the new keyId
    //        currentdefaultkey.keyId = currentdefaultkey.uuid;
    //        saveToIndexedDB('encryptionKeys', 'encryptionKeys', currentdefaultkey.keyId, currentdefaultkey).then(function (response) {
    //            console.log("navigate-collection.js: makeDefaultPrivateKey save to db:" + response);
    //        });
    //    });

    // read out the key from the database
    var obj;

    loadFromIndexedDB_async("privateKeys", "keyPairs", uuid).then(function (o) {
        obj = o;
        return deleteFromIndexedDB('privateKeys', 'keyPairs', 'defaultPrivateKey');

    }).then(function (res) {
        console.log("navigate-collection.js: makeDefaultPrivateKey read from res:" + res);
        console.log("navigate-collection.js: makeDefaultPrivateKey read from db:" + obj);
        console.log("navigate-collection.js: makeDefaultPrivateKey read from db:" + JSON.stringify(obj));
        // re-insert with a new reference -
        obj.uuid = obj.keyId;

        // make defaultPrivateKey the new keyid
        obj.keyId = "defaultPrivateKey";

        console.log("navigate-collection.js: makeDefaultPrivateKey write:" + JSON.stringify(obj));

        // and save it back in on the defaultkey id
        return saveToIndexedDB('privateKeys', 'keyPairs', 'defaultPrivateKey', obj);
    }).catch(function (err) {
        console.log("background.js: makeDefaultPrivateKey:err=\"" + err + "\"");
        // if the error is that the defaul is no set. proceed with setting it.
        if (err == "TypeError: obj is undefined") {
            console.log("na1");
            // read out the key and write it to the default key.
            return saveToIndexedDB('privateKeys', 'keyPairs', 'defaultPrivateKey', obj);

        } else {
            console.log("na2");

        }

    }).then(function (response) {
        console.log("navigate-collection.js: makeDefaultPrivateKey save to db:" + response);
    });
}

function onExecuted(result, tabid) {
    console.log("navigate-collection.js: We executed in tab ." + tabid + "." + result);
    //console.log("navigate-collection.js: We executed in tab ."+ tab.id +"."+ result);
    console.log(`navigate-collection.js: calling tab ..`);

}

function onError(error) {
    console.log(`navigate-collection.js: Error: ${error}`);
}

function getTabDocument(result) {
    console.log(`navigate-collection.js: getTabDocument: ${result}`);
    console.log("navigate-collection.js: getTabDocument:" + t);

    browser.tabs.sendMessage(t, {
        greeting: "Hi from background script.."
    })
    .then(function (response) {
        // examine the return data form the sacn

        console.log("navigate-collection.js: tab answer0:" + JSON.stringify(response));
        var token;
        var newItem;
        var arrayLength = response.response.doc.length;
        console.log("navigate-collection.js: arrayLength:" + arrayLength);
        for (var i = 0; i < arrayLength; i++) {

            token = response.response.doc[i];
            console.log(i + "check against database:" + i + ' ' + response.response.doc[i]);

            //Check if this key is in the database over decryption keys

            // retrieve the unique reference from the token
            var token_uuid_value;

            var token_uuid_regex = /:GloveboxToken:[^:]*:([^:]*):[^:]*:/;

            var token_uuid_match = token_uuid_regex.exec(response.response.doc[i]);
            token_uuid_value = token_uuid_match[1];

            var token_username_value;
            var token_username_regex = /:GloveboxToken:([^:]*):[^:]*:[^:]*:/;
            var token_username_match = token_username_regex.exec(response.response.doc[i]);
            token_username_value = token_username_match[1];

            var token_key_value;
            var token_key_regex = /:GloveboxToken:[^:]*:[^:]*:([^:]*):/;
            var token_key_match = token_key_regex.exec(response.response.doc[i]);
            token_key_value = token_key_match[1];

            console.log(i + "pageCopier.js: check if this key is in the database1:" + token_uuid_value + ' ' + token_username_value);

            newItem = {
                "keyId": token_uuid_value,
                "uuid": token_uuid_value,
                "jwk": {
                    "alg": "A128GCM",
                    "ext": true,
                    "k": token_key_value,
                    "key_ops": ["decrypt"],
                    "kty": "oct"
                },
                "format": "jwk",
                "username": token_username_value,
                "ext": true
            };

            console.log(i + "pageCopier.js: check if this key is in the database2:" + newItem);

            console.log(i + ' error in locating key with uuid=' + token_uuid_value);
            // add the token to the key database.

            console.log('adding key with username=' + token_username_value + ' uuid:' + token_uuid_value + ' and key =' + token_key_value);

            console.log('adding key: ' + JSON.stringify(newItem));
            saveToIndexedDB('trustedDecryptionKeys', 'decryptionKeys', token_uuid_value, newItem).then(function (response) {
                console.log("navigate-collection.js: added new decryption key to db:" + response);

            });

        }

    });

}

var t;

async function import_all_keys(json_all_records) {
    console.log("navigate-collection.js: import_all_keys" + json_all_records);

    var obj_all_records = JSON.parse(json_all_records);

    var all_encryption_keys = obj_all_records.encryptionKeys;

    console.log("navigate-collection.js: encryption keys: " + JSON.stringify(all_encryption_keys));

    var all_decryption_keys = obj_all_records.trustedDecryptionKeys;

    console.log("navigate-collection.js: decryption keys: " + JSON.stringify(all_decryption_keys));

    // loop through

    console.log("navigate-collection.js: decryption keys count: " + all_decryption_keys.length);

    for (var i = 0; i < all_decryption_keys.length; i++) {
        var obj = all_decryption_keys[i];

        console.log(obj.uuid);
        // create importable object


        // start the import


        saveToIndexedDB_async('trustedDecryptionKeys', 'decryptionKeys', obj.uuid, obj).then(function (response) {
            console.log('trusted key saved');
        }).catch(function (error) {
            console.log(error.message);
        });

    }

    for (var i = 0; i < all_encryption_keys.length; i++) {
        var obj = all_encryption_keys[i];

        console.log(obj.uuid);
        // create importable object
        // start the import


        saveToIndexedDB_async('encryptionKeys', 'encryptionKeys', obj.uuid, obj).then(function (response) {
            console.log('encryption key saved');
        }).catch(function (error) {
            console.log(error.message);
        });

    }

}

async function backup_all_keys() {
    console.log("navigate-collection.js: backup_all_keys");

    var listOfKeys = "";

    // read out all decryption keys


    var storeName = 'decryptionKeys';

    // get decryption keys

    var dbRequest = indexedDB.open("trustedDecryptionKeys");

    dbRequest.onsuccess = function (event) {
        var database = event.target.result;
        var transaction = database.transaction([storeName]);
        //  console.log("loadFromIndexedDB:transaction: " + JSON.stringify(transaction));
        var objectStore = transaction.objectStore(storeName);

        var allRecords = objectStore.getAll();
        allRecords.onsuccess = function () {

            //download_file("glovebox_keys_backup1.txt", listOfKeys);
            listOfKeys = listOfKeys + '{"trustedDecryptionKeys":' + JSON.stringify(allRecords.result) + '';

            // get encryption keys

            var dbRequest2 = indexedDB.open("encryptionKeys");

            dbRequest2.onsuccess = function (event2) {
                var database2 = event2.target.result;

                var storeName2 = 'encryptionKeys';

                var transaction2 = database2.transaction([storeName2]);
                var objectStore2 = transaction2.objectStore(storeName2);

                var allRecords2 = objectStore2.getAll();
                allRecords2.onsuccess = function () {

                    listOfKeys = listOfKeys + ',"encryptionKeys":' + JSON.stringify(allRecords.result) + '';
                    listOfKeys = listOfKeys + '}';
                    download_file("glovebox_keys_backup.json", listOfKeys);

                };

            }

        };

    }

    //download_file("glovebox_keys_backup.txt", listOfKeys, "text/plain");


}

function download_file(name, contents, mime_type) {
    mime_type = mime_type || "text/plain";

    var blob = new Blob([contents], {
            type: mime_type
        });

    var dlink = document.createElement('a');
    dlink.download = name;
    dlink.href = window.URL.createObjectURL(blob);
    dlink.onclick = function (e) {
        // revokeObjectURL needs a delay to work properly
        var that = this;
        setTimeout(function () {
            window.URL.revokeObjectURL(that.href);
        }, 1500);
    };

    dlink.click();
    dlink.remove();
}

async function get_default_signing_key_2() {
    console.log("get_default_signing_key_2:start");

    // This function returns a JSON structure contaning a public and private key suitable for digital signing and signature validation.
    // ( and also a keypai suitable for RSA encryption/dekryption)
    // If not such default key has been set, one is created and insterted into the database.
    // If a new key is created, it is inserted both under it's own unique identifier, as well as under the default identifier.

    // The function returns a Promise, which resolves to the key.

    var defaultSigningKey;
    var defaultSigningKey2;
    // look for default signing RSA key
    var newItem;
    var newItem2;

    var enc_privkey;
    var enc_pubkey;
    var sign_privkey;
    var sign_pubkey;
    var testkeypairobj;
    var uuid;

    let promises = [];
    promises[0] = (loadFromIndexedDB("privateKeys", "keyPairs", 'defaultPrivateKey'));
    defaultSigningKey = await Promise.all(promises);

    console.log('###### get default key ' + defaultSigningKey);

    promises[0] = (window.crypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 1024,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {
                name: "SHA-1"
            },
        },
            true,
            ["sign", "verify"]));
    testkeypairobj = await Promise.all(promises);

    console.log('###### testkeypairobj ' + testkeypairobj);

    var d;
    d = await loadFromIndexedDB("privateKeys", "keyPairs", 'defaultPrivateKey');
    console.log(d);
    console.log(typeof d);
    if (typeof d == "undefined") {
        console.log("no default signing priv key..");
        // make call to create one

        var a;
        a = await window.crypto.subtle.generateKey({
                name: "RSASSA-PKCS1-v1_5",
                modulusLength: 1024,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: {
                    name: "SHA-1"
                },
            },
                true,
                ["sign", "verify"]);
        console.log("#### 2");

        console.log(a);
        console.log(typeof a);
        var b;
        b = await window.crypto.subtle.exportKey("jwk", a.publicKey);
        console.log(b);
        console.log(typeof b);
        console.log("#### 3");

        var c;
        c = await window.crypto.subtle.exportKey("jwk", a.publicKey);
        console.log(c);
        console.log(typeof c);
        console.log("#### 4");

    }
    console.log("#### 5");
    return d;
}

async function get_default_signing_key() {
    console.log("get_default_signing_key:start");

    // This function returns a JSON structure contaning a public and private key suitable for digital signing and signature validation.
    // ( and also a keypai suitable for RSA encryption/dekryption)
    // If not such default key has been set, one is created and insterted into the database.
    // If a new key is created, it is inserted both under it's own unique identifier, as well as under the default identifier.

    // The function returns a Promise, which resolves to the key.

    var defaultSigningKey;
    var defaultSigningKey2;
    // look for default signing RSA key
    var newItem;
    var newItem2;

    var enc_privkey;
    var enc_pubkey;
    var sign_privkey;
    var sign_pubkey;
    var testkeypairobj;
    var uuid;

    var d;
    d = await loadFromIndexedDB("privateKeys", "keyPairs", 'defaultPrivateKey');
    console.log(d);
    console.log(typeof d);
    if (typeof d == "undefined") {
        console.log("no default signing priv key..");
        // make call to create one

        var a;
        a = await window.crypto.subtle.generateKey({
                name: "RSASSA-PKCS1-v1_5",
                modulusLength: 1024,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: {
                    name: "SHA-1"
                },
            },
                true,
                ["sign", "verify"]);
        console.log("#### 2");

        console.log(a);
        console.log(typeof a);
        var b;
        b = await window.crypto.subtle.exportKey("jwk", a.publicKey);
        console.log(b);
        console.log(typeof b);
        console.log("#### 3");

        var c;
        c = await window.crypto.subtle.exportKey("jwk", a.publicKey);
        console.log(c);
        console.log(typeof c);
        console.log("#### 4");

    }
    console.log("#### 5");
    return d;
}

async function generate_signingkey_obj() {
    console.log("generate_signingkey_obj");

    var uuid;
    var testkeypairobj;
    var testprivkey;
    var testpubkey;
    var newItem;
    // create key pair
    console.log("1");
    var key;
    var publicKeyJwk;
    var testkeypairobj;

    var enc_privkey;
    var enc_pubkey;
    var sign_privkey;
    var sign_pubkey;

    var sign_key_obj;
    console.log("2.0");
    try {
        console.log("2.0.1");
        sign_key_obj = await window.crypto.subtle.generateKey({
                name: "RSASSA-PKCS1-v1_5",
                modulusLength: 1024,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: {
                    name: "SHA-1"
                },
            },
                true,
                ["sign", "verify"]);
        console.log("2.0.2");

    } catch (e) {
        console.log("2.0.4");
        console.log(e);
    }
    console.log("2.0.5");
    console.log(sign_key_obj);

    return sign_key_obj;
}

// return the JWK of the default signing key
function get_default_signingkey_jwk() {
    console.log("navigate-collection.js: get_default_signingkey_jwk.begin");
    var signing_key_jwk;

    var default_signingkey_found;
    var default_signingkey_created;
    var default_encryptedkey_found;
    var default_encryptedkey_created;

    // look for default signing key in the database first, and use this if found

    loadFromIndexedDB("privateKeys", "keyPairs", 'defaultPrivateKey')
    .then(function (key) {
        // check if key was found and set flag accordingly
        console.log(key + ' fetched!');
        //    defaultSigningKeyFound = false;
        console.log(key);
        console.log(typeof key);
        if (typeof key == "undefined") {
            console.log("no key found");
        } else {
            console.log("default key found");
            return 2;
        }
    }).then(function (a) {
        console.log(a);

        return signing_key_jwk;

    }).catch(function (e) {
        console.log("a");

        return signing_key_jwk;

    });

    // depending on whether or not a key was returned, create a new one


    console.log("navigate-collection.js: get_default_signingkey_jwk.end");
}

//
async function generate_signingkey_jwk() {
    console.log("generate_signingkey_jwk");

    var uuid;
    var testkeypairobj;
    var testprivkey;
    var testpubkey;
    var newItem;
    // create key pair
    console.log("1");
    var key;
    var publicKeyJwk;
    var testkeypairobj;

    var enc_privkey;
    var enc_pubkey;
    var sign_privkey;
    var sign_pubkey;

    var newItem;
    var algoKeyGen = {
        name: 'AES-GCM',
        //          length: 256
        length: 128
    };

    console.log('navigate-collection.js:algoKeyGen: ' + JSON.stringify(algoKeyGen));

    var keyUsages = [
        'encrypt',
        'decrypt'
    ];
    var sign_key_obj;
    console.log("2.0");
    sign_key_obj = await window.crypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 1024,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {
                name: "SHA-1"
            },
        },
            true,
            ["sign", "verify"]);
    console.log(sign_key_obj);

    console.log("2.1");
    console.log("2.2");
    sign_pubkey = await window.crypto.subtle.exportKey("jwk", sign_key_obj.publicKey);
    console.log(sign_pubkey);
    console.log("2.3");
    sign_privkey = await window.crypto.subtle.exportKey("jwk", sign_key_obj.privateKey);
    console.log(sign_privkey);
    console.log("2.4");

    //generates random id;
    let guid = () => {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    uuid = guid();

    //      newItem = {
    //          keyId: uuid,
    //          uuid: uuid,
    //          "key": expkey.k,
    //          "jwk": expkey,
    //          "ext": true
    //       };
    newItem = {
        "keyId": uuid,
        "uuid": uuid,
        "encryption_publicKey": enc_pubkey,
        "encryption_privateKey": enc_privkey,
        "signature_publicKeyJWK": sign_pubkey,
        "signature_privateKeyJWK": sign_privkey,

    };

    console.log('newItem: ' + JSON.stringify(newItem));
    return newItem;
}

// generaye a public-private keypair
// put it in the database

async function generate_privatepublickey_2_jwk() {
    console.log("generate_privatepublickey_2_jwk");
    const one = await generate_privatepublickey();

    console.log(one);
    console.log("generate_privatepublickey_2_jwk.fin");
}
generate_privatepublickey_3_jwk

async function generate_privatepublickey_3_jwk() {
    console.log("generate_privatepublickey_3_jwk.begin");
    var testkeypairobj;
    var testprivkey;
    var testpubkey;
    var one;
    window.crypto.subtle.generateKey({
        name: "RSA-OAEP",
        modulusLength: 1024,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: {
            name: "SHA-256"
        }
    },
        true,
        ["encrypt", "decrypt"]).then(function (key) {
        console.log("1");
        testkeypairobj = key;
        return window.crypto.subtle.exportKey("jwk", testkeypairobj.publicKey);
    }).catch(function (err) {
        console.log("HEY!: " + err.message);
    }).then(function (key_pub) {
        testpubkey = key_pub;
        console.log(key_pub);
        console.log(JSON.stringify(key_pub));

        return window.crypto.subtle.exportKey("jwk", testkeypairobj.privateKey);
    }).catch(function (err) {
        console.log("HEY!: " + err.message);
    }).then(function (key_priv) {
        testprivkey = key_priv;
        console.log(key_priv);
        console.log("privkey: " + JSON.stringify(key_priv));

        var obj = {
            RSASSAPKCS1v1_5_privateKey: testpubkey
        };

        console.log("obj: " + JSON.stringify(obj));

        console.log("generate_privatepublickey_3_jwk:fin.1");
        return obj;
    }).catch(function (err) {
        console.log("HEY!: " + err.message);

    });

    console.log(one);
    console.log("generate_privatepublickey_3_jwk:fin.2");
}

async function generate_privatepublickey() {
    console.log("generate_privatepublickey");

    var uuid;
    var testkeypairobj;
    var testprivkey;
    var testpubkey;
    var newItem;
    // create key pair
    console.log("1");
    var key;
    var publicKeyJwk;
    var testkeypairobj;

    var enc_privkey;
    var enc_pubkey;
    var sign_privkey;
    var sign_pubkey;

    var newItem;
    var algoKeyGen = {
        name: 'AES-GCM',
        //          length: 256
        length: 128
    };

    console.log('navigate-collection.js:algoKeyGen: ' + JSON.stringify(algoKeyGen));

    var keyUsages = [
        'encrypt',
        'decrypt'
    ];
    var sign_key_obj;
    console.log("2.0");
    sign_key_obj = await window.crypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 1024,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {
                name: "SHA-1"
            },
        },
            true,
            ["sign", "verify"]);
    console.log(sign_key_obj);

    console.log("2.1");
    console.log("2.2");
    sign_pubkey = await window.crypto.subtle.exportKey("jwk", sign_key_obj.publicKey);
    console.log(sign_pubkey);
    console.log("2.3");
    sign_privkey = await window.crypto.subtle.exportKey("jwk", sign_key_obj.privateKey);
    console.log(sign_privkey);
    console.log("2.4");

    //generates random id;
    let guid = () => {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    uuid = guid();

    //      newItem = {
    //          keyId: uuid,
    //          uuid: uuid,
    //          "key": expkey.k,
    //          "jwk": expkey,
    //          "ext": true
    //       };
    newItem = {
        "keyId": uuid,
        "uuid": uuid,
        "encryption_publicKey": enc_pubkey,
        "encryption_privateKey": enc_privkey,
        "signature_publicKeyJWK": sign_pubkey,
        "signature_privateKeyJWK": sign_privkey,

    };

    console.log('newItem: ' + JSON.stringify(newItem));

//    return newItem;

    var crypt_key_obj;
    crypt_key_obj = await window.crypto.subtle.generateKey({
            name: "RSA-OAEP",
            modulusLength: 1024,
            publicExponent: new Uint8Array([1, 0, 1]),
            hash: {
                name: "SHA-256"
            }
        },
            true,
            ["encrypt", "decrypt"]);
    console.log(crypt_key_obj);
    console.log("3.2");

    enc_pubkey = window.crypto.subtle.exportKey("jwk", crypt_key_obj.publicKey);
    console.log(enc_pubkey);
    console.log("3.3");
    enc_privkey = window.crypto.subtle.exportKey("jwk", crypt_key_obj.privateKey);
    console.log(enc_privkey);
    console.log("3.4");

    newItem = {
        "keyId": uuid,
        "uuid": uuid,
        "encryption_publicKey": enc_pubkey,
        "encryption_privateKey": enc_privkey,
        "signature_publicKeyJWK": sign_pubkey,
        "signature_privateKeyJWK": sign_privkey,

    };

    console.log('newItem: ' + JSON.stringify(newItem));

    // bypass the remainder
    return newItem;

}

async function generate_private_key() {
    console.log("navigate-collection.js: generate_private_key");

    // create key pair
    console.log("1");
    const key5 = await window.crypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 1024,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {
                name: "SHA-1"
            },
        },
            true,
            ["sign", "verify"]).
        then(function (a) {
            console.log("1");
            console.log(a);
            console.log(a.publicKey);
            key = a;
            return window.crypto.subtle.exportKey("jwk", a.publicKey);
        }).then(function (b) {
            console.log("2");
            publicKeyJwk = b;

        }).catch(function (err) {
            console.log("HEY!: " + err.message);
        });
    console.log("4");
    var defaultEncryptionKeyId;
    var privateKeyJwk;
    var uuid;
    var offeredKeyId;

    var signatureStr;
    var publicKeyJwk;

    var textToSign = "encryptionkeyreference:";
    var newItem;

    var token_text;
    //generates random id;
    let guid = () => {
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
    uuid = guid();

    var obj;
    var key;
    const key4 = await window.crypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 1024,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {
                name: "SHA-1"
            },
        },
            true,
            ["sign", "verify"]).
        then(function (a) {
            console.log("1");
            console.log(a);
            console.log(a.publicKey);
            key = a;
            return window.crypto.subtle.exportKey("jwk", a.publicKey);
        }).then(function (b) {
            console.log("2");
            publicKeyJwk = b;

        }).catch(function (err) {
            console.log("HEY!: " + err.message);
        });

    console.log(key4);

    obj = {
        RSASSAPKCS1v1_5_privateKey: publicKeyJwk
    };

    console.log("obj: " + JSON.stringify(obj));

    generateRSAKeyPair().then(function (a) {
        //  console.log(a);
        console.log("a: " + JSON.stringify(a));

        privateKeyJwk = a.privateKey;

        publicKeyJwk = a.publicKey;

        //     return loadFromIndexedDB("encryptionKeys", "encryptionKeys", 'defaultSecretKey');

        console.log("publicKeyJwk: " + publicKeyJwk);
        console.log("privateKeyJwk: " + privateKeyJwk);
        console.log("privateKeyJwk: " + JSON.stringify(privateKeyJwk));
        console.log("publicKeyJwk: " + JSON.stringify(publicKeyJwk));

        newItem = {
            keyId: uuid,
            uuid: uuid,
            "privateKey": privateKeyJwk,
            "publicKey": publicKeyJwk,
            "ext": true
        };

        //        newItem.keyId = 'defaultPrivateKey';
        console.log('data to be saved on defaultkey: ' + JSON.stringify(newItem));

        saveToIndexedDB_async('privateKeys', 'keyPairs', 'keyId', newItem);

        // check if there is a default key present, if not save this as the default key too.

        console.log("look for default private key");

        //return loadFromIndexedDB("privateKeys", "keyPairs", 'defaultPrivateKey');

    }).then(function (currentdefaultkey) {

        console.log("background.js: getDefaultPrivateKey:found=" + currentdefaultkey);
        console.log("background.js: getDefaultPrivateKey:found=" + JSON.stringify(currentdefaultkey));

    }).catch(function (err) {
        if (err == "Error: object not found") {
            console.log("background.js: defaultkey not found, assign this key as it");
            // make a new default encryption key
        }
        if (err == "Error: objectstore_error") {
            console.log("background.js: respond to objectstore error");
        }

    });

}

// Create a new encryption key and place it both in the encryption and decryption key databases
// Check if there is a default key in palce, and if not, make this key the default encryption key too.


function generate_encryption_key_4() {
    console.log("navigate-collection.js: generate_encryption_key_4.begin");

    // get default private key

    var signing_key_jwk;
    var encryption_key_jwk;

    var signing_key_obj;
    var encryption_key_obj;

    var defaultEncryptionKeyId;
    var privateKeyJwk;
    var uuid;
    var offeredKeyId;

    var signatureStr;
    var publicKeyJwk;

    var default_signingkey_found;
    var default_signingkey_created;
    var default_encryptedkey_found;
    var default_encryptedkey_created;

    // look for default signing key in the database first, and use this if found

    var key;
    key = loadFromIndexedDB_nonpromise("privateKeys", "keyPairs", 'defaultPrivateKey');

    console.log(key);
    console.log(typeof key);
    if (typeof key == "undefined") {
        console.log("default signing key not found");

    } else {
        console.log("a default signing key was found");

    }

    window.crypto.subtle.generateKey({
        name: "RSASSA-PKCS1-v1_5",
        modulusLength: 1024,
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: {
            name: "SHA-1"
        },
    },
        true,
        ["sign", "verify"]).
    then(function (a) {
        console.log("1");
        console.log(a);
        console.log(a.publicKey);
        signing_key_obj = a;
        return window.crypto.subtle.exportKey("jwk", a.publicKey);
    }).then(function (b) {
        console.log("21");
        publicKeyJwk = b;
        return 0;
    }).catch(function (err) {
        console.log("HEY!: " + err.message);
    }).then(function (c) {
        console.log(c);
        console.log("should have signing key at this point");
        console.log(signing_key_obj);
        return loadFromIndexedDB_nonpromise("encryptionKeys", "encryptionKeys", 'defaultSecretKey');
      
    }).then(function (d) {
        console.log(d);
        console.log(typeof d);
        // was a default encryption key found ?


        return "notfound";
        //	 if (typeof d == "undefined"){
        //		 console.log("default encryption key not found");
        //return 0;
        //	 }else{
        //		 console.log("a default encryption key was found");
        //return 1;
        //	 }


    }).then(function (e) {
        console.log(e);
        console.log(typeof e);
        var algoKeyGen = {
            name: 'AES-GCM',
            //          length: 256
            length: 128
        };
        var keyUsages = [
            'encrypt',
            'decrypt'
        ];

        if (typeof e == "string") {
            // no def. key found
            console.log("create new encryption key");

            return window.crypto.subtle.generateKey(algoKeyGen, true, keyUsages);
        } else {
            return window.crypto.subtle.generateKey(algoKeyGen, true, keyUsages);
        	
        }

    }).then(function (f) {
        console.log(f);
        console.log(typeof f);

    });

    // if new keys were created earlier, save them in the database now


    //var key = generate_private_key();


    console.log("navigate-collection.js: generate_encryption_key_4.end");

}

async function generate_encryption_key_3() {
    console.log("navigate-collection.js: generate_encryption_key_3");

    var one;
    one = await generate_privatepublickey_2_jwk();

    console.log("23");

    // create a sequence of promises
    var sequence = Promise.resolve();
    var defaultSigningKeyFound = false;

    // add database lookup for default signing key
    sequence = sequence.then(function () {
            return loadFromIndexedDB_async("privateKeys", "keyPairs", 'defaultPrivateKey')
        }).then(function (url) {
            // check if key was found and set flag accordingly
            console.log(url + ' fetched!')
            //    defaultSigningKeyFound = false;
        }).catch(function (err) {
            console.log(err + ' failed to load!')
            //    defaultSigningKeyFound = false;
        })

        sequence = sequence.then(function () {
            return loadFromIndexedDB_async("privateKeys", "keyPairs", 'defaultPrivateKey')
        }).then(function (url) {
            // check if key was found and set flag accordingly
            console.log(url + ' fetched!')
            //    defaultSigningKeyFound = false;
        }).catch(function (err) {
            console.log(err + ' failed to load!')
            //    defaultSigningKeyFound = false;
        })

        sequence = sequence.then(function () {
            return loadFromIndexedDB_async("privateKeys", "keyPairs", 'defaultPrivateKey')
        }).then(function (url) {
            // check if key was found and set flag accordingly
            console.log(url + ' fetched!')
            //    defaultSigningKeyFound = false;
        }).catch(function (err) {
            console.log(err + ' failed to load!')
            //    defaultSigningKeyFound = false;
        })

        sequence = sequence.then(function () {
            return loadFromIndexedDB_async("privateKeys", "keyPairs", 'defaultPrivateKey')
        }).then(function (url) {
            // check if key was found and set flag accordingly
            console.log(url + ' fetched - NOT!')
            //    defaultSigningKeyFound = false;
        }).catch(function (err) {
            console.log(err + ' failed to load!')
            //    defaultSigningKeyFound = false;
        })

        // add signing key create with conditional on no default key having been found

        sequence = sequence.then(function () {
            return window.crypto.subtle.generateKey({
                name: "RSASSA-PKCS1-v1_5",
                modulusLength: 1024,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: {
                    name: "SHA-1"
                },
            },
                true,
                ["sign", "verify"])
        }).then(function (url) {
            // check if key was found and set flag accordingly
            console.log(url + ' created!');
            console.log(url);
        }).catch(function (err) {
            console.log(err + ' failed to create!')
        })

        sequence = sequence.then(function () {
            return loadFromIndexedDB_async("privateKeys", "keyPairs", 'defaultPrivateKey')
        }).then(function (url) {
            // check if key was found and set flag accordingly
            console.log(url + ' fetched - NOT!')
            //    defaultSigningKeyFound = false;
        }).catch(function (err) {
            console.log(err + ' failed to load!')
            //    defaultSigningKeyFound = false;
        })

        // add signing key public key export with conditional of sining key being create

        sequence = sequence.then(function () {
            return window.crypto.subtle.generateKey({
                name: "RSASSA-PKCS1-v1_5",
                modulusLength: 1024,
                publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                hash: {
                    name: "SHA-1"
                },
            },
                true,
                ["sign", "verify"]);
        }).then(function (url) {
            // check if key was found and set flag accordingly
            console.log(url + ' created!')
            console.log(url)
        }).catch(function (err) {
            console.log(err + ' failed to create!')
        })

        console.log("99");
   // return "";

    // run promise sequence


    var one = await loadFromIndexedDB_async("privateKeys", "keyPairs", 'defaultPrivateKey');
    var signing_key_obj;
    var signing_key_jwk;

    console.log("four");
    console.log(one);

    var privatekey_uuid;
    var newItem;

    // flag to mark whether or not a new RSA key was created for signing and which should be made the default signing key
    var createdNewSigningKey = false;

    var enc_privkey;
    var enc_pubkey;
    var sign_privkey;
    var sign_pubkey;
    var testkeypairobj;
    var algoKeyGen = {
        name: 'AES-GCM',
        //          length: 256
        length: 128
    };

    console.log('navigate-collection.js:algoKeyGen: ' + JSON.stringify(algoKeyGen));

    var keyUsages = [
        'encrypt',
        'decrypt'
    ];

    //generates random id;
    let guid = () => {
        console.log("#### 7");
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        console.log("#### 8");
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

    }
    console.log("#### 10");
    privatekey_uuid = guid();

    console.log("9");
    // creation of RSA signing key

    //try{

    signing_key_obj = await generate_privatepublickey_2_jwk();
    //    	signing_key_jwk = await generateRSAKeyPair();

    //	createdNewSigningKey = true;
    // }catch(e){
    // 	console.log(e);
    // }
    console.log(signing_key_obj);
    console.log(JSON.stringify(signing_key_obj));

    console.log("9.complete");

    // now have a new RSA with which to sign the symmetric encryption key

    const call3Promise = window.crypto.subtle.exportKey("jwk", signing_key_obj.publicKey);
    try {
        sign_pubkey = await call3Promise;
    } catch (e) {
        console.log(e);
    }
    console.log(sign_pubkey);

    const call4Promise = window.crypto.subtle.exportKey("jwk", signing_key_obj.privateKey);
    try {
        sign_privkey = await call4Promise;
    } catch (e) {
        console.log(e);
    }

    console.log(sign_privkey);

    if (createdNewSigningKey) {
        console.log("save the new signing key");
    } else {}

    //look for default encryption key

    const call5Promise = loadFromIndexedDB_async("encryptionKeys", "encryptionKeys", 'defaultSecretKey');
    console.log("100");
    var default_secretkey;
    try {
        //default_secretkey = await call5Promise;
    } catch (e) {
        console.log(e);
    }
    console.log("101");
    console.log(default_secretkey);
    // check if a secret key was found


    return signing_key_jwk;

}

async function generate_encryption_key_2() {
    console.log("navigate-collection.js: generate_encryption_key_2");
    var uuid;
    var privatekey_uuid;
    var newItem;
    var algoKeyGen = {
        name: 'AES-GCM',
        //          length: 256
        length: 128
    };

    console.log('navigate-collection.js:algoKeyGen: ' + JSON.stringify(algoKeyGen));

    var keyUsages = [
        'encrypt',
        'decrypt'
    ];

    //generates random id;
    let guid = () => {
        console.log("#### 7");
        let s4 = () => {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        console.log("#### 8");
        //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();

    }
    console.log("#### 10");
    privatekey_uuid = guid();
    // boolean to keep track of wheather or not a new default signing key was created
    var createdNewSigningKey = false;
    // first, get the defaul RSA keypair with which to sign the encryption key.

    var testkeypairobj;
    var enc_privkey;
    var enc_pubkey;
    var sign_privkey;
    var sign_pubkey;

    var one = await loadFromIndexedDB("privateKeys", "keyPairs", 'defaultPrivateKey');

    var two = await loadFromIndexedDB("privateKeys", "keyPairs", 'defaultPrivateKey');

    loadFromIndexedDB("privateKeys", "keyPairs", 'defaultPrivateKey').then(function (d) {
        console.log(d);
        console.log(typeof d);
        if (typeof d == "undefined") {
            console.log("no default signing priv key..");
            // make call to create one
            try {
                console.log("no");
                return window.crypto.subtle.generateKey({
                    name: "RSASSA-PKCS1-v1_5",
                    modulusLength: 1024,
                    publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
                    hash: {
                        name: "SHA-1"
                    },
                },
                    true,
                    ["sign", "verify"]);
            } catch (e) {
                console.log(e);
            }
            console.log("no");
        } else {
            console.log("no");
            return (new Promise(function (resolve, reject) {
                    resolve("");
                }));
        }
        console.log("no");

    }).then(function (b) {
        console.log("no");
        console.log(b);
        console.log(typeof b);

        if (typeof b == "") {
            console.log("bypass");
            return (new Promise(function (resolve, reject) {
                    resolve("");
                }));
        } else {
            testkeypairobj = b;
            createdNewSigningKey = true;
            console.log("#### 4");
            // export
            // make key into exportable form
            return window.crypto.subtle.exportKey("jwk", testkeypairobj.publicKey);
        }
        console.log("#### 2");

    }).then(function (b) {
        console.log(b);
        console.log(typeof b);

        if (typeof b == "") {
            console.log("bypass");
            return (new Promise(function (resolve, reject) {
                    resolve("");
                }));
        } else {
            console.log("#### 6");
            // accept exported public key
            sign_pubkey = JSON.stringify(b);
            // export private

            // make key into exportable form
            return window.crypto.subtle.exportKey("jwk", testkeypairobj.privateKey);
        }
        console.log("#### 2");

    }).then(function (b) {
        console.log(b);
        console.log(typeof b);

        if (typeof b == "") {
            console.log("bypass");
            return (new Promise(function (resolve, reject) {
                    resolve("");
                }));
        } else {
            console.log("#### 6");
            // accept exported private key
            sign_privkey = JSON.stringify(b);

        }
        console.log("#### 22");

    }).then(function (res) {
        console.log("#### 5");

        newItem = {
            "keyId": privatekey_uuid,
            "uuid": privatekey_uuid,
            "encryption_publicKey": enc_pubkey,
            "encryption_privateKey": enc_privkey,
            "signature_publicKeyJWK": sign_pubkey,
            "signature_privateKeyJWK": sign_privkey,

        };

        console.log("####: " + JSON.stringify(newItem));

        // have the deafult signing key

        if (createdNewSigningKey) {
            // return savetoDB
            console.log("save defaultkey");

            return saveToIndexedDB('privateKeys', 'keyPairs', 'defaultPrivateKey', newItem);
        } else {
            // buypass to next step
            console.log("bypass");
            return (new Promise(function (resolve, reject) {
                    resolve("");
                }));
        }

    }).then(function (res) {
        // also save on own key

        console.log("save on " + privatekey_uuid);
        console.log("####: " + JSON.stringify(newItem));
        newItem.keyId = privatekey_uuid;
        console.log("####: " + JSON.stringify(newItem));

        return saveToIndexedDB('privateKeys', 'keyPairs', privatekey_uuid, newItem);

        // having just created a new default signing key, we need to save it


        // get default encryption key

        //loadFromIndexedDB("privateKeys", "keyPairs", 'defaultPrivateKey')


        // no default encryption key was found,


        // create new default encryption key ,

        // sign the encryption key with the signing key


        // having just created a new default signed encryption key, we need to save it


        // finally, return the default encryption key


    });
}

async function generate_encryption_key() {
    console.log("navigate-collection.js: generate_encryption_key");
    var uuid;
    var newItem;
    var algoKeyGen = {
        name: 'AES-GCM',
        //          length: 256
        length: 128
    };

    console.log('navigate-collection.js:algoKeyGen: ' + JSON.stringify(algoKeyGen));

    var keyUsages = [
        'encrypt',
        'decrypt'
    ];

    // first, get the defaul RSA keypair with which to sign the encryption key.
    var sign_key;

    sign_key = await get_default_signing_key_2();

    console.log('navigate-collection.js: ###### get signing key ' + sign_key);
    //get_default_signing_key().then(function (s) {
    //  sign_key = s;
    console.log("sign_key: " + sign_key);
    console.log(sign_key);

    // exit early
    //return sign_key;

    window.crypto.subtle.generateKey(algoKeyGen, true, keyUsages).then(function (key) {
        // secretKey = key;
        console.log('navigate-collection.js:generate_encryption_key');
        // make key into exportable form
        return window.crypto.subtle.exportKey("jwk", key);
    }).then(function (expkey) {

        console.log('navigate-collection.js: expkey: ' + JSON.stringify(expkey));

        //generates random id;
        let guid = () => {
            let s4 = () => {
                return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
            }
            //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }

        uuid = guid();

        newItem = {
            keyId: uuid,
            uuid: uuid,
            "key": expkey.k,
            "jwk": expkey,
            "ext": true
        };
        // put key into encryption key store

        console.log('data to be saved: ' + JSON.stringify(newItem));
        //  '{"keyId":"one","uuid":"two"}'
        saveToIndexedDB_async('encryptionKeys', 'encryptionKeys', 'keyId', newItem).then(function (response) {
            console.log('data saved');
        }).catch(function (error) {
            console.log(error.message);
        });

        saveToIndexedDB_async('trustedDecryptionKeys', 'decryptionKeys', 'keyId', newItem).then(function (response) {
            console.log('data saved');
        }).catch(function (error) {
            console.log(error.message);
        });

    }).then(function (key) {
        // check if there is a default encryption key and if not, make this the default key.

        console.log('consider as possible new default key: ' + JSON.stringify(newItem));

        return loadFromIndexedDB("encryptionKeys", "encryptionKeys", 'defaultSecretKey');

    }).then(function (currentdefaultkey) {

        console.log("background.js: getDefaultSecretKey:found=" + currentdefaultkey);
        console.log("background.js: getDefaultSecretKey:found=" + JSON.stringify(currentdefaultkey));

    }).catch(function (err) {
        console.log("background.js: getDefaultSecretKey:err=\"" + err + "\"");
        // error
        // if error was "object not found" asume defaultencryptionkey not set, so set it now.

        if (err == "Error: object not found") {
            console.log("background.js: defaultkey not found, assign this key as it");
            // make a new default encryption key

            //        console.log('data to be saved on defaultkey: ' + JSON.stringify(newItem));
            newItem.keyId = 'defaultSecretKey';
            console.log('data to be saved on defaultkey: ' + JSON.stringify(newItem));

            saveToIndexedDB_async('encryptionKeys', 'encryptionKeys', 'keyId', newItem);

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

    //});
}

async function find_tabs(queryyy) {
    console.log("navigate-collection.js: find_tabs");
    // locate all Tabs, windows and popups
    let this_tab_url = browser.runtime.getURL("find.html");
    let tabs = await browser.tabs.query({});
    console.log("navigate-collection.js: find_tabs:" + tabs.length);
    for (let tab of tabs) {
        // Iterate through the tabs, but exclude the current tab.
        console.log("navigate-collection.js: found tabs(url) >" + tab.url);
        console.log("navigate-collection.js: found tabs(id) >" + tab.id);
        // console.log("navigate-collection.js: found tabs(json) >"+ JSON.stringify(tab));
        // if (tab.url === this_tab_url) {
        //      continue;
        //   }
        // on this tab, send in a script to extract the content
        // wait 3 seconds
        t = tab.id;

        await new Promise((resolve, reject) => setTimeout(resolve, 2000));

        const executing = browser.tabs.executeScript(
                tab.id, {
                file: "pageCopier.js"
            });
        executing.then(onExecuted, onError).then(getTabDocument);

    }
    console.log("navigate-collection.js: inject");

    // inject script

    var replacement_text = new String("");
    replacement_text = "replacement_text:";
    var selected_text = new String('info.selectionText');
    console.log("navigate-collection.js: onExecute2: selected_text:" + selected_text);
    console.log("navigate-collection.js: onExecute2: replacement_text:" + replacement_text);

    let executing2 = browser.tabs.executeScript({
            file: "pageCopier.js"
        }).then(
            function (result) {
            console.log("navigate-collection.js: onExecuted2: We made it....");
            console.log("navigate-collection.js: onExecuted2: result:" + result);
            console.log("navigate-collection.js: onExecute2: selected_text:" + selected_text);
            console.log("navigate-collection.js: onExecute2: replacement_text:" + replacement_text);
            //                 var querying = browser.tabs.query({
            //                          active: true,
            //                           currentWindow: false
            //                        });

            var querying = browser.tabs.query({
                    //      active: true,
                    //      currentWindow: false
                });

            querying.then(function (tabs) {

                //		sendMessageToTabs

                // send mesage to the script running on the other tabs
                //			 for (let tab of tabs) {
                //			   console.log("navigate-collection.js: onExecuted2: tab id:"+  tab.id);
                //				 browser.tabs.sendMessage(tab.id, {
                //                     replacement: replacement_text,
                //                      regex: selected_text
                //                   });
                //				 }

            });
        });

    return tabs.length;
}

function sendMessageToTabs(tabs) {
    console.log("navigate-collection.js: sendMessageToTabs");
    for (let tab of tabs) {
        browser.tabs.sendMessage(
            tab.id, {
            greeting: "Hi from background script"
        }).then(response => {
            console.log("Message from the content script:");
            console.log(response.response);
        }).catch(onError);
    }
}

// add a new decryption key to database
function submitAddNewDecryptionKey(e) {
    console.log("navigate-collection.js: submitAddNewDecryptionKey");
    console.log("navigate-collection.js: submitAddNewDecryptionKey: addnewdecryptionkey, username:" + document.querySelector("#addnewdecryptionkeyusername").value);
    console.log("navigate-collection.js: submitAddNewDecryptionKey: addnewdecryptionkey, key:" + document.querySelector("#addnewdecryptionkeykey").value);

    const a = document.querySelector("#addnewdecryptionkeyusername").value

        const b = document.querySelector("#addnewdecryptionkeyjwk").value
        console.log("navigate-collection.js: submitAddNewDecryptionKey: addnewdecryptionkeyjwk:" + b);

    console.log("navigate-collection.js: submitAddNewDecryptionKey: addnewdecryptionkeyjwk key:" + JSON.parse(b).k);

    var unique_key = SHA1(JSON.parse(b).k)

        console.log("navigate-collection.js: submitAddNewDecryptionKey: addnewdecryptionkeyjwk keyhash:" + unique_key);

    var newItem = {
        keyId: unique_key,
        "jwk": b,
        "ext": true
    };

    saveToIndexedDB('trustedDecryptionKeys', 'decryptionKeys', 'keyId', newItem).then(function (response) {
        console.log('data saved');
    }).catch(function (error) {
        console.log(error.message);
    });

    //   browser.storage.sync.set({
    //	         colour: document.querySelector("#colour").value
    //   });
    //   browser.storage.sync.set({
    //	         username: document.querySelector("#username").value
    //  });
    //  e.preventDefault();
}

/**
 * Secure Hash Algorithm (SHA1)
 * http://www.webtoolkit.info/
 **/
function BACK_SHA1(msg) {
    console.log("navigate-collection: SHA1");
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

function loadFromIndexedDB_nonpromise(dbName, storeName, id) {
    console.log("loadFromIndexedDB_nonpromise.begin");
    console.log("loadFromIndexedDB:1 " + dbName);
    console.log("loadFromIndexedDB:2 " + storeName);
    console.log("loadFromIndexedDB:3 " + id);

    var dbRequest = indexedDB.open(dbName);

    dbRequest.onerror = function (event) {
        reject(Error("Error text"));
    };

    dbRequest.onupgradeneeded = function (event) {
        // Objectstore does not exist. Nothing to load
        event.target.transaction.abort();
        reject(Error('Not found'));
    };

    dbRequest.onsuccess = function (event) {
        //  console.log("loadFromIndexedDB:onsuccess ");

        var database = event.target.result;
        var transaction = database.transaction([storeName]);
        //  console.log("loadFromIndexedDB:transaction: " + JSON.stringify(transaction));
        var objectStore = transaction.objectStore(storeName);
        //  console.log("loadFromIndexedDB:objectStore: " + JSON.stringify(objectStore));
        var objectRequest = objectStore.get(id);

        // console.log("loadFromIndexedDB:objectRequest: " + JSON.stringify(objectRequest));


        try {

            objectRequest.onerror = function (event) {
                // reject(Error('Error text'));
                console.log("45");

            };

            objectRequest.onsuccess = function (event) {
                if (objectRequest.result) {
                    console.log("loadFromIndexedDB:result " + JSON.stringify(objectRequest.result));

                    return (objectRequest.result);
                } else {
                    //reject(Error('object not found'));
                    //console.log("43");
                    return ('object not found');
                    //reject('object not found');


                }
            };

        } catch (error) {
            console.log(error);

        }

    };

}

function loadFromIndexedDB_async(dbName, storeName, id) {
    console.log("loadFromIndexedDB:0");
    console.log("loadFromIndexedDB:1 " + dbName);
    console.log("loadFromIndexedDB:2 " + storeName);
    console.log("loadFromIndexedDB:3 " + id);

    return new Promise(
        function (resolve, reject) {
        var dbRequest = indexedDB.open(dbName);

        dbRequest.onerror = function (event) {
            reject(Error("Error text"));
        };

        dbRequest.onupgradeneeded = function (event) {
            // Objectstore does not exist. Nothing to load
            event.target.transaction.abort();
            reject(Error('Not found'));
        };

        dbRequest.onsuccess = function (event) {
            //  console.log("loadFromIndexedDB:onsuccess ");

            var database = event.target.result;
            var transaction = database.transaction([storeName]);
            //  console.log("loadFromIndexedDB:transaction: " + JSON.stringify(transaction));
            var objectStore = transaction.objectStore(storeName);
            //  console.log("loadFromIndexedDB:objectStore: " + JSON.stringify(objectStore));
            var objectRequest = objectStore.get(id);

            // console.log("loadFromIndexedDB:objectRequest: " + JSON.stringify(objectRequest));


            try {

                objectRequest.onerror = function (event) {
                    // reject(Error('Error text'));
                    console.log("45");
                    reject('Error text');
                };

                objectRequest.onsuccess = function (event) {
                    if (objectRequest.result) {
                        console.log("loadFromIndexedDB:result " + JSON.stringify(objectRequest.result));

                        resolve(objectRequest.result);
                    } else {
                        //reject(Error('object not found'));
                        //console.log("43");
                        resolve('object not found');
                        //reject('object not found');


                    }
                };

            } catch (error) {
                console.log(error);
                reject(error);

            }

        };
    });
}

async function loadFromIndexedDB(dbName, storeName, id) {
    console.log("loadFromIndexedDB:0");
    console.log("loadFromIndexedDB:1 " + dbName);
    console.log("loadFromIndexedDB:2 " + storeName);
    console.log("loadFromIndexedDB:3 " + id);
    var res;
    try {
        await loadFromIndexedDB_async(dbName, storeName, id);

    } catch (e) {
        console.log(e);

    }

}

async function generateRSAKeyPair() {
    // for signing
    // name: "RSASSA-PKCS1-v1_5"
    // for encryption
    // name: "RSA-OAEP"

    console.log("generateRSAKeyPair");

    const key = await window.crypto.subtle.generateKey({
            name: "RSASSA-PKCS1-v1_5",
            modulusLength: 1024,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {
                name: "SHA-1"
            },
        },
            true,
            ["sign", "verify"]);

    const key2 = await window.crypto.subtle.generateKey({
            name: "RSA-OAEP",
            modulusLength: 1024,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {
                name: "SHA-1"
            },
        },
            true,
            ["encrypt", "decrypt"]);

    return {
        RSASSAPKCS1v1_5_privateKey: await window.crypto.subtle.exportKey(
            "jwk",
            key.privateKey, ),
        RSASSAPKCS1v1_5_publicKey: await window.crypto.subtle.exportKey(
            "jwk",
            key.publicKey, ),
        RSAOAEP_privateKey: await window.crypto.subtle.exportKey(
            "jwk",
            key2.privateKey, ),
        RSAOAEP_publicKey: await window.crypto.subtle.exportKey(
            "jwk",
            key2.publicKey, ),
    };
}

function arrayBufferToBase64(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

function base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    const buffer = new ArrayBuffer(8);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function saveToIndexedDB_async(dbName, storeName, keyId, object) {

    console.log("saveToIndexedDB_async:dbname " + dbName);
    console.log("saveToIndexedDB_async:objectstorename " + storeName);
    console.log("saveToIndexedDB_async:keyId " + keyId);
    console.log("saveToIndexedDB_async:object " + JSON.stringify(object));

    //  indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

    return new Promise(
        function (resolve, reject) {

        //console.log("saveToIndexedDB: 0 resolve=" + resolve )
        //console.log("saveToIndexedDB: 0 reject=" + reject )

        //if (object.taskTitle === undefined)
        //            reject(Error('object has no taskTitle.'));

        var dbRequest;

        try {

            dbRequest = indexedDB.open(dbName);
        } catch (error) {
            console.log(error);

        }
        console.log("saveToIndexedDB_async: 1 dbRequest=" + dbRequest);

        dbRequest.onerror = function (event) {
            console.log("saveToIndexedDB:error.open:db " + dbName);
            reject(Error("IndexedDB database error"));
        };

        console.log("saveToIndexedDB: 2" + JSON.stringify(dbRequest));

        dbRequest.onupgradeneeded = function (event) {
            console.log("saveToIndexedDB: 21");
            var database = event.target.result;
            console.log("saveToIndexedDB:db create obj store " + storeName);
            var objectStore = database.createObjectStore(storeName, {
                    keyId: keyId
                });
        };

        console.log("saveToIndexedDB: 3" + JSON.stringify(dbRequest));
        try {

            dbRequest.onsuccess = function (event) {
                console.log("saveToIndexedDB: 31");
                var database = event.target.result;
                console.log("saveToIndexedDB: 32");
                var transaction = database.transaction([storeName], 'readwrite');
                console.log("saveToIndexedDB: 33");
                var objectStore = transaction.objectStore(storeName);
                console.log("saveToIndexedDB:objectStore put: " + JSON.stringify(object));

                var objectRequest = objectStore.put(object); // Overwrite if already exists

                console.log("saveToIndexedDB:objectRequest: " + JSON.stringify(objectRequest));

                objectRequest.onerror = function (event) {
                    console.log("saveToIndexedDB:error: " + storeName);

                    reject(Error('Error text'));
                };

                objectRequest.onsuccess = function (event) {
                    console.log("saveToIndexedDB:success: " + storeName);
                    resolve('Data saved OK');
                };
            };

        } catch (error) {
            console.log(error);

        }

    });
}

async function saveToIndexedDB(dbName, storeName, id, object) {

    console.log("saveToIndexedDB:1 " + dbName);
    console.log("saveToIndexedDB:2 " + storeName);
    console.log("saveToIndexedDB:3 " + id);
    console.log("saveToIndexedDB:4 " + JSON.stringify(object));

    await saveToIndexedDB_async(dbName, storeName, id, object);

}

function deleteFromIndexedDB_async(dbName, storeName, keyId) {
    console.log("deleteFromIndexedDB:1 " + dbName);
    console.log("deleteFromIndexedDB:2 " + storeName);
    console.log("deleteFromIndexedDB:3 " + keyId);

    //  indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

    return new Promise(
        function (resolve, reject) {

        var dbRequest = indexedDB.open(dbName);

        //  console.log("deleteFromIndexedDB: 1 dbRequest=" + dbRequest)

        dbRequest.onerror = function (event) {
            console.log("deleteFromIndexedDB:error.open:db " + dbName);
            reject(Error("IndexedDB database error"));
        };

        //  console.log("deleteFromIndexedDB: 2")

        dbRequest.onupgradeneeded = function (event) {
            console.log("deleteFromIndexedDB: 21")
            var database = event.target.result;
            console.log("deleteFromIndexedDB:db create obj store " + storeName);
            var objectStore = database.createObjectStore(storeName, {
                    keyId: keyId
                });
        };

        // console.log("deleteFromIndexedDB: 3")

        dbRequest.onsuccess = function (event) {
            //       console.log("deleteFromIndexedDB: 31")
            var database = event.target.result;
            var transaction = database.transaction([storeName], 'readwrite');
            var objectStore = transaction.objectStore(storeName);
            var objectRequest = objectStore.delete(keyId); // Overwrite if exists

            objectRequest.onerror = function (event) {
                console.log("deleteFromIndexedDB:error: " + storeName + "/" + keyId);

                reject(Error('Error text'));
            };

            objectRequest.onsuccess = function (event) {
                console.log("deleteFromIndexedDB:success: " + storeName + "/" + keyId);
                resolve('Data saved OK');
            };
        };
    });
}

async function deleteFromIndexedDB(dbName, storeName, keyId) {
    console.log("deleteFromIndexedDB:1 " + dbName);
    console.log("deleteFromIndexedDB:2 " + storeName);
    console.log("deleteFromIndexedDB:3 " + keyId);

    await deleteFromIndexedDB_async(dbName, storeName, keyId);

    //  indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

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

// eslint-disable-next-line no-unused-vars
const navigateCollectionUI = new NavigateCollectionUI(document.getElementById('app'));