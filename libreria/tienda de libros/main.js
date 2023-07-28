/* Función para mostrar libros más vistos */
$(document).ready(function () {
  // Llamar a la función para mostrar los libros más vistos al cargar la página
  mostrarLibrosMasVistos();
});

function mostrarLibrosMasVistos() {
  const url = "https://www.etnassoft.com/api/v1/get/?criteria=most_viewed";

  $.ajax({
    url: url,
    method: "GET",
    dataType: "json",
    success: function (response) {
      // Verifica si hay datos en la respuesta antes de iterar sobre ellos
      if (response && Array.isArray(response)) {
        mostrarResultadosLibrosMasVistos(response); // Llamar a la función que muestra los resultados
      } else {
        console.log("No se encontraron libros más vistos.");
      }
    },
    error: function (error) {
      console.log("Error al obtener los libros más vistos:", error);
    },
  });
}

function mostrarResultadosLibrosMasVistos(books) {
  const mainContent = $("main");
  mainContent.empty();

  books.forEach(function (book) {
    const libroDiv = $("<div class='libro'></div>");

    // Imagen de portada
    if (book.cover && book.cover !== "") {
      const portadaImg = $("<img src='" + book.cover + "' alt='Portada del libro'>");
      libroDiv.append(portadaImg);
    }

    // Detalles del libro
    const tituloH2 = $("<h2>" + book.title + "</h2>");
    const autorP = $("<p>Autor: " + book.author + "</p>");
    const contenidoP = $("<p>Contenido: " + book.content_short + "</p>");
    const editorialP = $("<p>Editorial: " + book.publisher + "</p>");

    libroDiv.append(tituloH2, autorP, contenidoP, editorialP);
    mainContent.append(libroDiv);
  });
}

/* Función para mostrar categorías */

$(document).ready(function () {
  // Llamar a la función para mostrar las categorías al cargar la página
  mostrarCategorias();
});

function mostrarCategorias() {
  const url = "https://www.etnassoft.com/api/v1/get/?get_categories=all";

  $.ajax({
    url: url,
    method: "GET",
    dataType: "json",
    success: function (response) {
      mostrarResultadosCategorias(response);
    },
    error: function (error) {
      console.log("Error al obtener las categorías de libros:", error);
    },
  });
}

function mostrarResultadosCategorias(categories) {
  const resultadosDiv = $(".resultados");
  resultadosDiv.empty();

  resultadosDiv.append("<h2>Categorías de libros:</h2>");
  const ul = $("<ul></ul>");

  categories.forEach(function (category) {
    ul.append("<li>" + category.name + "</li>");
  });

  resultadosDiv.append(ul);
}

/* Función para guardar el libro en "Mis Libros" desde la categoría */
function guardarLibroDesdeCategoria() {
  const titulo = $(this).data("titulo");
  const autor = $(this).data("autor");

  // Verificar si el libro ya está en la biblioteca personal
  const bibliotecaPersonal = JSON.parse(localStorage.getItem("bibliotecaPersonal")) || [];
  const libroExistente = bibliotecaPersonal.find((libro) => libro.titulo === titulo && libro.autor === autor);

  if (libroExistente) {
    alert("El libro ya está en tu biblioteca personal.");
  } else {
    // Agregar el libro a la biblioteca personal
    bibliotecaPersonal.push({ titulo, autor });
    localStorage.setItem("bibliotecaPersonal", JSON.stringify(bibliotecaPersonal));
    alert("El libro ha sido agregado a tu biblioteca personal.");
  }
}

function mostrarLibrosPorCategoria(categoriaId) {
  const url = "https://www.etnassoft.com/api/v1/get/?category_id=" + categoriaId;

  $.ajax({
    url: url,
    method: "GET",
    dataType: "json",
    success: function (response) {
      // Verifica si hay datos en la respuesta antes de iterar sobre ellos
      if (response && Array.isArray(response)) {
        mostrarResultadosLibrosPorCategoria(response); // Llamar a la función que muestra los resultados
      } else {
        console.log("No se encontraron libros para esta categoría.");
      }
    },
    error: function (error) {
      console.log("Error al obtener los libros por categoría:", error);
    },
  });
}

function mostrarResultadosLibrosPorCategoria(books) {
  const mainContent = $("main");
  mainContent.empty();

  books.forEach(function (book) {
    const libroDiv = $("<div class='libro'></div>");
    const tituloH2 = $("<h2>" + book.title + "</h2>");
    const autorP = $("<p>Autor: " + book.author + "</p>");

    // Verificar si hay una URL de portada disponible
    if (book.cover && book.cover !== "") {
      const portadaImg = $("<img src='" + book.cover + "' alt='Portada del libro'>");
      libroDiv.append(portadaImg);
    }

    const detalleP = $("<p>Detalle: " + book.content_short + "</p>");

    // Agregar un botón para guardar el libro en "Mis Libros"
    const guardarBoton = $("<button class='boton-guardar' data-titulo='" + book.title + "' data-autor='" + book.author + "'>Guardar en Mis Libros</button>");
    guardarBoton.on("click", guardarLibroDesdeCategoria);

    libroDiv.append(tituloH2, autorP, detalleP, guardarBoton);
    mainContent.append(libroDiv);
  });
}

