const claveCorrecta = "123456"; 
const formularioLogin = document.getElementById("loginForm");

if (localStorage.getItem("saldoGuardado") === null) {
    localStorage.setItem("saldoGuardado", "100000");
}

if(localStorage.getItem("agendaContactos") === null) { 
    let contactosIniciales = [
        { nombre: "Jose Pérez", alias: "Jo", cbu: "1234567890" },
        { nombre: "María Maria", alias: "María", cbu: "0987654321" }
    ];
    localStorage.setItem("agendaContactos", JSON.stringify(contactosIniciales));
}


if (localStorage.getItem("historialMovimientos") === null) {
    localStorage.setItem("historialMovimientos", JSON.stringify([]));
}

// ==========================================
// 2. LÓGICA DEL MENÚ (menu.html)
// ==========================================

// Verificamos que estamos en el menú buscando la etiqueta del saldo
if (document.getElementById("saldoTotal")) {
    
    // Leemos cuánto dinero hay guardado en la memoria (si no hay nada, por defecto será 100000)
    let saldoActualMenu = localStorage.getItem("saldoGuardado") || "100000";
    
    // Imprimimos el valor real en la pantalla usando jQuery
    $('#saldoTotal').text("$" + saldoActualMenu);

    let historialMovimientos = JSON.parse(localStorage.getItem("historialMovimientos"));

    let fechaActual = new Date().toLocaleDateString('es-ES'); 

    historialMovimientos.push({
        fecha: fechaActual,
        descripcion: "Saldo inicial",
        monto: parseInt(saldoActualMenu),
        tipo: "ingreso"
    });
    localStorage.setItem("historialMovimientos", JSON.stringify(historialMovimientos));
    
}


// ==========================================
// LÓGICA DE LA PANTALLA DE DEPÓSITO
// ==========================================

// Verificamos si estamos en depositar.html buscando el ID del formulario
if (document.getElementById("formularioDeposito")) {
    
    // 1. Obtener el saldo desde Local Storage (o crear el de 100.000 si no existe)
    if (localStorage.getItem("saldoGuardado") === null) {
        localStorage.setItem("saldoGuardado", "100000");
    }
    // Convertimos el texto guardado a un número matemático
    let saldoActual = parseInt(localStorage.getItem("saldoGuardado"));

    // 2. Mostrar el saldo actual en el HTML al cargar la página
    $('#saldoEnPantalla').text("$" + saldoActual);

    // 3. Detectar el clic en el botón "Realizar depósito"
    $('#formularioDeposito').submit(function(event) {
        
        // Evita que el botón recargue la página instantáneamente
        event.preventDefault(); 

        // Capturamos el número que el usuario escribió en el input
        let monto = parseInt($('#depositAmount').val());

        // Validamos que sea un número positivo
        if (monto > 0) {
            
            // Suma matemática
            let nuevoSaldo = saldoActual + monto;

            // Guardamos el nuevo total en el Local Storage
            localStorage.setItem("saldoGuardado", nuevoSaldo.toString());

            // Actualizamos visualmente el saldo en pantalla al instante
            $('#saldoEnPantalla').text("$" + nuevoSaldo);

            // Cumplimos el requisito de la leyenda debajo del formulario
            $('#leyendaDeposito').text("Has depositado: $" + monto);

            // Creamos e inyectamos la alerta verde de éxito
            let alertaHTML = `
                <div class="alert alert-success alert-dismissible fade show" role="alert">
                    ¡Depósito realizado con éxito! Redirigiendo al menú principal...
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            $('#alert-container').html(alertaHTML);

            // REQUISITO 4: Redirigir usando setTimeout después de 2 segundos (2000 ms)
            setTimeout(function() {
                window.location.href = "menu.html";
            }, 2000);

        } else {
            // Alerta roja de error en caso de que escriban 0 o números negativos
            let alertaError = `
                <div class="alert alert-danger alert-dismissible fade show" role="alert">
                    Por favor, ingresa un monto válido mayor a $0.
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
            $('#alert-container').html(alertaError);
        }
    });
}



$(document).ready(function() {

    // 1. Usamos jQuery para manejar el evento submit
    $('#loginForm').submit(function(event) {
        event.preventDefault(); // Evitamos que el formulario se envíe automáticamente

        // 2. Usamos selectores de jQuery para obtener los valores
        let emailIngresado = $('#email').val();
        let claveIngresada = $('#password').val();
        
        let usuarioLogeado = false;
        const claveCorrecta = "123456";

        // 3. Comparamos la clave (más adelante puedes validar también el emailIngresado si lo deseas)
        if (claveIngresada === claveCorrecta) {
            usuarioLogeado = true;
        }

        // 4. Redirección o alerta
        if (usuarioLogeado) {
            console.log("Usuario logeado. Redirigiendo al menú principal...");
            // Usamos la nueva ruta que indicaste
            window.location.href = 'menu.html';
        } else {
            alert("Contraseña incorrecta. Por favor, inicie sesión.");
            console.log("Usuario no logeado. Manteniendo en la página de inicio...");
        }
    });

});


