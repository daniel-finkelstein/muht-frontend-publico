MUHT Frontend

Descripción:

Este repositorio tiene el frontend web de MUHT (monitoring your health treatment), una app tanto web como móvil orientada al seguimiento de pacientes con obesidad en contextos de preoperatorio, postoperatorio y tratamientos no quirúrgicos. 

Arquitectura:

El frontend esta hecho con React + Vite y se conecta al backend que corre en AWS.

El orden del proyecto es el siguiente:
src/ 
├── components/ piezas reutilizables de UI 
├── pages/ pantallas (login, dashboard, perfil, etc.) 
├── layouts/ estructura general de la pagina(sidebar, topbar) 
├── services/ llamadas al backend 
├── routes/ navegación 
├── assets/ imágenes (logo, etc.)

La lógica general es que el usuario interactua con la UI, el frontend le pide los datos al backend y estos se muestran en la pantalla dependiendo del rol del usuario

Para la autenticación se usa Auth0 para manejar el login y la seguridad.

La app se adapta dependiendo del rol del usuario. El paciente, doctor y superadmin tienen distintas vistas y capacidades


Uso de Inteligencia Artificial:

Durante el desarrollo del proyecto hemos usado herramientas de IA como apoyo (para debuggear, hacer distintas preguntas o como apoyo para resolver problemas)

Todas las decisiones fueron tomadas y entendidas por el equipo

La IA se uso como herramienta de apoyo, no reemplazo del proceso de desarrollo