/*
stock.js

objeto donde se gestiona el stock

*/

var stock = (function(){
	var listarPrecios = function (EvResultado){
			db.EjecutarSQL("SELECT Tipos_Servicio.Id_T_Servicio, Tipos_Servicio.Nombre, Precio, Maximo, Minimo, Tramo FROM Precios LEFT JOIN Tipos_Servicio ON Tipos_Servicio.Id_T_Servicio = Precios.Id_T_Servicio WHERE Precios.Id_G_Bebida = "+this.idGrupoBebida+";"
			, function(bExito, rowsArray){
				if(!isUndefined(EvResultado))
					EvResultado(bExito, rowsArray);
			});
		};
	var listarBebidas = function (EvResultado){
			db.EjecutarSQL("SELECT Id_Bebida, Nombre, Cantidad_Botella FROM Bebidas WHERE Id_G_Bebida = "+this.idGrupoBebida+";"
			, function(bExito, rowsArray){
				if(!isUndefined(EvResultado))
					EvResultado(bExito, rowsArray);
			});
		};
		
	var CGrupoBebida = function(){
		this.idGrupoBebida;
		this.Nombre; 
		//funciones
		this.ListarPrecios = listarPrecios;
		this.ListarBebidas = listarBebidas;


	};
	
	return {
	
		MostrarStock : function(){
		}
	,	CrearCGrupoBebida : function(){
			return new CGrupoBebida;
		}
	, 	ListarGruposBebida : function(EvObtResultados){
			db.EjecutarSQL("SELECT Id_G_Bebida, Nombre FROM Grupos_Bebida;"
			, function(bExito, rowsArray){
				if(!bExito){
					if(!isUndefined(EvObtResultados))
						EvObtResultados(false);
					return;
				}
				ArrayGruposBebida = [];
				for(var i = 0; i< rowsArray.length; i++){
					ArrayGruposBebida[i] = oGruposBebida = new CGrupoBebida();
					oGruposBebida.idGrupoBebida = rowsArray[i][0];
					oGruposBebida.Nombre = rowsArray[i][1];
				}
				if(!isUndefined(EvObtResultados))
					EvObtResultados(true, ArrayGruposBebida);
			});
		}
	,	AnadirGrupoBebida : function(Nombre, EvResultado){
			db.Grupos_Bebida.ObtenerNuevoId(function(id){
				db.EjecutarSQL("INSERT INTO " + db.Tablas[Grupos_Bebida].Tabla + " VALUES("+id+",'"+Nombre+"')"
				, function(bExito){
					if(!isUndefined(EvResultado))
						EvResultado(bExito, id);
				});
			});
		}
	,	ModificarGrupoBebida : function(idGrupoBebida, Nombre, EvResultado){
			db.EjecutarSQL("UPDATE " + db.Tablas[Grupos_Bebida].Tabla + " SET Nombre='"+Nombre+"' WHERE Id_G_Bebida = "+idGrupoBebida+";"
				,function(bExito){
					if(!isUndefined(EvResultado))
						EvResultado(bExito);
				}
			);
		}
	,	QuitarGrupoBebida : function(idGrupoBebida, EvResultado){
			//primero eliminar las bebidas en discordia
			db.EjecutarSQL("DELETE FROM " + db.Tablas[Bebidas].Tabla +" WHERE Id_G_Bebida = " + idGrupoBebida+";"
				, function(bExito){
					if(!bExito){
						if(!isUndefined(EvResultado))
							EvResultado(bExito);
						return;
					}
					db.EjecutarSQL("DELETE FROM " + db.Tablas[Grupos_Bebida].Tabla + " WHERE Id_G_Bebida = "+idGrupoBebida+";"
					, 	function(bExito){
							if(!isUndefined(EvResultado))
								EvResultado(bExito);
					});
				}
			);
		}
	,	AnadirBebida : function(idGrupoBebida, Nombre, CantidadxBotella, EvObtResultados){
			db.Bebidas.ObtenerNuevoId(function(id){
				if(!id){
					if(!isUndefined(EvObtResultados))
						EvObtResultados(false);
					return;
				}
				db.EjecutarSQL("INSERT INTO " + db.Tablas[Bebidas].Tabla + "(Id_G_Bebida, Id_Bebida, Nombre, Cantidad_Botella) VALUES("+idGrupoBebida+","+id+",'"+Nombre+"',"+str_o_null(CantidadxBotella)+")"
				, function(bExito){
					if(!isUndefined(EvObtResultados))
						EvObtResultados(bExito, id);
				});
			});
		}
	, 	ModificarBebida : function (idBebida, Nombre, CantidadxBotella, EvResultado){
			db.EjecutarSQL("UPDATE " + db.Tablas[Bebidas].Tabla + " SET Nombre = '"+Nombre+"', Cantidad_Botella = "+str_o_null(CantidadxBotella)+" WHERE Id_Bebida = " + idBebida + ";"
				, function(bExito){
					if(!isUndefined(EvResultado))
						EvResultado(bExito);
				});
		}
	, 	MostrarStockBebida : function(idBebida){
			
		}
	,	QuitarBebida : function(idBebida, EvtResultado){
			db.EjecutarSQL("DELETE FROM " + db.Tablas[Bebidas].Tabla + "' WHERE IdBebidas = "+idBebida+";"
				,function(bExito){
					if(!isUndefined(EvtResultado))
						EvtResultado(bExito);
				}
			);
		}
	,	ModificarStockBebida : function(idBebida, CantidadBotellas, CantidadParcialBotella){
			//tenemos que sabe la cantidad por botella
			db.EjecutarSQL("SELECT Cantidad_Botella FROM Bebidas WHERE Id_Bebida = "+idBebida+";"
					, function(bExito, rowsArray){
						if(!bExito){
							//informar al usuario de inaccesibilidad de la base de datos
							return;
						}
						
						var CantidadXBotella = parseInt(rowsArray[0][0]);
						var Cantidad = CantidadBotellas * CantidadXBotella;
						//ahora hay que añadir la cantidad parcial 
						if(cantidadParcialBotella != null){
							switch(parseInt(CantidadParcialBotella)){
								case 0:
									Cantidad += CantidadXBotella / 4;
									break;
								case 1:
									Cantidad += CantidadXBotella / 3;
									break;
								case 2:
									Cantidad += CantidadXBotella / 2;
									break;
								case 3:
									Cantidad += CantidadXBotella * (2/3);
									break;
								case 4:
									Cantidad += CantidadXBotella * (3/4);
							}
						}
						//añadimos en la base de datos los datos pertinente
						db.EjecutarSQL("UPDATE Bebidas SET Cantidad_Stock = "+Cantidad+" WHERE Id_Bebida = " + idBebida +";"
							, function(bExito){
								if(!bExito){
									//No se ha podido modificar la cantidad en stock
									return;
								}
								//TODO: actualizar la cantidad en stock.
							}
						);
					}
				);
			}
	};
})();