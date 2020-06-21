/* global loadStoredImages, removeStoredImages, saveToIndexedDB */

import * as utils_functions from '/utils/functions.js';

"use strict";

class NavigateCollectionUI {
    constructor(containerEl) {
        this.containerEl = containerEl;

        this.state = {
            storedImages: [],
        };



// setup database tables
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

// end DB setuo


        document.querySelector("form.scan-tabs").addEventListener("submit", submitScanTabs);

        document.querySelector("button.scan-tabs").onclick = this.scanTabs;

        // using two event listeners, on on the form and one on the button, along with e.preventDefault(); on the function being called, saves a page reload
        //document.querySelector("form.generate-encryption-key").addEventListener("submit", submitGenerateEncryptionKey);
        //document.querySelector("button.generate-encryption-key").onclick = this.generateEncryptionKey;
        // use this instead - which causes a page reload. This to show the newly created key immediately.
        document.querySelector("button.generate-encryption-key").addEventListener('click', function () {
            generate_encryption_key();
        });

        // setup table showing encryptionkeys
        const encryptionkeytable = document.querySelector("ul.encryptionkeys");

        const tb_for_encryptionKeys = document.createElement("table");
        tb_for_encryptionKeys.setAttribute("border", "1");
        encryptionkeytable.appendChild(tb_for_encryptionKeys);

        // setup column width for table
        const enc_col0 = document.createElement("col");
        enc_col0.setAttribute("width", "100px");
        tb_for_encryptionKeys.appendChild(enc_col0);

        const enc_col1 = document.createElement("col");
        enc_col1.setAttribute("width", "100px");
        tb_for_encryptionKeys.appendChild(enc_col1);

        const enc_col2 = document.createElement("col");
        enc_col2.setAttribute("width", "290px");
        tb_for_encryptionKeys.appendChild(enc_col2);
        const enc_col3 = document.createElement("col");
        enc_col3.setAttribute("width", "290px");
        tb_for_encryptionKeys.appendChild(enc_col3);
        const enc_col4 = document.createElement("col");
        enc_col4.setAttribute("width", "100px");
        tb_for_encryptionKeys.appendChild(enc_col4);

        const enc_col5 = document.createElement("col");
        enc_col5.setAttribute("width", "100px");
        tb_for_encryptionKeys.appendChild(enc_col5);
		
        const enc_col6 = document.createElement("col");
        enc_col6.setAttribute("width", "100px");
        tb_for_encryptionKeys.appendChild(enc_col6);

        const tr_top = document.createElement("tr");
        // setup column headers for table
        tb_for_encryptionKeys.appendChild(tr_top);

        const enc_td0 = document.createElement("td");
        enc_td0.innerHTML = "key id";
        tr_top.appendChild(enc_td0);

        const enc_td01 = document.createElement("td");
        enc_td01.innerHTML = "uuid";
        tr_top.appendChild(enc_td01);

        const enc_td1 = document.createElement("td");
        enc_td1.innerHTML = "user";
        tr_top.appendChild(enc_td1);
        const enc_td2 = document.createElement("td");
        enc_td2.innerHTML = "key";
        tr_top.appendChild(enc_td2);
        const enc_td3 = document.createElement("td");
        enc_td3.innerHTML = "jwk";
        tr_top.appendChild(enc_td3);

        const enc_td4 = document.createElement("td");
        enc_td4.innerHTML = "jwk1";
        tr_top.appendChild(enc_td4);

        const enc_td5 = document.createElement("td");
        enc_td5.innerHTML = "jwk2";
        tr_top.appendChild(enc_td5);

        const enc_td6 = document.createElement("td");
        enc_td6.innerHTML = "jwk3";
        tr_top.appendChild(enc_td6);

        const enc_td7 = document.createElement("td");
        enc_td7.innerHTML = "jwk3";
        tr_top.appendChild(enc_td7);

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

                    for (const url of res) {
                        // create table row
                        const tr = document.createElement("tr");

                        //    console.log("key:"+ JSON.stringify(url));
                        const td0 = document.createElement("td");
                        td0.innerHTML = url.keyId;
                        tr.appendChild(td0);

                        const td01 = document.createElement("td");
                        td01.innerHTML = url.uuid;
                        tr.appendChild(td01);

                        const td1 = document.createElement("td");
                        td1.innerHTML = url.username;
                        tr.appendChild(td1);

                        const td2 = document.createElement("td");
                        td2.innerHTML = url.jwk.k;
                        tr.appendChild(td2);

                        const td3 = document.createElement("td");
                        td3.innerHTML = JSON.stringify(url.jwk);
                        tr.appendChild(td3);
                        // column for"delete"button
                        const td4 = document.createElement("td");
                        // create a new form inside this table cell
                        //const single_enckey_form = document.createElement("form");

                        const btn = document.createElement("button");
                        btn.setAttribute("class", "delete-encryption-key");

                        btn.appendChild(document.createTextNode("delete this key"));
                        console.log("deleteEncryptionKey(" + url.keyId + ")");

                        btn.addEventListener('click', function () {
                            console.log("deleteEncryptionKey(" + url.keyId + ")");
                            deleteEncryptionKey(url.keyId);
                        });

                        //single_enckey_form.appendChild(btn);

                        td4.appendChild(btn);

                        tr.appendChild(td4);

                        // button to make key the default
                        const td5 = document.createElement("td");
                        const btn2 = document.createElement("button");
                        btn2.setAttribute("class", "designate-default-encryption-key");
                        btn2.appendChild(document.createTextNode("make default"));
                        btn2.addEventListener('click', function () {
                            makeDefaultEncryptionKey(url.keyId);
                        });
                        td5.appendChild(btn2);
                        tr.appendChild(td5);

                        // button to create popup to edit the key
                        const td6 = document.createElement("td");
                        const btn3 = document.createElement("button");
                        const att3 = document.createAttribute("class");
                        btn3.setAttribute("class", "update-encryption-key");
                        btn3.appendChild(document.createTextNode("make update"));
                        btn3.addEventListener('click', function () {
                            updateEncryptionKey(url.keyId);
                        });
                        td6.appendChild(btn3);
                        tr.appendChild(td6);

                        // button to export key
                        const td7 = document.createElement("td");
                        const btn4 = document.createElement("button");
                        //btn4.setAttribute("class","export-encryption-key");
                        btn4.appendChild(document.createTextNode("export key"));
                        btn4.addEventListener('click', function () {
                            exportEncryptionKey(url.keyId);
                        });
                        td7.appendChild(btn4);
                        tr.appendChild(td7);

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

                    tb_for_decryotionKeys.appendChild(tr_last);

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

                tb_for_decryotionKeys.appendChild(tr_last);

            }

        };

