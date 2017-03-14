/**编辑markdown区域的动态效果*/
{
    /**创建显示rows数值的dom元素*/
    function createSpan(row) {
        var span=document.createElement("span");
        span.classList.add("row");
        span.innerHTML=row;
        return span;
    }
    /**
     * 显示editor区域的回车符数
     */
    function lineInTextarea(textarea) {
        var content=textarea.value;
        content=content.split("\n");
        return content.length;
    }

    function showRows(e) {
        var e=e||window.event;
        var target=e.target||e.srcElement;
        let rows=lineInTextarea(target);
        var rowsDiv=target.previousElementSibling;
        var spanNum=rowsDiv.querySelectorAll(".row").length;
        var n=spanNum-rows;
        var startNum=spanNum+1;
        if (n<0){
            while (n<0){
                rowsDiv.appendChild(createSpan(startNum++))
                n++;
            }
        }
        if (n>0){
            while (n>0){
                rowsDiv.removeChild(rowsDiv.lastElementChild);
                n--;
            }
        }
        /**光标行数高亮显示*/
        var div=target.parentElement.lastElementChild;
        var currentRows=getCursorPosition(target)*18;
        highlight(div,currentRows);
    }



    function highlight(div,top) {
        div.style.top=top+"px";
    }
    function getCursorPosition(ele){
        var cursurPosition=-1;
        if (document.selection){
            ele.focus();
            var range=document.selection.createRange();
            range.moveStart("character",-ele.value.length);
            cursurPosition=range.text.length;
        }else if (ele.selectionStart ||ele.selectionStart=="0"){
            cursurPosition=ele.selectionStart;
        }
        let str=ele.value.slice(0,cursurPosition);
        var reg=/\n/;
        var pos=0;
        var match;
        while ((match=reg.exec(str))!==null){
            pos++;
            str=str.replace(match[0],"");
        }
        return pos;
    }

}


/**markdown格式的正则表达式转化*/
{
    var regObj={
        header:/^(\#{1,6})([^\#\n]+)$/m,
        list:/^((\s*((\*|\-)|\d(\.|\)))[^\n]+)\n)+/gm,
        quote:/^(\>)\s?([^\>\n]+)$/m,
        code:/\s?\`{1,2}\n?([^`])+\`{1,2}/m
    }
    function parseHeader(val) {
        var str=val;
        var reg=regObj.header;
        var head;
        while ((head=reg.exec(str))!==null){
            let count=head[1].length;
            str=str.replace(head[0],"<h"+count+">"+head[2].trim()+"</h"+count+">").trim();
        }
        return str
    }

    function parseCodeBox(val) {
        var reg=regObj.code;
        var str=val;
        var codes;
        while ((codes=reg.exec(str))!==null){
            let code_context=codes[0].trim();
            code_context=code_context.slice(1,-1);
            code_context="<code>"+code_context+"</code>";
            str=str.replace(codes[0],code_context);
        }
        return str;


    }
    function parseList(val) {
        var reg=regObj.list;
        var str=val;
        var lists_container
        while ((lists_container=reg.exec(str))!==null){
            let lists=lists_container[0];
            lists=lists.replace(/((\*|\-)|\d)./g,"<li>").replace(/(\r|\n)/g,"</li>");
            if (/^(\*|\-)./.test(lists_container[0])){
                lists="<ul>"+lists+"</ul>";
            }else if (/^\d./.test(lists_container[0])){
                lists="<ol>"+lists+"</ol>";
            }
            str=str.replace(lists_container[0],lists);
        }
       return str;
    }
    
    function parseQuote(val) {
        var str=val;
        var reg=regObj.quote;
        var q;
        while ((q=reg.exec(str))!==null){
            let q_context=q[0];
            q_context=q_context.replace(/\>/g,"").trim();
            q_context="<q>"+q_context+"</q>";
            str=str.replace(q[0],q_context);
        }
        return str
    }
    
    function parseParagraph(val) {
        var reg=/^((\s?[\u4e00-\u9fa5_a-zA-Z0-9]+[^\n]+)\n)+/m;
        var str=val;
        var p;
        while ((p=reg.exec(str))!==null){
            let p_context=p[0].replace(/(\n)/g,"</br>");
            p_context="<p>"+p_context+"</p>";
            str=str.replace(p[0],p_context);
        }
        return str;

    }


    function parse() {
        var showMarkdown=document.querySelector("#textDisplayArea");
        var val=document.querySelector("#editor").value;
        var str=parseParagraph(parseHeader(parseCodeBox(parseList(parseQuote(val)))));
        showMarkdown.innerHTML=str;
    };

}
window.onload=function () {
    parse();
    var editor=document.querySelector("#editor");
    var rowsDiv=document.querySelector("#rowsLine");
    var hightlight=document.querySelector("#highlight");

    var val=document.querySelector("#editor").value;
    (function () {
        let rows=lineInTextarea(editor);
        var startNum=1;
        while (rows--){
            rowsDiv.appendChild(createSpan(startNum++))
        }
    })();



    editor.addEventListener("keyup",showRows,false);
    editor.addEventListener("click",function(){
        /**鼠标点击后显示高亮*/
        var top=getCursorPosition(editor)*18;
        highlight(hightlight,top);
    },false);

    editor.addEventListener("keyup",parse,false)
}