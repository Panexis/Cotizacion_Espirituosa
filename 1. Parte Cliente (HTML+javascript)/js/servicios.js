/*
servicios.js
Objeto por el cual se registraraán los servicios que se hagan
*/

var servicios = (function(){


	return {
	
		AnadirTiposServicio : function(Nombre, Cantidad, EvResultado){
			db.Tipos_Servicio.ObtenerNuevoId(function(id){
				if(id == 0){
					if(!isUndefined(EvResultado))
						EvResultado(false);
					return;
				}
				db.EjecutarSQL("INSERT INTO Tipos_Servicio VALUES ("+id+",'"+Nombre+"',"+Cantidad+");"
					,	function(bExito){
							if(!isUndefined(EvResultado))
								EvResultado(bExito, id);
								
							
					}
				);
			});
		}
	,	ModificarTipoServicio : function(idTServicio, Nombre, Cantidad, EvResultado){			
			db.EjecutarSQL("UPDATE Tipos_Servicio SET Nombre = '"+Nombre+"', Cantidad = "+Cantidad+" WHERE Id_T_Servicio = "+idTServicio+";"
				,	function(bExito){						
						if(!isUndefined(EvResultado))
							EvResultado(bExito);
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
			db.EjecutarSQL("SELECT Tipos_Servicio.Id_T_Servicio, Nombre, Cantidad, Precio, Maximo, Minimo, Tramo FROM Tipos_Servicio INNER JOIN Precios ON Tipos_Servicio.Id_T_Servicio = Precios.Id_T_Servicio AND Precios.Id_G_Bebida IS NULL  UNION SELECT Id_T_Servicio, Nombre, Cantidad, '', '', '', '' FROM Tipos_Servicio WHERE Id_T_Servicio NOT IN (SELECT DISTINCT Id_T_Servicio FROM Precios);", function(bExito, rowsArray){
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