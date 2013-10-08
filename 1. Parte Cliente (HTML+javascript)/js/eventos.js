/*
Eventos de las aplicaciones

*/
//al cargar la página
$(function(){
	db.CrearBaseDeDatos();
	MostrarOpcionesxDefecto();
	MostrarTiposServicio();
	MostrarGruposBebida();
	
	//al hacer click en actualizapreferencias
	$("#ActualizarPreferencias").click(function(){
		//obtener los datos de la pantalla e insertarlos en la base de datos
		var secuencia = -1;
		var ArrUpdate = [];
		$(".tabla_Propiedades").each(function(i)
			{
				ArrUpdate[i]= [ $(this).attr('id').replace("Id_",""),  $(this).val() ];
			});
		var UpdateRecursivo = function(bExito){
			if(!bExito){
				alert("No se ha podido actualizar,\npor favor, pruebe más tarde");
				return;
			}
			secuencia++;
			if(secuencia == ArrUpdate.length){
				MostrarOpcionesxDefecto();
			} else {
				db.EjecutarSQL("UPDATE Propiedades SET Valor='"+ArrUpdate[secuencia][1]+"' WHERE Nombre='"+ArrUpdate[secuencia][0]+"';"
					, function(bExito){ UpdateRecursivo(bExito); });
			}
		}
		UpdateRecursivo(true);

	});		
	
});

