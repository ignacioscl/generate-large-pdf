# Generador de PDFs

Herramienta para generar archivos PDF de un tamaño específico. Útil para pruebas, desarrollo y casos donde necesites archivos PDF de tamaños determinados.

## Características

- ✅ Genera PDFs de cualquier tamaño especificado en MB
- ✅ Calibración automática para estimaciones precisas
- ✅ Ajuste automático para alcanzar el tamaño objetivo (tolerancia del 5%)
- ✅ Progreso en tiempo real durante la generación
- ✅ Contenido de ejemplo (Lorem Ipsum) para llenar el PDF

## Requisitos

- Node.js (v14 o superior)
- npm (v6 o superior)

## Instalación

1. Clona o descarga este repositorio
2. Instala las dependencias:

```bash
npm install
```

## Uso

### Uso básico

Genera un PDF de 1 MB (tamaño por defecto):

```bash
node generate-pdf.js
```

### Especificar tamaño

Genera un PDF de un tamaño específico en MB:

```bash
node generate-pdf.js 5
```

Esto generará un PDF de 5 MB.

### Especificar nombre de archivo

Genera un PDF con un nombre personalizado:

```bash
node generate-pdf.js 10 mi-archivo.pdf
```

### Usar npm script

También puedes usar el script de npm:

```bash
npm start
```

O con parámetros:

```bash
npm start -- 5
```

## Ejemplos

```bash
# Generar un PDF de 0.5 MB
node generate-pdf.js 0.5

# Generar un PDF de 10 MB
node generate-pdf.js 10

# Generar un PDF de 50 MB con nombre personalizado
node generate-pdf.js 50 documento-grande.pdf

# Generar un PDF de 100 MB
node generate-pdf.js 100
```

## Cómo funciona

1. **Calibración**: El script primero genera 5 páginas de prueba para calcular el tamaño promedio por página
2. **Estimación**: Basado en la calibración, calcula cuántas páginas necesita para alcanzar el tamaño objetivo
3. **Generación**: Genera el PDF con el contenido necesario
4. **Ajuste**: Si el tamaño no está dentro de la tolerancia (5%), ajusta y regenera hasta alcanzar el tamaño deseado

## Parámetros

- `tamaño` (opcional): Tamaño del PDF en MB. Por defecto: 1 MB
- `nombre-archivo` (opcional): Nombre del archivo de salida. Por defecto: `output-{tamaño}mb.pdf`

## Archivos generados

Los PDFs se generan en el directorio actual con el nombre especificado o `output-{tamaño}mb.pdf` si no se especifica un nombre.

## Estructura del proyecto

```
pdf-generate/
├── generate-pdf.js    # Script principal
├── package.json       # Dependencias y configuración
├── README.md          # Este archivo
└── node_modules/      # Dependencias (generado por npm)
```

## Dependencias

- **pdfkit**: Biblioteca para generar documentos PDF en Node.js

## Notas

- El script usa contenido Lorem Ipsum para llenar el PDF
- El tamaño final puede variar ligeramente debido a la estructura del PDF (márgenes, metadatos, etc.)
- Para PDFs muy grandes (>100 MB), la generación puede tomar varios minutos
- El script muestra el progreso durante la generación

## Licencia

ISC

## Contribuciones

Las contribuciones son bienvenidas. Si encuentras algún problema o tienes sugerencias, no dudes en abrir un issue o enviar un pull request.

