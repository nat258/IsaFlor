const DOMINIOS_PERMITIDOS = ['@duoc.cl','@profesor.duoc.cl','@gmail.com','@hotmail.com','@outlook.com'];
const STORAGE_CARRITO = 'isaflor-carrito';
const STORAGE_PRODUCTOS = 'isaflor-productos';
const STORAGE_USUARIOS = 'isaflor-usuarios';
const URL_SCRIPT = new URL(document.currentScript.src, document.baseURI);

async function cargarComponente(ruta) {
    const respuesta = await fetch(new URL('../componentes/' + ruta, URL_SCRIPT));
    if (!respuesta.ok) throw new Error('No se pudo cargar el componente: ' + ruta);
    return respuesta.text();
}

async function inicializarComponentes() {
    try {
        const [headerHtml, footerHtml] = await Promise.all([
            cargarComponente('header.html'),
            cargarComponente('footer.html')
        ]);

        const raiz = new URL('../', URL_SCRIPT);

        if (!document.querySelector('header')) {
            const header = document.createRange()
                .createContextualFragment(headerHtml)
                .firstElementChild;
            header.querySelectorAll('[data-route]').forEach((enlace) => {
                enlace.href = new URL(enlace.dataset.route, raiz).href;
            });
            const logo = header.querySelector('[data-src]');
            if (logo) {
                logo.src = new URL('imagenes/logo.webp', raiz).href;
            }
            document.body.prepend(header);
        }
        if (!document.querySelector('footer')) {
            const footer = document.createRange()
                .createContextualFragment(footerHtml)
                .firstElementChild;

            document.body.appendChild(footer);
        }
    } catch (error) {
        console.error(error);
    }
}

const regionesComunas = {
    'Region Metropolitana': ['Santiago','Puente Alto','Maipu','La Florida'],
    'Valparaiso': ['Valparaiso','Vina del Mar','Quilpue','Villa Alemana'],
    'Biobio': ['Concepcion','Talcahuano','Los Angeles','Coronel']
};

const productosBase = [
    {codigo:'ROS01',nombre:'Ramo de rosas',precio:19990,imagen:'../../imagenes/rosas.webp'},
    {codigo:'TUL02',nombre:'Tulipan premium',precio:14990,imagen:'../../imagenes/tulipanes.webp'},
    {codigo:'ORQ03',nombre:'Orquidea blanca',precio:24990,imagen:'../../imagenes/orquideas.webp'},
    {codigo:'CART',nombre:'Tarjeta dedicatoria',precio:500,imagen:'../../imagenes/tarjeta.webp'}
];

function normalizarTexto(valor) {
    return valor.trim();
}

function correoValido(correo) {
    const valor = normalizarTexto(correo).toLowerCase();
    if (!valor || valor.length > 100) return false;
    const formato = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return formato.test(valor) && DOMINIOS_PERMITIDOS.some((dominio) => valor.endsWith(dominio));
}

function validarRun(run) {
    const valor = normalizarTexto(run).toUpperCase();
    if (!valor || valor.length < 7 || valor.length > 9 || !/^[0-9K]+$/.test(valor)) return false;

    const cuerpo = valor.slice(0, -1);
    const dv = valor.slice(-1);
    if (!/^\d+$/.test(cuerpo)) return false;

    let suma = 0;
    let multiplicador = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += Number(cuerpo[i]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }
    const resto = 11 - (suma % 11);
    const dvEsperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto);
    return dvEsperado === dv;
}

function mostrarError(inputId, mensaje) {
    const input = document.getElementById(inputId);
    const error = document.querySelector('[data-error-for="' + inputId + '"]');

    if (input) input.classList.toggle('input-error', Boolean(mensaje));
    if (error) error.textContent = mensaje || '';
}

function limpiarErrores(formulario) {
    const errores = formulario.querySelectorAll('.error');
    const inputs = formulario.querySelectorAll('input, select, textarea');

    errores.forEach((item) => item.textContent = '');
    inputs.forEach((item) => item.classList.remove('input-error'));
}

