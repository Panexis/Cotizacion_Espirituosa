/*
stock.js

objeto donde se gestiona el stock

*/

var stock = (function(){
	

	return {
	
		MostrarStock : function(){
		}
	,	AnadirGrupoBebidas : function(Nombre){
			db.Grupo_Bebidas.ObtenerNuevoId(function(id){
				db.EjecutarSQL("INSERT INTO " + db.Tablas[Grupo_Bebidas].Tabla + " VALUES("+id+",'"+Nombre+"')"
				, function(bExito){
					if(!bExito){
						alert('No se ha podido a�adir el grupo de bebidas,\n comprueba que no est� ya en la lista.');
					}
				});
			});
		}
	,	ModificarGrupoBebidas : function(idGrupoBebida, Nombre){
		}
	,	QuitarGrupoBebidas : function(idGrupoBebida){
		}
	,	AnadirBebida : function(idGrupoBebida, Nombre, CantidadxBotella){
		}
	, 	MostrarStockBebida : function(idBebida){
		}
	,	QuitarBebida : function(idBebida){
		}
	,	ModificarStockBebida : function(idBebida, CantidadBotellas, CantidadParcialBotella){
		}
	};
})();