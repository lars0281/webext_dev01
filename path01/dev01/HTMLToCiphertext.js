


function htmlToCiphertext(request, sender, sendResponse) {
    //  document.body.textContent = "";

    var word = request.regex;
    var replacementStr = request.html_to_ciphertext_replacement;
    console.log("HTMLtoCiphertext:reWritePage: JSON(request): " + JSON.stringify(request));

    console.log("HTMLtoCiphertext: replacement string : " + replacementStr);
    console.log("HTMLtoCiphertext:reWritePage: sender: " + sender);

    var selection_html = "";

    if (replacementStr) {

        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                var container = document.createElement("div");
                console.log("p2," + sel.rangeCount);
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {

                    var range = sel.getRangeAt(i);
                    //range.insertNode(document.createTextNode("####replacementStr##"+replacementStr+"#"));
                    //   console.log("p3");
                    //     container.appendChild(sel.getRangeAt(i).cloneContents());
                    // insert before

                    // Create the new node to insert
                    //     let newNode = document.createElement("bold");
                    //     newNode.innerHTML = "key name";

                    //  console.log("p4");

                    // Get a reference to the parent node
                    //let parentDiv = sel.getRangeAt(i).parentNode;


                    // if start node is a text node. annd the cipher text to this node. At the end of the text.
                    if (range.endContainer.isSameNode(range.startContainer)) {
                        console.log("start and end node is the same node");

                        if (range.startContainer.nodeType == 3) {

                            let begin = range.startContainer.textContent.substring(0, range.startOffset);

                            let end = range.endContainer.textContent.substring(range.endOffset);

                            range.startContainer.textContent = begin + replacementStr + end;
                            console.log("p4");
                        } else {
                            console.log("p5");
                        }
                    } else {

                        console.log("start and end node not the same");
                        if (range.startContainer.nodeType == 3) {
							 console.log("The range start inside a text node. edit the text node to include the cipher text");
					
                            // append the cipher text to the start node
                            console.log("range.startContainer.textContent: " + range.startContainer.textContent);
                            console.log("sel.getRangeAt(i).startOffset: " + range.startOffset);
                            let begin = range.startContainer.textContent.substring(0, range.startOffset);

                            console.log("begin: " + begin);
                            // the start node is a text node and it will be modified to retein the non-selected part, and have the cipher text appended.
                            var begin_node = range.startContainer;
                            var e = range.extractContents();
                            begin_node.textContent = begin + replacementStr;
                            // do not indert a new start node...
                            //range.insertNode(document.createTextNode(begin + "###" + replacementStr));
                            // ..rewrite the existing one
                            //begin_node =


                            // cut back the end node
                            if (range.endContainer.nodeType == 3) {
                                console.log("range.endOffset" + range.endOffset);

                                console.log("range.endContainer.textContent.length" + range.endContainer.textContent.length);

                                console.log("range.endContainer.textContent.substring( 2,5)" + range.endContainer.textContent.substring(2, 5));

                                let end = range.endContainer.textContent.substring(range.endOffset);
                                console.log("sel" + end);
                                // wipe the selected html, the selection may have contained markup at it should be removed too
                                //        var e = sel.getRangeAt(i).extractContents();

                                //  range.endContainer.textContent = end;
                            }

                            //range.insertNode(document.createTextNode("replacementStr"));

                            //							var e = range.deleteContents();

                            //						range.insertNode(document.createTextNode(replacementStr));

                            console.log("p4");
                        } else {
						 console.log("The range does not start inside a text node. insert a new node");
						// The range does not sort inside a text node. append the node
						
						
						
                           
                        }
                    }
                    // wipe the selected html
                    //var e = sel.getRangeAt(i).extractContents();

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
        console.log("HTMLtoCiphertext.js:##selected html: " + selection_html);

        // replace the selected HTML


        return Promise.resolve({
            response: {
                "status": "ok"
            }
        });

        //document.body.style.backgroundColor = "yellow";

        // var header = document.createElement('h1');
        // header.textContent = request.replacement;
        // document.body.appendChild(header);

        // start rewrite
        // replaceText(document.body, word, replacementStr);

        console.log("HTMLtoCiphertext:eatPageReceiver: completed");
    }
}
browser.runtime.onMessage.addListener(htmlToCiphertext);
