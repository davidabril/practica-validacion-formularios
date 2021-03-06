$("#formulario").validate({
    rules:
    {
        nombre: {
            required: true       
        },
        apellidos: {
            required: true
        },
        telefono: {
        	required: true,
			digits : true,
			minlength : 9
		},
		email: {
				required: true,
				email: true,
				minlength: 4,
				remote: "http://localhost/php/validar_email.php"
		},
		email2: {
				required: true,
				equalTo: email
		},
		conocer: {
                allow_single_deselect: true
        },
        usuario: {
                required: true,
                minlength : 4
        },
        password: {
                required: true,
                pass: true,
                remote: "php/validar_password.php"
        },
        password2: {
                required: true,
                equalTo: password
        },
        nifcif:{
                required: true,
                validanifcif: true
        },
        particularempresa:{
                required: true
        },        
        direccion: {
                required: true
        },
        cp: {
                required: true,
				digits : true,
				maxlength : 5,
                remote: "http://localhost/php/validar_zip_db.php"
        },
        provincia: {
                required: true
        },
        localidad: {
                required: true
        },
		iban: {             
            iban: true,
            required: true
        },
        pago: {             
            required: true
        }
    },   
    submitHandler : function() {
            if(parseInt($("#pago").val())==1){
                var alerta=confirm("¡Envíado! Va a darse de alta como usuario. Se le pasará un cobro de 50 € ¿Desea continuar?");
            }
            if(parseInt($("#pago").val())==2){
                var alerta=confirm("¡Envíado! Va a darse de alta como usuario. Se le pasará un cobro de 140 € ¿Desea continuar?");
            }
            if(parseInt($("#pago").val())==3){
                var alerta=confirm("¡Envíado! Va a darse de alta como usuario. Se le pasará un cobro de 550 € ¿Desea continuar?");                
            }    
            if(alerta==true){
                window.location.href = "bienvenida.html";
            }
    }                    
});

// Cambia la provincia en funcion de los dos primeros digitos del codigo postal
$("#cp").focusout(function(evento) {
    $codigo=($("#cp").val()).substr(0, 2);
    $("#provincia").val($codigo);
});

// Si cambia el texto en nombre de particular dinamicamente con nombre y apellidos
$(document).ready(function(){
    // Convierte en modo chosen el select de como nos conocio
    $("#conocer").chosen({ 
        allow_single_deselect: true,
        no_results_text: "No existe resultado con "
    });
    // Convierte en modo chosen el select de forma pago
    $("#pago").chosen({
        allow_single_deselect: true,
        no_results_text: "No existe resultado con "
    });

    // Funcion y sus llamadas para cambiar dinamicamente el nombre en caso de tener
        // activado el checked de empresa y rellenarlo automaticamente
    function actualizaNombreApellidos(){
        if ($("#demandanteparticular").is(':checked')) {
            $("#particularempresa").val($("#nombre").val()+" "+$("#apellidos").val());
        }
    }
    $(document).on("change, keyup", "#nombre", actualizaNombreApellidos);
    $(document).on("change, keyup", "#apellidos", actualizaNombreApellidos);


// Bloque para cambiar
    // Pone un option value inicial en localidad
    $("#localidad").html("<option value=''>Seleccione una localidad...</option>");

    // Cambia dinamicamente al cambiar el valor de provincia
    $("#cp").change(function() {
        // Cambia la opcion a Cargando mientras se prepara para buscar en php
        $("#localidad").html("<option value=''>Cargando...</option>");

        // Si no encontro localidad (es un error pero lo manejo), Vuelve a mostrar seleccione una localidad
        if ($(this).val() == "") {
            $("#localidad").html("<option value=''>Seleccione una localidad...</option>");
        }else{
            // Hace una peticion ajax usando el valor seleccionado (value) como parametro GET
            $.ajax({
                url: 'http://localhost/php/rellenar_municipios_db.php?cp='+$(this).val(),
                // Si todo va bien muestra la salida (previamente formateada en php) en localidad
                success: function(output) {
                    $("#localidad").html(output);
                },
                // Si no va bien muestra el error
                error: function (xhr, ajaxOptions, thrownError) {
                    alert(xhr.status + " "+ thrownError);
                }});
            }
        });
});


