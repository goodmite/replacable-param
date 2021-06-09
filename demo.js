import {MsgBox} from "./chatutils.js";

const editor = document.getElementById('wrapper');

const msgBox = MsgBox(editor);
let template = `Hello, <customer> this is the <text1> <text2> <text3>`

/*format message*/
const message = msgBox.formatTemplateMessage(template, {});
editor.querySelector('#editor-froala').innerHTML = message;
console.log(message);

document.getElementById('validate').addEventListener('click', () => {
    alert(msgBox.checkIfParamsReplaced());
})