        //
        //
        // setup table showing decryptionkeys
        //
        //const keytable = document.getElementById("descruptionkeys");
        const keytable = document.querySelector("ul.decryptionkeys");
        console.log("inavigate-collection.js: keytable2:" + keytable);

        const tb_for_decryotionKeys = document.createElement("table");
        tb_for_decryotionKeys.setAttribute("border", "1");
        //tb.innerHTML ="test2";
        keytable.appendChild(tb_for_decryotionKeys);

        // setup column width for table
        const col0 = document.createElement("col");
        col0.setAttribute("width", "100px");
        tb_for_decryotionKeys.appendChild(col0);

        const col1 = document.createElement("col");
        col1.setAttribute("width", "100px");
        tb_for_decryotionKeys.appendChild(col1);

        const col2 = document.createElement("col");
        col2.setAttribute("width", "290px");
        tb_for_decryotionKeys.appendChild(col2);
        const col3 = document.createElement("col");
        col3.setAttribute("width", "290px");
        tb_for_decryotionKeys.appendChild(col3);
        const col4 = document.createElement("col");
        col4.setAttribute("width", "100px");
        tb_for_decryotionKeys.appendChild(col4);

        const col5 = document.createElement("col");
        col5.setAttribute("width", "100px");
        tb_for_decryotionKeys.appendChild(col5);

        const col6 = document.createElement("col");
        col6.setAttribute("width", "100px");
        tb_for_decryotionKeys.appendChild(col6);

        const tr = document.createElement("tr");
        // setup column headers for table
        tb_for_decryotionKeys.appendChild(tr);

        const td0 = document.createElement("td");
        td0.innerHTML = "key id";
        tr.appendChild(td0);