function inicializarLogin() {
    const form = document.getElementById('form-login');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        limpiarErrores(form);

        let valido = true;
        const correo = document.getElementById('login-correo').value;
        const password = document.getElementById('login-password').value.trim();

        if (!correo) {
            mostrarError('login-correo','El correo es obligatorio.');
            valido = false;
        } else if (correo.length > 100 || !correoValido(correo)) {
            mostrarError('login-correo','Ingresa un correo valido con dominio permitido.');
            valido = false;
        }

        if (!password) {
            mostrarError('login-password','La contrasena es obligatoria.');
            valido = false;
        } else if (password.length < 4 || password.length > 10) {
            mostrarError('login-password','La contrasena debe tener entre 4 y 10 caracteres.');
            valido = false;
        }

        const mensaje = document.getElementById('mensaje-login');

        if (!valido) {
            mensaje.textContent = '';
            return;
        }

        mensaje.textContent = 'Inicio de sesion validado correctamente.';
        const botonPresionado = event.submitter;

        if (document.activeElement.id === 'btn-cliente') {
            window.location.href = 'VistaCliente/inicioCliente.html';
        }

        if (document.activeElement.id === 'btn-admin') {
            window.location.href = 'VistaAdmin/inicioAdmin.html';
        }
    });
}

function inicializarContacto() {
    const form = document.getElementById('form-contacto');
    if (!form) return;

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        limpiarErrores(form);

        let valido = true;
        const nombre = document.getElementById('contacto-nombre').value.trim();
        const correo = document.getElementById('contacto-correo').value.trim();
        const comentario = document.getElementById('contacto-comentario').value.trim();

        if (!nombre) {
            mostrarError('contacto-nombre','El nombre es obligatorio.');
            valido = false;
        } else if (nombre.length > 100) {
            mostrarError('contacto-nombre','El nombre no puede superar 100 caracteres.');
            valido = false;
        }

        if (!correo) {
            mostrarError('contacto-correo','El correo es obligatorio.');
            valido = false;
        } else if (correo.length > 100 || !correoValido(correo)) {
            mostrarError('contacto-correo','Ingresa un correo valido con dominio permitido.');
            valido = false;
        }

        if (!comentario) {
            mostrarError('contacto-comentario','El comentario es obligatorio.');
            valido = false;
        } else if (comentario.length > 500) {
            mostrarError('contacto-comentario','El comentario no puede superar 500 caracteres.');
            valido = false;
        }

        document.getElementById('mensaje-contacto').textContent = valido ? 'Formulario de contacto enviado correctamente.' : '';
    });
}

