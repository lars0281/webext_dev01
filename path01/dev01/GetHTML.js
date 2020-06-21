

browser.runtime.onMessage.addListener(request => {

    // var word = request.regex;
    var replacementStr = request.replacement;
    console.log("pageWriterGetHTML:reWritePageGetHTMLselected JSON(request): " + JSON.stringify(request));

    //console.log("pageWriterGetHTML:reWritePageGetHTMLselected: request.replacement: " + replacementStr);
    // console.log("pageWriterGetHTML:reWritePageGetHTMLselected: request.regex: " + word);
    // console.log("pageWriterGetHTML:reWritePageGetHTMLselected: sender: " + sender);
    // console.log("pageWriterGetHTML:reWritePageGetHTMLselected: sendResponse: " + sendResponse);


var modified_selection_text;

    console.log("p1");
    var selection_html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
           // var container = document.createElement("div");
            console.log("p2," + sel.rangeCount);
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {

// the selection html (DocumentFragmet) may begin and end in plain text. 
//There can be multiple text nodes in succession before there is an element node. plain text nodes broken up into several textnode, is a source of error. 
// check if preceeding node is a text node

			console.log("p3,commonAncestorContainer " + 	sel.getRangeAt(i).commonAncestorContainer  );
			console.log("p3,commonAncestorContainer nodetype " + 	sel.getRangeAt(i).commonAncestorContainer.nodeType  );
			console.log("p3,commonAncestorContainer textContent " + 	sel.getRangeAt(i).commonAncestorContainer.textContent  );


			console.log("p3,commonAncestorContainer previousSibling nodeType: " + 	sel.getRangeAt(i).commonAncestorContainer.previousSibling.nodeType  );
			console.log("p3,commonAncestorContainer previousSibling textContent: " + 	sel.getRangeAt(i).commonAncestorContainer.previousSibling.textContent  );

			console.log("p3,commonAncestorContainer previousSibling.previousSibling nodeType: " + 	sel.getRangeAt(i).commonAncestorContainer.previousSibling.previousSibling.nodeType  );
			console.log("p3,commonAncestorContainer previousSibling.previousSibling textContent: " + 	sel.getRangeAt(i).commonAncestorContainer.previousSibling.previousSibling.textContent  );


console.log("p3,commonAncestorContainer.parent " + 	sel.getRangeAt(i).commonAncestorContainer.parentNode  );
			console.log("p3,commonAncestorContainer.parent nodeType " + 	sel.getRangeAt(i).commonAncestorContainer.parentNode.nodeType );
			console.log("p3,commonAncestorContainer.parent textContent " + 	sel.getRangeAt(i).commonAncestorContainer.parentNode.textContent );


                // the Glovebox ciphertext is a plaintext node without markup.
                // Get the preceeding text content.

                var selectStartOffset = sel.getRangeAt(i).startOffset;
                console.log("pageWriterGetHTML:reWritePageGetHTMLselected: Range.startOffset:" + selectStartOffset);

                var selectEndOffset = sel.getRangeAt(i).endOffset;
                console.log("pageWriterGetHTML:reWritePageGetHTMLselected: Range.endOffset:" + selectEndOffset);

                var selection_text = sel.getRangeAt(i).toString();
                var rangesize = selection_text.length;
                console.log("pageWriterGetHTML:reWritePageGetHTMLselected: Range.size:" + rangesize);

                var selection_end_pos = selectStartOffset + rangesize;

                // get the whole of the surrounding text

                var fulltextofnode = sel.getRangeAt(i).startContainer.textContent;

                console.log("pageWriterGetHTML:reWritePageGetHTMLselected: Range.startContainer:" + fulltextofnode);

                // grab the piece of the fulltext of the node preceeding the selected text and see if it contains the opening statement
                var preceeding = fulltextofnode.substring(0, selectStartOffset);

                console.log("pageWriterGetHTML:reWritePageGetHTMLselected: preceeding:" + preceeding);

                var following = fulltextofnode.substring(selectStartOffset + rangesize);

                console.log("pageWriterGetHTML:reWritePageGetHTMLselected: following:" + following);

                // check if selection contain the opening statement, and if not look in the preceeding

                var glovebox_header_regex = /(:Glovebox:[^:]*:[^:]*:)/g;
                // var glovebox_header_regex = /:Gl/g;

              
                // ok, see if it is in the preceeding text with selection_text appended

                // pick the glovobox text which intersects with the selection text.
                // - if more than one, only the first one.


                console.log("pageWriterGetHTML:reWritePageGetHTMLselected: has to contain the Glovebox header:" + preceeding + selection_text + following);
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


                var k = 0;
                while ((match3 = glovebox_header_regex.exec(t)) != null && k < 1000) {
                    console.log("pageWriterHTMLtoCiphertext:reWritePage: contains##: selection begin: " + selectStartOffset + " end" + selection_end_pos);

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

                // wipe the selected html
                //     var e = sel.getRangeAt(i).extractContents();

                // insert the new Glovebox text
                //sel.getRangeAt(i).insertNode(document.createTextNode(replacementStr));


            }
            //            selection_html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            selection_html = document.selection.createRange().htmlText;
        }
    }

 // remove this event listener
 //browser.runtime.onMessage.addListener();

        console.log("return: " + modified_selection_text);

    return Promise.resolve({
        response: {
            "doc": modified_selection_text
        }
    });
    //return Promise.resolve({response: doc });


});

