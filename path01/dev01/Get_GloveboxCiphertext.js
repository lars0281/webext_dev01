
function getGloveboxCiphertext(request, sender, sendResponse) {

    console.log("GetGloveboxCiphertext.js:GetCiphertextSurroundingSelection JSON(request): " + JSON.stringify(request));

    //console.log("pageWriterGetHTML:reWritePageGetHTMLselected: request.replacement: " + replacementStr);
    // console.log("pageWriterGetHTML:reWritePageGetHTMLselected: request.regex: " + word);
    // console.log("pageWriterGetHTML:reWritePageGetHTMLselected: sender: " + sender);
    // console.log("pageWriterGetHTML:reWritePageGetHTMLselected: sendResponse: " + sendResponse);

    // cipher text is retained inside the DOM but hidden inside a <small hidden="true">:Glovebox:3ccbc288mxxxxx</small> structure and wit ha event listener attached
    // The event listener is there to effect some actions:
    // - If the page rolls over and the decrypted plaintext is thereby made invisible, the plaintext is removed and cipher text is returned to it's former position. 

    var GetGloveboxCiphertext = "";

    //GetGloveboxCiphertext = request.GetGloveboxCiphertext;

    var modified_selection_text = "";

    // only execute this code if it has been propperly called. The value of GetGloveboxCiphertext is not being used for anything other than to screen out calls to this code.
    if (request.GetGloveboxCiphertext == "Glbx_marker") {

        console.log("p1");
        var selection_html = "";
        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                // var container = document.createElement("div");
                console.log("p2," + sel.rangeCount);
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {


                    //var glovebox_header_regex = /(:Glovebox:[^:]*:[^:]*:)/g;
                    const glovebox_header_regex = new RegExp('(:Glovebox:[^:]*:[^:]*:)', 'm');

                    // var glovebox_header_regex = /:Gl/g;
                    //console.log(expand_selection_to_encompass_the_whole_gloveboxtoken(new RegExp('(:Glovebox:[^:]*:[^:]*:)', 'm'), sel));

                	
                    // the selection html (DocumentFragmet) may begin and end inside plain text nodes.
                    // The Glovebox cipher text may be broken across multiple text nodes in succession.
                    // check if preceeding node is a text node

                    var previous_text = "";

                    console.log("p3,commonAncestorContainer " + sel.getRangeAt(i).commonAncestorContainer);
                    console.log("p3,commonAncestorContainer nodetype " + sel.getRangeAt(i).commonAncestorContainer.nodeType);

                    console.log("p3,commonAncestorContainer textContent " + sel.getRangeAt(i).commonAncestorContainer.textContent);

                    var n = 0;

                    // loop backwards to determine how far the text-only nodes go.

                    var previousnode = sel.getRangeAt(i).commonAncestorContainer.previousSibling;
                    console.log("p4");
                    //while ( previousnode.nodeType == 3 && n<3 ){
                    while (previousnode && previousnode.nodeType == 3 && n < 8) {

                        console.log("p3,commonAncestorContainer previousSibling (" + n + ")  nodeType: " + previousnode.nodeType);
                        console.log("p3,commonAncestorContainer previousSibling (" + n + ") textContent: " + previousnode.textContent);
                        console.log("p3,commonAncestorContainer previousSibling (" + n + ") length: " + previousnode.textContent.length);
                        previous_text = previousnode.textContent + previous_text;
                        previousnode = previousnode.previousSibling;
                        n = n + 1;
                    }

                    console.log("p5");

                    var following_text = "";

                    var nextnode = sel.getRangeAt(i).commonAncestorContainer.nextSibling;
                    n = 0;
                    while (nextnode && nextnode.nodeType == 3 && n < 8) {

                        console.log("p3,commonAncestorContainer nextSibling (" + n + ")  nodeType: " + nextnode.nodeType);
                        console.log("p3,commonAncestorContainer nextSibling (" + n + ") textContent: " + nextnode.textContent);
                        console.log("p3,commonAncestorContainer nextSibling (" + n + ") length: " + nextnode.textContent.length);
                        following_text = nextnode.textContent + following_text;
                        nextnode = nextnode.nextSibling;
                        n = n + 1;
                    }

                    // the Glovebox ciphertext is a plaintext node without markup.
                    // Get the preceeding text content.
                    console.log("GetGloveboxCiphertext.js:reWritePageGetHTMLselected: Range.startOffset(computed):" + previous_text.length);

                    var selectStartOffset = sel.getRangeAt(i).startOffset;
                    console.log("GetGloveboxCiphertext.js:reWritePageGetHTMLselected: Range.startOffset:" + selectStartOffset);

                    console.log("GetGloveboxCiphertext.js:reWritePageGetHTMLselected: Range.endOffset(computed):" + following_text.length);

                    var selectEndOffset = sel.getRangeAt(i).endOffset;
                    console.log("GetGloveboxCiphertext.js:reWritePageGetHTMLselected: Range.endOffset:" + selectEndOffset);

                    //var selection_text = sel.getRangeAt(i).toString();
                    var selection_text = sel.getRangeAt(i).commonAncestorContainer.toString();

                    var b = sel.getRangeAt(i).commonAncestorContainer.textContent;
                    var a = sel.getRangeAt(i).toString();

                    console.log("GetGloveboxCiphertext.js:reWritePageGetHTMLselected: Range:" + a);
                    console.log("GetGloveboxCiphertext.js:reWritePageGetHTMLselected: Range:" + b);

                    if (b.indexOf(a) != -1) {
                        selection_text = b;
                    } else {
                        selection_text = a;

                    }

                    var rangesize = selection_text.length;
                    console.log("GetGloveboxCiphertext.js:reWritePageGetHTMLselected: selection_text:" + selection_text);
                    console.log("GetGloveboxCiphertext.js:reWritePageGetHTMLselected: selection_text.size:" + rangesize);

                    var selection_end_pos = selectStartOffset + rangesize;

                    // get the whole of the surrounding Glovebox cipher text

                    //      var fulltextofnode = sel.getRangeAt(i).startContainer.textContent;

                    //    console.log("GetGloveboxCiphertext.js:reWritePageGetHTMLselected: Range.startContainer:" + fulltextofnode);

                    // grab the piece of the fulltext of the node preceeding the selected text and see if it contains the opening statement
                    //      var preceeding = fulltextofnode.substring(0, selectStartOffset);

                    //       console.log("GetGloveboxCiphertext.js:reWritePageGetHTMLselected: preceeding:" + preceeding);
                    //        console.log("GetGloveboxCiphertext.js:reWritePageGetHTMLselected: preceeding (computed):" + previous_text);

                    //        var following = fulltextofnode.substring(selectStartOffset + rangesize);

                    //         console.log("GetGloveboxCiphertext.js:reWritePageGetHTMLselected: following:" + following);
                    //          console.log("GetGloveboxCiphertext.js:reWritePageGetHTMLselected: following(computed):" + following_text);

                    // check if selection contain the opening statement, and if not look in the preceeding

                    // ok, see if it is in the preceeding text with selection_text appended

                    // pick the glovebox text which intersects with the selection text.
                    // - if more than one, only the first one.

                    var t = previous_text + sel.getRangeAt(i).commonAncestorContainer.textContent + following_text;

                    console.log("GetGloveboxCiphertext.js:reWritePageGetHTMLselected: has to contain the Glovebox header:" + t);

                    // text
                    // Glovebox_start
                    // start selection
                    // end selection
                    // Glovebox_end
                    // text
                    // Glovebox_start
                    // Glovebox_end
                    // text


                    var k = 0;
                    // step through the full body of the text node and look for ocurences of Glovebox tokens
                    while ((match3 = glovebox_header_regex.exec(t)) != null && k < 1000) {
                        console.log(" contains##: selection begin: " + selectStartOffset + " end" + selection_end_pos);
                        //ctor Chris :Glovebox:47b83c2c-5d3b-3823-2fc2-d8256aeb7f73:R/+62UyjNV1OcmBrYH7i19KTFP65kiRsVHEcmrE3+ClTTC9W5IlVjTN5u8Bqu4xfXVkBMPSa:
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

                        k++;
                    }

                }
                //            selection_html = container.innerHTML;
            }
        } else if (typeof document.selection != "undefined") {
            console.log("returning: error");
		}

    }
    // remove this event listener
    //browser.runtime.onMessage.addListener();

    console.log("return promise {doc: " + modified_selection_text);

    return Promise.resolve({
        response: {
            "doc": modified_selection_text
        }
    });
    //return Promise.resolve({response: doc });


}

// The use may click anywhere inside the encrypted text.
// Expand the selection at either end to ensure the entire token text containing the encrypted text is selected.
// input
// regexp    Use a regexp to identify the whole token inside a larger plaintext.
// selection  The starting point from which to expand the selection. Output of window.getSelection()
// 

// return the text in the expanded selection

function expand_selection_to_encompass_the_whole_gloveboxtoken(reg, sel){
	
	console.log("expand_selection_to_encompass_the_whole_gloveboxtoken");
	
	console.log("regexp: " + reg);
	console.log("selection: " + sel);
	
    // the selection html (DocumentFragmet) may begin and end inside plain text nodes.
    // The Glovebox cipher text may be broken across multiple text nodes in succession.
    // check if preceeding node is a text node

    var previous_text = "";

    console.log("commonAncestorContainer " + sel.getRangeAt(i).commonAncestorContainer);
    console.log("commonAncestorContainer nodetype " + sel.getRangeAt(i).commonAncestorContainer.nodeType);

    console.log("commonAncestorContainer textContent " + sel.getRangeAt(i).commonAncestorContainer.textContent);

    var n = 0;

	
	
}

browser.runtime.onMessage.addListener(getGloveboxCiphertext);