function mostrarAlertaYRedirigir(mensaje, destino) {
    let alertaHTML = `
        <div class="alert alert-info alert-dismissible fade show" role="alert">
            ${mensaje}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;

    $('#contenedorAlertas').html(alertaHTML);

    setTimeout(function() {
        window.location.href = destino;
    }, 2000);
}

// 2. Escuchamos los clics de cada botón usando su ID
$('#btnDepositar').click(function(event) {
    event.preventDefault(); // ¡ESTO ES CLAVE! Detiene el salto inmediato del HTML
    mostrarAlertaYRedirigir("Redirigiendo a depositar...", "depositar.html");
});

$('#btnEnviar').click(function(event) {
    event.preventDefault(); 
    mostrarAlertaYRedirigir("Redirigiendo a enviar dinero...", "enviardinero.html");
});

$('#btnMovimientos').click(function(event) {
    event.preventDefault(); 
    mostrarAlertaYRedirigir("Redirigiendo a últimos movimientos...", "movimientos.html");
});

$("p").css("background-color", "gold");



// ==========================================
// LÓGICA DE LA PANTALLA DE ENVIAR DINERO
// ==========================================

if (document.getElementById("buscadorContacto")) {
    
    // -- Cargar saldo actual en pantalla --
    let saldoActual = parseInt(localStorage.getItem("saldoGuardado") || "100000");
    $('#saldoEnPantalla').text("$" + saldoActual);

    let listaContactosGuardados = JSON.parse(localStorage.getItem("agendaContactos"));
    let ulContactos = $('#listaContactos');

    ulContactos.empty();

    listaContactosGuardados.forEach(function(contacto) {
        let filaContacto = `<li class="list-group-item list-group-item-action contacto-item" data-nombre="${contacto.nombre}">${contacto.nombre} (Alias: ${contacto.alias})</li>`;
        ulContactos.append(filaContacto);
    });

    // ==========================================
    // REQUISITO 1: Mostrar y ocultar formulario
    // ==========================================
    $('#btnMostrarFormulario').click(function() {
        $('#formularioNuevoContacto').slideDown(); // slideDown hace que aparezca con una animación
        $(this).hide(); // Oculta el botón de "Agregar"
    });

    $('#btnCancelarContacto').click(function() {
        $('#formularioNuevoContacto').slideUp();
        $('#btnMostrarFormulario').show();
        // Limpiamos los campos por si escribió algo
        $('#formularioNuevoContacto')[0].reset();
        $('#errorValidacion').hide();
    });

    // ==========================================
   // REQUISITO 2: Validar el formulario de contacto
    // ==========================================
    $('#formularioNuevoContacto').submit(function(event) {
        event.preventDefault();
        
        let nombre = $('#nombreContacto').val().trim();
        let alias = $('#aliasContacto').val().trim();
        let cbu = $('#cbuContacto').val().trim();
        
        // Expresión regular: Valida que sean exactamente 10 números
        let cbuValido = /^\d{10}$/.test(cbu); 

        if (nombre === "" || alias === "" || cbu === "") {
            $('#errorValidacion').text("Todos los campos son obligatorios.").show();
        } else if (!cbuValido) {
            $('#errorValidacion').text("La cuenta de destino debe contener exactamente 10 números.").show();
        } else {
            // Si todo está bien, ocultamos errores
            $('#errorValidacion').hide();
            
            // --- INICIO DEL PUNTO 3: GUARDAR EN LA MEMORIA ---
            // 1. Traemos la lista de la memoria (asumimos que ya existe gracias al paso 1)
            let agendaMemoria = JSON.parse(localStorage.getItem("agendaContactos"));
            
            // 2. Agregamos el nuevo contacto como un objeto de datos a la lista
            agendaMemoria.push({
                nombre: nombre,
                alias: alias,
                cbu: cbu
            });
            
            // 3. Volvemos a guardar la lista actualizada en el navegador
            localStorage.setItem("agendaContactos", JSON.stringify(agendaMemoria));
            // --- FIN DEL PUNTO 3 ---
            
            // Creamos un nuevo elemento de lista (li)
            let nuevoContactoHTML = `<li class="list-group-item list-group-item-action contacto-item" data-nombre="${nombre}">${nombre} (Alias: ${alias})</li>`;
            
            // Dibujamos el nuevo contacto en la pantalla
            $('#listaContactos').append(nuevoContactoHTML);
            
            // Cerramos el formulario
            $('#btnCancelarContacto').click();
            
            // Mostramos un mensajito de éxito temporal
            alert("Contacto agregado correctamente.");
        }
    });
    // ==========================================
    // REQUISITO 3: Buscar en la agenda
    // ==========================================
    $('#buscadorContacto').on('keyup', function() {
        // Obtenemos lo que el usuario escribe, en minúsculas
        let textoBusqueda = $(this).val().toLowerCase();
        
        // Filtramos la lista
        $('#listaContactos li').filter(function() {
            // Muestra u oculta el elemento dependiendo de si el texto coincide
            $(this).toggle($(this).text().toLowerCase().indexOf(textoBusqueda) > -1);
        });
    });

    // ==========================================
    // REQUISITO 4: Mostrar botón "Enviar dinero" al seleccionar
    // ==========================================
    // Usamos .on('click') en la lista para que también funcione con contactos nuevos
    $('#listaContactos').on('click', '.contacto-item', function() {
        // Quitamos el color activo de todos los demás y se lo ponemos al seleccionado
        $('.contacto-item').removeClass('active');
        $(this).addClass('active');

        // Capturamos el nombre del contacto
        let nombreDestino = $(this).attr('data-nombre');
        
        // Ponemos el nombre en el formulario y mostramos la sección
        $('#nombreDestinatario').text(nombreDestino);
        $('#seccionEnviarDinero').slideDown();
        $('#mensajeConfirmacion').empty(); // Limpiamos mensajes anteriores
    });

    // ==========================================
    // REQUISITO 5: Enviar el dinero y mostrar confirmación
    // ==========================================
    $('#btnEnviarDinero').click(function() {
        let montoEnviar = parseInt($('#montoEnviar').val());
        let nombreDestino = $('#nombreDestinatario').text();

        // Validamos que el monto sea lógico y que el usuario tenga dinero suficiente
        if (isNaN(montoEnviar) || montoEnviar <= 0) {
            alert("Por favor, ingresa un monto válido mayor a 0.");
            return;
        }

        if (montoEnviar > saldoActual) {
            alert("Fondos insuficientes. Tu saldo actual es de $" + saldoActual);
            return;
        }

        // Restamos el saldo
        saldoActual = saldoActual - montoEnviar;
        let historial = JSON.parse(localStorage.getItem("historialMovimientos"));
        let fechaActual = new Date().toLocaleString('es-ES'); // Fecha y hora actual
        localStorage.setItem("saldoGuardado", saldoActual.toString());
        
        historial.push({
            fecha: fechaActual,
            descripcion: "Transferencia a " + nombreDestino,
            monto: montoEnviar,
            tipo: "egreso"
        });
        localStorage.setItem("historialMovimientos", JSON.stringify(historial));
        $('#saldoEnPantalla').text("$" + saldoActual);

        // Creamos la alerta de Bootstrap de éxito
        let alertaHTML = `
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>¡Transferencia Exitosa!</strong> Has enviado $${montoEnviar} a ${nombreDestino}.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        `;
        $('#mensajeConfirmacion').html(alertaHTML);

        // Limpiamos y ocultamos el formulario de envío para que no envíe dos veces
        $('#montoEnviar').val('');
        $('#seccionEnviarDinero').slideUp();
        $('.contacto-item').removeClass('active');
    });
}

// ==========================================
// LÓGICA DE LA PANTALLA DE MOVIMIENTOS
// ==========================================
if (document.getElementById("cuerpoTablaMovimientos")) {
    
    // 1. Traemos el historial de la memoria
    let historial = JSON.parse(localStorage.getItem("historialMovimientos"));
    let cuerpoTabla = $('#cuerpoTablaMovimientos');

    // 2. Limpiamos la tabla
    cuerpoTabla.empty();

    // 3. Verificamos si hay datos
    if (!historial || historial.length === 0) {
        cuerpoTabla.append('<tr><td colspan="3" class="text-center text-muted">No hay movimientos recientes.</td></tr>');
    } else {
        // 4. Llenamos la tabla fila por fila
        historial.reverse().forEach(function(movimiento) {
            
            let colorTexto = movimiento.tipo === "ingreso" ? "text-success" : "text-danger";
            let signo = movimiento.tipo === "ingreso" ? "+" : "-";

            let fila = `
                <tr>
                    <td>${movimiento.fecha}</td>
                    <td>${movimiento.descripcion}</td>
                    <td class="fw-bold ${colorTexto}">${signo}$${movimiento.monto}</td>
                </tr>
            `;
            
            cuerpoTabla.append(fila);
        });
    }
}