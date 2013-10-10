
//Incluir los javascripts de los que dependo
document.write(
	'<script src="./js/global.js" type="text/javascript"></script>'+
	'<script src="./js/jquery.js" type="text/javascript"></script>'+
	'<script src="./js/bootstrap.js" type="text/javascript"></script>'+
	'<script src="./js/database.js" type="text/javascript" charset="utf-8"></script>'+
	'<script src="./js/stock.js" type="text/javascript" charset="utf-8"></script>'+
	'<script src="./js/servicios.js" type="text/javascript" charset="utf-8"></script>'+
	'<script src="./js/cotizacion.js" type="text/javascript" charset="utf-8"></script>'+
	'<script src="./js/servidor.js" type="text/javascript" charset="utf-8"></script>'+
	'<script src="./js/eventos.js" type="text/javascript" charset="utf-8"></script>');
	
var ArrayGruposBebida = [];
var ArrayTiposServicio = [];
	

function MostrarOpcionesxDefecto(){
	db.EjecutarSQL("SELECT Nombre, Valor FROM Propiedades"
		,	function(bExito, rowsArray){
			//mostrar en los precios por defecto en un div
			var html = "";
			for(var i = 0; i<rowsArray.length; i++)
				$("#Id_"+rowsArray[i][0]).val(null_o_str(rowsArray[i][1]));

		});
}

/********************** Tipos de Servicio ***********************/

function MostrarTiposServicio(){
	servicios.ListarTiposServicios(
		function(bExito, rowsArray){
			if(!bExito){
				return;
			}
			ArrayTiposServicio = rowsArray;
			$("#tabla_Tipos_Servicio").html("");
			$(".Select_Tipos_Servicio").html("");
			for(var i = 0; i < ArrayTiposServicio.length; i++){
				//vamos a rellenar la tabla de tipos de servicios
				$("#tabla_Tipos_Servicio").append('<tr> '+
								'<td><input type="text" id="Id_TS_'+ArrayTiposServicio[i][0]+'_Nombre" value="'+ArrayTiposServicio[i][1]+'"></td> '+
								'<td><input type="text" id="Id_TS_'+ArrayTiposServicio[i][0]+'_Cantidad" value="'+null_o_str(ArrayTiposServicio[i][2])+'" class="input-mini numerico"></td> '+
								'<td><input type="text" id="Id_TS_'+ArrayTiposServicio[i][0]+'_Precio" value="'+null_o_str(ArrayTiposServicio[i][3])+'" class="input-mini numerico"></td> '+
								'<td><input type="text" id="Id_TS_'+ArrayTiposServicio[i][0]+'_Maximo" value="'+null_o_str(ArrayTiposServicio[i][4])+'" class="input-mini numerico"></td> '+
								'<td><input type="text" id="Id_TS_'+ArrayTiposServicio[i][0]+'_Minimo" value="'+null_o_str(ArrayTiposServicio[i][5])+'" class="input-mini numerico"></td> '+
								'<td><input type="text" id="Id_TS_'+ArrayTiposServicio[i][0]+'_Tramo" value="'+null_o_str(ArrayTiposServicio[i][6])+'" class="input-mini numerico"></td> '+
								'<td class="boton" ><a class="btn" onClick="ModificarTiposServicios('+ArrayTiposServicio[i][0]+')"  href="javascript:void(0)"><i class="icon-refresh"></i> </a><a class="btn" onClick="EliminarTipoServicio('+ArrayTiposServicio[i][0]+')" href="javascript:void(0)"><i class="icon-minus"></i> </a></td> '+
							'</tr>  '
							);
				//añadir los elementos del selector
				
				$(".Select_Tipos_Servicio").append('<option value="'+ArrayTiposServicio[i][0]+'" ' + (ArrayTiposServicio[i][0] == $(".Select_Tipos_Servicio").attr("name") ? "selected=selected" : "") +" >"+ArrayTiposServicio[i][1]+"</option>");
				
			}
			$("#tabla_Tipos_Servicio").append('<tr> '+  
					'<td><input type="text" id="Id_NuevoTS_Nombre" value="" class="enfocar"></td>  '+
					'<td><input type="text" id="Id_NuevoTS_Cantidad" value="" class="input-mini numerico"></td> ' +
					'<td><input type="text" id="Id_NuevoTS_Precio" value="" class="input-mini numerico"></td> '+
					'<td><input type="text" id="Id_NuevoTS_Maximo" value="" class="input-mini numerico"></td> '+
					'<td><input type="text" id="Id_NuevoTS_Minimo" value="" class="input-mini numerico"></td> '+
					'<td><input type="text" id="Id_NuevoTS_Tramo" value="" class="input-mini numerico"></td> '+
					'<td class="boton" ><a class="btn" onClick="AnadirNuevoTipoServicio()" href="javascript:void(0)"><i class="icon-plus"></i> </a></td> '+
				'</tr> ');
			
	});
}

