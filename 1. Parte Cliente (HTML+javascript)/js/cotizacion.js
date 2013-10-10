/*
cotizacion.js
*/

cotizacion = (function(){
	
	return {
		//lo mismo que calcular cotización
		MostrarPreciosIniciales : function(){

		}
	,	AnadirPrecioxTipoServicio : function (idTipoServicio, Precio, Maximo, Minimo, Tramo, EvResultado){
			db.EjecutarSQL("INSERT INTO Precios(Id_T_Servicio,Precio,Maximo,Minimo,Tramo) VALUES("+
						idTipoServicio+","+Precio+","+Maximo+","+Minimo+","+Tramo+");"
				,	function(bExito){
						if(!isUndefined(EvResultado))
							EvResultado(bExito);
						
					}
				);
		}
	,	AnadirPrecio : function(idGrupoBebida, idTipoServicio, Precio, Maximo, Minimo, Tramo, EvResultado){
			db.EjecutarSQL("INSERT INTO Precios(Id_G_Bebida, Id_T_Servicio,Precio,Maximo,Minimo,Tramo) VALUES("+
						idGrupoBebida+","+idTipoServicio+","+str_o_null(Precio)+","+str_o_null(Maximo)+","+str_o_null(Minimo)+","+str_o_null(Tramo)+");"
				,	function(bExito){
						if(!isUndefined(EvResultado))
							EvResultado(bExito);
					}
				);		
		}
	, 	ComprobarSiExistePrecio: function(idGrupoBebida, idTipoServicio, EvResultado){
			db.EjecutarSQL("SELECT * FROM Precios WHERE Id_T_Servicio = "+idTipoServicio+" AND Id_G_Bebida "+eq_id_o_null(idGrupoBebida)+";", function(bExito, rowsArray){
				if(!isUndefined(EvResultado))
					EvResultado(rowsArrya.length > 0);
			});
		}
	, 	ModificarPrecio : function(idGrupoBebida, idTipoServicio,  Precio, Maximo, Minimo, Tramo, EvResultado){
			db.EjecutarSQL("UPDATE Precios SET Precio = "+str_o_null(Precio)+", Maximo = "+str_o_null(Maximo)+", Minmo = "+str_o_null(Minimo)+", Tramo = "+str_o_null(Tramo)+" WHERE Id_G_Bebida "+eq_id_o_null(id)+" AND Id_T_Servicio " + eq_id_o_null(id)+";"
			, function(bExito){
				if(!isUndefined(EvResutlado))
					EvResultado(bExito);
			});
		}
	, 	ModificarPrecioxGrupoBebida : function(idGrupoBebida, idTipoServicio, idTipoServicioNuevo,  Precio, Maximo, Minimo, Tramo, EvResultado){
			db.EjecutarSQL("UPDATE Precios SET Precio = "+str_o_null(Precio)+", Maximo = "+str_o_null(Maximo)+", Minimo = "+str_o_null(Minimo)+", Tramo = "+str_o_null(Tramo)+(idTipoServicioNuevo == null ? "" : ", Id_T_Servicio = "+idTipoServicioNuevo )+" WHERE Id_G_Bebida "+eq_id_o_null(idGrupoBebida)+" AND Id_T_Servicio " + eq_id_o_null(idTipoServicio)+";"
			, function(bExito){
				if(!isUndefined(EvResultado))
					EvResultado(bExito);
			});
		}
	, 	QuitarPrecio : function(idGrupoBebida, idTipoServicio, EvResultado){
			db.EjecutarSQL("DELETE FROM Precios WHERE Id_G_Bebida "+ep_id_o_null(idGrupoBebida)+" AND Id_T_Servicio = "+idTipoServicio+";"
					, function(bExito){
							if(!isUndefined(EvResultado))
								EvResultado(bExito);
						});
		}
	, 	CalcularCotizacion : function(EvResultado){
		}
	};
})();