function poblarRegionesYComunas(form) {
    const regionSelect = form.querySelector('#region');
    const comunaSelect = form.querySelector('#comuna');
    if (!regionSelect || !comunaSelect) return;

    regionSelect.innerHTML = '<option value="">Seleccione una region</option>';

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

const usuariosPrecargados = [
    {run:'19011022K',nombre:'Maria',apellidos:'Gonzalez Perez',correo:'maria@gmail.com',fechaNacimiento:'1995-05-10',tipoUsuario:'Cliente',region:'Region Metropolitana',comuna:'Maipu',direccion:'Av. Los Aromos 123'},
    {run:'18234567K',nombre:'Juan',apellidos:'Perez Soto',correo:'juan@gmail.com',fechaNacimiento:'1990-08-20',tipoUsuario:'Vendedor',region:'Valparaiso',comuna:'Quilpue',direccion:'Calle Las Flores 456'},
    {run:'12345678K',nombre:'Ana',apellidos:'Martinez Lopez',correo:'ana@gmail.com',fechaNacimiento:'1988-03-15',tipoUsuario:'Administrador',region:'Region Metropolitana',comuna:'Maipu',direccion:'Av. Principal 789'},
    {run:'16543210K',nombre:'Carlos',apellidos:'Ramirez Diaz',correo:'carlos@gmail.com',fechaNacimiento:'1992-11-25',tipoUsuario:'Cliente',region:'Biobio',comuna:'Concepcion',direccion:'Calle Los Jardines 321'}
];

function obtenerUsuarios() {
    const guardados = localStorage.getItem(STORAGE_USUARIOS);

    if (!guardados) {
        localStorage.setItem(STORAGE_USUARIOS, JSON.stringify(usuariosPrecargados));
        return [...usuariosPrecargados];
    }

    try {
        const usuarios = JSON.parse(guardados);
        return Array.isArray(usuarios) ? usuarios : [...usuariosPrecargados];
    } catch (error) {
        return [...usuariosPrecargados];
    }
}

function guardarUsuarios(usuarios) {
    localStorage.setItem(STORAGE_USUARIOS, JSON.stringify(usuarios));
}

function renderizarUsuarios() {
    const contenedor = document.getElementById('lista-usuarios');
    if (!contenedor) return;

    const usuarios = obtenerUsuarios();
    contenedor.innerHTML = '';

    usuarios.forEach((usuario) => {
        const fila = document.createElement('tr');

        fila.innerHTML =
            '<td>' + usuario.run + '</td>' +
            '<td>' + usuario.nombre + '</td>' +
            '<td>' + usuario.apellidos + '</td>' +
            '<td>' + usuario.correo + '</td>' +
            '<td>' + (usuario.fechaNacimiento || '-') + '</td>' +
            '<td>' + usuario.tipoUsuario + '</td>' +
            '<td>' + usuario.region + '</td>' +
            '<td>' + usuario.comuna + '</td>' +
            '<td>' + usuario.direccion + '</td>' +
            '<td><button type="button" class="boton boton-secundario" data-editar-usuario="' + usuario.run + '">Editar</button> <button type="button" class="boton" data-eliminar-usuario="' + usuario.run + '">Eliminar</button></td>';

        contenedor.appendChild(fila);
    });

    contenedor.querySelectorAll('[data-eliminar-usuario]').forEach((boton) => {
        boton.addEventListener('click', () => eliminarUsuario(boton.getAttribute('data-eliminar-usuario')));
    });

    contenedor.querySelectorAll('[data-editar-usuario]').forEach((boton) => {
        boton.addEventListener('click', () => editarUsuario(boton.getAttribute('data-editar-usuario')));
    });
}

function eliminarUsuario(run) {
    const usuarios = obtenerUsuarios();
    const nuevosUsuarios = usuarios.filter((usuario) => usuario.run !== run);
    guardarUsuarios(nuevosUsuarios);
    renderizarUsuarios();
}

function editarUsuario(run) {
    const usuario = obtenerUsuarios().find((item) => item.run === run);
    if (!usuario) return;

    localStorage.setItem('isaflor-usuario-editar', JSON.stringify(usuario));
    window.location.href = 'nuevoCliente.html?editar=' + encodeURIComponent(run);
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
        const passwordInput = form.querySelector('#password');
        const password = passwordInput ? passwordInput.value.trim() : '';
        const fechaNacimiento = form.querySelector('#fechaNacimiento')?.value || '';
        const tipoUsuarioInput = form.querySelector('#tipoUsuario');
        const tipoUsuario = tipoUsuarioInput ? tipoUsuarioInput.value : '';
        const region = form.querySelector('#region').value;
        const comuna = form.querySelector('#comuna').value;
        const direccion = form.querySelector('#direccion').value.trim();

        if (!run) {
            mostrarError('run','El RUN es obligatorio.');
            valido = false;
        } else if (run.length < 7 || run.length > 9 || !validarRun(run)) {
            mostrarError('run','Ingresa un RUN valido sin puntos ni guion.');
            valido = false;
        }

        if (!nombre) {
            mostrarError('nombre','El nombre es obligatorio.');
            valido = false;
        } else if (nombre.length > 50) {
            mostrarError('nombre','El nombre no puede superar 50 caracteres.');
            valido = false;
        }

        if (!apellidos) {
            mostrarError('apellidos','Los apellidos son obligatorios.');
            valido = false;
        } else if (apellidos.length > 100) {
            mostrarError('apellidos','Los apellidos no pueden superar 100 caracteres.');
            valido = false;
        }

        if (!correo) {
            mostrarError('correo','El correo es obligatorio.');
            valido = false;
        } else if (!correoValido(correo)) {
            mostrarError('correo','Ingresa un correo valido con dominio permitido.');
            valido = false;
        }

        if (passwordInput && !password) {
            mostrarError('password','La clave es obligatoria.');
            valido = false;
        } else if (passwordInput && (password.length < 4 || password.length > 10)) {
            mostrarError('password','La clave debe tener entre 4 y 10 caracteres.');
            valido = false;
        }

        if (tipoUsuarioInput && !tipoUsuario) {
            mostrarError('tipoUsuario','Debes seleccionar un tipo de usuario.');
            valido = false;
        }

        if (!region) {
            mostrarError('region','Debes seleccionar una region.');
            valido = false;
        }

        if (!comuna) {
            mostrarError('comuna','Debes seleccionar una comuna.');
            valido = false;
        }

        if (!direccion) {
            mostrarError('direccion','La direccion es obligatoria.');
            valido = false;
        } else if (direccion.length > 300) {
            mostrarError('direccion','La direccion no puede superar 300 caracteres.');
            valido = false;
        }

        const mensaje = document.getElementById(mensajeId);

        if (!valido) {
            if (mensaje) mensaje.textContent = '';
            return;
        }

        const nuevoUsuario = {run,nombre,apellidos,correo,password,fechaNacimiento,tipoUsuario,region,comuna,direccion};
        const usuarios = obtenerUsuarios();
        const parametroEditar = new URLSearchParams(window.location.search).get('editar');

        if (parametroEditar) {
            const posicion = usuarios.findIndex((usuario) => usuario.run === parametroEditar);

            if (posicion !== -1) {
                usuarios[posicion] = nuevoUsuario;
                guardarUsuarios(usuarios);
            }
        } else {
            const existe = usuarios.some((usuario) => usuario.run === nuevoUsuario.run);

            if (existe) {
                mostrarError('run','Ya existe un usuario con este RUN.');
                return;
            }

            usuarios.push(nuevoUsuario);
            guardarUsuarios(usuarios);
        }

        if (mensaje) mensaje.textContent = parametroEditar
            ? 'Usuario actualizado correctamente.'
            : 'Usuario creado correctamente.';

        form.reset();

        const comunaSelect = form.querySelector('#comuna');

        if (comunaSelect) comunaSelect.innerHTML = '<option value="">Seleccione una comuna</option>';
    });
}