function RellenarSelectTiposServicio(){
	if(ArrayTiposServicio == [])
		MostrarTiposServicio();
	else{
		$(".Select_Tipos_Servicio").html("");
			for(var i = 0; i < ArrayTiposServicio.length; i++){
				$(".Select_Tipos_Servicio").append(function(){
					return '<option value="'+ArrayTiposServicio[i][0]+'" ' + (ArrayTiposServicio[i][0] == $(this).attr("name") ? "selected=selected" : "") +" >"+ArrayTiposServicio[i][1]+"</option>";
				});
			}
	}

}

function AnadirNuevoTipoServicio(){
	//Comprobar que haya datos en los campos copa y ml
	if($("#Id_NuevoTS_Nombre").val() == ""){
		alert("Debe indicar el nombre del tipo de servicio");
		return;
	}
	if($("#Id_NuevoTS_Cantidad").val() == ""){
		alert("Debe indicar la cantidad en ml que se gasta con este servicio");
		return;
	}
	
	//debo añadir el tipo de servicio
	servicios.AnadirTiposServicio($("#Id_NuevoTS_Nombre").val(), $("#Id_NuevoTS_Cantidad").val()
	, function(bExito, idTipoServicio){
		if(!bExito){
			//
			alert("No se ha podido añadir este tipo de servicio");
			return;
		}
		//Ha añadido cotización inicial de este tipo de servicio?
		if($("#Id_NuevoTS_Precio").val() != null)
			cotizacion.AnadirPrecioxTipoServicio(idTipoServicio, $("#Id_NuevoTS_Precio").val(), $("#Id_NuevoTS_Maximo").val(), $("#Id_NuevoTS_Minimo").val(), $("#Id_NuevoTS_Tramo").val()
			,	function (bExito){
				MostrarTiposServicio();
			});			
		else
			MostrarTiposServicio();
		$("#Id_NuevoTS_Nombre").focus();
	});

}

function ModificarTiposServicios(idTipoServicio){
	//Comprobar que haya datos en los campos copa y ml
	if($("#Id_TS_"+idTipoServicio+"_Nombre").val() == ""){
		alert("Debe indicar el nombre del tipo de servicio");
		return;
	}
	if($("#Id_TS_"+idTipoServicio+"_Cantidad").val() == ""){
		alert("Debe indicar la cantidad en ml que se gasta con este servicio");
		return;
	}

	servicios.ModificarTipoServicio(idTipoServicio, $("#Id_TS_"+idTipoServicio+"_Nombre").val(), $("#Id_TS_"+idTipoServicio+"_Cantidad").val()
		, function(bExito){
			if(!bExito){
				alert("No se ha podido modificar el tipo de servicio");
				return;
			}
			if($("#Id_TS_"+idTipoServicio+"_Precio").val()!=null)
				cotizacion.ComprobarSiExistePrecio(null, idTipoServicio
					, function(bExito){
						if(bExito)
							cotizacion.ModificarPrecio(null, idTipoServicio,$("#Id_NuevoTSPrecio").val(), $("#Id_NuevoTSMaximo").val(), $("#Id_NuevoTSMinimo").val(), $("#Id_NuevoTSTramo").val()
							,	function (bExito){
									MostrarTiposServicio();
							});
						else 
							cotizacion.AnadirPrecioxTipoServicio(idTipoServicio, $("#Id_NuevoTSPrecio").val(), $("#Id_NuevoTSMaximo").val(), $("#Id_NuevoTSMinimo").val(), $("#Id_NuevoTSTramo").val()
							,	function (bExito){
							MostrarTiposServicio();
							});
					});			
			else
				MostrarTiposServicio();
	});
}

