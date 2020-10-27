
// create this structure
// <glovebox><ciphertext hidden="true">cipher text</ciphertext>plain text</glovebox>
// Leaving the cipher text in place but not visible allows for quick "reencryption". 
// Use case: screen "rollover" removes plain text.

function ciphertextToText(request, sender, sendResponse) {

    console.log("CiphertextToText:JSON(request): " + JSON.stringify(request));

    var replacement_text = "";
    replacement_text = request.ciphertext_replacement_text;

    console.log("CiphertextToText:new text: " + replacement_text);

    if (replacement_text) {

        var newFragment = document.createRange().createContextualFragment(replacement_text);

        // only text is to be used, so extract the text from this html

        console.log("CiphertextToText:new text(html): " + replacement_text);
        var replacementStr = "";
        replacementStr = newFragment.textContent;
        console.log("CiphertextToText:new text(textonly): " + replacementStr);

        var modified_selection_text;

        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                // var container = document.createElement("div");
                console.log("p2," + sel.rangeCount);
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {

                    // the Glovebox ciphertext is a plain text node without markup.
                    // Get the preceeding text content.

                    var selectStartOffset = sel.getRangeAt(i).startOffset;
                    console.log("CiphertextToText:reWritePageGetHTMLselected: Range.startOffset:" + selectStartOffset);

                    var selectEndOffset = sel.getRangeAt(i).endOffset;
                    console.log("CiphertextToText:reWritePageGetHTMLselected: Range.startOffset:" + selectEndOffset);

                    var selection_text = sel.getRangeAt(i).toString();
                    var rangesize = selection_text.length;
                    console.log("CiphertextToText:reWritePageGetHTMLselected: Range.size:" + rangesize);

                    var selection_end_pos = selectStartOffset + rangesize;

                    // get the whole of the surrounding text

                    var fulltextofnode = sel.getRangeAt(i).startContainer.textContent;

                    console.log("pageWriterCiphertextToText:reWritePageGetHTMLselected: Range.startContainer:" + fulltextofnode);

                    // grab the piece of the fulltext of the node preceeding the selected text and see if it contains the opening statement
                    var preceeding = fulltextofnode.substring(0, selectStartOffset);

                    console.log("pageWriterCiphertextToText:reWritePageGetHTMLselected: preceeding:" + preceeding);

                    var following = fulltextofnode.substring(selectStartOffset + rangesize);

                    console.log("pageWriterCiphertextToText:reWritePageGetHTMLselected: following:" + following);

                    // check if selection contain the opening statement, and if not look in the preceeding

                    var glovebox_header_regex = /(:Glovebox:[^:]*:[^:]*:)/g;
                    // var glovebox_header_regex = /:Gl/g;


                    // ok, see if it is in the preceeding text with selection_text appended

                    // pick the glovobox text which intersects with the selection text.
                    // - if more than one, only the first one.


                    console.log("pageWriterCiphertextToText:reWritePageGetHTMLselected: has to contain the Glovebox header:" + preceeding + selection_text + following);
                    var t = preceeding + selection_text + following;

                    // text
                    // Glovebox_start
                    // start selection
                    // end selection
                    // Glovebox_end
                    // text
                    // Glovebox_start
                    // Glovebox_end
                    // text

                    // identity the exact extent of the Glovebox text - which is then replaces with the decrytped text (or html stripped of markup)
                    // identity the node where the Glovebox ciphertext begins.

                    var k = 0;
                    while ((match3 = glovebox_header_regex.exec(t)) != null && k < 1000) {
                        console.log("pageWriterCiphertextToText:reWritePage: contains##: selection begin: " + selectStartOffset + " end" + selection_end_pos);

                        // console.log("match found at " + match3.index);
                        //  console.log("match 0 found of length " + match3[0].length);
                        //   console.log("match 1 found of length " + match3[1].length);
                        //    console.log("match found of length " + match3[k].length);
                        var token_end_pos = match3.index + match3[k].length;
                        var token_start_pos = match3.index;

                        console.log("match found of length token_start_pos=" + token_start_pos + "  token_end_pos=" + token_end_pos);

                        // either selection begins inside token


                        if (token_start_pos <= selectStartOffset && selectStartOffset <= token_end_pos) {
                            console.log("selection beigns inside token");
                            // break out of while loop
                            k = k + 10000;
                            // move the selection to match the Glovebox token.

                            modified_selection_text = t.substring(token_start_pos, token_end_pos);
                            console.log("returning: " + modified_selection_text);

                        } else if (token_start_pos <= selection_end_pos && selection_end_pos <= token_end_pos) {
                            // or selection ends inside Glovebox token

                            console.log("selection ends inside token");
                            // break out of while loop
                            k = k + 10000;

                            modified_selection_text = t.substring(token_start_pos, token_end_pos);
                            console.log("returning: " + modified_selection_text);

                        } else if (selectStartOffset < token_start_pos && token_end_pos < selection_end_pos) {
                            // or selection fully encloses Glovebox token
                            console.log("selection encloses token");
                            // break out of while loop
                            k = k + 10000;

                            modified_selection_text = t.substring(token_start_pos, token_end_pos);
                            console.log("returning: " + modified_selection_text);

                        }

                        // creating the glovebox ciphertext node 
                        newGloveboxNode = document.createElement("glovebox");
                        newGloveboxNode.textContent = 'some bold text';
                        //newGloveboxNode.appendChild(document.createTextNode("New Node Inserted Here"));

                        var comlete_glovebox_token_text = fulltextofnode.substring(token_end_pos, token_start_pos);
                        
                        // carry out replacement
                        console.log("replacing " + comlete_glovebox_token_text + " with " + newFragment.textContent);

                        console.log("range " + sel.getRangeAt(i).textContent);
                        // expand range
                        console.log("range startcontainer " + sel.getRangeAt(i).startContainer);

                        console.log("range startcontainer textContent " + sel.getRangeAt(i).startContainer.textContent);

                        console.log("range .startContainer.childNodes " + sel.getRangeAt(i).startContainer.childNodes);

                        console.log("range .startContainer.childNodes " + sel.getRangeAt(i).startContainer.childNodes);
                        console.log("range .startContainer.childNodes.length " + sel.getRangeAt(i).startContainer.childNodes.length);

                        console.log("range...from " + token_start_pos);

                        sel.getRangeAt(i).setStart(sel.getRangeAt(i).startContainer, token_start_pos);
                        sel.getRangeAt(i).setEnd(sel.getRangeAt(i).startContainer, token_end_pos);

                        // If there is text at the start of the Glovebox ciphertext add the replacement text to the end of this text (node). I.e do not add another node, just expand an existing one.

                        // What is the node immediately preceeding the selection ?


                        console.log("sel.getRangeAt(i).commonAncestorContainer.nodeType: " + sel.getRangeAt(i).commonAncestorContainer.nodeType);

                        console.log("sel.getRangeAt(i).startContainer.nodeType: " + sel.getRangeAt(i).startContainer.nodeType);
                        console.log("sel.getRangeAt(i).startOffset: " + sel.getRangeAt(i).startOffset);
                        console.log("sel.getRangeAt(i).startContainer: " + sel.getRangeAt(i).startContainer);

                        console.log("sel.getRangeAt(i).startContainer.textContent: " + sel.getRangeAt(i).startContainer.textContent);

                        console.log("sel.getRangeAt(i).endContainer.nodeType: " + sel.getRangeAt(i).endContainer.nodeType);
                        console.log("sel.getRangeAt(i).endOffset: " + sel.getRangeAt(i).endOffset);
                        console.log("sel.getRangeAt(i).endContainer: " + sel.getRangeAt(i).endContainer);

                        console.log("sel.getRangeAt(i). is same: " + sel.getRangeAt(i).endContainer.isSameNode(sel.getRangeAt(i).startContainer));

                        // if start node is a text node. and the cipher text to this node. At the end of the text.
                        if (sel.getRangeAt(i).endContainer.isSameNode(sel.getRangeAt(i).startContainer)) {
                            if (sel.getRangeAt(i).startContainer.nodeType == 3) {

                                let begin = sel.getRangeAt(i).startContainer.textContent.substring(0, sel.getRangeAt(i).startOffset);

                                let end = sel.getRangeAt(i).endContainer.textContent.substring(sel.getRangeAt(i).endOffset);

                                console.log("sel.getRangeAt(i).endContainer, begin: " + begin);

                                console.log("sel.getRangeAt(i).endContainer, end: " + end);

                                sel.getRangeAt(i).startContainer.textContent = begin + replacementStr + end;
                                
                                // split the text content at the start of the inserted text
                                console.log("split text node "+ sel.getRangeAt(i).startContainer.textContent +" on position 7");
                                var seondnewNode = sel.getRangeAt(i).startContainer.splitText(7);
                                // insert new node before 
                                let insertedNode = sel.getRangeAt(i).startContainer.parentNode.insertBefore(newGloveboxNode, seondnewNode);
                                // insert the cipher text into the new node
                                insertedNode.innerHTML = comlete_glovebox_token_text;
                                
                                // mark the new node as hidden
                                //insertedNode.setAttribute('hidden', 'true');
                                
                                // Attach event listener which can take action:
                                //   - If the text "rolls" out of screen. 
                                insertedNode.addEventListener('pagehide', function () {
                                   console.log("onpagehide test");
                                });
                           //     insertedNode.addEventListener('submit', function () {
                           //         console.log("onsubmit test");
                           //     })
                                insertedNode.addEventListener("scroll", function () {
                                    console.log("(on)scroll test");
                                });
                                
                                insertedNode.addEventListener("click", function(){ console.log("click test"); }); 
                                insertedNode.addEventListener("focus", function (){ console.log("focus test"); });
                                insertedNode.addEventListener("pagehide", function (){ console.log("pagehide test"); });
                                insertedNode.addEventListener("pageshow", function (){ console.log("pageshow test"); });
                                insertedNode.addEventListener("resize", function (){ console.log("resize test"); });
                                insertedNode.addEventListener("mouseover", function (){ console.log("mouseover test"); });
                                insertedNode.addEventListener("keypress", function(){ console.log("keypress test"); }); 
                                insertedNode.addEventListener("keydown", function(){ console.log("keydown test"); });
                                insertedNode.addEventListener("error", function(){ console.log("error test"); });
                                insertedNode.addEventListener("dblclick", function(){ console.log("dblclick test"); });
                                insertedNode.addEventListener("contextmenu", function(){ console.log("contextmenu test"); });
                                
                                insertedNode.addEventListener("blur", function(){ console.log("blur test"); });
                                insertedNode.addEventListener("beforeprint", function(){ console.log("beforeprint test"); });

                                // Add scroll listener to window
                                // call handler which will assess if any glovebox nodes needs work
                                // Specifically: 
                                // whether any deciphered nodes, should have their plaintext deleted and cipher text restored to visible state. 
                                
                                window.addEventListener("scroll", function(){ console.log("scroll test"); });
                                
                                
                                
                                
                                 insertedNode.addEventListener("unload", function(){ console.log("unload test"); }); 
                                insertedNode.addEventListener("click", function(){ console.log("Hello World2!"); }); 
                                insertedNode.addEventListener("unload", function(){ console.log("unload test"); }); 
                                insertedNode.addEventListener('select', function () {   console.log("select test");   });
                                insertedNode.addEventListener('forminput', function () {
                                    console.log("onforminput test");
                                });
                                insertedNode.addEventListener('change', function () {
                                    console.log("onchange test");
                                });
                                
                                
                                
                                
                                console.log("p4");
                            } else {
                                console.log("p5");
                            }
                        } else {
                            console.log("start and end node not the same");
                            if (sel.getRangeAt(i).startContainer.nodeType == 3) {
                                // append the cipher text to the start node
                                let begin = sel.getRangeAt(i).startContainer.textContent.substring(0, sel.getRangeAt(i).startOffset);

                                sel.getRangeAt(i).startContainer.textContent = begin + replacementStr;
                                // cut back the end node
                                if (sel.getRangeAt(i).endContainer.nodeType == 3) {
                                    console.log("sel.getRangeAt(i).endOffset" + sel.getRangeAt(i).endOffset);
                                    console.log("sel.getRangeAt(i).endContainer.textContent.length" + sel.getRangeAt(i).endContainer.textContent.length);
                                    console.log("sel.getRangeAt(i).endContainer.textContent.substring( 2,5)" + sel.getRangeAt(i).endContainer.textContent.substring(2, 5));

                                    let end = sel.getRangeAt(i).endContainer.textContent.substring(sel.getRangeAt(i).endOffset);
                                    console.log("sel" + end);
                                    // wipe the selected html, the selection may have contained markup at it should be removed too
                                    //        var e = sel.getRangeAt(i).extractContents();

                                    sel.getRangeAt(i).endContainer.textContent = end;
                                }
                                console.log("p4");
                            } else {
                                console.log("p5");
                            }
                        }

                        // delete Glovebox cipher text
                        //var e = sel.getRangeAt(i).extractContents()

                        // insert the new content before
                        //sel.getRangeAt(i).insertNode(newFragment);


                        k++;
                    }

                }
            }
        }

    } else {
        console.log("no replacement text provided.");

    }
}

browser.runtime.onMessage.addListener(ciphertextToText);