function inicializarFormulariosUsuario() {
    const formularios = [
        {id:'form-registro-cliente',mensajeId:'mensaje-registro-cliente'},
        {id:'form-nuevo-usuario',mensajeId:'mensaje-nuevo-usuario'},
        {id:'form-registro-admin',mensajeId:'mensaje-registro-admin'}
    ];

    formularios.forEach((config) => {
        const form = document.getElementById(config.id);
        if (form) validarFormularioUsuario(form,config.mensajeId);
    });
}

function evaluarAlertaStock() {
    const stockInput = document.getElementById('stock');
    const stockCriticoInput = document.getElementById('stock-critico');
    const alerta = document.getElementById('alerta-stock');

    if (!stockInput || !stockCriticoInput || !alerta) return;

    const stock = Number(stockInput.value);
    const stockCritico = Number(stockCriticoInput.value);
    const mostrar = Number.isInteger(stock) && Number.isInteger(stockCritico) && stock <= stockCritico;

    alerta.classList.toggle('oculto',!mostrar);
}

function inicializarProducto() {
    const form = document.getElementById('form-producto');
    if (!form) return;

    const stockInput = document.getElementById('stock');
    const stockCriticoInput = document.getElementById('stock-critico');

    [stockInput,stockCriticoInput].forEach((input) => {
        if (input) input.addEventListener('input',evaluarAlertaStock);
    });

    form.addEventListener('submit',(event) => {
        event.preventDefault();
        limpiarErrores(form);

        let valido = true;
        const codigo = document.getElementById('codigo').value.trim();
        const nombre = document.getElementById('nombre-producto').value.trim();
        const precio = Number(document.getElementById('precio').value);
        const stock = Number(document.getElementById('stock').value);
        const stockCritico = Number(document.getElementById('stock-critico').value);

        if (!codigo) {
            mostrarError('codigo','El codigo es obligatorio.');
            valido = false;
        } else if (codigo.length < 3) {
            mostrarError('codigo','El codigo debe tener al menos 3 caracteres.');
            valido = false;
        }

        if (!nombre) {
            mostrarError('nombre-producto','El nombre es obligatorio.');
            valido = false;
        } else if (nombre.length > 100) {
            mostrarError('nombre-producto','El nombre no puede superar 100 caracteres.');
            valido = false;
        }

        if (document.getElementById('precio').value === '') {
            mostrarError('precio','El precio es obligatorio.');
            valido = false;
        } else if (Number.isNaN(precio) || precio < 0) {
            mostrarError('precio','El precio debe ser un numero mayor o igual a 0.');
            valido = false;
        }

        if (document.getElementById('stock').value === '') {
            mostrarError('stock','El stock es obligatorio.');
            valido = false;
        } else if (!Number.isInteger(stock) || stock < 0) {
            mostrarError('stock','El stock debe ser un entero mayor o igual a 0.');
            valido = false;
        }

        if (document.getElementById('stock-critico').value === '') {
            mostrarError('stock-critico','El stock critico es obligatorio.');
            valido = false;
        } else if (!Number.isInteger(stockCritico) || stockCritico < 0) {
            mostrarError('stock-critico','El stock critico debe ser un entero mayor o igual a 0.');
            valido = false;
        }

        if (valido) {
            const productos = obtenerProductosDisponibles();
            productos.push({codigo,nombre,precio});
            localStorage.setItem(STORAGE_PRODUCTOS,JSON.stringify(productos));
        }

        document.getElementById('mensaje-producto').textContent =
            valido ? 'Producto validado y guardado correctamente.' : '';

        evaluarAlertaStock();
    });
}