function EliminarTipoServicio(idTipoServicio){
	servicios.QuitarTiposServicio(idTipoServicio
		, function(bExito){
			if(!bExito){
				alert("No se ha podido eliminar el tipo de servicio");
				return;
			}		
		MostrarTiposServicio();
	});
}

/**********************************************************************/

function MostrarGruposBebida(){
	stock.ListarGruposBebida(function(bExito, rowsArray){
		if(!bExito){
			return;
		}
		ArrayGruposBebida = rowsArray;
		//debo añadir el grupo de bebidas que he recibido por el ArrayGruposBebida
		$("#tabla_Grupos_Bebida").html("");
		for(var i = 0; i<ArrayGruposBebida.length; i++){
			$("#tabla_Grupos_Bebida").append(
				'<tr id="TR_'+ArrayGruposBebida[i].idGrupoBebida+'"> '+
				'	<td><input type="text" id="Id_'+ArrayGruposBebida[i].idGrupoBebida+'_Nombre" value="'+ArrayGruposBebida[i].Nombre+'" class="input-block-level"></td>'+
				'	<td class="boton" ><a class="btn" onClick="ModificarGrupoBebida('+ArrayGruposBebida[i].idGrupoBebida+')"  href="javascript:void(0)"><i class="icon-refresh" ></i> </a><a class="btn" onClick="EliminarGrupoBebida('+ArrayGruposBebida[i].idGrupoBebida+')" href="javascript:void(0)"><i class="icon-minus"></i> </a></td>'+
				'<td style="text-align:left;">'+
				' <a class="m_GB" href="javascript:void(0)" onClick="mostrarOcultarBebida('+ArrayGruposBebida[i].idGrupoBebida+')">[ '+
				'<span id="mas_Bebidas_'+ArrayGruposBebida[i].idGrupoBebida+'">+</span> ] Bebidas</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
				' <a class="m_GB" href="javascript:void(0)" onClick="mostrarOcultarTS('+ArrayGruposBebida[i].idGrupoBebida+')">[ '+
				'<span id="mas_TS_'+ArrayGruposBebida[i].idGrupoBebida+'">+</span> ] Precios por Tipo Servicios</a>'+
				'</td> '+
				'</tr></td>'+
				'<tr id="Id_TR_TS_'+ArrayGruposBebida[i].idGrupoBebida+'" style="display:none;">'+
				'<td></td><td colspan="2"><table class="in_tabla" style="min-width: 500px;">'+
				'<!-- <caption onClick="mostrarOcultarTS('+ArrayGruposBebida[i].idGrupoBebida+')"><i class="icon-chevron-down " id="i_HTS_'+ArrayGruposBebida[i].idGrupoBebida+'"></i> Precios por Tipo de Servicio</caption> --!>'+
				'<thead id="Id_HTS_'+ArrayGruposBebida[i].idGrupoBebida+'"><tr><th>Nombre</th><th>Precio</th><th>M&aacute;ximo</th><th>M&iacute;nimo</th><th>Tramo</th><th></th></tr></thead><tbody id="Sub_Tabla_Precios_'+ArrayGruposBebida[i].idGrupoBebida+'"></tbody></table></td></tr>'+
				'<tr id="Id_TR_Bebidas_'+ArrayGruposBebida[i].idGrupoBebida+'" style="display:none;">'+
				'<td></td><td colspan="2"><table class="in_tabla" style="min-width: 370px;">'+
				'<!--<caption onClick="mostrarOcultarBebida('+ArrayGruposBebida[i].idGrupoBebida+')" > <i class="icon-chevron-down" id="i_HBebidas_'+ArrayGruposBebida[i].idGrupoBebida+'"> </i>Bebidas</caption>--!>'+
				'<thead id="Id_HBebidas_'+ArrayGruposBebida[i].idGrupoBebida+'"><tr><th>Nombre</th><th>ml/Botella</th><th></th></tr></thead><tbody id="Sub_Tabla_Bebidas_'+ArrayGruposBebida[i].idGrupoBebida+'"></tbody></table></td></tr>'
			);
			//debo añadir una tabla con los tipos de servicios
			MostrarPreciosGruposBebida(ArrayGruposBebida[i]);
			MostrarBebidasGruposBebida(ArrayGruposBebida[i]);
		}
		$("#tabla_Grupos_Bebida").append('<tr><td><input type="text"  id="Id_NuevoGB_Nombre" value="" class="input-block-level"></td> ' +
			'<td class="boton" ><a class="btn AddGB" onClick="AnadirGrupoBebida()" onBlur="'+"$('#Id_NuevoGB_Nombre').focus();"+'" href="javascript:void(0)"><i class="icon-plus"></i> </a></td> </tr>');
	});
}

