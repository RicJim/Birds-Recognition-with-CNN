//Change imagen
let cargar = document.getElementById('load');
cargar.addEventListener('click', cargarArchivo);

function cargarArchivo() {
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = '.wav';
    input.onchange = function (event) {
    var archivo = event.target.files[0];
    var nombreArchivo = 'tmp.wav';

    var formData = new FormData();
    formData.append('archivo', archivo, nombreArchivo);
    clearBirdImageAndName();

    fetch('/guardar-archivo', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        var audiosCargadosDiv = document.getElementById('audios-cargados');
        var audioElement = document.createElement('audio');
        audioElement.src = data.url;
        audioElement.controls = true;

        var LoadList = document.getElementById('audios-cargados');
        if (LoadList.childElementCount >= 2) {
            LoadList.removeChild(LoadList.firstChild);
        }

        audiosCargadosDiv.appendChild(audioElement);
    })
    .catch(error => console.error('Error:', error));
    };

    input.click();
}
  

/*
//Para cambiar la imagen (Descartado)
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
*/

//Navbar button collapse
$(document).ready(function(){
    $('.navbar-toggler').on('click', function(){
        var target = $(this).data('target');
        $(target).collapse('toggle');
    });
});