/*
Objeto Base de datos 
Al crear este objeto a la base de datos de nuestro programa
Autor Jose Angel Navarro
*/
const 	Grupo_Bebidas = 0
,		Bebidas = 1
,		Tipo_Servicios = 2
,		Servicios = 3
,		Bebidas_Servicios = 4
,		Precios = 5
,		Propiedades = 6;

var db = (function() {

var database = null	
,	arrTablas = [{ Tabla : 'Grupo_Bebidas', Indice : 'Id_G_Bebidas'
								  , CreacionTabla : 'CREATE TABLE IF NOT EXISTS Grupo_Bebidas (	\
														Id_G_Bebidas NUMERIC(3,0) PRIMARY KEY	\
													,	Nombre VARCHAR(150) UNIQUE	\
													);' }
				, {Tabla : 'Bebidas', Indice : 'Id_Bebidas'
							, CreacionTabla : 'CREATE TABLE IF NOT EXISTS Bebidas (	\
													Id_Bebida NUMERIC(3,0) PRIMARY KEY	\
												,	Id_G_Bebidas NUMERIC(3,0) REFERENCES 	\
														Grupo_Bebidas (Id_G_Bebida) ON DELETE SET NULL	\
												, 	Nombre VARCHAR(150) UNIQUE	\
												, 	Cantidad_Botella NUMERIC(5,0) NOT NULL	\
												, 	Cantidad_Stock NUMERIC(10,0) NULL	\
												);' }
				, {Tabla : 'Tipo_Servicios', Indice : 'Id_T_Servicio'
									, CreacionTabla : 'CREATE TABLE IF NOT EXISTS Tipo_Servicios (	\
															Id_T_Servicio NUMERIC(3,0) PRIMARY KEY	\
														,	Nombre VARCHAR(150) UNIQUE	\
														,	Cantidad NUMERIC(5,0) NOT NULL	\
														);'}
				, {Tabla : 'Servicios', Indice : 'Id_Servicio'
								, CreacionTabla : 'CREATE TABLE IF NOT EXISTS Servicios (	\
														Id_Servicio NUMERIC(15,0) PRIMARY KEY	\
													,	Id_T_Servicio NUMERIC(3,0) REFERENCES 	\
														Tipo_Servicios (Id_T_Servicio) ON DELETE SET NULL	\
													, 	Fecha DATETIME NOT NULL	\
													);' }
				, {Tabla : 'Bebidas_Servicios', Indice : 'CONVERT(VARCHAR,Id_Servicio)+CONVERT(VARCHAR,Id_Bebida)'
										, CreacionTabla: 'CREATE TABLE IF NOT EXISTS Bebida_Servicios (	\
															Id_Servicio NUMERIC(15,0) NOT NULL	\
														,	Id_Bebida NUMERIC(3,0) NOT NULL	\
														, 	PRIMARY KEY (Id_Servicio, Id_Bebida)	\
														, 	FOREIGN KEY (Id_Servicio) REFERENCES 	\
															Servicios(Id_Servicio) ON DELETE SET NULL	\
														, 	FOREIGN KEY (Id_Bebida) REFERENCES	\
																Bebidas(Id_Bebida) ON DELETE SET NULL	\
														);' }
				, {Tabla : 'Precios', Indice: 'CONVERT(VARCHAR,Id_G_Bebidas)+CONVERT(VARCHAR,Id_T_Servicio)'
								, CreacionTabla: 'CREATE TABLE IF NOT EXISTS Precios (	\
													Id_G_Bebidas NUMERIC(3,0)  NULL	\
												,	Id_T_Servicio NUMERIC(3,0) NOT NULL	\
												, 	Precio NUMERIC(5,2) NULL	\
												, 	Maximo NUMERIC(5,2) NULL	\
												,	Minimo NUMERIC(5,2) NULL	\
												, 	Tramo NUMERIC(5,2) NULL	\
												, 	PRIMARY KEY (Id_G_Bebidas, Id_T_Servicio)	\
												, 	FOREIGN KEY (Id_G_Bebidas) REFERENCES	\
														Grupo_Bebidas(Id_G_Bebidas) ON DELETE CASCADE	\
												, 	FOREIGN KEY (Id_T_Servicio) REFERENCES	\
														Tipo_Servicios(Id_T_Servicio) ON DELETE CASCADE	\
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
, 	isUndefined = function(obj) { 
						return obj === void 0;
						}
,   Resultado = function(){/* variable a utilizar para registrar los datos */
				
				var isUndefined = function(obj) { 
						return obj === void 0;
						};
				var ObResultados;
				return {
							ObtenerResultados : function(results){
								ObResultados = results
								}/* evento function(results) */
						,	SqlError : function (transaction, error){
								if (error.code==1){
									// DB Table already exists
								} else {
									// Error is a human-readable string.
									console.log('Error: '+error.message+'\nCode: '+error.code);
								}
								if(!isUndefined(ObResultados))
									ObResultados(null);
									
								return false;
							}
						,	SqlExito : function (transaction, results){
								console.log("Consulta SQL ejecutada con éxito");
								if(!isUndefined(ObResultados))
									ObResultados(results);
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
,	ExecSQL = function(/* Comando SQL */cmdSQL,/* evento resultante */ EvObtenerResultados){
		if(!database){
			console.log('Error: no se ha cargado ninguna base de datos');
			if(!isUndefined(EvObtenerResultados))
				EvObtenerResultados(null);
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
					, function(results){
						if(!isUndefined(EvObtenerNuevoId))
							if(results != null && results.rows.length > 0)
								EvObtenerNuevoId(results.rows.item(0).Cantidad);
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
		,	EjecutarSQL : ExecSQL
		,	Grupo_Bebidas : { 
								ObtenerDatosTabla : function(EvObtenerResultados){
									ObDatosTabla(arrTablas[Grupo_Bebidas], EvObtenerResultados);
								}
							,	ObtenerNuevoId : function(EvObtenerId){
									ObNuevoId(arrTablas[Grupo_Bebidas], EvObtenerId);
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
		,	Tipo_Servicios : { 
								ObtenerDatosTabla : function(EvObtenerResultados){
									ObDatosTabla(arrTablas[Tipo_Servicios], EvObtenerResultados);
								}
							,	ObtenerNuevoId : function(EvObtenerId){
									ObNuevoId(arrTablas[Tipo_Servicios], EvObtenerId);
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
									ObDatosTabla(arrTablas[Bebida_Servicios], EvObtenerResultados);
								}
							,	ObtenerNuevoId : function(EvObtenerId){
									ObNuevoId(arrTablas[Bebida_Servicios], EvObtenerId);
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

db.CrearBaseDeDatos();