        const td1 = document.createElement("td");
        td1.innerHTML = "user name";
        tr.appendChild(td1);
        const td2 = document.createElement("td");
        td2.innerHTML = "key";
        tr.appendChild(td2);
        const td3 = document.createElement("td");
        td3.innerHTML = "jwk";
        tr.appendChild(td3);

        const td4 = document.createElement("td");
        td4.innerHTML = "";
        tr.appendChild(td4);

        const td5 = document.createElement("td");
        td5.innerHTML = "";
        tr.appendChild(td5);
        const td6 = document.createElement("td");
        td6.innerHTML = "";
        tr.appendChild(td6);

        // list all keys in db


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

                    for (const url of res) {
                        // create table row
                        const tr = document.createElement("tr");

                        //   console.log("key:"+ JSON.stringify(url));
                        const td0 = document.createElement("td");
                        td0.innerHTML = url.keyId;
                        tr.appendChild(td0);

                        const td01 = document.createElement("td");
                        td01.innerHTML = url.uuid;
                        tr.appendChild(td01);

                        const td1 = document.createElement("td");
                        td1.innerHTML = url.username;
                        tr.appendChild(td1);

                        const td2 = document.createElement("td");
                        td2.innerHTML = url.jwk.k;
                        tr.appendChild(td2);
                        //
                        const td3 = document.createElement("td");
                        td3.innerHTML = JSON.stringify(url.jwk);
                        tr.appendChild(td3);
                        // column for"delete"button
                        //
                        const td4 = document.createElement("td");
                        // create a new form inside this table cell
                        const single_key_form = document.createElement("form");

                        const btn = document.createElement("button");
                        const att = document.createAttribute("class");
                        att.value = "delete-key";
                        btn.setAttributeNode(att);

                        var newContent = document.createTextNode("delete this key");
                        btn.appendChild(newContent);
                        btn.addEventListener('click', function () {
                            deleteDecryptionKey(url.keyId);
                        });
                        single_key_form.appendChild(btn);
                        td4.appendChild(single_key_form);
                        tr.appendChild(td4);
                        //
                        const td5 = document.createElement("td");

                        const btn3 = document.createElement("button");
                        const att3 = document.createAttribute("class");
                        // btn3.setAttribute("class","update-encryption-key");
                        btn3.appendChild(document.createTextNode("make update"));

                        btn3.addEventListener('click', function () {
                            updateDecryptionKey(url.keyId);
                        });
                        td5.appendChild(btn3);

                        tr.appendChild(td5);

                        // append form to table row
                        //tr.appendChild(t);
                        // create add row to table
                        tb_for_decryotionKeys.appendChild(tr);
                        // console.log("button.delete-key"+ document.querySelector("button.delete-key"));

                        //document.querySelector("button.delete-key").onclick = this.onDeleteKey;

                        //tr.appendChild(keyform);

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

                    tb_for_decryotionKeys.appendChild(tr_last);

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

                tb_for_decryotionKeys.appendChild(tr_last);

            }

        };

    }

    componentDidMount() {
        // Load the stored image once the component has been rendered in the page.
        this.onFilterUpdated();
    }

    onDeleteEncryptionKey() {
        console.log("inavigate-collection.js: onDeleteEncryptionKey");

        var keyId = browser.storage.sync.get('keyId');
        keyId.then((res) => {
            document.querySelector("#keyId").value = res.keyId || 'Firefox red';
        });

        console.log("inavigate-collection.js: onDeleteEncryptionKey:keyId:" + document.querySelector("#keyId").value);

    }

    onAddDecryptionKey() {
        console.log("inavigate-collection.js: onAddDecryptionKey");

    }

    onDeleteKey() {
        console.log("inavigate-collection.js: onDeleteKey");

        console.log("inavigate-collection.js: onDeleteKey:keyId:" + document.querySelector("#keyId").value);

    }
    onTest() {
        console.log("inavigate-collection.js: onTest");

    }

    // add decryption key to database
    scanTabs() {
        console.log("inavigate-collection.js: scanTabs");
        find_tabs("Glovebox:");

    }

    generateEncryptionKey() {
        console.log("inavigate-collection.js: generateEncryptionKey");

        generate_encryption_key();

    }

    // add decryption key to database
    onAddEncryptionKey() {
        console.log("inavigate-collection.js: onAddEncryptionKey");

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

// capture the form submission
function submitScanTabs(e) {
    console.log("inavigate-collection.js: submitScanTabs");
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
    console.log("inavigate-collection.js: submitDeleteEncryptionKey" + JSON.stringify(e));
    console.log("inavigate-collection.js: submitDeleteEncryptionKey" + document.querySelector("#keyId").value);
    browser.storage.sync.set({
        keyId: document.querySelector("#keyId").value
    });

    e.preventDefault();
}

function deleteEncryptionKey(u) {
    console.log("inavigate-collection.js: deleteEncryptionKey" + u);

    deleteFromIndexedDB('encryptionKeys', 'encryptionKeys', u);

}

// exportEncryptionKey
function exportEncryptionKey(keyId) {
    console.log("inavigate-collection.js: exportEncryptionKey \"" + keyId + "\"");

    // objectStore:"encryptionKeys"
    // get data from database


    console.log("navigate-collection.js: exportEncryptionKey keyId:" + keyId);

    loadFromIndexedDB_async("encryptionKeys", "encryptionKeys", keyId).then(function (obj) {

        console.log("inavigate-collection.js: exportEncryptionKey object:" + JSON.stringify(obj));
        // present a popup window

        var frog2 = window.open("", "exportkey", "width=800,height=300,scrollbars=1,resizable=1");

        // create the endryption key in importableform. The keytoken created here and presnted in the form, is readable wherever it is found.

        // the format of the key token is

        // The key tokens can be presented different formats:

        //"open"which is readbable to anyone. the symmetric key is not encrypted, just base64 encoded. The point here is not present any real security other than what is achieved through key distribution. Which may be adequate for many use cases.


        // Glovebox keytoken open syntax:":Clovebox:<username>:<keyuuid>:<base64(decryptionkey)>:"
        // Glovebox keytoken open sample:":Clovebox:username01@domain.org:asasd-bb-erw-w45gvs-5asd:fsdawwefwrwtgRgevWefsfsetg3563rgvegreRErgvE==:"


        //var enc_base = utils_functions.arrayBufferToBase64(keyId);
        var glovebox_key_token_openform = '';
        console.log("inavigate-collection.js: exportEncryptionKey object:1" + glovebox_key_token_openform);

        // consider prompting for username in the popup.

        glovebox_key_token_openform = ':GloveboxToken:username01@domain.org:' + obj.keyId + ':' + obj.key + ':';
        console.log("inavigate-collection.js: exportEncryptionKey object:2" + glovebox_key_token_openform);

        var html = "<html><head><title>export key</title></head><body>export key:" + keyId;

        html += '<form>';

        html += '<p/><textarea  name="jwk"type="textarea"id="exportedkey" rows="6"cols="80">' + glovebox_key_token_openform + '</textarea >';

        html += '</form>';

        html += '<script type="module"src="/export-encryption-key-popup.js"></script>';

        html += "</body></html>";

        //variable name of window must be included for all three of the following methods so that
        //javascript knows not to write the string to this window, but instead to the new window

        console.log("inavigate-collection.js: exportEncryptionKey html" + html);

        frog2.document.open();
        frog2.document.write(html);
        frog2.document.close();
    });

}

// updateEncryptionKey
function updateEncryptionKey(uuid) {
    console.log("inavigate-collection.js: updateEncryptionKey \"" + uuid + "\"");

    // objectStore:"encryptionKeys"
    // get data from database

    loadFromIndexedDB_async("encryptionKeys", "encryptionKeys", uuid).then(function (obj) {

        console.log("inavigate-collection.js: updateEncryptionKey read from db:" + obj);
        console.log("inavigate-collection.js: updateEncryptionKey read from db:" + JSON.stringify(obj));

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
    console.log("inavigate-collection.js: updateDecryptionKey \"" + uuid + "\"");

    // objectStore:"encryptionKeys"
    // get data from database

    loadFromIndexedDB_async("trustedDecryptionKeys", "decryptionKeys", uuid).then(function (obj) {

        console.log("inavigate-collection.js: updateDecryptionKey read from db:" + obj);
        //    console.log("inavigate-collection.js: updateDecryptionKey read from db:"+ JSON.stringify(obj));

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
    console.log("inavigate-collection.js: makeDefaultEncryptionKey" + uuid);

    // get tne existing default key and give it a new keyId


    loadFromIndexedDB_async("encryptionKeys", "encryptionKeys", 'defaultSecretKey').then(function (currentdefaultkey) {

        console.log("inavigate-collection.js: makeDefaultEncryptionKey read default from db:" + currentdefaultkey);
        console.log("inavigate-collection.js: makeDefaultEncryptionKey read default from db:" + JSON.stringify(currentdefaultkey));
        // make the UUID of the object the new keyId
        currentdefaultkey.keyId = currentdefaultkey.uuid;

        saveToIndexedDB('encryptionKeys', 'encryptionKeys', currentdefaultkey.keyId, currentdefaultkey).then(function (response) {
            console.log("inavigate-collection.js: makeDefaultEncryptionKey save to db:" + response);

        });

    });

    loadFromIndexedDB_async("encryptionKeys", "encryptionKeys", uuid).then(function (obj) {

        console.log("inavigate-collection.js: makeDefaultEncryptionKey read from db:" + obj);
        console.log("inavigate-collection.js: makeDefaultEncryptionKey read from db:" + JSON.stringify(obj));
        // reinsert with a new reference -
        obj.uuid = obj.keyId;

        // make defaultSecretKey the new keyid
        obj.keyId = "defaultSecretKey";

        saveToIndexedDB('encryptionKeys', 'encryptionKeys', 'defaultSecretKey', obj).then(function (response) {
            console.log("inavigate-collection.js: makeDefaultEncryptionKey save to db:" + response);
        });

    });

}

function deleteDecryptionKey(e) {
    console.log("inavigate-collection.js: deleteDecryptionKey" + e);

    deleteFromIndexedDB('trustedDecryptionKeys', 'decryptionKeys', e);

}

function onExecuted(result, tabid) {
    console.log("inavigate-collection.js: We executed in tab ." + tabid + "." + result);
    //console.log("inavigate-collection.js: We executed in tab ."+ tab.id +"."+ result);
    console.log(`inavigate-collection.js: calling tab ..`);

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
                console.log("inavigate-collection.js: added new decryption key to db:" + response);

            });

        }

    });

}