function MostrarPreciosGruposBebida(oGrupoBebida){
	if(oGrupoBebida == null) return;
	oGrupoBebida.ListarPrecios(function(bExito, Precios){
		if(!bExito)
			return;
			alert($("#Sub_Tabla_Precios_"+oGrupoBebida.idGrupoBebida));
		$("#Sub_Tabla_Precios_"+oGrupoBebida.idGrupoBebida).html("");
		for(var i = 0; i<Precios.length; i++)
			$("#Sub_Tabla_Precios_"+oGrupoBebida.idGrupoBebida).append('<tr> '+
							'<td><select id="Id_'+oGrupoBebida.idGrupoBebida+"_"+Precios[i][0]+'_Nombre" name="'+Precios[i][0]+'"  class="Select_Tipos_Servicio disabled"></td> '+
							'<td><input type="text" id="Id_'+oGrupoBebida.idGrupoBebida+"_"+Precios[i][0]+'_Precio" value="'+null_o_str(Precios[i][2])+'" class="input-mini numerico"></td> '+
							'<td><input type="text" id="Id_'+oGrupoBebida.idGrupoBebida+"_"+Precios[i][0]+'_Maximo" value="'+null_o_str(Precios[i][3])+'" class="input-mini numerico"></td> '+
							'<td><input type="text" id="Id_'+oGrupoBebida.idGrupoBebida+"_"+Precios[i][0]+'_Minimo" value="'+null_o_str(Precios[i][4])+'" class="input-mini numerico"></td> '+
							'<td><input type="text" id="Id_'+oGrupoBebida.idGrupoBebida+"_"+Precios[i][0]+'_Tramo" value="'+null_o_str(Precios[i][5])+'" class="input-mini numerico"></td> '+
							'<td class="boton" ><a class="btn" onClick="ModificarTSGB('+oGrupoBebida.idGrupoBebida+','+Precios[i][0]+')"  href="javascript:void(0)"><i class="icon-refresh"></i> </a><a class="btn" onClick="EliminarTSGB('+oGrupoBebida.idGrupoBebida+','+Precios[i][0]+')" href="javascript:void(0)"><i class="icon-minus"></i> </a></td> '+
						'</tr>  '
						);
		$("#Sub_Tabla_Precios_"+oGrupoBebida.idGrupoBebida).append('<tr> '+  
				'<td><select id="Id_TS_ID_'+oGrupoBebida.idGrupoBebida+'" class="Select_Tipos_Servicio"></select></td>  '+
				'<td><input type="text" name="NuevoPrecio" id="Id_TS_Precio_'+oGrupoBebida.idGrupoBebida+'" value="" class="input-mini numerico"></td> '+
				'<td><input type="text" name="NuevoMaximo" id="Id_TS_Maximo_'+oGrupoBebida.idGrupoBebida+'" value="" class="input-mini numerico"></td> '+
				'<td><input type="text" name="NuevoMinimo" id="Id_TS_Minimo_'+oGrupoBebida.idGrupoBebida+'" value="" class="input-mini numerico"></td> '+
				'<td><input type="text" name="NuevoTramo" id="Id_TS_Tramo_'+oGrupoBebida.idGrupoBebida+'" value="" class="input-mini numerico"></td> '+
				'<td class="boton" ><a class="btn" onClick="AnadirTSGB('+oGrupoBebida.idGrupoBebida+')" href="javascript:void(0)"><i class="icon-plus"></i> </a></td> '+
			'</tr>');
		RellenarSelectTiposServicio();
	});
}

