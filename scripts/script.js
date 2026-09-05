const DOMINIOS_PERMITIDOS = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
const STORAGE_CARRITO = 'isaflor-carrito';
const STORAGE_PRODUCTOS = 'isaflor-productos';

const regionesComunas = {
    'Región Metropolitana': ['Santiago', 'Puente Alto', 'Maipú', 'La Florida'],
    'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana'],
    'Biobío': ['Concepción', 'Talcahuano', 'Los Ángeles', 'Coronel']
};

const productosBase = [
    { codigo: 'ROS01', nombre: 'Ramo de rosas', precio: 19990 },
    { codigo: 'TUL02', nombre: 'Tulipanes premium', precio: 14990 },
    { codigo: 'ORQ03', nombre: 'Orquídea blanca', precio: 24990 },
    { codigo: 'FREE', nombre: 'Tarjeta dedicatoria', precio: 0 }
];

function normalizarTexto(valor) {
    return valor.trim();
}

function correoValido(correo) {
    const valor = normalizarTexto(correo).toLowerCase();
    if (!valor || valor.length > 100) {
        return false;
    }
    const formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return formato.test(valor) && DOMINIOS_PERMITIDOS.some((dominio) => valor.endsWith(dominio));
}

function validarRun(run) {
    const valor = normalizarTexto(run).toUpperCase();
    if (!valor || valor.length < 7 || valor.length > 9) {
        return false;
    }
    if (!/^[0-9K]+$/.test(valor)) {
        return false;
    }

    const cuerpo = valor.slice(0, -1);
    const dvIngresado = valor.slice(-1);

    if (!/^\d+$/.test(cuerpo)) {
        return false;
    }

    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i -= 1) {
        suma += Number(cuerpo[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = 11 - (suma % 11);
    let dvEsperado = '';

    if (resto === 11) {
        dvEsperado = '0';
    } else if (resto === 10) {
        dvEsperado = 'K';
    } else {
        dvEsperado = String(resto);
    }

    return dvEsperado === dvIngresado;
}

function mostrarError(inputId, mensaje) {
    const input = document.getElementById(inputId);
    const error = document.querySelector('[data-error-for="' + inputId + '"]');

    if (input) {
        input.classList.toggle('input-error', Boolean(mensaje));
    }

    if (error) {
        error.textContent = mensaje || '';
    }
}

function limpiarErrores(formulario) {
    const errores = formulario.querySelectorAll('.error');
    const inputs = formulario.querySelectorAll('input, select, textarea');

    errores.forEach((item) => {
        item.textContent = '';
    });

    inputs.forEach((item) => {
        item.classList.remove('input-error');
    });
}

function inicializarLogin() {
    const form = document.getElementById('form-login');
    if (!form) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        limpiarErrores(form);
        let valido = true;

        const correo = document.getElementById('login-correo').value;
        const password = document.getElementById('login-password').value.trim();

        if (!correo) {
            mostrarError('login-correo', 'El correo es obligatorio.');
            valido = false;
        } else if (correo.length > 100 || !correoValido(correo)) {
            mostrarError('login-correo', 'Ingresa un correo válido con dominio permitido.');
            valido = false;
        }

        if (!password) {
            mostrarError('login-password', 'La contraseña es obligatoria.');
            valido = false;
        } else if (password.length < 4 || password.length > 10) {
            mostrarError('login-password', 'La contraseña debe tener entre 4 y 10 caracteres.');
            valido = false;
        }

        document.getElementById('mensaje-login').textContent = valido ? 'Inicio de sesión validado correctamente.' : '';
    });
}

