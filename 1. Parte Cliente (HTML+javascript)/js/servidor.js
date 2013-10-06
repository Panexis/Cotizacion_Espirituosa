/* ***** servidor.js ******
 *
 * Descripci�n: Se va a generar las llamadas as�ncronax para registrar los datos en el servidor
 * 
 *
 * Autor: Jos� �ngel Navarro
 *
 *
 * 
 */
 
 var servidor = (function(){
	
	var servidorPHP = ""
	,	getServidorPHP = function() {
			db.ejecutarSQL("SELECT Valor FROM Propiedades WHERE Nombre = 'ServidorPHP'"
					, function(transaction, results, rowsArray){
								servidorPHP = rowsArray[0].Valor;
								});			
						}
	,	sendAjaxSQL = function(cmdSQL){
			$.ajax(
				url : servidorPHP+'\consolaSQL.php'
			,	method : 'POST'
			,   data : cmdSQL
			,	succes : AjaxExito
			,	error : AjaxError
			,   beforesend : AjaxEsperando
			)};
	,   AjaxExito = function(data, textStatus, jqXHR){
		}
	,	AjaxError = function(jqXHR, textStatus, errorThrown){
		}
	,	AjaxEsperando = function(){
		}
	;
	return {
	
		ActualizarServidor : sendAjaxSQL
	,	ObtenerDatosServidor : sendAjaxSQL
	};
 })();