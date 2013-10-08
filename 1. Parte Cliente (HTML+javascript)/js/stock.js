/*
stock.js

objeto donde se gestiona el stock

*/

var stock = (function(){
	var ObjetoGruposBebida = function(){
		var idGruposBebida;
		var Nombre; 
		var Precios = []; //rowsArray de precios
		var Bebidas = []; //rowsArray de bebidas
	};
	
	return {
	
		MostrarStock : function(){
		}
	, 	ListarGruposBebida : function(EvObtResultados){
			db.EjecutarSQL("SELECT Id_G_Bebidas, Nombre FROM Grupo_Bebidas;"
			, function(bExito, rowsArray){
				if(!bExito){
					if(!isUndefined(EvObtResultados))
						EvObtResultados(false);
					return;
				}
				ArrayGruposBebida = [];
				for(var i = 0; i< rowsArray.length; i++){
					ArrayGruposBebida[i] = oGruposBebida = new ObjetoGruposBebida();
					oGruposBebida.idGruposBebida = rowsArray[i][0];
					oGruposBebida.Nombre = rowsArray[i][1];
				}
				var secuencia = -1;
				//seleccionar los precios
				var SelectPrecios = function(bExito, rowsArray_1){
					if(secuencia > -1){
						//comprobar bExito
						if(!bExito){
							if(!isUndefined(EvObtResultados))
								EvObtResultados(false);
							return;
						}
						ArrayGruposBebida[secuencia].Precios = rowsArray_1;
					}
					secuencia++;
					if(secuencia == ArrayGruposBebida.length){
						secuencia=-1;
						SelectBebidas(true);
						return;
					}
					db.EjecutarSQL("SELECT Tipos_Servicio.Id_T_Servicio, Tipos_Servicio.Nombre, Precio, Maximo, Minimo, Tramo FROM Precios LEFT JOIN Tipos_Servicio ON Tipos_Servicio.Id_T_Servicio = Precios.Id_T_Servicio WHERE Precios.Id_G_Bebidas = "+ArrayGruposBebida[secuencia].idGruposBebida+";"
					, function(bExito, rowsArray){ SelectPrecios(bExito, rowsArray) });
					
				};
				//seleccionar las bebidas
				var  SelectBebidas = function(bExito, rowsArray_2){
					if(secuencia > -1){
						//comprobar bExito
						if(!bExito){
							if(!isUndefined(EvObtResultados))
								EvObtResultados(false);
							return;
						}
						ArrayGruposBebida[secuencia].Bebidas = rowsArray_2;
					}
					secuencia++;
					if(secuencia == ArrayGruposBebida.length){
							if(!isUndefined(EvObtResultados))
								EvObtResultados(true, ArrayGruposBebida);
							return;
					}
					db.EjecutarSQL("SELECT Id_Bebida, Nombre, Cantidad_Botella FROM Bebidas WHERE Id_G_Bebidas = "+ArrayGruposBebida[secuencia].idGruposBebida+";"
					,	function(bExito, rowsArray){
							SelectBebidas(bExito, rowsArray);
					});
						
				};
				
				SelectPrecios(true);

			});
		}
	,	AnadirGruposBebida : function(Nombre){
			db.Grupo_Bebidas.ObtenerNuevoId(function(id){
				db.EjecutarSQL("INSERT INTO " + db.Tablas[Grupo_Bebidas].Tabla + " VALUES("+id+",'"+Nombre+"')"
				, function(bExito){
					if(!bExito){
						//Indicar que no se ha podido añadir, si ha escrito el mismo nombre que un grupo ya existente
						//alert('No se ha podido añadir el grupo de bebidas,\n comprueba que no esté ya en la lista.');
						return;
					} 
					//añadir el div con el grupo de bebidas
				});
			});
		}
	,	ModificarGruposBebida : function(idGrupoBebida, Nombre){
			db.EjecutarSQL("UPDATE " + db.Tablas[Grupo_Bebidas].Tabla + " SET Nombre='"+Nombre+"' WHERE Id_G_Bebidas = "+idGrupoBebida+";"
				,function(bExito){
					if(!bExito){
						//Informar del error
						return;
					}
					//modificación correcta.
				}
			);
		}
	,	QuitarGruposBebida : function(idGrupoBebida){
			db.EjecutarSQL("DELETE FROM " + db.Tablas[Grupo_Bebidas].Tabla + "' WHERE Id_G_Bebidas = "+idGrupoBebida+";"
				,function(bExito){
					if(!bExito){
						//Informar del error
						return;
					}
					//modificación correcta.
				}
			);
		}
	,	AnadirBebida : function(idGrupoBebida, Nombre, CantidadxBotella){
			db.Bebidas.ObtenerNuevoId(function(id){
				db.EjecutarSQL("INSERT INTO " + db.Tablas[Bebidas].Tabla + "(Id_G_Bebidas, Id_Bebida, Nombre, Cantidad_Botella) VALUES("+idGrupoBebida+","+id+",'"+Nombre+"',"+CantidadxBotella+")"
				, function(bExito){
					if(!bExito){
						//Indicar que no se ha podido añadir, si ha escrito el mismo nombre que un grupo ya existente
						//alert('No se ha podido añadir el grupo de bebidas,\n comprueba que no esté ya en la lista.');
						return;
					} 
					//añadir el div con el grupo de bebidas
				});
			});
		}
	, 	MostrarStockBebida : function(idBebida){
			
		}
	,	QuitarBebida : function(idBebida){
			db.EjecutarSQL("DELETE FROM " + db.Tablas[Bebidas].Tabla + "' WHERE IdBebidas = "+idBebida+";"
				,function(bExito){
					if(!bExito){
						//Informar del error
						return;
					}
					//modificación correcta.
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