document.body.style.backgroundColor = "white";
console.log("We made it yellow");

var selObj = window.getSelection();

console.log("pageWriterGetHTML:eatPageReceiver: rangecount:" + selObj.rangeCount);

if (typeof selObj != "undefined") {
    if (selObj.rangeCount) {

        for (var i = 0, len = selObj.rangeCount; i < len; ++i) {

            console.log("pageWriterGetHTML:eatPageReceiver1: Range.commonAncestorContainer:" + selObj.getRangeAt(i).commonAncestorContainer);
            console.log("pageWriterGetHTML:eatPageReceiver1: Range.commonAncestorContainer:" + selObj.getRangeAt(i).commonAncestorContainer.innerHTML);
            console.log("pageWriterGetHTML:eatPageReceiver1: Range.commonAncestorContainer:" + selObj.getRangeAt(i).commonAncestorContainer.toString());

            console.log("pageWriterGetHTML:eatPageReceiver1: Range.startOffset:" + selObj.getRangeAt(i).startOffset);
            console.log("pageWriterGetHTML:eatPageReceiver1: Range.endOffset:" + selObj.getRangeAt(i).endOffset);

            var frag = selObj.getRangeAt(i).cloneContents();
            console.log("pageWriterGetHTML:eatPageReceiver: Range.cloneContents():" + frag);

            let newNode = document.createElement("bold");
            newNode.innerHTML = "key name";

            //console.log("pageWriter:eatPageReceiver: Range.insertNode:" +		selObj.getRangeAt(i).insertNode(newNode) );
            var t = document.createTextNode("Hello World");

            //   selObj.getRangeAt(i).insertNode(document.createTextNode("Hello World"));
            console.log("pageWriter:eatPageReceiver: Range.insertNode:");

            //selObj.getRangeAt(i).deleteContents();
            ///    var e = selObj.getRangeAt(i).extractContents();

            ////     selObj.getRangeAt(i).insertNode(document.createTextNode("Hello World2"));

            console.log("pageWrite");

        }

    }
}

function reWritePageGetHTMLselected(request, sender, sendResponse) {
    //  document.body.textContent = "";

    //

    var word = request.regex;
    var replacementStr = request.replacement;
    console.log("pageWriterGetHTML:reWritePageGetHTMLselected JSON(request): " + JSON.stringify(request));

    console.log("pageWriterGetHTML:reWritePageGetHTMLselected: request.replacement: " + replacementStr);
    console.log("pageWriterGetHTML:reWritePageGetHTMLselected: request.regex: " + word);
    console.log("pageWriterGetHTML:reWritePageGetHTMLselected: sender: " + sender);
    console.log("pageWriterGetHTML:reWritePageGetHTMLselected: sendResponse: " + sendResponse);

    console.log("p1");
    var selection_html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            console.log("p2," + sel.rangeCount);
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {

                // the Glovebox ciphertext is a plaintext node without markup.
                // Get the preceeding text content.

                console.log("pageWriterGetHTML:reWritePageGetHTMLselected: Range.startOffset:" + sel.getRangeAt(i).startOffset);
                console.log("pageWriterGetHTML:eatPageReceiver: Range.endOffset:" + sel.getRangeAt(i).endOffset);

                //   console.log("p3");
                //     container.appendChild(sel.getRangeAt(i).cloneContents());
                // insert before

                // Create the new node to insert
                //     let newNode = document.createElement("bold");
                //     newNode.innerHTML = "key name";

                //  console.log("p4");

                // Get a reference to the parent node
                //let parentDiv = sel.getRangeAt(i).parentNode;

                //parentDiv.insertBefore(newNode, sp2);
                //		let insertedNode = 		sel.getRangeAt(i)
                //  sel.getRangeAt(i).insertBefore(newNode);
                console.log("p5");

                //  console.log("pageWriterHTMLtoCiphertext:reWritePage: inserted: " + JSON.stringify(newNode));


                // wipe the selected html
                //     var e = sel.getRangeAt(i).extractContents();

                // insert the new Glovebox text
                //sel.getRangeAt(i).insertNode(document.createTextNode(replacementStr));


            }
            //            selection_html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            selection_html = document.selection.createRange().htmlText;
        }
    }
    console.log("pageWriterHTMLtoCiphertext.js:##selected html: " + selection_html);

    console.log("pageWriterHTMLtoCiphertext:eatPageReceiver: completed");
    sendResponse("response");
    return true;

}
//browser.runtime.onMessage.addListener(reWritePageGetHTMLselected);
