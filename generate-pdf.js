const PDFDocument = require('pdfkit')
const fs = require('fs')
const path = require('path')

// Obtener el tamaño en MB desde los argumentos de línea de comandos
const sizeInMB = parseFloat(process.argv[2]) || 1 // Por defecto 1 MB
const outputPath = process.argv[3] || `output-${sizeInMB}mb.pdf`

const targetSizeInBytes = sizeInMB * 1024 * 1024 // Convertir MB a bytes

console.log(`Generando PDF de ${sizeInMB} MB (${targetSizeInBytes} bytes)...`)

// Contenido base para llenar el PDF
const loremIpsum = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris 
nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
culpa qui officia deserunt mollit anim id est laborum. `

// Función para generar PDF con un número estimado de páginas
function generatePDF(estimatedPages) {
  return new Promise((resolve, reject) => {
    // Crear el documento PDF
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: 50, bottom: 50, left: 50, right: 50 },
    })

    // Stream para escribir el archivo
    const stream = fs.createWriteStream(outputPath)
    doc.pipe(stream)

    // Agregar título
    doc.fontSize(20).text(`PDF de ${sizeInMB} MB`, { align: 'center' })
    doc.moveDown(2)

    let pageCount = 1

    // Generar contenido hasta alcanzar el número estimado de páginas
    while (pageCount <= estimatedPages) {
      // Agregar contenido repetido
      for (let i = 0; i < 10; i++) {
        doc.fontSize(12).text(loremIpsum.repeat(5))
        doc.moveDown()
      }

      // Mostrar progreso (cada 50 páginas para pocas, cada 500 para muchas)
      const progressInterval = estimatedPages > 1000 ? 500 : 50
      if (pageCount % progressInterval === 0) {
        const progress = ((pageCount / estimatedPages) * 100).toFixed(1)
        console.log(`Generando... ${pageCount} / ${estimatedPages} páginas (${progress}%)`)
      }

      // Agregar nueva página si no es la última
      if (pageCount < estimatedPages) {
        doc.addPage()
        pageCount++
      } else {
        break
      }
    }

    // Finalizar el documento
    doc.end()

    stream.on('finish', () => {
      const finalSize = fs.statSync(outputPath).size
      resolve({ size: finalSize, pages: pageCount })
    })

    stream.on('error', reject)
  })
}

// Función principal asíncrona
async function main() {
  // Primero, hacer una calibración rápida con 5 páginas para estimar bytes por página
  console.log('Calibrando estimación...')
  const calibrationResult = await generatePDF(5)
  const bytesPerPage = calibrationResult.size / calibrationResult.pages
  
  console.log(`Calibración: ${(bytesPerPage / 1024).toFixed(2)} KB por página`)
  
  // Calcular páginas estimadas basadas en la calibración
  let estimatedPages = Math.ceil(targetSizeInBytes / bytesPerPage)
  
  console.log(`Estimación inicial: ${estimatedPages} páginas`)

  let finalSize = 0
  let pageCount = 0
  let iterations = 0
  const maxIterations = 5 // Límite de iteraciones para evitar loops infinitos
  const tolerance = 0.05 // Tolerancia del 5% del tamaño objetivo

  // Generar y ajustar hasta alcanzar el tamaño deseado
  while (iterations < maxIterations) {
    iterations++
    
    if (iterations > 1) {
      // Ajustar la estimación basada en el tamaño actual
      const actualBytesPerPage = finalSize / pageCount
      estimatedPages = Math.ceil(targetSizeInBytes / actualBytesPerPage)
      console.log(`Ajustando: generando ${estimatedPages} páginas (iteración ${iterations})`)
    }

    const result = await generatePDF(estimatedPages)
    finalSize = result.size
    pageCount = result.pages

    const finalSizeMB = (finalSize / (1024 * 1024)).toFixed(2)
    const targetMB = (targetSizeInBytes / (1024 * 1024)).toFixed(2)
    console.log(`Tamaño actual: ${finalSizeMB} MB / ${targetMB} MB (${pageCount} páginas)`)

    // Verificar si estamos dentro de la tolerancia
    const difference = Math.abs(finalSize - targetSizeInBytes) / targetSizeInBytes
    if (difference <= tolerance) {
      console.log(`Tamaño dentro de la tolerancia (${(difference * 100).toFixed(1)}%)`)
      break
    }

    if (finalSize < targetSizeInBytes) {
      // Necesitamos más contenido
      const remainingBytes = targetSizeInBytes - finalSize
      const bytesPerPage = finalSize / pageCount
      const additionalPages = Math.ceil(remainingBytes / bytesPerPage)
      estimatedPages = pageCount + additionalPages
    } else {
      // Tenemos demasiado contenido, reducir
      const bytesPerPage = finalSize / pageCount
      estimatedPages = Math.floor(targetSizeInBytes / bytesPerPage)
      if (estimatedPages < 1) estimatedPages = 1
    }
  }

  // Si aún no alcanzamos el tamaño después de las iteraciones, 
  // el PDF se generó con el tamaño más cercano posible

  const finalSizeMB = (finalSize / (1024 * 1024)).toFixed(2)
  console.log(`\nPDF generado exitosamente!`)
  console.log(`Archivo: ${path.resolve(outputPath)}`)
  console.log(`Tamaño final: ${finalSizeMB} MB (${finalSize} bytes)`)
  console.log(`Páginas: ${pageCount}`)
}

// Ejecutar
main().catch(err => {
  console.error('Error al generar el PDF:', err)
  process.exit(1)
})