var t


// create a new encryption key and place it both in the encryption and decryption key databases
async function generate_encryption_key() {
    console.log("inavigate-collection.js: generate_encryption_key");

    var algoKeyGen = {
        name: 'AES-GCM',
        //          length: 256
        length: 128
    };

    console.log('inavigate-collection.js:algoKeyGen: ' + JSON.stringify(algoKeyGen));

    var keyUsages = [
        'encrypt',
        'decrypt'
    ];
    window.crypto.subtle.generateKey(algoKeyGen, true, keyUsages).then(function (key) {
        // secretKey = key;
        console.log('navigate-collection.js:generate_encryption_key');
        // put key into encryption key store

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

        var id = guid();

        var newItem = {
            keyId: id,
            uuid: id,
            "key": expkey.k,                                                               
            "jwk": expkey,
            "ext": true
        };

        console.log('data to be saved: ' + JSON.stringify(newItem));
//  '{"keyId":"one","uuid":"two"}'
        saveToIndexedDB('encryptionKeys', 'encryptionKeys', 'keyId', newItem).then(function (response) {
            console.log('data saved');
        }).catch(function (error) {
            console.log(error.message);
        });

saveToIndexedDB('trustedDecryptionKeys', 'decryptionKeys', 'keyId', newItem).then(function (response) {
            console.log('data saved');
        }).catch(function (error) {
            console.log(error.message);
        });

    });
}