function MostrarBebidasGruposBebida(oGrupoBebida){
	if(oGrupoBebida == null) return;
	oGrupoBebida.ListarBebidas(function(bExito, Bebidas){
		if(!bExito)
			return;
		$("#Sub_Tabla_Bebidas_"+oGrupoBebida.idGrupoBebida).html("");
		for(var i = 0; i<Bebidas.length; i++)
			$("#Sub_Tabla_Bebidas_"+oGrupoBebida.idGrupoBebida).append('<tr> '+
				'<td><input type="text" id="Id_Bebida_'+Bebidas[i][0]+'_Nombre" value="'+Bebidas[i][1]+'" /></td>'+
				'<td><input type="text" id="Id_Bebida_'+Bebidas[i][0]+'_Cantidad_Botella" value="'+null_o_str(Bebidas[i][2])+'" class="input-mini numerico" /></td>'+
				'<td class="boton" ><a class="btn" onClick="ModificarBebida('+oGrupoBebida.idGrupoBebida+','+Bebidas[i][0]+')"  href="javascript:void(0)"><i class="icon-refresh"></i> </a><a class="btn" onClick="EliminarBebida('+oGrupoBebida.idGrupoBebida+','+Bebidas[i][0]+')" href="javascript:void(0)"><i class="icon-minus"></i> </a></td>'+
				'</tr>');
		$("#Sub_Tabla_Bebidas_"+oGrupoBebida.idGrupoBebida).append('<tr>'+
				'<td><input type="text" id="Id_Bebida_Nombre_'+oGrupoBebida.idGrupoBebida+'" value="" /></td>'+
				'<td><input type="text" id="Id_Bebida_Cantidad_Botella_'+oGrupoBebida.idGrupoBebida+'" value="" class="input-mini numerico" /></td>'+
				'<td class="boton" ><a class="btn" onClick="AnadirBebida('+oGrupoBebida.idGrupoBebida+')" href="javascript:void(0)"><i class="icon-plus"></i></a></td>'+
				'</tr>');

	});

}

function AnadirGrupoBebida(){
	//debe introducir
	if($("#Id_NuevoGB_Nombre").val() == ""){
		alert("Debe indicar el nombre del grupo de bebidas (Whisky, Ginebra,...,)");
		return;
	}
	
	stock.AnadirGrupoBebida($("#Id_NuevoGB_Nombre").val()
		, function(bExito,id){
			if(bExito){
				//Añadir al array de grupo de bebidas un nuevo objeto a listar 
				var i = ArrayGruposBebida.length;
				ArrayGruposBebida[i] = stock.CrearCGrupoBebida();
				ArrayGruposBebida[i].idGrupoBebida = id;
				ArrayGruposBebida[i].Nombre = $("#Id_NuevoGB_Nombre").val();
				//Eliminar esta fila
				$("#tabla_Grupos_Bebida tr:last").remove();
				//añadir una nueva fila con nuestros resultados
				$("#tabla_Grupos_Bebida").append(
					'<tr id="TR_'+ArrayGruposBebida[i].idGrupoBebida+'"> '+
					'	<td><input type="text" id="Id_'+ArrayGruposBebida[i].idGrupoBebida+'_Nombre" value="'+ArrayGruposBebida[i].Nombre+'" class="input-block-level"></td>'+
					'	<td class="boton" ><a class="btn" onClick="ModificarGrupoBebida('+ArrayGruposBebida[i].idGrupoBebida+')"  href="javascript:void(0)"><i class="icon-refresh" ></i> </a><a class="btn" onClick="EliminarGrupoBebida('+ArrayGruposBebida[i].idGrupoBebida+')" href="javascript:void(0)"><i class="icon-minus"></i> </a></td>'+
					'<td style="text-align:left;">'+
					' <a class="m_GB" href="javascript:void(0)" onClick="mostrarOcultarBebida('+ArrayGruposBebida[i].idGrupoBebida+')">[ '+
					'<span id="mas_Bebidas_'+ArrayGruposBebida[i].idGrupoBebida+'">+</span> ] Bebidas</a>&nbsp;&nbsp;&nbsp;&nbsp;'+
					' <a class="m_GB" href="javascript:void(0)" onClick="mostrarOcultarTS('+ArrayGruposBebida[i].idGrupoBebida+')">[ '+
					'<span id="mas_TS_'+ArrayGruposBebida[i].idGrupoBebida+'">+</span> ] Precios por Tipo Servicios</a>'+
					'</td> '+
					'</tr></td>'+
					'<tr id="Id_TR_TS_'+ArrayGruposBebida[i].idGrupoBebida+'" style="display:none;">'+
					'<td></td><td colspan="2"><table class="in_tabla" style="min-width: 500px;">'+
					'<!-- <caption onClick="mostrarOcultarTS('+ArrayGruposBebida[i].idGrupoBebida+')"><i class="icon-chevron-down " id="i_HTS_'+ArrayGruposBebida[i].idGrupoBebida+'"></i> Precios por Tipo de Servicio</caption> --!>'+
					'<thead id="Id_HTS_'+ArrayGruposBebida[i].idGrupoBebida+'"><tr><th>Nombre</th><th>Precio</th><th>M&aacute;ximo</th><th>M&iacute;nimo</th><th>Tramo</th><th></th></tr></thead><tbody id="Sub_Tabla_Precios_'+ArrayGruposBebida[i].idGrupoBebida+'"></tbody></table></td></tr>'+
					'<tr id="Id_TR_Bebidas_'+ArrayGruposBebida[i].idGrupoBebida+'" style="display:none;">'+
					'<td></td><td colspan="2"><table class="in_tabla" style="min-width: 370px;">'+
					'<!--<caption onClick="mostrarOcultarBebida('+ArrayGruposBebida[i].idGrupoBebida+')" > <i class="icon-chevron-down" id="i_HBebidas_'+ArrayGruposBebida[i].idGrupoBebida+'"> </i>Bebidas</caption>--!>'+
					'<thead id="Id_HBebidas_'+ArrayGruposBebida[i].idGrupoBebida+'"><tr><th>Nombre</th><th>ml/Botella</th><th></th></tr></thead><tbody id="Sub_Tabla_Bebidas_'+ArrayGruposBebida[i].idGrupoBebida+'"></tbody></table></td></tr>'
				);
				MostrarPreciosGruposBebida(ArrayGruposBebida[i]);
				MostrarBebidasGruposBebida(ArrayGruposBebida[i]);
				$("#tabla_Grupos_Bebida").append('<tr><td><input type="text"  id="Id_NuevoGB_Nombre" value="" class="input-block-level"></td> ' +
					'<td class="boton" ><a class="btn AddGB" onClick="AnadirGrupoBebida()" href="javascript:void(0)"><i class="icon-plus"></i> </a></td> </tr>');
				}
			else
				alert("No se ha podido realizar esta operación");
		});
}