function obtenerProductosDisponibles() {
    const guardados = localStorage.getItem(STORAGE_PRODUCTOS);
    if (!guardados) return [...productosBase];

    try {
        const productos = JSON.parse(guardados);
        return Array.isArray(productos) ? productos : [...productosBase];
    } catch (error) {
        return [...productosBase];
    }
}

function obtenerCarrito() {
    const guardado = localStorage.getItem(STORAGE_CARRITO);
    if (!guardado) return [];

    try {
        const carrito = JSON.parse(guardado);
        return Array.isArray(carrito) ? carrito : [];
    } catch (error) {
        return [];
    }
}

function guardarCarrito(carrito) {
    localStorage.setItem(STORAGE_CARRITO,JSON.stringify(carrito));
}

function agregarAlCarrito(codigo) {
    const productos = obtenerProductosDisponibles();
    const producto = productos.find((item) => item.codigo === codigo);
    if (!producto) return;

    const carrito = obtenerCarrito();
    const existente = carrito.find((item) => item.codigo === codigo);

    if (existente) existente.cantidad += 1;
    else carrito.push({...producto,cantidad:1});

    guardarCarrito(carrito);
    alert('Producto agregado al carrito.');
}

function actualizarCantidad(codigo,cantidad) {
    let carrito = obtenerCarrito();

    carrito = carrito.map((item) => {
        if (item.codigo === codigo) return {...item,cantidad};
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

function renderizarProductos() {
    const contenedor = document.getElementById('productos-lista');
    if (!contenedor) return;

    const productos = obtenerProductosDisponibles();
    contenedor.innerHTML = '';

    productos.forEach((producto) => {
        const articulo = document.createElement('article');
        articulo.className = 'producto-card';

        articulo.innerHTML =
            '<img src="' + producto.imagen + '" alt="' + producto.nombre + '">' +
            '<h3>' + producto.nombre + '</h3>' +
            '<p><strong>Codigo:</strong> ' + producto.codigo + '</p>' +
            '<p><strong>Precio:</strong> $' + producto.precio.toFixed(2) + '</p>' +
            '<button type="button" class="boton" data-codigo="' + producto.codigo + '">Anadir al carrito</button>';

        contenedor.appendChild(articulo);
    });

    contenedor.querySelectorAll('[data-codigo]').forEach((boton) => {
        boton.addEventListener('click',() => agregarAlCarrito(boton.getAttribute('data-codigo')));
    });
}

function renderizarCarrito() {
    const contenedor = document.getElementById('carrito-contenido');
    if (!contenedor) return;

    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        contenedor.innerHTML = '<p>El carrito esta vacio.</p>';
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

    contenedor.innerHTML =
        '<table class="tabla-carrito"><thead><tr>' +
        '<th>Codigo</th><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th><th>Accion</th>' +
        '</tr></thead><tbody>' + filas + '</tbody></table>' +
        '<div class="resumen-carrito">Total: $' + total.toFixed(2) + '</div>';

    contenedor.querySelectorAll('[data-cantidad]').forEach((input) => {
        input.addEventListener('change',() => {
            const cantidad = Number(input.value);

            if (!Number.isInteger(cantidad) || cantidad < 0) {
                renderizarCarrito();
                return;
            }

            actualizarCantidad(input.getAttribute('data-cantidad'),cantidad);
        });
    });

    contenedor.querySelectorAll('[data-eliminar]').forEach((boton) => {
        boton.addEventListener('click',() => eliminarDelCarrito(boton.getAttribute('data-eliminar')));
    });
}

document.addEventListener('DOMContentLoaded',() => {
    inicializarComponentes();
    inicializarLogin();
    inicializarContacto();
    inicializarFormulariosUsuario();
    inicializarProducto();
    renderizarProductos();
    renderizarCarrito();
    renderizarUsuarios();
});