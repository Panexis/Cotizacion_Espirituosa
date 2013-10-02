/*
Creación y gestión de la base de datos
Escrito por José Ángel Navarro (janmbaco@gmail.com)
Dependencias:
jQuery.js
*/

var cmdCreacionTabas = ' \
\
CREATE TABLE IF NOT EXISTS Valores_x_Defecto (	\
	Precio NUMERIC(5,2) NOT NULL	\
,	Maximo NUMERIC(5,2) NOT NULL	\
,	Minimo NUMERIC(5,2) NOT NULL	\
,	Tramo NUMERIC(5,2) NOT NULL	\
, 	Cantidad_Botellas NUMERIC(5,0) NOT NULL	\
, 	Cantidad_Stock NUMERIC(10,0) NOT NULL	\
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
);	';

var cmdInsertValoresxDefecto = 'INSERT INTO Valores_x_Defecto VALUES(3.5,4.5,2.5,0.1,1000,5000)';

var db = html5sql;

function CrearBaseDeDatos() {
		try {
	    if (!window.openDatabase) {
	        alert('No se puede gestionar los datos desde este explorador.\nAconsejamos que utilice Google Chrome');
	    } else {
	        var nombre = 'CotizacionEspirituosa.db';
	        var descripcion = 'Cotizacion Espirituosa';
	        var maxSize = 5*1024*1024; // 5 MBytes
	        db.openDatabase(nombre, descripcion , maxSize);
			CrearTablas();
	    }
	} catch(e) {
		console.log("Error desconocido: "+ e +".");
	    return;
	} 
}

function CrearTablas() {
	db.process(cmdCreacionTabas, nullDataHandler, errorHandler);
}

function errorHandler(error, sentencia){
 	if (error.code==1){
 		// DB Table already exists
 	} else {
    	// Error is a human-readable string.
	    console.log('Error: '+error.message+' (Code '+error.code+')');
 	}
    return false;
}


function nullDataHandler(){
	console.log("SQL Query Succeeded");
}
