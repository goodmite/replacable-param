import {Encoder} from './encoder.js';
import {formatTemplateMessage} from "./template.js";


let labelFroalaEditor = "#editor-froala";
let spnHighlight = ".spnhighlight";


/***
 * wrapper is editor div
 * */
export const MsgBox = wrapper => {
    wrapper.addEventListener('keypress', (e) => {
        let el = $(e.target);
        if (e.target.classList.contains('spnhighlight') && e.target.classList.contains('pristine')) {
            el.text('');
            e.target.classList.remove('pristine');
            setTimeout(() => {
                if (el.text().trim()) {
                    e.target.classList.remove('error');
                    e.target.classList.add('highlight');
                } else {
                    e.target.classList.add('error');
                    e.target.classList.remove('highlight');
                }
            })
        }
    })

    wrapper.addEventListener('click', (e) => {
        let el = $(e.target);
        if (e.target.classList.contains('spnhighlight') && e.target.classList.contains('pristine')) {
            showtxtbox(e.target);
        }
    })


    const showtxtbox = function (ctrl) {
        debugger;
        /*For pristine state: bring focus at the beginning*/
        if (ctrl.classList.contains('pristine')) {
            let x = $(ctrl).text();
            $(ctrl).text("");
            $(ctrl).text(x);
        }

    }

    return (
        {
            txtbox: "#txtMsg",

            formatTemplateMessage: function(message, data) {
                console.log(this);
                return formatTemplateMessage(message, data, this);
            },

            /**
             * max length of individual replacable param
             * todo: get length from api, as of now hardcoded as 480
             * */
            getBoxMaxLength: function () {
                let maxLength = sessionStorage.getItem("chnlmaxlength");
                if (maxLength === undefined || maxLength === null) {
                    maxLength = 480;
                }
                return maxLength;
            },

            /**
             * before getting text, we do this replacements
             * &nbsp ->  ' '
             * <br> ->  \n
             * */
            replaceHtml: function () {

                let stringText = "";
                const wrapperHTML = $(wrapper).html();
                if (wrapperHTML !== undefined && wrapperHTML !== null) {
                    stringText = wrapperHTML.replace(/\&nbsp;/g, ' ').replace(/<br\s*\/?>/mg, "\n");
                }
                return stringText;
            },

            /**
             * checks if user entered value in RP
             * check: looks for < or >
             * */
            checkIfParamsReplaced: function () {
                const self = this;
                let t = '';

                t = $("<div></div>").html(self.replaceHtml());
                var errorCount = 0;
                var i = -1;
                $(t[0]).find(spnHighlight).each(function () {

                    i += 1;
                    if ($(this).text().includes("<") || $(this).text().includes(">")) {
                        $(wrapper).contents().find("#spn" + i).addClass("error");
                        debugger;
                        $(wrapper).contents().find("#spn" + i).removeClass("highlight");
                        errorCount += 1;
                    }
                });
                return errorCount > 0 ? false : true;
            },

            /**
             * is called before sending to user
             * html -> text in editor
             * */
            getTxt: function (flag) {
                debugger;
                const self = this;
                let t = '';

                t = $("<div></div>").html(self.replaceHtml());
                $(t[0]).find(spnHighlight).each(function () {
                    $(this).replaceWith($(this).text())
                });
                $(t[0]).find(".txtedit").each(function () {
                    $(this).remove()
                });
                var finalHtml = "";
                var i;
                for (i = 0; i < $(t[0]).find("p").length - 1; ++i) {
                    finalHtml += $($(t[0]).find("p")[i]).html() + "\n"
                }
                finalHtml += $($(t[0]).find("p")[i]).html();
                return finalHtml;
            },

            /**
             * trim the str to maxlenght char
             * */
            getMaxLengthText: function (str, maxlen) {
                let len = 0;
                let temp = "";
                str = str.replace(/\r\n/g, "\n");
                for (let charPos = 0; charPos < str.length; charPos++) {
                    if (str[charPos] === "\n") {
                        len += 2;
                    } else {
                        len += 1;
                    }
                    if (str.charCodeAt(charPos) > 127) {
                        len += 1;
                    }
                    temp = temp + str[charPos];
                    if (len === maxlen) {
                        return temp;
                    }
                }
                return temp;
            },

            /**
             * called in set4mTxt
             * */
            getChatCount: function () {
                const maxLength = this.getBoxMaxLength();
                let str = this.getTxt(false);
                str = str.replace(/\r\n/, '\n');
                if (maxLength !== "0" && maxLength.length > 0 && len > parseInt(maxLength)) {
                    str = this.getMaxLengthText(str, maxLength);
                }
                let len = 0;
                for (let charPos = 0; charPos < str.length; charPos++) {
                    switch (str[charPos]) {
                        case "\n":
                            len += 2;
                            // if (environment.channelId === "3") {
                            //     len += 3;
                            // }
                            break;
                        case "\r":
                            len += 2;
                            break;
                        default:
                            len += 1;
                    }
                    if (str.charCodeAt(charPos) > 127) {
                        len += 1;
                    }
                }

                return len;
            },

            /**
             *
             * */
            set2span: function (e, ctrl) {
                const ctrlspan = $(wrapper.querySelector(labelFroalaEditor).querySelector("iframe")).contents().find("#" + $(ctrl).attr("id").substring(3));
                $(ctrl).hide();
                ctrlspan.show();
                if ($(ctrl).val() !== undefined && $(ctrl).val().length > 0) {
                    ctrlspan.text($(ctrl).val());
                    //$(ctrl).val(""); commented to retain the value of the input field
                    $(ctrlspan).addClass("highlight");
                    $(ctrlspan).removeClass("error");
                } else {
                    ctrlspan.text(ctrlspan.attr("mytext"));
                    if ($(ctrl).val() !== null && $(ctrl).val() !== undefined && $(ctrl).val().length > 0) {
                        $(ctrlspan).addClass("highlight");
                        $(ctrlspan).removeClass("error");
                    }
                    // checks wheather '<' and '>' are present in the replceable params value or not, checks send button throws error not not by clicking
                    else if (ctrlspan.text().search('<') !== -1 && ctrlspan.text().search('>') !== -1 /*&& environment.sendButtonClicked*/) {
                        $(ctrlspan).addClass("error");
                        $(ctrlspan).removeClass("highlight");
                    }
                }
                ctrlspan.removeAttr("mytext");
            },

            /**
             *
             * */
            set4mTxt: function (e, ctrl) {
                const maxLength = this.getBoxMaxLength();
                if (maxLength !== "0" && maxLength.length > 0) {
                    const limit = this.getChatCount();
                    if (limit >= parseInt(maxLength) && e.keyCode !== 8 && e.keyCode !== 46) {
                        e.preventDefault();
                    }
                }
                const ctrlspan = $("#" + $(ctrl).attr("id").substring(3));
                ctrlspan.text($(ctrl).val());
            },

            /**
             * listen for various events in RP span
             * */
            txtKeyEvnt: function (e, ctrl) {
                const placeHolderMaxCount = $(wrapper.querySelector(labelFroalaEditor).querySelector("iframe")).contents().find(".txtedit").length;
                switch (e.keyCode) {
                    case 13: {
                        this.set2span(e, ctrl);
                    }
                        break;
                    case 27: {
                        $(this).val("");
                        this.set2span(e, ctrl);
                    }
                        break;
                    case 9: {
                        let nextItemIndex = parseInt(ctrl.id.substring(6)) + 1;
                        if (e.type === "keydown") {
                            this.showtxtbox($(wrapper.querySelector(labelFroalaEditor).querySelector("iframe")).contents().find("#spn" + nextItemIndex)[0])
                        } else if (placeHolderMaxCount !== undefined) {
                            nextItemIndex = parseInt(ctrl.id.substring(6)) + 1;
                            if (nextItemIndex !== placeHolderMaxCount) {
                                e.preventDefault();
                            }
                            if (e.type === "keydown") {
                                if (nextItemIndex < placeHolderMaxCount) {
                                    showtxtbox($(wrapper.querySelector(labelFroalaEditor).querySelector("iframe")).contents().find("#spn" + nextItemIndex)[0]);
                                }
                            }
                        }
                    }
                        break;
                    default: {
                        this.set4mTxt(e, ctrl);
                    }
                        break;
                }
            },

            /*called on click of RP*/
            showtxtbox,

            /**
             * when template is selected, we need to convert <> markup to span
             *
             * */
            parseMessage: function (msg) {
                const self = this;
                const result = msg.match(/<([\s\S]*?)>/g);
                if (result !== undefined && result !== null) {
                    for (let i = 0; i < result.length; i++) {
                        const text = Encoder.htmlEncode(result[i]);
                        let ele = `<span contenteditable='false'><span  title='${text}' contenteditable='true' id='spn${i}' class='spnhighlight highlight pristine'>${text}</span></span> `;
                        msg = msg.replace(result[i], ele);
                    }
                    // updateEnvironment({isReplacableParamstemplate : true});
                } else {
                    // updateEnvironment({isReplacableParamstemplate : false});
                }
                $(wrapper.querySelector(labelFroalaEditor).querySelector("iframe")).contents().find(".txtedit").each(function () {
                    $(this).keydown(function (e) {
                        self.txtKeyEvnt(e, this, result.length);
                    }).keyup(function (e) {
                        self.txtKeyEvnt(e, this, result.length);
                    }).blur(function (e) {
                        if ($(this).is(":visible")) {
                            self.set2span(e, this);
                        }
                    });
                });
                msg = msg.replaceAll("\n", "<br>")
                return msg;
            }
        }
    )
}
