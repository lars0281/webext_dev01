
// create this structure
// <glovebox><ciphertext hidden="true">cipher text</ciphertext>plain text</glovebox>
// Leaving the cipher text in place but not visible allows for quick "reencryption". 
// Use case: screen "rollover" removes plain text.

function ciphertextToGloveboxMarkup(request, sender, sendResponse) {

    console.log("ciphertextToGloveboxMarkup:JSON(request): " + JSON.stringify(request));

    var replacementStr = request.ciphertext_replacement_html;
    console.log("rJSON(request): " + JSON.stringify(request));

    var replacement_html = "";
    replacement_html = request.ciphertext_replacement_html;

    console.log("new html: " + request.ciphertext_replacement_html);

    if (replacement_html) {

        var newFragment = document.createRange().createContextualFragment(replacement_html);

        var modified_selection_text;

        console.log("p1.2");

        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                // var container = document.createElement("div");
                console.log("p2," + sel.rangeCount);
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {

                    var glovebox_header_regex = /(:Glovebox:[^:]*:[^:]*:)/g;
                    
                	 // var glovebox_header_regex = /:Gl/g;
                    //console.log(expand_selection_to_encompass_the_whole_gloveboxtoken(new RegExp('(:Glovebox:[^:]*:[^:]*:)', 'm'), sel));

                	
                    // The Glovebox ciphertext is a plaintext node without markup.
                    // Expand the selection so as to make sure the whole glovebox ciher text token has been selected.

                    var selectStartOffset = sel.getRangeAt(i).startOffset;
                    console.log("reWritePageGetHTMLselected: Range.startOffset:" + selectStartOffset);

                    var selectEndOffset = sel.getRangeAt(i).endOffset;
                    console.log("reWritePageGetHTMLselected: Range.startOffset:" + selectEndOffset);

                    var selection_text = sel.getRangeAt(i).toString();
                    var rangesize = selection_text.length;
                    console.log("reWritePageGetHTMLselected: Range.size:" + rangesize);

                    var selection_end_pos = selectStartOffset + rangesize;

                    // get the whole of the surrounding text

                    var fulltextofnode = sel.getRangeAt(i).startContainer.textContent;

                    console.log("reWritePageGetHTMLselected: Range.startContainer:" + fulltextofnode);

                    // grab the piece of the fulltext of the node preceeding the selected text and see if it contains the opening statement
                    var preceeding = fulltextofnode.substring(0, selectStartOffset);

                    console.log("reWritePageGetHTMLselected: preceeding:" + preceeding);

                    var following = fulltextofnode.substring(selectStartOffset + rangesize);

                    console.log("reWritePageGetHTMLselected: following:" + following);

                    // check if selection contain the opening statement, and if not look in the preceeding

                    // var glovebox_header_regex = /:Gl/g;


                    // ok, see if it is in the preceeding text with selection_text appended

                    // pick the glovobox text which intersects with the selection text.
                    // - if more than one, only the first one.


                    console.log("reWritePageGetHTMLselected: has to contain the Glovebox header:" + preceeding + selection_text + following);
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

                    // identity the exact extent of the Glovebox text - which is then replaces with the decrytped html

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

                        // carry out replacement
                        console.log("replacing " + fulltextofnode.substring(token_end_pos, token_start_pos) + " with " + newFragment.toString());

                        console.log("range " + sel.getRangeAt(i).toString());
                        // expand range
                        console.log("range startcontainer " + sel.getRangeAt(i).startContainer);

                        console.log("range startcontainer textContent " + sel.getRangeAt(i).startContainer.textContent);

                        console.log("range .startContainer.childNodes " + sel.getRangeAt(i).startContainer.childNodes);

                        console.log("range .startContainer.childNodes " + sel.getRangeAt(i).startContainer.childNodes);
                        console.log("range .startContainer.childNodes.length " + sel.getRangeAt(i).startContainer.childNodes.length);

                        console.log("range...from " + token_start_pos);

                        sel.getRangeAt(i).setStart(sel.getRangeAt(i).startContainer, token_start_pos);
                        sel.getRangeAt(i).setEnd(sel.getRangeAt(i).startContainer, token_end_pos);

                        // delete Glovebox cipher text
                        var e = sel.getRangeAt(i).extractContents();

                        // create the Glovebox node
                        
                        var newGloveboxNode;
                        var newCipherNode;
                        var newPlaintextNode;
                        
                        
                        newGloveboxNode = document.createElement("glovebox");
                       // newGloveboxNode.textContent = 'some bold text';

                        // this node will retain a copy of the encrypted text and make it not visible. 
                        newCipherNode = document.createElement("ciphertext");
                        newCipherNode.setAttribute("hidden","true"); // attach the attribute to the element to make it invisible, yet still present in the DOM-tree
                        var uuid;
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
                        newCipherNode.setAttribute("id",uuid); // attach a unique ID to the element to make it more easily adressable. 

                        newCipherNodeBold = document.createElement("b");
                        newCipherNodeBold.textContent = 'some bold text';
                        newCipherNode.appendChild(newCipherNodeBold);

                        
                        newPlaintextNode = document.createElement("b");
                        newPlaintextNode.textContent = 'some plain text';

                        
                        newGloveboxNode.appendChild(newCipherNode);
                       // newGloveboxNode.appendChild(newPlaintextNode);
                        
                        newGloveboxNode.appendChild(newFragment);
                        
                      //newGloveboxNode.appendChild(document.createTextNode("New Node Inserted Here"));
                      // insert <glovebox> node at the start of the Glovebox encrypted token
                        console.log("insert glovebox node");
                        var seondnewNode = sel.getRangeAt(i).startContainer.splitText(7);
                        
                       // let insertedNode = sel.getRangeAt(i).startContainer.parentNode.insertBefore(newGloveboxNode, seondnewNode);

                       
                        
                            // insert the new content before
                           // sel.getRangeAt(i).insertNode(newFragment);
                        sel.getRangeAt(i).insertNode(newGloveboxNode);
                        
                        // attach the event that will trigger the required behavior
                   
                       
                        // add evenhandler which makes cipher text visible/invisible with clicking
                        newGloveboxNode.addEventListener("click", function(){
                        	console.log("click test");
                        	// add action to flipp visibility if decrypted text is being clicked
                        	console.log("clicked node: " + document.getElementById(uuid));
                        	console.log("clicked is hidden: " + document.getElementById(uuid).hidden);
                        	
                        	if (document.getElementById(uuid).hidden){
                            	console.log("clicked is hidden: " );
                            	document.getElementById(uuid).hidden = false;
                        	} else{
                            	console.log("clicked is visible, make hidden" );
                            	document.getElementById(uuid).hidden = true;
                        	}
                        	
//                        	document.getElementById("welcome").hidden = true;
 
                        });
                     
                        // Add scroll listener to window
                        // call handler which will assess if any glovebox nodes needs work
                        // Specifically: 
                        // whether any deciphered nodes, should have their plaintext deleted and cipher text restored to visible state. 
                        
                        window.addEventListener("scroll", function(){ 
                        	console.log("scroll test");
                        // check if node is visible. 
                        	
                        	console.log("1: "+document.getElementById(uuid).style.display);
                        	console.log("2: "+document.getElementById(uuid).parentNode.style.display);
                        	console.log("3: "+document.getElementById(uuid).offsetWidth );
                        	console.log("4: "+document.getElementById(uuid).offsetHeight  );
                        	
                        	//  insertedNode.addEventListener("pagehide", function (){ console.log("pagehide test"); });
                           //   insertedNode.addEventListener("pageshow", function (){ console.log("pageshow test"); });
                            
                        	console.log("5: "+document.hidden );
                        	console.log("6: "+document.getElementById(uuid).offsetHeight  );
                        	
                        
                        });
                        // kick off processing if focus is removed from the page
                        window.addEventListener("blur", function(){ 
                        	console.log("blur test");

                        });

                        
                        window.addEventListener("pagehide", function(){ 
                        	console.log("pagehide test");

                        });
                        window.addEventListener("pageshow", function(){ 
                        	console.log("pageshow test");

                        });
                        
                        k++;
                    }

                }
            }
        }

    } else {
        console.log("no replacement html provided.");

    }

}


//The use may click anywhere inside the encrypted text.
//Expand the selection at either end to ensure the entire token text containing the encrypted text is selected.
//input
//regexp    Use a regexp to identify the whole token inside a larger plaintext.
//selection  The starting point from which to expand the selection. Output of window.getSelection()
//

//return the text in the expanded selection

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

browser.runtime.onMessage.addListener(ciphertextToGloveboxMarkup);
