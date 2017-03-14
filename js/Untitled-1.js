{

    /**解析标题*/

    function isHead(val) {
        var reg=/^#(.*)+/;
        return [reg.test(val),parsHead]
    }
    function parsHead(val) {
        var str=val;
        var index_p=str.lastIndexOf("#")+1;
        var pre_tag="<h"+index_p+">"
        var tag_end="</h"+index_p+">"
        str=str.substr(index_p);
        str=pre_tag+str;
        str=str+tag_end;
        return str;
    }


    /**解析列表*/

    function isLiInList(val) {
        var reg=/^(-.|\*.|\d.)(.*)+/;
        return reg.test(val);
    }

    function isUl(val) {
        var reg=/^(-.|\*.)(.*)+/;
        return [reg.test(val),paresUl]
    }
    function paresUl(val) {
        return "<ul>"+parseList(val)+"</ul>";
    }
    function isOl(val) {
        var reg=/^(\d.)(.*)+/;
        return [reg.test(val),paresOl]
    }
    function paresOl(val) {
        return "<ol>"+parseList(val)+"</ol>";
    }
    function parseList(val) {
       var str=val;

        str=str.replace(/^(-.|\*.|\d.)/,"")
        str="<li>"+str+"</li>";

        return str;
    }

    /**解析引用*/
    function  isQuote(val) {
        var reg=/^>(.*)+/;
        return [reg.test(val),parseQuote]
    }

    function parseQuote(val) {
        var str=val;
        str=str.replace(">","")
        str="<q class='quote'>"+str+"</q>";
        return str;
    }

    function isParagraph(val) {
        var reg=/^(.*)+/g;
        return [reg.test(val),parseParagraph]
    }
    function parseParagraph(val) {
        return "<p>"+val+"</p>"
    }

    function isCodebox(val) {
        var _reg=/`(\w)+/;
        var reg_=/(\w)+`$/;
        return [reg_.test(val) || _reg.test(val),parseCodebox];
    }

    function parseCodebox(val) {
        var _reg=/`(\w)+/;
        var reg_=/(\w)+`/;
        var reg=/`(\w)+`/;
        if (reg.test(val)){
            return "<div class=codebox>"+val.replace(/`/g,"")+"</div>";
        }
        if (_reg.test(val)){
            return "<div class=codebox>"+val.replace(/`/g,"");
        }
        if (reg_.test(val)){
            return val.replace(/`/g,"")+"</div>";
        }

    }

    var chosePrase=[isHead,isOl,isUl,isQuote,isCodebox,isParagraph];

    function parseLine(val) {
        var str=val;
        var style=chosePrase.filter(function (item,index) {
            return item(str)[0]==true;
        });
        let fn=style[0](str)[1];
        return fn(str);

    }
    
    function removing(val) {
        var arr=val.replace(/(\r)/,"").split(/(\n|\r)/);
        arr=arr.filter(function (item,index) {
            return item.search(/(\r|\n)/)==-1
        })
        return arr
    }

    function remove_excess_ul_ol(val) {
        var reg=/((<ul>)|(<ol>))(.*)+((<\/ul>)|(<\/ol>))/;
        var result=reg.exec(val)[0];
        var index=val.indexOf(result);
        var lens=result.length;
        var string=result.slice(4,-5).replace(/(<ul>)|(<ol>)|(<\/ul>)|(<\/ol>)/g,"");
        string=result.slice(0,4)+string+result.slice(-5);
        val=val.split(result);
        val.splice(1,0,string);
        val=val.join("");
        return val;



    }
    function pares(val) {
        var arr=removing(val);
        console.log(arr)
        arr.forEach(function (item,index) {
            item=item.trim();
            item= parseLine(item);
            arr[index]=item;
        })
        var str=arr.join("");
        return remove_excess_ul_ol(str);

    }

    var val=document.querySelector("#editor").value;
    var showDiv=document.querySelector("#textDisplayArea");
     showDiv.innerHTML=pares(val);

}