function inicializarContacto() {
    const form = document.getElementById('form-contacto');
    if (!form) {
        return;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        limpiarErrores(form);
        let valido = true;

        const nombre = document.getElementById('contacto-nombre').value.trim();
        const correo = document.getElementById('contacto-correo').value.trim();
        const comentario = document.getElementById('contacto-comentario').value.trim();

        if (!nombre) {
            mostrarError('contacto-nombre', 'El nombre es obligatorio.');
            valido = false;
        } else if (nombre.length > 100) {
            mostrarError('contacto-nombre', 'El nombre no puede superar 100 caracteres.');
            valido = false;
        }

        if (correo) {
            if (correo.length > 100 || !correoValido(correo)) {
                mostrarError('contacto-correo', 'El correo debe tener un dominio permitido.');
                valido = false;
            }
        }

        if (!comentario) {
            mostrarError('contacto-comentario', 'El comentario es obligatorio.');
            valido = false;
        } else if (comentario.length > 500) {
            mostrarError('contacto-comentario', 'El comentario no puede superar 500 caracteres.');
            valido = false;
        }

        document.getElementById('mensaje-contacto').textContent = valido ? 'Formulario de contacto enviado correctamente.' : '';
    });
}

function poblarRegionesYComunas(form) {
    const regionSelect = form.querySelector('#region');
    const comunaSelect = form.querySelector('#comuna');

    if (!regionSelect || !comunaSelect) {
        return;
    }

    regionSelect.innerHTML = '<option value="">Seleccione una región</option>';
    Object.keys(regionesComunas).forEach((region) => {
        const option = document.createElement('option');
        option.value = region;
        option.textContent = region;
        regionSelect.appendChild(option);
    });

    regionSelect.addEventListener('change', () => {
        const comunas = regionesComunas[regionSelect.value] || [];
        comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
        comunas.forEach((comuna) => {
            const option = document.createElement('option');
            option.value = comuna;
            option.textContent = comuna;
            comunaSelect.appendChild(option);
        });
    });
}

function validarFormularioUsuario(form, mensajeId) {
    poblarRegionesYComunas(form);

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        limpiarErrores(form);
        let valido = true;

        const run = form.querySelector('#run').value.trim().toUpperCase();
        const nombre = form.querySelector('#nombre').value.trim();
        const apellidos = form.querySelector('#apellidos').value.trim();
        const correo = form.querySelector('#correo').value.trim();
        const tipoUsuario = form.querySelector('#tipoUsuario').value;
        const region = form.querySelector('#region').value;
        const comuna = form.querySelector('#comuna').value;
        const direccion = form.querySelector('#direccion').value.trim();

        if (!run) {
            mostrarError('run', 'El RUN es obligatorio.');
            valido = false;
        } else if (run.length < 7 || run.length > 9 || !validarRun(run)) {
            mostrarError('run', 'Ingresa un RUN válido sin puntos ni guion.');
            valido = false;
        }

        if (!nombre) {
            mostrarError('nombre', 'El nombre es obligatorio.');
            valido = false;
        } else if (nombre.length > 50) {
            mostrarError('nombre', 'El nombre no puede superar 50 caracteres.');
            valido = false;
        }

        if (!apellidos) {
            mostrarError('apellidos', 'Los apellidos son obligatorios.');
            valido = false;
        } else if (apellidos.length > 100) {
            mostrarError('apellidos', 'Los apellidos no pueden superar 100 caracteres.');
            valido = false;
        }

        if (!correo) {
            mostrarError('correo', 'El correo es obligatorio.');
            valido = false;
        } else if (!correoValido(correo)) {
            mostrarError('correo', 'Ingresa un correo válido con dominio permitido.');
            valido = false;
        }

        if (!tipoUsuario) {
            mostrarError('tipoUsuario', 'Debes seleccionar un tipo de usuario.');
            valido = false;
        }

        if (!region) {
            mostrarError('region', 'Debes seleccionar una región.');
            valido = false;
        }

        if (!comuna) {
            mostrarError('comuna', 'Debes seleccionar una comuna.');
            valido = false;
        }

        if (!direccion) {
            mostrarError('direccion', 'La dirección es obligatoria.');
            valido = false;
        } else if (direccion.length > 300) {
            mostrarError('direccion', 'La dirección no puede superar 300 caracteres.');
            valido = false;
        }

        const mensaje = document.getElementById(mensajeId);
        if (mensaje) {
            mensaje.textContent = valido ? 'Usuario validado correctamente.' : '';
        }
    });
}

