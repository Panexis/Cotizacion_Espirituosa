/*
Objeto Base de datos 
Al crear este objeto a la base de datos de nuestro programa
Autor Jose Angel Navarro
*/

var db = (function() {

	var cmdCreacionTabas = ' \
	\
	CREATE TABLE IF NOT EXISTS  Propiedades \
	( \
		Nombre VARCHAR(150) PRIMARY KEY \
	,	Valor VARCHAR(300) NULL \
	);	\
		\
		\
	CREATE TABLE IF NOT EXISTS Grupo_Bebidas (	\
		Id_G_Bebidas NUMERIC(3,0) PRIMARY KEY	\
	,	Nombre VARCHAR(150) UNIQUE	\
	);	\
		\
	CREATE TABLE IF NOT EXISTS Bebidas (	\
		Id_Bebida NUMERIC(3,0) PRIMARY KEY	\
	,	Id_G_Bebidas NUMERIC(3,0) REFERENCES 	\
	Grupo_Bebidas (Id_G_Bebida) ON DELETE SET NULL	\
	, 	Nombre VARCHAR(150) UNIQUE	\
	, 	Cantidad_Botella NUMERIC(5,0) NOT NULL	\
	, 	Cantidad_Stock NUMERIC(10,0) NULL	\
	);	\
		\
	CREATE TABLE IF NOT EXISTS Tipo_Servicios (	\
		Id_T_Servicio NUMERIC(3,0) PRIMARY KEY	\
	,	Nombre VARCHAR(150) UNIQUE	\
	,	Cantidad NUMERIC(5,0) NOT NULL	\
	);	\
		\
	CREATE TABLE IF NOT EXISTS Servicios (	\
		Id_Servicio NUMERIC(15,0) PRIMARY KEY	\
	,	Id_T_Servicio NUMERIC(3,0) REFERENCES 	\
			Tipo_Servicios (Id_T_Servicio) ON DELETE SET NULL	\
	, 	Fecha DATETIME NOT NULL	\
	);	\
		\
	CREATE TABLE IF NOT EXISTS Bebida_Servicios (	\
		Id_Servicio NUMERIC(15,0) NOT NULL	\
	,	Id_Bebida NUMERIC(3,0) NOT NULL	\
	, 	PRIMARY KEY (Id_Servicio, Id_Bebida)	\
	, 	FOREIGN KEY (Id_Servicio) REFERENCES 	\
	Servicios(Id_Servicio) ON DELETE SET NULL	\
	, 	FOREIGN KEY (Id_Bebida) REFERENCES	\
			Bebidas(Id_Bebida) ON DELETE SET NULL	\
	);	\
		\
	CREATE TABLE IF NOT EXISTS Precios (	\
		Id_G_Bebidas NUMERIC(3,0) NOT NULL	\
	,	Id_T_Servicio NUMERIC(3,0) NOT NULL	\
	, 	Precio NUMERIC(5,2) NULL	\
	, 	Maximo NUMERIC(5,2) NULL	\
	,	Minimo NUMERIC(5,2) NULL	\
	, 	Tramo NUMERIC(5,2) NULL	\
	, 	PRIMARY KEY (Id_G_Bebidas, Id_T_Servicio)	\
	, 	FOREIGN KEY (Id_G_Bebidas) REFERENCES	\
			Grupo_Bebidas(Id_G_Bebidas) ON DELETE SET NULL	\
	, 	FOREIGN KEY (Id_T_Servicio) REFERENCES	\
			Tipo_Servicios(Id_T_Servicio) ON DELETE SET NULL	\
	);	'
,	cmdInsertValoresxDefecto = 
   "INSERT INTO Propiedades VALUES('Precio','3.5'); \
	INSERT INTO Propiedades VALUES('Maximo', '4'); \
	INSERT INTO Propiedades VALUES('Minimo', '2'); \
	INSERT INTO Propiedades VALUES('Tramo', '0.1'); \
	INSERT INTO Propiedades VALUES('Cantidad_Botella','1000'); \
	INSERT INTO Propiedades VALUES('Cantidad_Stock', '5000'); \
	INSERT INTO Propiedades VALUES('ServidorPHP', 'http://localhost/cotizacion_espirituosa');"
,	CrearTablas = function () {
		html5sql.process(cmdCreacionTabas, SqlExito, CapturarError);
		html5sql.process(cmdInsertValoresxDefecto, SqlExito, CapturarError);
	}
,	CapturarError = function (error, sentencia){
		if (error.code==1){
			// DB Table already exists
		} else {
			// Error is a human-readable string.
			console.log('Error: '+error.message+'\nSQL:'+sentencia+'\nCode: '+error.code);
		}
		return false;
	}
,	SqlExito = function (){
		console.log("Consulta SQL ejecutada");
	}
,	isUndefined = function(obj) { // From Underscore.js
		    return obj === void 0;
		}
,	doNothing = function () {}
,	emptyArray = [];
	//retorna una estructura { nombre: valor, nombre2:valor2,...}
	return {
	
		CrearBaseDeDatos : function () {
			try {
				if (!window.openDatabase) {
					alert('No se puede gestionar los datos desde este explorador.\nAconsejamos que utilice Google Chrome');
				} else {
					var nombre = 'CotizacionEspirituosa.db';
					var descripcion = 'Cotizacion Espirituosa';
					var maxSize = 5*1024*1024; // 5 MBytes
					html5sql.openDatabase(nombre, descripcion , maxSize);
					CrearTablas();
				}
			} catch(e) {
				console.log("Error desconocido: "+ e +".");
				return;
			} 
		},
	
		ejecutarSQL : function(comandoSQL, fnExito, fnError){
								
			if(isUndefined(fnExito))
				fnExito = SqlExito;
			if(isUndefined(fnError))
				fnError = CapturarError;
			html5sql.process(comandoSQL, fnExito, fnError)
		}
	}
	
})();

db.CrearBaseDeDatos();