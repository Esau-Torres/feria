// js/r_curso_detalle.js

async function setupCourseDetailPage() {
  console.log("Inicializando página de Detalle de Curso...");

  // Obtenemos los elementos de la plantilla
  const titleEl = document.getElementById("course-title");
  const descEl = document.getElementById("course-description");
  const infoEl = document.getElementById("course-info");
  
  // ======================================================
  // ¡NUEVO! Botón de PDF
  // ======================================================
  const downloadBtn = document.getElementById("downloadPdfBtn");
  
  try {
    // 1. Leer el ID que guardamos en sessionStorage
    const courseId = sessionStorage.getItem('currentCourseId');
    if (!courseId) {
      titleEl.innerText = "Error";
      descEl.innerText = "No se ha seleccionado ningún curso. Vuelve a 'Mis Cursos' e inténtalo de nuevo.";
      return;
    }

    // 2. Cargar nuestra "Base de Datos" JSON
    const response = await fetch('cursos.json');
    if (!response.ok) {
      throw new Error('No se pudo cargar la base de datos de cursos (cursos.json).');
    }
    const courses = await response.json();

    // 3. Encontrar el curso específico por su ID
    const course = courses.find(c => c.id == courseId);

    if (!course) {
      throw new Error(`Curso con ID ${courseId} no encontrado.`);
    }

    // 4. Rellenar la plantilla con los datos
    titleEl.innerText = course.name;
    descEl.innerText = course.description;
    infoEl.innerText = course.info;

    // ======================================================
    // ¡NUEVO! Añadir listener al botón de descarga
    // ======================================================
    downloadBtn.addEventListener('click', () => {
      generateCoursePDF(course);
    });
    // ======================================================

  } catch (error) {
    console.error("Error al cargar el curso:", error);
    titleEl.innerText = "Error al Cargar";
    descEl.innerText = error.message;
    if(infoEl) infoEl.innerText = "No se pudo cargar la información adicional.";
  }
}

/**
 * ===================================================================
 * ¡NUEVA FUNCIÓN! Genera un PDF con la info del curso usando jsPDF
 * ===================================================================
 * @param {object} course - El objeto del curso cargado desde cursos.json
 */
function generateCoursePDF(course) {
  try {
    // Importamos jsPDF desde el objeto window (donde se cargó desde el CDN)
    const { jsPDF } = window.jspdf;

    // Inicializamos el documento
    const doc = new jsPDF();

    // Seteamos propiedades del documento
    doc.setFontSize(20);
    doc.text(course.name, 10, 20); // Título

    // Separador
    doc.setLineWidth(0.5);
    doc.line(10, 25, 200, 25);

    // Contenido
    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80); // Un gris oscuro
    doc.text("Sobre este tema:", 10, 35);
    
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Reset a negro
    // 'splitTextToSize' maneja el salto de línea automático
    const infoLines = doc.splitTextToSize(course.info, 180); // 180mm de ancho
    doc.text(infoLines, 10, 45);

    let currentY = 45 + (infoLines.length * 7); // Calculamos dónde sigue

    doc.setFontSize(14);
    doc.setTextColor(80, 80, 80);
    doc.text("Descripción del Curso:", 10, currentY + 10);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    const descLines = doc.splitTextToSize(course.description, 180);
    doc.text(descLines, 10, currentY + 20);

    // Generamos el nombre del archivo (ej: algebra_basica.pdf)
    const fileName = course.name.toLowerCase().replace(/ /g, '_') + '.pdf';
    
    // Guardamos el archivo
    doc.save(fileName);

  } catch (err) {
    console.error("Error al generar el PDF:", err);
    alert("Hubo un error al generar el PDF. Asegúrate de que la librería jsPDF esté cargada.");
  }
}