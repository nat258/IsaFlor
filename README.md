# IsaFlor

IsaFlor es un proyecto web estático de una tienda y sitio comercial enfocada en productos y servicios relacionados con la floristería y la experiencia de compra en línea. El proyecto incluye una interfaz para clientes y otra para administración, con navegación para productos, carrito, contacto, blog y registro de usuarios.

## Descripción

La aplicación está desarrollada con HTML, CSS y JavaScript, y presenta una estructura modular con páginas separadas para cada vista principal. El objetivo es ofrecer una experiencia visual atractiva y una navegación clara tanto para compradores como para administradores.

## Características

- Página principal con diseño atractivo y presentación de marca
- Vista para clientes con navegación a productos, blogs, nosotros y contacto
- Carrito de compras
- Registro e inicio de sesión
- Gestión de usuarios y productos desde una vista administrativa
- Diseño responsivo y adaptable a distintas pantallas
- Estructura simple y fácil de mantener para proyectos web estáticos

## Estructura del proyecto

```text
IsaFlor/
├── paginas/
│   ├── index.html
│   ├── inicioSesion.html
│   ├── administrador.html
│   ├── otros.html
│   ├── VistaAdmin/
│   │   ├── inicioAdmin.html
│   │   ├── mostrarUsuarios.html
│   │   ├── nuevoProducto.html
│   │   ├── nuevoUsuario.html
│   │   └── registroUsuario.html
│   └── VistaCliente/
│       ├── blogs.html
│       ├── carritoCompras.html
│       ├── contacto.html
│       ├── detalle1.html
│       ├── inicioCliente.html
│       ├── nosotros.html
│       ├── productos.html
│       └── registro.html
├── scripts/
│   └── script.js
├── Style/
│   └── estilos.css
├── README.md
└── .gitignore
```

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Git y GitHub para control de versiones

## Cómo ejecutar el proyecto localmente

1. Clona este repositorio:

```bash
git clone https://github.com/nat258/IsaFlor.git
```

2. Navega a la carpeta del proyecto:

```bash
cd IsaFlor
```

3. Abre cualquiera de los archivos HTML dentro de la carpeta `paginas` en tu navegador, o usa una extensión como Live Server en Visual Studio Code para una mejor experiencia de desarrollo.

### Ejemplo

```text
paginas/index.html
```

## Vista general de las páginas

- `paginas/index.html`: página principal del sitio
- `paginas/inicioSesion.html`: acceso de usuarios
- `paginas/administrador.html`: panel general del administrador
- `paginas/VistaCliente/*`: páginas del cliente
- `paginas/VistaAdmin/*`: panel y gestión interna para administradores

## Estado del proyecto

Este proyecto está en desarrollo como una interfaz web estática para una tienda de estilo boutique/floristería. Puede ampliarse con integración de backend, base de datos, autenticación real y gestión dinámica de productos.

## Autor

Proyecto desarrollado por Natali.