function ModificarGrupoBebida(idGrupoBebida){
	stock.ModificarGrupoBebida(idGrupoBebida, $("Id_'"+idGrupoBebida+"_Nombre").val()
		, function(bExito){
			if(!bExito)
				alert("No se ha podido realizar la modificación");
		});
}

function EliminarGrupoBebida(idGrupoBebida){
	stock.QuitarGrupoBebida(idGrupoBebida
		, function(bExito){
			if(!bExito){
				alert("No se ha podido realizar la operación");
				return;
			}
			$("#TR_"+idGrupoBebida).remove();
			$("#Id_TR_TS_"+idGrupoBebida).remove();
			$("#Id_TR_Bebidas_"+idGrupoBebida).remove();
			obtGrupoBebida(idGrupoBebida).idGrupoBebida = -1;
		});		
}

function obtGrupoBebida(idGrupoBebida){
	for(var i = 0; i<ArrayGruposBebida.length; i++)
		if(idGrupoBebida == ArrayGruposBebida[i].idGrupoBebida) 
			return ArrayGruposBebida[i];
	return null;
}

function AnadirTSGB(idGrupoBebida){
	//debe introducir un tipo de servicio
	if($("#Id_TS_ID_"+idGrupoBebida).val() == null){
		alert("Debe seleccionar un tipo de servicio");
		return;
	}
	if($("#Id_TS_Precio_"+idGrupoBebida).val() == null){
		alert("Debe indicar al menos un precio");
		return;
	}
	
	//añadimos la cotizacion
	cotizacion.AnadirPrecio(idGrupoBebida, $("#Id_TS_ID_"+idGrupoBebida).val(), $("#Id_TS_Precio_"+idGrupoBebida).val(),$("#Id_TS_Maximo_"+idGrupoBebida).val(),$("#Id_TS_Minimo_"+idGrupoBebida).val(),$("#Id_TS_Tramo_"+idGrupoBebida).val()
		, function(bExito){
			if(bExito)
				MostrarPreciosGruposBebida(obtGrupoBebida(idGrupoBebida));
			else
				alert("No se ha podido realizar esta operación");
		});

}

