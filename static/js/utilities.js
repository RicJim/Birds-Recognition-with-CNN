//Change imagen
let image = document.getElementById('image');
let imageName = document.getElementById('imageName');

let json = [];
let indiceActual = 0;

function LoadJson() {
    fetch('static/uploads/main.json')
        .then(response => response.json())
        .then(data => { json = data.birds; })
        .catch(error => { console.log(error); });
}

function changeImage(direccion) {
    if (indiceActual < json.length && direccion === "forward") {
        indiceActual++;
    } else if (indiceActual >= 0 && direccion === "backward") {
        indiceActual--;
    }

    if (indiceActual > json.length - 1) {
        indiceActual = 0;
    } else if (indiceActual < 0) {
        indiceActual = json.length - 1;
    }

    const elementoActual = json[indiceActual];
    image.src = elementoActual.Poster;
    imageName.textContent = elementoActual.Title;
}

LoadJson();

//Navbar button collapse
$(document).ready(function(){
    $('.navbar-toggler').on('click', function(){
        var target = $(this).data('target');
        $(target).collapse('toggle');
    });
});