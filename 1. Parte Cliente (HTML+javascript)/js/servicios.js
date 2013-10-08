/*
servicios.js
Objeto por el cual se registraraán los servicios que se hagan
*/

var servicios = (function(){


	return {
	
		AnadirTiposServicio : function(Nombre, Cantidad, Precio, Maximo, Minimo, Tramo, EvResultado){
			db.Tipos_Servicio.ObtenerNuevoId(function(id){
				if(id == 0){
					if(!isUndefined(EvResultado))
						EvResultado(false);
					return;
				}
				db.EjecutarSQL("INSERT INTO Tipos_Servicio VALUES ("+id+",'"+Nombre+"',"+Cantidad+");"
					,	function(bExito){
							if(!bExito){
								if(!isUndefined(EvResultado))
									EvResultado(false);
								return;
							}
							//vamos a insertar el precio de este servicio
							if(Precio != null && Maximo != null && Minimo != null && Tramo != null)
							{
								db.EjecutarSQL("INSERT INTO Precios(Id_T_Servicio, Precio, Maximo, Minimo, Tramo) VALUES("+id+","+Precio+","+Maximo+","+Minimo+","+Tramo+");", function(bExito){
									EvResultado(true);
								});
							}else{
								EvResultado(true);
							}
					}
				);
			});
		}
	,	ModificarTipoServicio : function(idTServicio, Nombre, Cantidad, Precio, Maximo, Minimo, Tramo, EvResultado){			
			db.EjecutarSQL("UPDATE Tipos_Servicio SET Nombre = '"+Nombre+"', Cantidad = "+Cantidad+" WHERE Id_T_Servicio = "+idTServicio+";"
				,	function(bExito){
						if(!bExito){
							if(!isUndefined(EvResultado))
								EvResultado(false);
							return;
						}
						//vamos a insertar el precio de este servicio
						if(Precio != null && Maximo != null && Minimo != null && Tramo != null)
						{
							db.EjecutarSQL("SELECT * FROM Precios WHERE Id_G_Bebidas IS NULL AND Id_T_Servicio = "+idTServicio+";"
							,function(bExito, rowsArray){
								if(rowsArray.length > 0){
									db.EjecutarSQL("UPDATE Precios SET Precio = "+Precio+", Maximo = "+Maximo+", Minimo ="+Minimo+" Tramo = "+Tramo+" WHERE Id_G_Bebida IS NULL AND Id_T_Servicio = "+idTServicio+";", function(bExito){
										if(!isUndefined(EvResultado))
											EvResultado(bExito);
									});
								} else {
									db.EjecutarSQL("INSERT INTO Precios(Id_T_Servicio, Precio, Maximo, Minimo, Tramo) VALUES("+idTServicio+","+Precio+","+Maximo+","+Minimo+","+Tramo+");", function(bExito){
										if(!isUndefined(EvResultado))
											EvResultado(bExito);
									});
								}
							});
						}else{
							if(!isUndefined(EvResultado))
								EvResultado(true);
						}
				}
			);
		}
	,	QuitarTiposServicio : function(idTServicio, EvResultado){
			db.EjecutarSQL("DELETE FROM Precios WHERE Id_T_Servicio = "+idTServicio+";"
				, function(bExito){
					if(!bExito){
						if(!isUndefined(EvResultado))
							EvResultado(false);
							return;
					}
					db.EjecutarSQL("DELETE FROM Tipos_Servicio WHERE Id_T_Servicio = "+idTServicio+";"
						, function(bExito){
							if(!isUndefined(EvResultado))
								EvResultado(bExito);
						});
				});
	
		}
	,	ListarTiposServicios : function(EvObtenerTiposServicios){
			db.EjecutarSQL("SELECT Tipos_Servicio.Id_T_Servicio, Nombre, Cantidad, Precio, Maximo, Minimo, Tramo FROM Tipos_Servicio INNER JOIN Precios ON Tipos_Servicio.Id_T_Servicio = Precios.Id_T_Servicio AND Precios.Id_G_Bebidas IS NULL  UNION SELECT Id_T_Servicio, Nombre, Cantidad, '', '', '', '' FROM Tipos_Servicio WHERE Id_T_Servicio NOT IN (SELECT DISTINCT Id_T_Servicio FROM Precios);", function(bExito, rowsArray){
				if(!isUndefined(EvObtenerTiposServicios)){
					EvObtenerTiposServicios(bExito, rowsArray);
				}
			});
		}
	, 	MostrarServicios : function(){
		}
	, 	AnadirServicio : function(idTipoServicio, ArrBebidas){
		}
	};
})();