function ModificarTSGB(idGrupoBebida, idTipoServicio){
	if($("#Id_"+idGrupoBebida+"_"+idTipoServicio+"_Precio").val() == null){
		alert("Debe indicar un precio, para poder modificarlo");
		return;
	}
	
	cotizacion.ModificarPrecioxGrupoBebida(idGrupoBebida, idTipoServicio, $("#Id_"+idGrupoBebida+"_"+idTipoServicio+"_Nombre").val(),$("#Id_"+idGrupoBebida+"_"+idTipoServicio+"_Precio").val(), $("#Id_"+idGrupoBebida+"_"+idTipoServicio+"_Maximo").val(), $("#Id_"+idGrupoBebida+"_"+idTipoServicio+"_Minimo").val(), $("#Id_"+idGrupoBebida+"_"+idTipoServicio+"_Tramo").val()
		, function(bExito){
			if(!bExito){
				alert("No se ha podido realizar la modificación");
				return;
			}
			
			MostrarPreciosGruposBebida(obtGrupoBebida(idGrupoBebida));
	});		

}

function EliminarTSGB(idGrupoBebida, idTipoServicio){
	cotizacion.QuitarPrecio(idGrupoBebida, idTipoServicio
		, function(bExito){
			if(!bExito){
				alert("No se ha podido eliminar el registro.");
				return;
			}
			
			MostrarPreciosGruposBebida(obtGrupoBebida(idGrupoBebida));
			
		});		
}

function AnadirBebida(idGrupoBebida){
	if($("#Id_Bebida_Nombre_"+idGrupoBebida).val() == null){
		alert("Debe introducir al menos el nombre de la bebida");
		return;
	}
	
	stock.AnadirBebida(idGrupoBebida, $("#Id_Bebida_Nombre_"+idGrupoBebida).val(), $("#Id_Bebida_Cantidad_Botella_"+idGrupoBebida).val()
		,	function(bExito, id){
			if(bExito)
				MostrarBebidasGruposBebida(obtGrupoBebida(idGrupoBebida));
			else
				alert("No se ha podido realizar esta operación");

		});
}

function ModificarBebida(idGrupoBebida, idBebida){
	if($("#Id_Bebida_"+idBebida+"_Nombre").val() == null){
		alert("Debe introducir al menos el nombre de la bebida");
		return;
	}
	
	stock.ModificarBebida(idBebida, $("#Id_Bebida_"+idBebida+"_Nombre").val(), $("#Id_Bebida_"+idBebida+"_Cantidad_Botella").val()
		, function(bExito){
			if(bExito)
				MostrarBebidasGruposBebida(obtGrupoBebida(idGrupoBebida));
			else
				alert("No se ha podido realizar esta operación");
		});
}

function EliminarBebida(idGrupoBebida, idBebida){
	
	stock.QuitarBebida(idBebida
		, function(bExito){
			if(bExito)
				MostrarBebidasGruposBebida(obtGrupoBebida(idGrupoBebida));
			else
				alert("No se ha podido realizar esta operación");
		});
}


function mostrarOcultarTS(id){
	
	$("#Id_TR_Bebidas_"+id).hide(250
	, function(){
			$("#mas_Bebidas_"+id).html("+");
			
			if($("#Id_TR_TS_"+id).css("display") == "none"){
				$("#Id_TR_TS_"+id).show(250);
				$("#mas_TS_"+id).html("-");
			} else {				
				$("#Id_TR_TS_"+id).hide(250);
				$("#mas_TS_"+id).html("+");
			}
		}
	);
	
	
}

function mostrarOcultarBebida(id){
	$("#Id_TR_TS_"+id).hide(250
	, function(){
		$("#mas_TS_"+id).html("+");
		if($("#Id_TR_Bebidas_"+id).css("display") == "none"){
			$("#Id_TR_Bebidas_"+id).show(250);
			$("#mas_Bebidas_"+id).html("-");
			}
		else {
			$("#Id_TR_Bebidas_"+id).hide(250);
			$("#mas_Bebidas_"+id).html("+");
			}
		}
	);
	 
}