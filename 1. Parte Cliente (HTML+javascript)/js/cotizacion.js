/*
cotizacion.js
*/

cotizacion = (function(){
	
	return {
		//lo mismo que calcular cotización
		MostrarPreciosIniciales : function(){

		}
	,	AnadirPrecioxTipoServicio : function (idTipoServicio, Precio, Maximo, Minimo, Tramo){
			db.EjecutarSQL("INSERT INTO Precios(Id_T_Servicio,Precio,Maximo,Minimo,Tramos) VALUES("+
						idTipoServicio+","+Precio+","+Maximo+","+Minimo+","+Tramo+");"
				,	function(bExito){
						if(!bExito){
							return;
						}
					}
				);
		}
	,	AnadirPrecio : function(idGrupoBebida, idTipoServicio, Precio, Maximo, Minimo, Tramo){
			db.EjecutarSQL("INSERT INTO Precios(Id_G_Bebidas, Id_T_Servicio,Precio,Maximo,Minimo,Tramos) VALUES("+
						idGrupoBebida+","+idTipoServicio+","+Precio+","+Maximo+","+Minimo+","+Tramo+");"
				,	function(bExito){
						if(!bExito){
							return;
						}
					}
				);		
		}
	,	ModificarPrecioxDefecto : function(Precio, Maximo, Minimo, Tramo){

		}
	, 	CalcularCotizacion : function(){
		}
	};
})();