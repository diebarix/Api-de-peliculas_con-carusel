document.addEventListener("DOMContentLoaded", function () {
  let pagina = 1;
  let peliculas = [];
  let ultimaPelicula;
  const observador = new IntersectionObserver(
    (entradas, observador) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          pagina++;
          cargarPeliculas();
        }
      });
    },
    {
      rootMargin: "0px 0px 150px 0px",
      threshold: 1.0,
    }
  );

  const cargarPeliculas = async () => {
    try {
      const respuesta = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=8732984fbae139504e75aa18e79295ec&language=es-MX&page=${pagina}`
      );

      if (respuesta.status === 200) {
        const datos = await respuesta.json();
        /*             let cont = 1;
            cont = cont + 1;
            console.log(cont); */
        let cors = [];
        const cargar_datos = await datos.results.forEach((pelicula) => {
          const movie = pelicula.poster_path;
          const title = pelicula.title;
          if (cors.length <= 1000) {
            cors += `<div class='carousel_images'><img src="https://image.tmdb.org/t/p/w500/${movie}"></div>`;
            document.getElementById("carousel__lista").innerHTML = cors;

            //Carrousel
            window.addEventListener("scroll", () => {
              new Glider(document.getElementById("carousel__lista"), {
                slidesToShow: 4,
                slidesToScroll: 2,
                dots: ".carousel__indicadores",
                /*            arrows: {
                      prev: ".carousel__anterior",
                      next: ".carousel__siguiente",
                    }, */
              });
            });
          }
          peliculas += `
            <div class="pelicula">
            <img class="poster" src="https://image.tmdb.org/t/p/w500/${movie}">
            <h3 class="titulo">${title}</h3>
            </div>`;
        });
        document.getElementById("contenedor").innerHTML = peliculas;

        if (pagina < 1000) {
          if (ultimaPelicula) {
            observador.unobserve(ultimaPelicula);
          }

          const peliculasPantalla = document.querySelectorAll(
            ".contenedor .pelicula"
          );

          ultimaPelicula = peliculasPantalla[peliculasPantalla.length - 1];
          observador.observe(ultimaPelicula);
        }
      } else if (respuesta.status === 401) {
        console.log("pusiste mal la llave");
      } else if (respuesta.status === 404) {
        console.log("La pelicula no existe");
      } else {
        console.log("Error inesperado");
      }
    } catch (error) {
      console.log(error);
    }
  };
  cargarPeliculas();
});
