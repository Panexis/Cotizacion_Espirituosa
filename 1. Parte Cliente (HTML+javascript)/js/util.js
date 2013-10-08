const 	Grupo_Bebidas = 0
,		Bebidas = 1
,		Tipos_Servicio = 2
,		Servicios = 3
,		Bebidas_Servicios = 4
,		Precios = 5
,		Propiedades = 6;

function isUndefined(obj) { 
	return obj === void 0;
}

function MostrarOpcionesxDefecto(){
	db.EjecutarSQL("SELECT Nombre, Valor FROM Propiedades"
		,	function(bExito, rowsArray){
			//mostrar en los precios por defecto en un div
			var html = "";
			for(var i = 0; i<rowsArray.length; i++)
				$("#Id_"+rowsArray[i][0]).val(rowsArray[i][1]);

		});
}

/********************** Tipos de Servicio ***********************/

function MostrarTiposServicio(){
	servicios.ListarTiposServicios(
		function(bExito, rowsArray){
			if(!bExito){
				return;
			}
			$("#tabla_Tipos_Servicio").html("");
			for(var i = 0; i < rowsArray.length; i++){
				//vamos a rellenar la tabla de tipos de servicios
				$("#tabla_Tipos_Servicio").append('<tr> '+
								'<td><input type="text" id="Id_'+rowsArray[i][0]+'_Nombre" value="'+rowsArray[i][1]+'"></td> '+
								'<td><input type="text" id="Id_'+rowsArray[i][0]+'_Cantidad" value="'+rowsArray[i][2]+'" class="input-mini numerico"></td> '+
								'<td><input type="text" id="Id_'+rowsArray[i][0]+'_Precio" value="'+rowsArray[i][3]+'" class="input-mini numerico"></td> '+
								'<td><input type="text" id="Id_'+rowsArray[i][0]+'_Maximo" value="'+rowsArray[i][4]+'" class="input-mini numerico"></td> '+
								'<td><input type="text" id="Id_'+rowsArray[i][0]+'_Minimo" value="'+rowsArray[i][5]+'" class="input-mini numerico"></td> '+
								'<td><input type="text" id="Id_'+rowsArray[i][0]+'_Tramo" value="'+rowsArray[i][6]+'" class="input-mini numerico"></td> '+
								'<td class="boton" ><a class="btn" onClick="ModificarTiposServicios('+rowsArray[i][0]+')"  href="javascript:void(0)"><i class="icon-refresh"></i> </a><a class="btn" onClick="EliminarTipoServicio('+rowsArray[i][0]+')" href="javascript:void(0)"><i class="icon-minus"></i> </a></td> '+
							'</tr>  '
							);
				//añadir los elementos del selector
				$(".Select_Tipos_Servicio").append('<option value="'+rowsArray[i][0]+'"'
				
			}
			$("#tabla_Tipos_Servicio").append('<tr> '+  
					'<td><input type="text" name="NuevoServicio" id="Id_NuevoTSNombre" value=""></td>  '+
					'<td><input type="text" name="NuevoCantidad" id="Id_NuevoTSCantidad" value="" class="input-mini numerico"></td> ' +
					'<td><input type="text" name="NuevoPrecio" id="Id_NuevoTSPrecio" value="" class="input-mini numerico"></td> '+
					'<td><input type="text" name="NuevoMaximo" id="Id_NuevoTSMaximo" value="" class="input-mini numerico"></td> '+
					'<td><input type="text" name="NuevoMinimo" id="Id_NuevoTSMinimo" value="" class="input-mini numerico"></td> '+
					'<td><input type="text" name="NuevoTramo" id="Id_NuevoTSTramo" value="" class="input-mini numerico"></td> '+
					'<td class="boton" ><a class="btn" onClick="AnadirNuevoTipoServicio()" href="javascript:void(0)"><i class="icon-plus"></i> </a></td> '+
				'</tr> ');
			
	});
}

function AnadirNuevoTipoServicio(){
	//Comprobar que haya datos en los campos copa y ml
	if($("#Id_NuevoTSNombre").val() == ""){
		alert("Debe indicar el nombre del tipo de servicio");
		return;
	}
	if($("#Id_NuevoTSCantidad").val() == ""){
		alert("Debe indicar la cantidad en ml que se gasta con este servicio");
		return;
	}
	
	//debo añadir el tipo de servicio
	servicios.AnadirTiposServicio($("#Id_NuevoTSNombre").val(), $("#Id_NuevoTSCantidad").val(), $("#Id_NuevoTSPrecio").val(),$("#Id_NuevoTSMaximo").val(),$("#Id_NuevoTSMinimo").val(),$("#Id_NuevoTSTramo").val()
	, function(bExito, rowsArray){
		if(!bExito){
			//
			alert("No se ha podido añadir este tipo de servicio");
			return;
		}
		MostrarTiposServicio();
		
	});

}

function ModificarTiposServicios(idTipoServicio){
	servicios.ModificarTipoServicio(idTipoServicio, $("#Id_"+idTipoServicio+"_Nombre").val(), $("#Id_"+idTipoServicio+"_Cantidad").val(),$("#Id_"+idTipoServicio+"_Precio").val(),$("#Id_"+idTipoServicio+"_Maximo").val(),$("#Id_"+idTipoServicio+"_Minimo").val(),$("#Id_"+idTipoServicio+"_Tramo").val()
	, function(bExito){
		if(!bExito){
			alert("No se ha podido modificar el tipo de servicio");
			return;
		}
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
		//debo añadir el grupo de bebidas que he recibido por el rowsArray
		$("#tabla_Grupos_Bebida").html("");
		for(var i = 0; i<rowsArray.length; i++){
			$("#tabla_Grupos_Bebida").append(
				'<tr> '+
				'	<td><input type="text" id="Id_'+rowsArray[i].idGruposBebida+'_Nombre" value="'+rowsArray[i].Nombre+'"></td>'+
				'	<td class="boton" ><a class="btn" onClick="ModificarGruposBebida('+rowsArray[i].idGruposBebida+')"  href="javascript:void(0)"><i class="icon-refresh" ></i> </a><a class="btn" onClick="EliminarGruposBebida('+rowsArray[i].idGruposBebida+')" href="javascript:void(0)"><i class="icon-minus"></i> </a></td><td></td> '+
				'</tr></td><tr><td></td><td colspan="2"><table class="in_tabla" style="min-width: 500px;"> <caption onClick="mostrarOcultarTS('+rowsArray[i].idGruposBebida+')"><i class="icon-chevron-down " id="i_HTS_'+rowsArray[i].idGruposBebida+'"></i> Precios por Tipo de Servicio</caption><thead id="Id_HTS_'+rowsArray[i].idGruposBebida+'"><tr><th>Nombre</th><th>Precio</th><th>M&aacute;ximo</th><th>M&iacute;nimo</th><th>Tramo</th><th></th></tr></thead><tbody id="Sub_Tabla_Precios_'+rowsArray[i].idGruposBebida+'"></tbody></table></td></tr><tr><td></td><td><table class="in_tabla" style="min-width: 370px;"><caption onClick="mostrarOcultarBebida('+rowsArray[i].idGruposBebida+')" > <i class="icon-chevron-down" id="i_HBebidas_'+rowsArray[i].idGruposBebida+'"> </i>Bebidas</caption><thead id="Id_HBebidas_'+rowsArray[i].idGruposBebida+'"><tr><th>Nombre</th><th>ml/Botella</th><th></th></tr></thead><tbody id="Sub_Tabla_Bebidas_'+rowsArray[i].idGruposBebida+'"></tbody></table></td></tr>'
			);
			//debo añadir una tabla con los tipos de servicios
			for(var ii = 0; ii<rowsArray[i].Precios; ii++)
				$("#Sub_Tabla_Precios_"+rowsArray[i].idGruposBebida).append('<tr> '+
								'<td><select id="Id_'+rowsArray[i].idGruposBebida+"_"+rowsArray[i].Precios[ii][0]+'_Nombre" name="'+rowsArray[i].Precios[ii][0]+'"  class="Select_Tipos_Servicio"></td> '+
								'<td><input type="text" id="Id_'+rowsArray[i].idGruposBebida+"_"+rowsArray[i].Precios[ii][0]+'_Precio" value="'+rowsArray[i].Precios[ii][3]+'" class="input-mini numerico"></td> '+
								'<td><input type="text" id="Id_'+rowsArray[i].idGruposBebida+"_"+rowsArray[i].Precios[ii][0]+'_Maximo" value="'+rowsArray[i].Precios[ii][4]+'" class="input-mini numerico"></td> '+
								'<td><input type="text" id="Id_'+rowsArray[i].idGruposBebida+"_"+rowsArray[i].Precios[ii][0]+'_Minimo" value="'+rowsArray[i].Precios[ii][5]+'" class="input-mini numerico"></td> '+
								'<td><input type="text" id="Id_'+rowsArray[i].idGruposBebida+"_"+rowsArray[i].Precios[ii][0]+'_Tramo" value="'+rowsArray[i].Precios[ii][6]+'" class="input-mini numerico"></td> '+
								'<td class="boton" ><a class="btn" onClick="ModificarTiposServicios('+rowsArray[i].idGruposBebida+','+rowsArray[i].Precios[ii][0]+')"  href="javascript:void(0)"><i class="icon-refresh"></i> </a><a class="btn" onClick="EliminarTipoServicio('+rowsArray[i].idGruposBebida+','+rowsArray[i].Precios[ii][0]+')" href="javascript:void(0)"><i class="icon-minus"></i> </a></td> '+
							'</tr>  '
							);
			$("#Sub_Tabla_Precios_"+rowsArray[i].idGruposBebida).append('<tr> '+  
					'<td><select id="Id_NuevoTS_ID" class="Select_Tipos_Servicio"></select></td>  '+
					'<td><input type="text" name="NuevoPrecio" id="Id_NuevoTSPrecio" value="" class="input-mini numerico"></td> '+
					'<td><input type="text" name="NuevoMaximo" id="Id_NuevoTSMaximo" value="" class="input-mini numerico"></td> '+
					'<td><input type="text" name="NuevoMinimo" id="Id_NuevoTSMinimo" value="" class="input-mini numerico"></td> '+
					'<td><input type="text" name="NuevoTramo" id="Id_NuevoTSTramo" value="" class="input-mini numerico"></td> '+
					'<td class="boton" ><a class="btn" onClick="AnadirNuevoTipoServicio()" href="javascript:void(0)"><i class="icon-plus"></i> </a></td> '+
				'</tr>');
			for(var ii = 0; ii<rowsArray[i].Bebidas; ii++)
				$("#Sub_Tabla_Bebidas_"+rowsArray[i].idGruposBebida).append('<tr> '+
					'<td><input type="text" id="Id_"'+rowsArray[i].Bebidas[ii][0]+'_Nombre" value="'+rowsArray[i].Bebidas[ii][1]+'" /></td>'+
					'<td><input type="text" id="Id_"'+rowsArray[i].Bebidas[ii][0]+'_Cantidad_Botella" value="'+rowsArray[i].Bebidas[ii][2]+'" class="input-mini numerico" /></td>'+
					'<td class="boton" ><a class="btn" onClick="ModificarBebidas('+rowsArray[i].idGruposBebida+','+rowsArray[i].Bebidas[ii][0]+')"  href="javascript:void(0)"><i class="icon-refresh"></i> </a><a class="btn" onClick="EliminarBebidas('+rowsArray[i].idGruposBebida+','+rowsArray[i].Bebidas[ii][0]+')" href="javascript:void(0)"><i class="icon-minus"></i> </a></td>'+
					'</tr>');
			$("#Sub_Tabla_Bebidas_"+rowsArray[i].idGruposBebida).append('<tr>'+
					'<td><input type="text" id="Id_NuevaBebida_Nombre" value="" /></td>'+
					'<td><input type="text" id="Id_NuevaBebida_Cantidad_Botella" value="" class="input-mini numerico" /></td>'+
					'<td class="boton" ><a class="btn" onClick="AnadirNuevaBebida()" href="javascript:void(0)"><i class="icon-plus"></i></a></td>'+
					'</tr>');
		}
		$("#tabla_Grupos_Bebida").append('<tr><td><input type="text" name="NuevoServicio" id="Id_NuevoGBNombre" value=""></td> ' +
			'<td class="boton" ><a class="btn AddGB" href="#"><i class="icon-plus"></i> </a></td> </tr>');
	});
}

function mostrarOcultarTS(id){
	$("#Id_HTS_"+id).toggle(100);
	$("#Sub_Tabla_Precios_"+id).toggle(100);
	$("#i_HTS_"+id).attr("class", $("#Id_HTS_"+id).css("opacity") == 1 ? "icon-chevron-down " : "icon-chevron-up ");
}

function mostrarOcultarBebida(id){
	$("#Id_HBebidas_"+id).toggle(100);
	$("#Sub_Tabla_Bebidas_"+id).toggle(100);
	$("#i_HBebidas_"+id).attr("class", $("#Id_HBebidas_"+id).css("opacity") == 1 ? "icon-chevron-down " : "icon-chevron-up ");
}

//function ModificarTiposServicios(idGruposBebida)