function inicializarFormulariosUsuario() {
    const formularios = [
        { id: 'form-registro-cliente', mensajeId: 'mensaje-registro-cliente' },
        { id: 'form-nuevo-usuario', mensajeId: 'mensaje-nuevo-usuario' },
        { id: 'form-registro-admin', mensajeId: 'mensaje-registro-admin' }
    ];

    formularios.forEach((config) => {
        const form = document.getElementById(config.id);
        if (form) {
            validarFormularioUsuario(form, config.mensajeId);
        }
    });
}

function evaluarAlertaStock() {
    const stockInput = document.getElementById('stock');
    const stockCriticoInput = document.getElementById('stock-critico');
    const alerta = document.getElementById('alerta-stock');

    if (!stockInput || !stockCriticoInput || !alerta) {
        return;
    }

    const stock = Number(stockInput.value);
    const stockCritico = Number(stockCriticoInput.value);
    const mostrar = Number.isInteger(stock) && Number.isInteger(stockCritico) && stock <= stockCritico;
    alerta.classList.toggle('oculto', !mostrar);
}

function inicializarProducto() {
    const form = document.getElementById('form-producto');
    if (!form) {
        return;
    }

    const stockInput = document.getElementById('stock');
    const stockCriticoInput = document.getElementById('stock-critico');

    [stockInput, stockCriticoInput].forEach((input) => {
        input.addEventListener('input', evaluarAlertaStock);
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        limpiarErrores(form);
        let valido = true;

        const codigo = document.getElementById('codigo').value.trim();
        const nombre = document.getElementById('nombre-producto').value.trim();
        const precio = Number(document.getElementById('precio').value);
        const stock = Number(document.getElementById('stock').value);
        const stockCritico = Number(document.getElementById('stock-critico').value);

        if (!codigo) {
            mostrarError('codigo', 'El código es obligatorio.');
            valido = false;
        } else if (codigo.length < 3) {
            mostrarError('codigo', 'El código debe tener al menos 3 caracteres.');
            valido = false;
        }

        if (!nombre) {
            mostrarError('nombre-producto', 'El nombre es obligatorio.');
            valido = false;
        } else if (nombre.length > 100) {
            mostrarError('nombre-producto', 'El nombre no puede superar 100 caracteres.');
            valido = false;
        }

        if (document.getElementById('precio').value === '') {
            mostrarError('precio', 'El precio es obligatorio.');
            valido = false;
        } else if (Number.isNaN(precio) || precio < 0) {
            mostrarError('precio', 'El precio debe ser un número mayor o igual a 0.');
            valido = false;
        }

        if (document.getElementById('stock').value === '') {
            mostrarError('stock', 'El stock es obligatorio.');
            valido = false;
        } else if (!Number.isInteger(stock) || stock < 0) {
            mostrarError('stock', 'El stock debe ser un entero mayor o igual a 0.');
            valido = false;
        }

        if (document.getElementById('stock-critico').value === '') {
            mostrarError('stock-critico', 'El stock crítico es obligatorio.');
            valido = false;
        } else if (!Number.isInteger(stockCritico) || stockCritico < 0) {
            mostrarError('stock-critico', 'El stock crítico debe ser un entero mayor o igual a 0.');
            valido = false;
        }

        if (valido) {
            const productos = obtenerProductosDisponibles();
            productos.push({ codigo, nombre, precio });
            localStorage.setItem(STORAGE_PRODUCTOS, JSON.stringify(productos));
        }

        document.getElementById('mensaje-producto').textContent = valido ? 'Producto validado y guardado correctamente.' : '';
        evaluarAlertaStock();
    });
}

function obtenerProductosDisponibles() {
    const guardados = localStorage.getItem(STORAGE_PRODUCTOS);
    if (!guardados) {
        return [...productosBase];
    }

    try {
        const productos = JSON.parse(guardados);
        return Array.isArray(productos) ? productos : [...productosBase];
    } catch (error) {
        return [...productosBase];
    }
}

function obtenerCarrito() {
    const guardado = localStorage.getItem(STORAGE_CARRITO);
    if (!guardado) {
        return [];
    }

    try {
        const carrito = JSON.parse(guardado);
        return Array.isArray(carrito) ? carrito : [];
    } catch (error) {
        return [];
    }
}

