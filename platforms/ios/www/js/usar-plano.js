$(document).ready(function() {

	// Verifica conexão com o servidor
	localStorage.conectado = 0;
	var dados = {
		"dadoEnv" : 1
	};    
	$.ajax({
	    type     : "post",
	    url      : "http://intonses.com.br/tagarela/scripts/verifica-conexao.php",
	    data     : dados,
	    dataType : "json",
	    success  : function(ret) {
	    	if (ret.dadoRet == 1) {
		    	localStorage.conectado = 1;
		    	consistirDados();
		    }
	    },
		error    : function(ret) {
		   	$("body").removeClass("loading");
		},
		beforeSend: function() {
		   	$("body").addClass("loading");
		},
        complete: function() { 
        	$("body").removeClass("loading");
        }
	});

    db.transaction(transPranchasPlano, nokQuery);
	function nokQuery(erro) {
		alert("Erro ao realizar operação no banco de dados! Erro: "+erro.code);
	}
	function transPranchasPlano(tx) {
    	tx.executeSql("SELECT id,simb_prancha, tipo FROM pranchas WHERE plano = ?", [localStorage.idPlano], okQueryPranchasPlano, nokQuery);
    }
    var pranchasId = [];
    var pranchasIdAux = [];
    var pranchasTipo = [];
    var simbsPrancha = [];
    function okQueryPranchasPlano(tx, results) {
        var len = results.rows.length;
        for (var i=0; i<len; i++) {
	    	pranchasId[i] = results.rows.item(i).id;
            pranchasTipo[i] = results.rows.item(i).tipo;
	    	pranchasIdAux[i] = 0;
	    	simbsPrancha[i] = results.rows.item(i).simb_prancha;
	    	db.transaction(transSimbPranchasPlano, nokQuery);
	    }
    }
    function transSimbPranchasPlano(tx) {
    	for (var i=0; i<pranchasId.length; i++) {
            if (pranchasIdAux[i] == 0) {
                if(pranchasTipo[i] == 0){
    			    tx.executeSql("SELECT categoria,img,audio,pranchas.id as prancha, 0 as tipo FROM simbolos,pranchas WHERE simbolos.id = ? AND pranchas.id = ?", [simbsPrancha[i],pranchasId[i]], okQuerySimbPranchasPlano, nokQuery);
                }else{
                    tx.executeSql("SELECT 5 as categoria,img,audio,id as prancha, 1 as tipo FROM letrasNumeros WHERE letrasNumeros.id = ?", [simbsPrancha[i]], okQuerySimbPranchasPlano, nokQuery);
                }
    			pranchasIdAux[i] = 1;
    			break;
    		}
    	}
    }
    function okQuerySimbPranchasPlano(tx, results) {
    	var len = results.rows.length;
        var auxili = 0;
        for (var i=0; i<len; i++) {
	    	var corBorda;
	        switch (results.rows.item(i).categoria) {
				case 1:
					corBorda = "yellow";
					break;
				case 2:
					corBorda = "red";
					break;
				case 3:
					corBorda = "green";
					break;
				case 4:
					corBorda = "blue";
					break;
				default:
					corBorda = "black";
					break;
			}
            if(auxili == 0){
                $(".simbolos").append("<div class = 'row'>");
            }
            if(results.rows.item(i).tipo == 0){
                link = 'usar-prancha.html';
            }else{
                link = 'usar-pranchaLN.html';
            }
	    	if (localStorage.dinamico == "iOS") {
                $(".pranchas").append("<div class = 'col col-50' simbs>"
                                    + "<a href='" + link + "'>"
                                    + "<img src='img/"+results.rows.item(i).img+"' title='"+results.rows.item(i).audio+"'"
                                    + " alt='"+results.rows.item(i).prancha+"' class='img-prancha' style='margin:25px; border:10px solid "+corBorda+";"
                                    + "height='175' width='175''/></a></div>");
	    	}
	    	else {
	    		$(".pranchas").append("<div class = 'col col-50' simbs>"
                                    + "<a href='" + link + "'>"
                                    + "<img src='"+results.rows.item(i).img+"' title='"+results.rows.item(i).audio+"'"
                                    + " alt='"+results.rows.item(i).prancha+"' class='img-prancha' style='margin:25px; border:10px solid "+corBorda+";"
                                    + "height='175' width='175''/></a></div>");
	    	}
            if(auxili == 1){
                $(".simbolos").append("</div>");
                auxili = 0;
            }else{
                auxili = 1;
            }
	    }
        if(auxili == 1){
            $(".simbolos").append("</div>");
        }
	    $(".img-prancha").click(function() {
			var alt = $(this).attr("alt");
			localStorage.idPrancha = Number(alt);
			localStorage.gravarLog = "true";
		});
    }
    
		
});