// Si el input:radio #demandanteparticular esta marcado: 
$("#demandanteparticular").change(function(evento) {
    if ($("#demandanteparticular").is(':checked')) {
        $("#textonifcif").text("NIF");    
        $("#nifcif").val("");        
        $("#textoparticularempresa").text("Nombre"); 
        $("#particularempresa").val($("#nombre").val()+" "+$("#apellidos").val()); 
    }
});
// Si el input:radio #demandanteparticular esta marcado: 
$("#demandanteempresa").change(function(evento) {
    if ($("#demandanteempresa").is(':checked')) {
        $("#textonifcif").text("CIF");    
        $("#nifcif").val("");                
        $("#textoparticularempresa").text("Empresa"); 
        $("#particularempresa").val(""); 
    }
});
/*$("#demandanteparticular").change(function(evento) {
    if ($("#demandanteparticular").is(':checked')) {
        $("#lblcif > span").removeClass("important");
        $("#lblcif > span").text("");
        $("#cif").attr('disabled', true);
        $("#lblempresa > span").removeClass("important");
        $("#lblempresa > span").text("");
        $("#empresa").attr('disabled', true);

        $("#lblnif > span").addClass("important");
        $("#lblnif > span").text("*");
        $("#nif").removeAttr('disabled');
        $("#lblparticular > span").addClass("important");
        $("#lblparticular > span").text("*");
        $("#particular").removeAttr('disabled');        
    }
});*/

// Si el input:radio #demandanteempresa esta marcado: 
/*$("#demandanteempresa").change(function(evento) {
    if ($("#demandanteempresa").is(':checked')) {
        $("#lblnif > span").removeClass("important");
        $("#lblnif > span").text("");
        $("#nif").attr('disabled', true);
        $("#lblparticular > span").removeClass("important");
        $("#lblparticular > span").text("");
        $("#particular").attr('disabled', true);

        $("#lblcif > span").addClass("important");
        $("#lblcif > span").text("*");
        $("#cif").removeAttr('disabled');
        $("#lblempresa > span").addClass("important");
        $("#lblempresa > span").text("*");
        $("#empresa").removeAttr('disabled');
        
    }
});*/

// Si el Código Postal tiene menos de 4 dígitos, se agrega un 0 a la izquierda.
$("#cp").focusout(function() {
    var codigo = $("#cp").val();
    var longi=codigo.length;
    while(longi<5){
        codigo="0"+codigo;
        longi++;
    }
    $("#cp").val(codigo);    
});

// El usuario debe tener al menos 4 caracteres, se rellenará de modo automático
    //con el correo electrónico y no podrá ser modificado.
$("#usuario").focusout(function() {    
    if($("#email").val()!=""){
        $("#usuario").val($("#usuario").val()+$("#email").val());   
        $("#usuario").attr('disabled', true);    
    }else{
        $("#usuario").val("");        
    }
});

$.validator.addMethod("validaTarjeta", function(value, element) {
    $("#cuentabanco").val("");
    /*Aqui va el cambio de particular a empresa si procede*/
    return this.optional(element) ||  /^[0-9]+$/.test(value);
}, "Por favor eliga un tipo de tarjeta de credito.");

 //Validación del Código Postal mediante Ajax
/*$("#cp").change(function(){
	if($(this).val()!=""){
        var dato=$(this).val();
        $.ajax({
            type:"POST",
            dataType:"html",
            url:"php/validar_zip_db.php",
            data:"cp="+dato,
            success:function(msg){
            	alert(msg);
                $("#provincia").val(msg);
            }
        });
    }			
});*/
 	



            
