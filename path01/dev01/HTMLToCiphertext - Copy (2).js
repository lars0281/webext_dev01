


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
					range.insertNode(document.createTextNode("####replacementStr##"+replacementStr+"#"));
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
                        if (sel.getRangeAt(i).startContainer.nodeType == 3) {
                            // append the cipher text to the start node
                            console.log("range.startContainer.textContent: " + range.startContainer.textContent);
                            console.log("sel.getRangeAt(i).startOffset: " + range.startOffset);
                            let begin = range.startContainer.textContent.substring(0, range.startOffset);

                            console.log("begin: " + begin);

                            // modify the range object such that calling extractContents removes the correct selection.
                            console.log("range.htmlText: " + range.cloneContents().textContent);
                            console.log("range.htmlText: " + range.cloneContents().toString());
                            console.log("range.htmlText: " + range.cloneContents().htmlText);

                            console.log("range.cloneContents().querySelectorAll(*): " + range.cloneContents().querySelectorAll("*"));
                            console.log("range.cloneContents().querySelectorAll(*).length: " + range.cloneContents().querySelectorAll("*").length);

                            var child_element_list = range.cloneContents().querySelectorAll("*");
                            console.log("childlist" + child_element_list);
                            console.log("childlist" + child_element_list.length);

                            console.log("range.cloneContents().querySelectorAll(*).length: " + range.cloneContents().querySelectorAll("*").length);

                            var docfrag = range.cloneContents();
                            console.log("range.cloneContents().childNodes.length: " + range.cloneContents().childNodes.length);
                            var docfrag_topnodecount = docfrag.childNodes.length;
                            console.log("node count: " + docfrag_topnodecount);

                            // lowest common denominator node.
                            // below this is the whole of the slected html, but potentially also a great deal more.
                            var connomAncestorNode = range.commonAncestorContainer;
                            console.log("common denominator node: commonAncestorContainer: " + connomAncestorNode);

                            // step throug the documentfragment

                            // pay attention to the fist and last nodes in the range/fragment

                            // begining
                            // If the first is a text node, it may require edditing to remove any parth that was selected. The cipher text is appended to this node.
                            // if the first node is not a text node, it should be removed.

                            // middle
                            // second node (if not last) up until the second to last node are all removed.

                            // end
                            // If the last node is a text node, it may require edditing to remove any parth that was selected.
                            // if the last node is not a text node, it should be removed.


                            for (let j = 0; j < docfrag_topnodecount; j++) {
                                let item = docfrag.childNodes[j];
                                console.log("item " + j + ": " + item);
                                console.log("item " + j + ": " + item.textContent);
                            }

                            console.log("first: " + docfrag.childNodes[0]);
                            console.log("last: " + docfrag.childNodes[docfrag_topnodecount - 1]);

                            console.log("range.startContainer: " + range.startContainer);
                            console.log("range.startContainer.textContent: " + range.startContainer.textContent);

                            // start node.
                            var startNode = docfrag.childNodes[0];
                            console.log("first node in selection(startContainer): " + startNode);
                            console.log("first node in selection(startContainer) type: " + startNode.nodeType);

                            // end node.
                            var endNode = docfrag.childNodes[docfrag_topnodecount - 1];
                            console.log("last node in selection(endContainer ): " + endNode);
                            console.log("last node in selection(endContainer ) type: " + endNode.nodeType);

                            //console.log("sel.getRangeAt(i).setStartAfter(sel.getRangeAt(i).startContainer): " + sel.getRangeAt(i).setStartAfter(sel.getRangeAt(i).startContainer));
                            //		console.log("sel.getRangeAt(i).setStartAfter(sel.getRangeAt(i).startContainer): " + sel.getRangeAt(i).setStartAfter(sel.getRangeAt(i).startContainer) );
                            //		console.log("sel.getRangeAt(i).setStartAfter(sel.getRangeAt(i).startContainer).toString: " + sel.getRangeAt(i).setStartAfter(sel.getRangeAt(i).startContainer).toString );
                            //		console.log("sel.getRangeAt(i).setStartAfter(sel.getRangeAt(i).startContainer).toString(): " + sel.getRangeAt(i).setStartAfter(sel.getRangeAt(i).startContainer).toString() );

                            // edit the range to exclude the starting textnode
                            if (startNode.nodeType == 3) {
                                range.setStartAfter(startNode);
                                console.log("first node in selection(startContainer,modified): " + range.startContainer);
                            }
                            if (endNode.nodeType == 3) {
                                // edit the range to exclude the ending textnode
                                range.setEndBefore(endNode);
                                // edit the end textnode to remove the part of it that is in the selected text/html
                                console.log("endContainer: " + range.endContainer);
                                console.log("endOffset: " + range.endOffset);
                                console.log("endContainer.textContent " + range.endContainer.textContent);
                                console.log("");

                                let endRemainText = range.endContainer.textContent.substring(range.endOffset);
                                console.log("end node endRemainText:" + endRemainText);

                            }

                            docfrag = range.cloneContents();
                            console.log("2range.cloneContents().childNodes.length: " + range.cloneContents().childNodes.length);
                            docfrag_topnodecount = docfrag.childNodes.length;
                            console.log("2node count: " + docfrag_topnodecount);

                            for (let j = 0; j < docfrag_topnodecount; j++) {
                                let item = docfrag.childNodes[j];
                                console.log("2item " + j + ": " + item);
                                console.log("2item " + j + ": " + item.textContent);
                            }

                            startNode.textContent = begin + replacementStr;
							
							// delete the middle nodes
							for (let k = docfrag_topnodecount-1; k > 1 ; k--) {
                                let item = docfrag.childNodes[k];
                                console.log("deleting item " + k + ": " + item);
                                console.log("deleting item " + k + ": " + item.textContent);
								var removed = docfrag.removeChild(item);
								
                            }

							
							
							
                            // cut back the end node
                            if (range.endContainer.nodeType == 3) {
                                console.log("range.endOffset" + range.endOffset);

                                console.log("range.endContainer.textContent.length" + range.endContainer.textContent.length);

                                console.log("range.endContainer.textContent.substring( 2,5)" + range.endContainer.textContent.substring(2, 5));

                                let end = range.endContainer.textContent.substring(range.endOffset);
                                console.log("sel" + end);
                                // wipe the selected html, the selection may have contained markup at it should be removed too
                                //        var e = sel.getRangeAt(i).extractContents();

                                range.endContainer.textContent = end;
                            }

							range.insertNode(document.createTextNode("replacementStr"));

							var e = range.deleteContents();
							
							range.insertNode(document.createTextNode(replacementStr));
							
                            console.log("p4");
                        } else {
                            console.log("p5");
                        }
                    }
                    // wipe the selected html
                    // var e = sel.getRangeAt(i).extractContents();

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