async function find_tabs(queryyy) {
    console.log("inavigate-collection.js: find_tabs");
    // locate all Tabs, windows and popups
    let this_tab_url = browser.runtime.getURL("find.html");
    let tabs = await browser.tabs.query({});
    console.log("inavigate-collection.js: find_tabs:" + tabs.length);
    for (let tab of tabs) {
        // Iterate through the tabs, but exclude the current tab.
        console.log("navigate-collection.js: found tabs(url) >" + tab.url);
        console.log("navigate-collection.js: found tabs(id) >" + tab.id);
        // console.log("inavigate-collection.js: found tabs(json) >"+ JSON.stringify(tab));
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
    console.log("inavigate-collection.js: inject");

    // inject script

    var replacement_text = new String("");
    replacement_text = "replacement_text:";
    var selected_text = new String('info.selectionText');
    console.log("inavigate-collection.js: onExecute2: selected_text:" + selected_text);
    console.log("inavigate-collection.js: onExecute2: replacement_text:" + replacement_text);

    let executing2 = browser.tabs.executeScript({
            file: "pageCopier.js"
        }).then(
            function (result) {
            console.log("inavigate-collection.js: onExecuted2: We made it....");
            console.log("inavigate-collection.js: onExecuted2: result:" + result);
            console.log("inavigate-collection.js: onExecute2: selected_text:" + selected_text);
            console.log("inavigate-collection.js: onExecute2: replacement_text:" + replacement_text);
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
                //			   console.log("inavigate-collection.js: onExecuted2: tab id:"+  tab.id);
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
    console.log("inavigate-collection.js: sendMessageToTabs");
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
    console.log("inavigate-collection.js: submitAddNewDecryptionKey");
    console.log("inavigate-collection.js: submitAddNewDecryptionKey: addnewdecryptionkey, username:" + document.querySelector("#addnewdecryptionkeyusername").value);
    console.log("inavigate-collection.js: submitAddNewDecryptionKey: addnewdecryptionkey, key:" + document.querySelector("#addnewdecryptionkeykey").value);

    const a = document.querySelector("#addnewdecryptionkeyusername").value

        const b = document.querySelector("#addnewdecryptionkeyjwk").value
        console.log("inavigate-collection.js: submitAddNewDecryptionKey: addnewdecryptionkeyjwk:" + b);

    console.log("inavigate-collection.js: submitAddNewDecryptionKey: addnewdecryptionkeyjwk key:" + JSON.parse(b).k);

    var unique_key = SHA1(JSON.parse(b).k)

        console.log("inavigate-collection.js: submitAddNewDecryptionKey: addnewdecryptionkeyjwk keyhash:" + unique_key);

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

function loadFromIndexedDB_async(dbName, storeName, id) {
    console.log("loadFromIndexedDB: 0");
    console.log("loadFromIndexedDB: 1" + dbName);
    console.log("loadFromIndexedDB: 2" + storeName);
    console.log("loadFromIndexedDB: 3" + id);

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
            //  console.log("loadFromIndexedDB: onsuccess");

            var database = event.target.result;
            var transaction = database.transaction([storeName]);
            //  console.log("loadFromIndexedDB: transaction:"+ JSON.stringify(transaction));
            var objectStore = transaction.objectStore(storeName);
            //  console.log("loadFromIndexedDB: objectStore:"+ JSON.stringify(objectStore));
            var objectRequest = objectStore.get(id);

            // console.log("loadFromIndexedDB: objectRequest:"+ JSON.stringify(objectRequest));

            objectRequest.onerror = function (event) {
                reject(Error('Error text'));
            };

            objectRequest.onsuccess = function (event) {
                if (objectRequest.result) {
                    console.log("loadFromIndexedDB: result" + JSON.stringify(objectRequest.result));

                    resolve(objectRequest.result);
                } else {
                    reject(Error('object not found'));
                }
            };
        };
    });
}

async function loadFromIndexedDB(dbName, storeName, id) {
    console.log("loadFromIndexedDB: 0");
    console.log("loadFromIndexedDB: 1" + dbName);
    console.log("loadFromIndexedDB: 2" + storeName);
    console.log("loadFromIndexedDB: 3" + id);

    await loadFromIndexedDB_async(dbName, storeName, id);

}

function saveToIndexedDB(dbName, storeName, keyId, object) {
    console.log("saveToIndexedDB: 0");
    console.log("saveToIndexedDB: 1" + dbName);
    console.log("saveToIndexedDB: 2" + storeName);
    console.log("saveToIndexedDB: 3" + keyId);
    console.log("saveToIndexedDB: 4" + JSON.stringify(object));

    //console.log("saveToIndexedDB: jwk.k" + object.jwk.k);

    //  indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

    return new Promise(
        function (resolve, reject) {

        var dbRequest = indexedDB.open(dbName);

        console.log("saveToIndexedDB: 1 dbRequest =" + dbRequest)

        dbRequest.onerror = function (event) {
            console.log("saveToIndexedDB: error.open: db" + dbName);
            reject(Error("IndexedDB database error"));
        };

        console.log("saveToIndexedDB: 2")

        dbRequest.onupgradeneeded = function (event) {
            console.log("saveToIndexedDB: 21")
            var database = event.target.result;
            console.log("saveToIndexedDB: db create obj store" + storeName);
            var objectStore = database.createObjectStore(storeName, {
                    keyId: keyId
                });
        };

        console.log("saveToIndexedDB: 3")

        dbRequest.onsuccess = function (event) {
            console.log("saveToIndexedDB: 31")
            var database = event.target.result;
            var transaction = database.transaction([storeName], 'readwrite');
            var objectStore = transaction.objectStore(storeName);
            //console.log("saveToIndexedDB: objectStore:" + JSON.stringify(objectStore));
            var objectRequest = objectStore.put(object); // "put" - does and overwrite if already exists

            console.log("saveToIndexedDB: objectRequest:" + JSON.stringify(objectRequest));

            objectRequest.onerror = function (event) {
                console.log("saveToIndexedDB: error:" + storeName);

                reject(Error('Error text'));
            };

            objectRequest.onsuccess = function (event) {
                console.log("saveToIndexedDB: success:" + storeName);
                resolve('Data saved OK');
            };
        };
    });
}

function deleteFromIndexedDB(dbName, storeName, keyId) {
    console.log("deleteFromIndexedDB: 0");
    console.log("deleteFromIndexedDB: 1" + dbName);
    console.log("deleteFromIndexedDB: 2" + storeName);
    console.log("deleteFromIndexedDB: 3" + keyId);

    //  indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;

    return new Promise(
        function (resolve, reject) {

        var dbRequest = indexedDB.open(dbName);

        console.log("deleteFromIndexedDB: 1 dbRequest =" + dbRequest)

        dbRequest.onerror = function (event) {
            console.log("deleteFromIndexedDB: error.open: db" + dbName);
            reject(Error("IndexedDB database error"));
        };

        console.log("deleteFromIndexedDB: 2")

        dbRequest.onupgradeneeded = function (event) {
            console.log("deleteFromIndexedDB: 21")
            var database = event.target.result;
            console.log("deleteFromIndexedDB: db create obj store" + storeName);
            var objectStore = database.createObjectStore(storeName, {
                    keyId: keyId
                });
        };

        console.log("deleteFromIndexedDB: 3")

        dbRequest.onsuccess = function (event) {
            console.log("deleteFromIndexedDB: 31")
            var database = event.target.result;
            var transaction = database.transaction([storeName], 'readwrite');
            var objectStore = transaction.objectStore(storeName);
            var objectRequest = objectStore.delete(keyId); // Overwrite if exists

            objectRequest.onerror = function (event) {
                console.log("deleteFromIndexedDB: error:" + storeName);

                reject(Error('Error text'));
            };

            objectRequest.onsuccess = function (event) {
                console.log("deleteFromIndexedDB: success:" + storeName);
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

function deleteKey(e) {
    console.log("inavigate-collection.js: deleteKey");
    console.log("inavigate-collection.js: deleteKey: keyId:" + document.querySelector("#keyId").value);
    //browser.storage.sync.set({
    //    colour: document.querySelector("#colour").value
    // });
    e.preventDefault();
}

function saveOptions(e) {
    console.log("inavigate-collection.js: saveOptions");
    console.log("inavigate-collection.js: saveOptions: colour:" + document.querySelector("#colour").value);
    console.log("inavigate-collection.js: saveOptions: username:" + document.querySelector("#username").value);
    console.log("inavigate-collection.js: saveOptions: decryptionkey:" + document.querySelector("#decryptionkey").value);
    //browser.storage.sync.set({
    //    colour: document.querySelector("#colour").value
    // });
    e.preventDefault();
}

// eslint-disable-next-line no-unused-vars
const navigateCollectionUI = new NavigateCollectionUI(document.getElementById('app'));