function guardarCarrito(carrito) {
    localStorage.setItem(STORAGE_CARRITO, JSON.stringify(carrito));
}

function agregarAlCarrito(codigo) {
    const productos = obtenerProductosDisponibles();
    const producto = productos.find((item) => item.codigo === codigo);
    if (!producto) {
        return;
    }

    const carrito = obtenerCarrito();
    const existente = carrito.find((item) => item.codigo === codigo);

    if (existente) {
        existente.cantidad += 1;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }

    guardarCarrito(carrito);
    alert('Producto agregado al carrito.');
}

function renderizarProductos() {
    const contenedor = document.getElementById('productos-lista');
    if (!contenedor) {
        return;
    }

    const productos = obtenerProductosDisponibles();
    contenedor.innerHTML = '';

    productos.forEach((producto) => {
        const articulo = document.createElement('article');
        articulo.className = 'producto-card';
        articulo.innerHTML = '<h3>' + producto.nombre + '</h3>' +
            '<p><strong>Código:</strong> ' + producto.codigo + '</p>' +
            '<p><strong>Precio:</strong> $' + producto.precio.toFixed(2) + '</p>' +
            '<button type="button" class="boton" data-codigo="' + producto.codigo + '">Añadir al carrito</button>';
        contenedor.appendChild(articulo);
    });

    contenedor.querySelectorAll('[data-codigo]').forEach((boton) => {
        boton.addEventListener('click', () => {
            agregarAlCarrito(boton.getAttribute('data-codigo'));
        });
    });
}

function actualizarCantidad(codigo, cantidad) {
    let carrito = obtenerCarrito();
    carrito = carrito.map((item) => {
        if (item.codigo === codigo) {
            return { ...item, cantidad };
        }
        return item;
    }).filter((item) => item.cantidad > 0);

    guardarCarrito(carrito);
    renderizarCarrito();
}

function eliminarDelCarrito(codigo) {
    const carrito = obtenerCarrito().filter((item) => item.codigo !== codigo);
    guardarCarrito(carrito);
    renderizarCarrito();
}

function renderizarCarrito() {
    const contenedor = document.getElementById('carrito-contenido');
    if (!contenedor) {
        return;
    }

    const carrito = obtenerCarrito();
    if (carrito.length === 0) {
        contenedor.innerHTML = '<p>El carrito está vacío.</p>';
        return;
    }

    let total = 0;
    const filas = carrito.map((item) => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;
        return '<tr>' +
            '<td>' + item.codigo + '</td>' +
            '<td>' + item.nombre + '</td>' +
            '<td>$' + item.precio.toFixed(2) + '</td>' +
            '<td><input type="number" min="0" step="1" value="' + item.cantidad + '" data-cantidad="' + item.codigo + '"></td>' +
            '<td>$' + subtotal.toFixed(2) + '</td>' +
            '<td><button type="button" class="boton boton-secundario" data-eliminar="' + item.codigo + '">Eliminar</button></td>' +
            '</tr>';
    }).join('');

    contenedor.innerHTML = '<table class="tabla-carrito">' +
        '<thead><tr><th>Código</th><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th>Acción</th></tr></thead>' +
        '<tbody>' + filas + '</tbody></table>' +
        '<div class="resumen-carrito">Total: $' + total.toFixed(2) + '</div>';

    contenedor.querySelectorAll('[data-cantidad]').forEach((input) => {
        input.addEventListener('change', () => {
            const cantidad = Number(input.value);
            if (!Number.isInteger(cantidad) || cantidad < 0) {
                renderizarCarrito();
                return;
            }
            actualizarCantidad(input.getAttribute('data-cantidad'), cantidad);
        });
    });

    contenedor.querySelectorAll('[data-eliminar]').forEach((boton) => {
        boton.addEventListener('click', () => {
            eliminarDelCarrito(boton.getAttribute('data-eliminar'));
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarLogin();
    inicializarContacto();
    inicializarFormulariosUsuario();
    inicializarProducto();
    renderizarProductos();
    renderizarCarrito();
});
