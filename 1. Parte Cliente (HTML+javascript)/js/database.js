/*
Objeto Base de datos 
Al crear este objeto a la base de datos de nuestro programa
Autor Jose Angel Navarro
*/
var db = (function() {

var database = null	
,	arrTablas = [{ Tabla : 'Grupos_Bebida', Indice : 'Id_G_Bebida'
								  , CreacionTabla : 'CREATE TABLE IF NOT EXISTS Grupos_Bebida (	\
														Id_G_Bebida NUMERIC(3,0) PRIMARY KEY	\
													,	Nombre VARCHAR(150) UNIQUE	\
													);' }
				, {Tabla : 'Bebidas', Indice : 'Id_Bebida'
							, CreacionTabla : 'CREATE TABLE IF NOT EXISTS Bebidas (	\
													Id_Bebida NUMERIC(3,0) PRIMARY KEY	\
												,	Id_G_Bebida NUMERIC(3,0) REFERENCES 	\
														Grupos_Bebida (Id_G_Bebida) ON DELETE SET NULL	\
												, 	Nombre VARCHAR(150) UNIQUE	\
												, 	Cantidad_Botella NUMERIC(5,0) NULL	\
												, 	Cantidad_Stock NUMERIC(10,0) NULL	\
												);' }
				, {Tabla : 'Tipos_Servicio', Indice : 'Id_T_Servicio'
									, CreacionTabla : 'CREATE TABLE IF NOT EXISTS Tipos_Servicio (	\
															Id_T_Servicio NUMERIC(3,0) PRIMARY KEY	\
														,	Nombre VARCHAR(150) UNIQUE	\
														,	Cantidad NUMERIC(5,0) NOT NULL	\
														);'}
				, {Tabla : 'Servicios', Indice : 'Id_Servicio'
								, CreacionTabla : 'CREATE TABLE IF NOT EXISTS Servicios (	\
														Id_Servicio NUMERIC(15,0) PRIMARY KEY	\
													,	Id_T_Servicio NUMERIC(3,0) REFERENCES 	\
														Tipos_Servicio (Id_T_Servicio) ON DELETE SET NULL	\
													, 	Fecha DATETIME NOT NULL	\
													);' }
				, {Tabla : 'Bebidas_Servicios', Indice : 'CONVERT(VARCHAR,Id_Servicio)+CONVERT(VARCHAR,Id_Bebida)'
										, CreacionTabla: 'CREATE TABLE IF NOT EXISTS Bebidas_Servicios (	\
															Id_Servicio NUMERIC(15,0) NOT NULL	\
														,	Id_Bebida NUMERIC(3,0) NOT NULL	\
														, 	PRIMARY KEY (Id_Servicio, Id_Bebida)	\
														, 	FOREIGN KEY (Id_Servicio) REFERENCES 	\
															Servicios(Id_Servicio) ON DELETE SET NULL	\
														, 	FOREIGN KEY (Id_Bebida) REFERENCES	\
																Bebidas(Id_Bebida) ON DELETE SET NULL	\
														);' }
				, {Tabla : 'Precios', Indice: 'CONVERT(VARCHAR,Id_G_Bebida)+CONVERT(VARCHAR,Id_T_Servicio)'
								, CreacionTabla: 'CREATE TABLE IF NOT EXISTS Precios (	\
													Id_G_Bebida NUMERIC(3,0)  NULL	\
												,	Id_T_Servicio NUMERIC(3,0) NOT NULL	\
												, 	Precio NUMERIC(5,2) NULL	\
												, 	Maximo NUMERIC(5,2) NULL	\
												,	Minimo NUMERIC(5,2) NULL	\
												, 	Tramo NUMERIC(5,2) NULL	\
												, 	PRIMARY KEY (Id_G_Bebida, Id_T_Servicio)	\
												, 	FOREIGN KEY (Id_G_Bebida) REFERENCES	\
														Grupos_Bebida(Id_G_Bebida) ON DELETE CASCADE	\
												, 	FOREIGN KEY (Id_T_Servicio) REFERENCES	\
														Tipos_Servicio(Id_T_Servicio) ON DELETE CASCADE	\
												);'}
				, {Tabla : 'Propiedades', Indice : 'Nombre'
									, CreacionTabla: 'CREATE TABLE IF NOT EXISTS  Propiedades \
													( \
														Nombre VARCHAR(150) PRIMARY KEY \
													,	Valor VARCHAR(300) NULL \
													);'}
			]
,	arrValoresxDefecto = [
		"INSERT INTO Propiedades VALUES('Precio','3.5');"
	,	"INSERT INTO Propiedades VALUES('Maximo', '4');"
	,	"INSERT INTO Propiedades VALUES('Minimo', '2');"
	, 	"INSERT INTO Propiedades VALUES('Tramo', '0.1');"
	,	"INSERT INTO Propiedades VALUES('Cantidad_Botella','1000');"
	, 	"INSERT INTO Propiedades VALUES('Cantidad_Stock', '5000');" 
	,	"INSERT INTO Propiedades VALUES('ServidorPHP', 'http://localhost/cotizacion_espirituosa');"
	]
,   Resultado = function(){/* variable a utilizar para registrar los datos */
				var ObResultados;
				return {
							ObtenerResultados : function(EvObResults){
								ObResultados = EvObResults;
								}/* evento function(results) */
						,	SqlError : function (transaction, error){
								if (error.code==1){
									// DB Table already exists
								} else {
									// Error is a human-readable string.
									console.log('Error: '+error.message+'\nCode: '+error.code);
								}
								if(!isUndefined(ObResultados))
									ObResultados(false, 'Error: '+error.message+'\nCode: '+error.code , null);
									
								return false;
							}
						,	SqlExito : function (transaction, results){
								console.log("Consulta SQL ejecutada con éxito");
								if(!isUndefined(ObResultados)){
									var bExito = true
									, 	rowsArray = [];
									if(results.rows.length > 0){
										for(var i = 0; i<results.rows.length;i++){
											rowsArray[i] = new Array();
											for(key in results.rows.item(i))
												rowsArray[i].push(results.rows.item(i)[key]);
										}
									}	
									ObResultados(bExito, rowsArray, results);
								}
							}
					}
	}
, 	CrearTablas = function(){
		if(!database){
			console.log('Error: no se ha cargado ninguna base de datos');
			return;
		}
		database.transaction(function(tx){
			var oResultado = new Resultado();
			for(var t = 0; t < arrTablas.length; t++){
				tx.executeSql(arrTablas[t].CreacionTabla,[], oResultado.SqlExito, oResultado.SqlError);
				if(arrTablas[t].Tabla == 'Propiedades')
					for(var i = 0; i < arrValoresxDefecto.length; i++)
						tx.executeSql(arrValoresxDefecto[i], [], oResultado.SqlExito, oResultado.SqlError);
			}
		});
	}
,	BorrarTablas = function(EvResultado){
		if(!database){
			console.log('Error: no se ha cargado ninguna base de datos');
			if(!isUndefined(EvResultado))
				EvResultado(false, "Error: no se ha cargado ninguna base de datos", null);
			return;
		}
		database.transaction(function(tx){
			var oResultado = new Resultado();
			oResultado.ObtenerResultados(EvResultado);
			for(var t = 0; t < arrTablas.length; t++){
				tx.executeSql(" DROP TABLE " + arrTablas[t].Tabla+";",[], oResultado.SqlExito, oResultado.SqlError);
			}
		});
	}
,	ExecSQL = function(/* Comando SQL */cmdSQL,/* evento resultante */ EvObtenerResultados){
		if(!database){
			console.log('Error: no se ha cargado ninguna base de datos');
			if(!isUndefined(EvObtenerResultados))
				EvObtenerResultados(false, "Error: no se ha cargado ninguna base de datos", null);
			return;
		}

		database.transaction(function(tx){
			var oResultado = new Resultado();
			oResultado.ObtenerResultados(EvObtenerResultados);
			tx.executeSql(cmdSQL, [], oResultado.SqlExito, oResultado.SqlError);
		});	
	}
, 	ObNuevoId = function(/*arrTabalas*/ oTabla, /* Evento de Obtener nuevo Id */ EvObtenerNuevoId){
			ExecSQL('SELECT COALESCE(MAX('+oTabla.Indice+'),0)+1 AS Cantidad FROM ' + oTabla.Tabla+';'
					, function(bExito, rowsArray){
						if(!isUndefined(EvObtenerNuevoId))
							if(bExito)
								EvObtenerNuevoId(rowsArray[0][0]);
							else
								EvObtenerNuevoId(0);
						}
					);
	}
,   ObDatosTabla = function(oTabla, EvObtenerResultados){
			return ExecSQL('SELECT * FROM '+ oTabla.Tabla+';', EvObtenerResultados);				
	}
;
	//retorna una estructura { nombre: valor, nombre2:valor2,...}
	return {
			/* variable de resultados para poder enviarlos cuando se ejecute los comando */
			Tablas : arrTablas
		,	CrearBaseDeDatos : function () {
				try {
					if (!window.openDatabase) {
						alert('No se puede gestionar los datos desde este explorador.\nAconsejamos que utilice Google Chrome');
					} else {
						var nombre = 'CotizacionEspirituosa.db'
						,	descripcion = 'Cotizacion Espirituosa'
						,	version = '1.0'
						,	maxSize = 5*1024*1024; // 5 MBytes
						database = openDatabase(nombre, version, descripcion , maxSize);
						CrearTablas();
					}
				} catch(e) {
					console.log("Error desconocido: "+ e +".");
					return;
				} 
			}
		, 	ReiniciarBaseDeDatos : function (EvResultado){
				BorrarTablas( function(bExito, Mensaje){
					if(bExito){
						CrearTablas();
					}
					if(!isUndefined(EvResultado))
						EvResultado(bExito, Mensaje);
				});
			}		
		,	EjecutarSQL : ExecSQL
		,	Grupos_Bebida : { 
								ObtenerDatosTabla : function(EvObtenerResultados){
									ObDatosTabla(arrTablas[Grupos_Bebida], EvObtenerResultados);
								}
							,	ObtenerNuevoId : function(EvObtenerId){
									ObNuevoId(arrTablas[Grupos_Bebida], EvObtenerId);
								}			
							}
		,	Bebidas :{ 
								ObtenerDatosTabla : function(EvObtenerResultados){
									ObDatosTabla(arrTablas[Bebidas], EvObtenerResultados);
								}
							,	ObtenerNuevoId : function(EvObtenerId){
									ObNuevoId(arrTablas[Bebidas], EvObtenerId);
								}			
							}
		,	Tipos_Servicio : { 
								ObtenerDatosTabla : function(EvObtenerResultados){
									ObDatosTabla(arrTablas[Tipos_Servicio], EvObtenerResultados);
								}
							,	ObtenerNuevoId : function(EvObtenerId){
									ObNuevoId(arrTablas[Tipos_Servicio], EvObtenerId);
								}			
							}
		,	Servicios : { 
								ObtenerDatosTabla : function(EvObtenerResultados){
									ObDatosTabla(arrTablas[Servicios], EvObtenerResultados);
								}
							,	ObtenerNuevoId : function(EvObtenerId){
									ObNuevoId(arrTablas[Servicios], EvObtenerId);
								}			
							}
		,	Bebidas_Servicios : { 
								ObtenerDatosTabla : function(EvObtenerResultados){
									ObDatosTabla(arrTablas[Bebidas_Servicios], EvObtenerResultados);
								}
							,	ObtenerNuevoId : function(EvObtenerId){
									ObNuevoId(arrTablas[Bebidas_Servicios], EvObtenerId);
								}			
							}
		,	Precios : { 
								ObtenerDatosTabla : function(EvObtenerResultados){
									ObDatosTabla(arrTablas[Precios], EvObtenerResultados);
								}
							,	ObtenerNuevoId : function(EvObtenerId){
									ObNuevoId(arrTablas[Precios], EvObtenerId);
								}			
							}
							
	}
	
})();