/* Función para buscar libros por ID */
function buscarLibrosPorID() {
  const libroID = prompt("Ingresa el ID del libro que deseas buscar:");

  // Verificar si el usuario ingresó un ID válido
  if (libroID !== null && libroID.trim() !== "") {
    const url = "https://www.etnassoft.com/api/v1/get/?id=" + libroID;

    $.ajax({
      url: url,
      method: "GET",
      dataType: "json",
      success: function (response) {
        mostrarDetalleLibro(response); // Llamar a la función que muestra el detalle del libro
      },
      error: function (error) {
        console.log("Error al obtener el detalle del libro:", error);
      },
    });
  } else {
    alert("Debes ingresar un ID válido");
  }
}

// Función para mostrar el detalle del libro en el contenido principal
function mostrarDetalleLibro(libro) {
  const mainContent = $("main");
  mainContent.empty();

  // Verificar si el libro recibido es válido y tiene la propiedad 'title'
  if (libro && libro.title) {
    mainContent.append("<div class='libro'><h2>" + libro.title + "</h2><p>Autor: " + libro.author + "</p></div>");
  } else {
    mainContent.append("<p>Libro no encontrado</p>");
  }
}

/* Función para mostrar Mis libros */
function guardarLibro(titulo, autor) {
  // Verificar si el libro ya está en la biblioteca personal
  const bibliotecaPersonal = JSON.parse(localStorage.getItem('bibliotecaPersonal')) || [];
  const libroExistente = bibliotecaPersonal.find(libro => libro.titulo === titulo && libro.autor === autor);

  if (libroExistente) {
    alert('El libro ya está en tu biblioteca personal.');
  } else {
    // Agregar el libro a la biblioteca personal
    bibliotecaPersonal.push({ titulo, autor });
    localStorage.setItem('bibliotecaPersonal', JSON.stringify(bibliotecaPersonal));
    alert('El libro ha sido agregado a tu biblioteca personal.');
  }
}

function eliminarLibro(titulo, autor) {
  // Obtener la biblioteca personal desde localStorage
  let bibliotecaPersonal = JSON.parse(localStorage.getItem('bibliotecaPersonal')) || [];

  // Filtrar los libros y eliminar el libro correspondiente
  bibliotecaPersonal = bibliotecaPersonal.filter(libro => libro.titulo !== titulo || libro.autor !== autor);

  // Guardar la nueva biblioteca personal en localStorage
  localStorage.setItem('bibliotecaPersonal', JSON.stringify(bibliotecaPersonal));

  // Mostrar nuevamente la lista de libros guardados
  mostrarMisLibros();
}

function mostrarMisLibros() {
  // Obtener la biblioteca personal desde localStorage
  const bibliotecaPersonal = JSON.parse(localStorage.getItem('bibliotecaPersonal')) || [];

  // Mostrar los libros guardados en la biblioteca personal
  const resultadosDiv = $('.resultados');
  resultadosDiv.empty();
  resultadosDiv.append('<h2>Mis Libros:</h2>');

  if (bibliotecaPersonal.length === 0) {
    resultadosDiv.append('<p>No has guardado ningún libro aún.</p>');
  } else {
    const ul = $('<ul></ul>');
    bibliotecaPersonal.forEach(libro => {
      const li = $('<li></li>');
      const tituloSpan = $('<span class="libro-titulo">' + libro.titulo + '</span>');
      const autorSpan = $('<span class="libro-autor">' + libro.autor + '</span>');
      const botonEliminar = $('<button class="boton-eliminar">Eliminar</button>');

      // Asignar el evento click al botón "Eliminar" con los datos del libro correspondiente
      botonEliminar.on("click", function () {
        eliminarLibro(libro.titulo, libro.autor); // Pasar los datos del libro para eliminar correctamente
      });

      li.append(tituloSpan, autorSpan, botonEliminar);
      ul.append(li);
    });
    resultadosDiv.append(ul);
  }
}

// Asignar evento click para el botón "Guardar en Mis Libros" en la función mostrarResultadosLibrosPorCategoria
$(document).on("click", ".boton-guardar", function () {
  const titulo = $(this).data("titulo");
  const autor = $(this).data("autor");
  guardarLibro(titulo, autor);
});

// Llamar a la función mostrarMisLibros al cargar la página
$(document).ready(function () {
  mostrarMisLibros();
});