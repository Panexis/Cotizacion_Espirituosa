CREATE TABLE Valores_x_Defecto (
	Precio NUMERIC(5,2) NOT NULL
,	Maximo NUMERIC(5,2) NOT NULL
,	Minimo NUMERIC(5,2) NOT NULL
,	Tramo NUMERIC(5,2) NOT NULL
, 	Cantidad_Botellas NUMERIC(5,0) NOT NULL
, 	Cantidad_Stock NUMERIC(10,0) NOT NULL
);


CREATE TABLE Grupo_Bebidas (
	Id_G_Bebidas NUMERIC(3,0) PRIMARY KEY
,	Nombre VARCHAR(150) UNIQUE
);

CREATE TABLE Bebidas (
	Id_Bebida NUMERIC(3,0) PRIMARY KEY
,	Id_G_Bebidas NUMERIC(3,0) REFERENCES 
Grupo_Bebidas (Id_G_Bebida) ON DELETE SET NULL
, 	Nombre VARCHAR(150) UNIQUE
, 	Cantidad_Botella NUMERIC(5,0) NOT NULL
, 	Cantidad_Stock NUMERIC(10,0) NULL
);

CREATE TABLE Tipo_Servicios (
	Id_T_Servicio NUMERIC(3,0) PRIMARY KEY
,	Nombre VARCHAR(150) UNIQUE
,	Cantidad NUMERIC(5,0) NOT NULL
);

CREATE TABLE Servicios (
	Id_Servicio NUMERIC(15,0) PRIMARY KEY
,	Id_T_Servicio NUMERIC(3,0) REFERENCES 
		Tipo_Servicios (Id_T_Servicio) ON DELETE SET NULL
, 	Fecha DATETIME NOT NULL
);

CREATE TABLE Bebida_Servicios (
	Id_Servicio NUMERIC(15,0) NOT NULL
,	Id_Bebida NUMERIC(3,0) NOT NULL
, 	PRIMARY KEY (Id_Servicio, Id_Bebida)
, 	FOREIGN KEY (Id_Servicio) REFERENCES 
Servicios(Id_Servicio) ON DELETE SET NULL
, 	FOREIGN KEY (Id_Bebida) REFERENCES
		Bebidas(Id_Bebida) ON DELETE SET NULL
);

CREATE TABLE Precios (
	Id_G_Bebidas NUMERIC(3,0) NOT NULL
,	Id_T_Servicio NUMERIC(3,0) NOT NULL
, 	Precio NUMERIC(5,2) NULL
, 	Maximo NUMERIC(5,2) NULL
,	Minimo NUMERIC(5,2) NULL
, 	Tramo NUMERIC(5,2) NULL
, 	PRIMARY KEY (Id_G_Bebidas, Id_T_Servicio)
, 	FOREIGN KEY (Id_G_Bebidas) REFERENCES
		Grupo_Bebidas(Id_G_Bebidas) ON DELETE SET NULL
, 	FOREIGN KEY (Id_T_Servicio) REFERENCES
		Tipo_Servicios(Id_T_Servicio) ON DELETE SET NULL
);