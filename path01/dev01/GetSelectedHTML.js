


function getSelectedHTML(request, sender, sendResponse) {
    //  document.body.textContent = "";


    // var word = request.regex;
    //  var replacementStr = request.replacement;
    console.log("GetSelectedHTML:request selected JSON(request): " + JSON.stringify(request));
    var selection_html = "";

    if (request.GetSelectedHTML = "Glbx_marker") {

        if (typeof window.getSelection != "undefined") {
            var sel = window.getSelection();
            if (sel.rangeCount) {
                var container = document.createElement("div");
                for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                selection_html = container.innerHTML;
            }
        } else if (typeof document.selection != "undefined") {
            if (document.selection.type == "Text") {
                selection_html = document.selection.createRange().htmlText;
            }
        }
        console.log("GetSelectedHTML.js:##selected html: " + selection_html);

        //   return Promise.resolve({
        //       response: {
        //           "selection_html": selection_html
        //       }
        //   });

    } else {
        console.log("GetSelectedHTML.js: invalid request");

    }

    return Promise.resolve({
        response: {
            "doc": selection_html
        }
    });

}

browser.runtime.onMessage.addListener(getSelectedHTML);
