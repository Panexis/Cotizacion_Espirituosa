/*
global.js
funciones globales para todo el programa

*/

const 	Grupos_Bebida = 0
,		Bebidas = 1
,		Tipos_Servicio = 2
,		Servicios = 3
,		Bebidas_Servicios = 4
,		Precios = 5
,		Propiedades = 6;

function isUndefined(obj) { 
	return obj === void 0;
}

function str_o_null(obj){
	if(obj == null || obj == "")
		return " NULL ";
	else
		return obj;
}

function null_o_str(obj){
	if(obj == null || obj == "null")
		return "";
	else
		return obj;
}

function eq_id_o_null(id){
	if(id == null || id == "")
		return " IS NULL ";
	else
		return " = " + id+" ";
}