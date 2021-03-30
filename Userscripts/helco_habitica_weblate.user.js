// ==UserScript==
// @name         Habitica Variables (for Weblate)
// @namespace    com.habitica.translate
// @version      0.1
// @description  Userscript designed to make a 'contenteditable' appealing interface
// @author       Helcostr (User:Echoblast53 @ Fandom)
// @run-at       document-idle
// @match        https://translate.habitica.com/*
// @grant        none
// ==/UserScript==
(function() {
    'use strict';
    window.onInit = (callback, interval = 250, maxWaitDuration = 5000) => {
        const appInterval = setInterval(() => {
            // Don't do anything during this interval if App doesn't exist.
            if (!window.$) return;
            // If App does exist, clear the interval, and run the callback function.
            clearInterval(appInterval);
            callback();
        }, interval);

        // Timeout the checking process after the specified max time.
        setTimeout(() => clearInterval(appInterval), maxWaitDuration);
    }
    window.onInit(() => {
        // Simple Function to check the indexes of two childs (for comparison)
        const calcChild = child =>{let i = 0; while( (child = child.previousSibling) != null )++i; return i;}

        // Calculate the Carret Cursor's position in the working div (parent)
        const selIndexCalc = (sel,parent) => {
            if (sel.focusNode.isEqualNode(parent)) {
                console.log('Calc Parent');
                return [null,sel.focusOffset];
            }
            const lines = parent.childNodes;
            let total;
            let line_i = -1;
            while (++line_i < lines.length) {
                const nodes = lines[line_i].childNodes;
                total = 0;
                for (let node of nodes) {
                    if (sel.focusNode.isEqualNode(lines[line_i]) && node.nodeName == 'BR' && calcChild(sel.focusNode) == calcChild(lines[line_i])) {
                        return [line_i,1];
                    }
                    if( ( sel.focusNode.isEqualNode(node) && calcChild(sel.focusNode) == calcChild(node) )
                        || ( node.nodeName == 'SPAN' && node.classList.contains("habitica_variable") && node.contains(sel.focusNode) ) )
                        return [line_i, total + sel.focusOffset];
                    if (node.nodeName == '#text')
                        total += node.length;
                    else
                        total += node.innerText.length;
                }
            }
            return [--line_i,total];
        };

        // Set the Carret Cursor's position in the working div (parent)
        const selIndexExec = (sel,parent,line_i,index) =>{
            if (line_i === null) {
                console.log("Select parent");
                return sel.collapse(parent,index);
            }
            let nodes;
            try {
                nodes = parent.childNodes[line_i].childNodes;
            } catch (e) {
                console.log('Parent:',parent);
                console.log('Lines of Parent:',parent.childNodes);
                console.log('Line Index:',line_i);
                console.log('Line:',parent.childNodes[line_i]);
                console.log('Sections of Line:',parent.childNodes[line_i].childNodes);
            }
            for (let node of nodes) {
                if (node.nodeName == 'BR') {
                    return sel.collapse(parent.childNodes[line_i],1);
                }
                if (node.nodeName == '#text' && node.length < index)
                    index -= node.length;
                else if (node.nodeName != '#text' && node.innerText.length < index)
                    index -= node.innerText.length;
                else if (node.nodeName != '#text')
                    return sel.collapse(node.firstChild,index);
                else
                    return sel.collapse(node,index);
            }
        };

        // Convert a marked variable to an actual variable
        const jqVarPaste = whole => $('<span>')
                .text(whole)
                .addClass('habitica_variable');

        // Detect all the varaibles (used for English detection)
        const detectVars = string => {
            let iter = string.matchAll(/<%=(.+)%>/g)
            let {value,done} = iter.next();
            const allVars = {};
            while (!done) {
                // Define variables
                const [whole, name] = value;

                // Add variable
                allVars[name.trim()] = whole;

                //Set up next section
                let next = iter.next();
                done = next.done;
                value = next.value;
            }
            return allVars;
        };

        // Convert working div innerText to a fresh array div set
        // (In the working div, each line is a div)
        // (In each line, there can be #text nodes, or span nodes: marked variables)
        const plainToMarked = (string, allVars) => {
            const working_lines = string.replace(/\n{2}/g,'\n<br>\n').split('\n').map(string=>{
                if (string == '')
                    return null;
                let iter = string.matchAll(/<%=(.+?)%>/g);
                let {value,done} = iter.next();
                const working_string = [];
                let start = 0;
                while (!done) {
                    // Define variables
                    const [whole,name] = value;

                    // Add previous string section
                    working_string.push(string.substring(start, value.index));

                    // Add variable
                    const var_obj = jqVarPaste(whole);
                    if (name.trim() in allVars)
                        working_string.push(var_obj);
                    else
                        working_string.push(whole);

                    //Set up next section
                    start = value.index + whole.length;
                    let next = iter.next();
                    done = next.done;
                    value = next.value;
                }
                // Cleanup
                working_string.push(string.substr(start));
                return $('<div>').append(working_string);
            }).filter(e=>e !== null);
            return working_lines;
        };

        // Add style (for variable detection)
        const styles = '.habitica_variable { border-radius: 3px; padding: 0 2px; color: white; background-color: #144d3f; }';
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = styles
        document.head.appendChild(styleSheet);

        // Get current string for current language
        const string = $('.translation-form .translation-editor').text().trim();

        // Get max input
        const max_input = parseInt($('.translation-form .translation-editor').attr('maxlength'));

        // Detect all variables (from English)
        const allVars = detectVars(document.querySelector('.translation-form .list-group-item-text').innerText);

        // Custom history with array (I hope this isn't taxing on the user's computer)
        class CustEditHist {
            constructor(firstEntry) {
                this.storage = [firstEntry];
                this.currentIndex = 0;
            }
            get prev() {
                this.currentIndex = Math.max(--this.currentIndex,0);
                return this.storage[this.currentIndex];
            }
            get next() {
                this.currentIndex = Math.min(++this.currentIndex,this.storage.length-1);
                return this.storage[this.currentIndex];
            }
            set add(entry) {
                this.storage = this.storage.slice(0,this.currentIndex+1);
                this.storage.push(entry);
                this.currentIndex++;
            }
            set moveCursor([line_index,length]) {
                this.storage[this.currentIndex].undo_line_index = line_index;
                this.storage[this.currentIndex].undo_length = length;
            }
            get debug() {
                return this.storage;
            }
        }

        // Mimic the text area... but make it our own
        const working_div = $('<div contenteditable>')
            .addClass('translation-editor form-control')
            .css({
                'min-height': '48px',
                height:'auto',
                'margin-top':'.25em'
            }).append(...plainToMarked(string,allVars))
            .on({
                input: function (event){
                    const {data,inputType} = event.originalEvent;
                    const history = $(this).data('history');
                    const sel = window.getSelection();
                    if (data === null && inputType === '')
                        return;
                    if (inputType === 'historyUndo') {
                        event.preventDefault();
                        const {html,undo_line_index,undo_length} = history.prev;
                        $(this).html(html);
                        selIndexExec(sel,this,undo_line_index,undo_length);
                    } else if (inputType === 'historyRedo') {
                        event.preventDefault();
                        const {html,line_index,length} = history.next;
                        $(this).html(html);
                        selIndexExec(sel,this,line_index,length);
                    } else {
                        const [line_index,length] = selIndexCalc(sel,this);
                        const text = this.innerText;
                        const chunk = {
                            html:$(this).html('').append(plainToMarked(text,allVars)).html(),
                            line_index,
                            length
                        };

                        history.add = chunk;
                        selIndexExec(sel,this,line_index,length);
                    }
                    let endText = this.innerText.replace(/\n{2}/g,'\n');
                    $('textarea.translation-editor.form-control').val(endText);
                    $('.length-indicator').text(endText.length);
                    if (endText.length > max_input) {
                        const {html,undo_line_index,undo_length} = history.prev;
                        $(this).html(html);
                        selIndexExec(sel,this,undo_line_index,undo_length);
                        endText = this.innerText.replace(/\n{2}/g,'\n');
                        $('textarea.translation-editor.form-control').val(endText);
                        $('.length-indicator').text(endText.length);
                    }
                },
                paste: (event) => {
                    event.preventDefault();
                    // Plaintext translate
                    const toPaste = event.originalEvent.clipboardData.getData('text/plain');
                    document.execCommand('insertText', false, toPaste);
                },
                keydown: function() {
                    const history = $(this).data('history');
                    const sel = window.getSelection();
                    history.moveCursor = selIndexCalc(sel,this)
                },
                mouseup: function() {
                    const history = $(this).data('history');
                    const sel = window.getSelection();
                    history.moveCursor = selIndexCalc(sel,this)
                }
            });
        // Add the working div to the playing field
        $('.translation-form .translation-editor')
            .css('display','none')
            .before(working_div);

        // Add current snapshot as first history (for our custom history)
        working_div.data('history', new CustEditHist( { html: working_div.html() } ) );

        // Set cursor to the end
        const initSelect = ()=> {
            const sel = window.getSelection();
            try {
                const line_i = working_div.children().length-1,
                      length = working_div.children().get(line_i).innerText.length;
                selIndexExec(sel,working_div.get(0),line_i,length);
            } catch (e) {
                selIndexExec(sel,working_div.get(0),null,0);
            }
        };
        // Hook our working div to the buttons
        $('.editor-toolbar button').off('click').click( function(event){
            event.preventDefault();
            const data = this.dataset;

            // Cursor track
            const sel = window.getSelection();
            working_div.focus().data('history')
                .moveCursor = selIndexCalc(sel,working_div.get(0));

            // Clear board
            if ('content' in data)
                working_div.html('');
            // Set
            const pasteValue = 'content' in data ? data.content.substring(1,data.content.length-1) : data.value;
            document.execCommand('insertText', false, pasteValue);

            if ('content' in data)
                initSelect();
        });

        // Generate buttons for each detected variable
        $('.editor-toolbar')
            .prepend(
                $('<div class="btn-group btn-group-xs">')
                    .append(
                        Object
                            .entries(allVars)
                            .map( ([name,whole]) => $('<button>')
                                .addClass('btn btn-default specialchar')
                                .attr('title','Insert variable')
                                .append(name)
                                .click(event=>{
                                    event.preventDefault();
                                    // Cursor track
                                    const sel = window.getSelection();
                                    working_div.focus().data('history')
                                        .moveCursor = selIndexCalc(sel,working_div.get(0));
                                    document.execCommand('insertText', false, whole);
                                })
                            )
                    )
            );

        // Set selector at the end
        initSelect();
        // Hide tab (it's a bad character to use anyways);
        $('button.btn.btn-default.specialchar[data-value="\t"]').hide()
    },250,10000);
})();
