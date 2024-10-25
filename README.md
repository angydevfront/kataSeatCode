# kataSeatCode

## Puntos Obligatorios

- ✅ **Uso de Less para Estilos**: Los estilos están escritos en Less, compilados localmente para generar CSS y añadidos al proyecto.
- ✅ **Metodología BEM**: El código Less/CSS sigue la metodología BEM.
- ✅ **JavaScript**: Escrito en JavaScript Vanilla (sin jQuery, React, etc.). Utiliza HTML5 y CSS3.
- ✅ **Bibliotecas de Terceros**: Permitidas. Incluidas vía CDNJS.
- ✅ **Diseño Responsive**: El prototipo está diseñado para móvil primero, pero es totalmente adaptable. En pantallas de escritorio, la cuadrícula de productos se ajusta a 4 columnas.

### Notas Adicionales

- Todos los filtros disponibles se recuperan de los endpoints.
- La estructura del proyecto hace referencia a la metodología AEM, utilizando nombres de paquetes como `clientlib` y organizando estilos por componente.

## Puntos Opcionales

- **SEO, Accesibilidad y Rendimiento**: Se han añadido varias etiquetas meta y etiquetas alternas. Para mejorar el rendimiento, se ha implementado un caché tanto del payload de las API como de las imágenes en memoria.
- **Documentación**: Pendiente debido a limitaciones de tiempo.
- **Animaciones**: Se añadieron animaciones en el hover de las tarjetas.
- **Caché del Payload**: Implementado usando almacenamiento local (local storage).
- **Indicador de Carga**: No se consideró necesario debido a los rápidos tiempos de carga, aunque se podría implementar con un delay para hacerla visible.
- **Datalist en el Campo de Búsqueda**: No implementado (duda sobre la funcionalidad deseada).
- **Resolución de Problemas**: La lógica de filtrado es compleja, manejando filtros multi-opción por tipo, color y género, y además permite búsquedas anidadas por palabra clave.

## Bonus
- ✅ **Limpiar Filtros**: La funcionalidad para limpiar filtros está implementada.

## Cómo Probar

1. Asegúrate de tener Node.js instalado en tu computadora.
2. Dirígete a la carpeta raiz `kata`.
3. Instala el servidor de Node si aún no lo tienes e inicialo: 
   ```bash
   npm install -g http-server
   
   http-server .
4. Abre con el navegador: http://127.0.0.1:8080/src/index.html
