# kataSeatCode
Mandatory points:
Done -  Use Less to create styles, compile Less files to locally generate CSS, and add them to the project.
Done -  Less/CSS code must be writen using BEM metodologhy.
Done -  JavaScript must be written in Vanilla No jQuery, React ...).  Use HTML5 and CSS3.
OK   -  Third-party libraries are permited, Use CDNJS for include it.
Done -  Responsive: The given prototype is designed for mobile, but it should be responsive Mobile First. For example, on desktop screens, the product grid may change to 4 columns.

Nota: 

- todos los filtros diponibles se recogen de los endpoints.
- la estructura del proyecto es un guiño a como se trabaja en AEM, (usando nombres de paquetes como clientlib, o dividir los styles por componente)

Optional
SEO, Accesibility & Performance - añadidos unos cuantos metas, alternates y demás. En cuanto a la performace, aparte de cachear el payload de las llamadas, también se ha implementado un cacheo de imágenes en memoria.
Documentation - falta de tiempo
Animations - sobre el hover en las cards
Caching the payload - implementado usando la local storage. 
Loading during queries - no lo vi necesareo porque ya la carga de por si era bastante rapida, no obstante se puede implementar e incluso añadir un sleep para que sea visible.
Datalist in search field - no entendí esto.
Problems resolution - La lógica más comleja está en el filtrado, por multiopción del tipo, color y genero, anidado tambien si buscas por la keyword

Bonus
Done - Clear filter

How to test:
Necesitas tener node instalado en tu computadora.
Posicionate en la carpeta src.
Instala el servidor node si no lo tienes aun: npm install -g http-server
Inicia el servidor: npm install -g http-server
Puedes accder ahora mediante: http://127.0.0.1:8080/
Por defecto ya carga el index.html :)
