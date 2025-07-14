# Sobre este repositorio

Proyecto de fin de grado, un prototipo de aplicación pensada para ayudar a **un caso específico** mediante la toma de notas, de reservas y mostrar el menú en vivo.

Emplea tecnologías como Websockets, peticiones REST y varios. Abajo del todo se adjuntan planos y alguna que otra imagen para hacerse una pequeña idea.

Se puede observar las diferentes modificaciones y el progreso viendo el historial de versiones.
Este proyecto es solo un prototipo por lo que carece de filtrado de datos, es bastante inseguro y se han usado tecnologías incompatibles debido a que no está enfocado en la escalabilidad y la interfaz está preparada específicamente en los dispositivos móviles.
También parece un "frankestein" porque me gusta entender a fondo lo que uso e integrarlo al máximo a mi manera.

## Conocimientos adquiridos

En este proyecto se ha podido aprender más acerca de varios focos:

- Gestión de proyectos complejos
- Respetar los tiempos de entrega
- Aplicar conocimientos y aprender a usar nuevas herramientas (Svelte, WebSockets, SQLite, etcétera...)
- Lanzar aplicaciones en producción
- Gestionar un servidor web

## Despliegue y ejecución

Yo he usado `yarn` pero se puede usar npm.

```sh
#instalar módulos
npm run installAll

# añadir un .env y montarlo
cp serverData .env.template .env
# para solo pruebas: echo SESION_SIGN_COOKIE_KEY="test" > serverData/.env

# ejecutar en desarrollo
npm run dev
# si a cambio quieres compilar y desplegar
npm run build
npm run start

# info adicional
# - npm run install realiza lo siguiente:
# # npm install
# # cd backend
# # npm install
# # npm run installModules
# # cd ../frontend
# # npm install
# # cd ..
```

## Comandos globales

- `npm run dev`: Despliegue en testeo
- `npm run build`: para compilar el proyecto
- `npm run start`: para desplegar en producción
- `npm run stop`: para parar el despliegue en producción

## Documentos y planos

En esta sección se pueden observar algunas de las planificaciones realizadas en las que se ha basado la aplicación

### Diagrama de casos de uso

Algunas de las acciones que se pueden realizar en la aplicación y que usuarios pueden realizarlas.

![Diagrama de casos de uso](/.github/readmeImages/DiagramaDeCasosDeUso.jpg)

### Diagrama de despliegue

Muestra la arquitectura de la aplicación sin entrar muy al detalle pero mostrando la funcionalidad global.

![Diagrama de despliegue](/.github/readmeImages/DiagramaDeDespliegue.jpg)

## Galería
Aquí algunos _screenshoots_ del proyecto donde se puede observar brevemente alguna que otra funcionalidad existente.

1. **Landing page (sin registro)**  
   Vista inicial para usuarios no registrados.  
   ![imagen1](./.github/readmeImages/img1.png)

2. **Landing page (sesión administrador)**  
   Vista con opciones disponibles para el administrador. 
   ![imagen2](./.github/readmeImages/img2.png)

3. **Panel de trabajo (empleado)**  
   Área restringida con acceso a base de datos, reservas y modos de trabajo (solo los administradores acceden y ven las bases de datos).  
   ![imagen3](./.github/readmeImages/img3.png)

4. **Lista de usuarios en base de datos**  
   Vista del panel con usuarios registrados y sus roles.  
   ![imagen4](./.github/readmeImages/img4.png)

5. **Lista de productos (modo camarero)**  
   Catálogo de productos con opción de búsqueda por nombre.  
   ![imagen5](./.github/readmeImages/img5.png)

6. **Añadir nota extra (modo camarero)**  
   Interfaz para agregar instrucciones personalizadas a productos.  
   ![imagen6](./.github/readmeImages/img6.png)

7. **Vista de pedidos (modo camarero)**  
   Pedido con estado visual de productos: Listo y Servido.  
   ![imagen7](./.github/readmeImages/img7.png)

8. **Modo cocinero**  
   Gestión del estado de productos en cocina (preparación/entrega).  
   ![imagen8](./.github/readmeImages/img8.png)

9. **Vista de reservas (cliente)**  
   Reservas con estado aceptadas o rechazadas.  
   ![imagen9](./.github/readmeImages/img9.png)

10. **Aceptar o rechazar reservas (empleado)**  
    Gestión de solicitudes de reserva pendientes.  
    ![imagen10](./.github/readmeImages/img10.png)
