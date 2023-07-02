function LoadJson() {
    fetch('static/uploads/main.json')
        .then(response => response.json())
        .then(data => { json = data.birds; mostrarPosters(); })
        .catch(error => { console.log(error); });
}

//Gallery
function mostrarPosters() {
    const gallery = document.getElementById("image-gallery");
    gallery.innerHTML = "";

    json.forEach((item) => {
        const { Name, Poster } = item;

        // Crear el elemento de imagen
        const imageItem = document.createElement("div");
        imageItem.classList.add("col-md-3", "mb-4");

        const card = document.createElement("div");
        card.classList.add("card");

        const imageWrapper = document.createElement("div");
        imageWrapper.classList.add("image-wrapper");

        const image = document.createElement("img");
        image.src = Poster;
        image.alt = Name;

        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");

        const cardTitle = document.createElement("h6");
        cardTitle.classList.add("card-title", "bird-name");
        cardTitle.textContent = Name;
        cardTitle.setAttribute("data-name", Name);

        cardBody.appendChild(cardTitle);
        imageWrapper.appendChild(image);
        card.appendChild(imageWrapper);
        card.appendChild(cardBody);
        imageItem.appendChild(card);
        gallery.appendChild(imageItem);
    });


    $('#image-gallery').on('click', '.bird-name', function() {
        const name = $(this).data('name');

        // Mostrar la pantalla transparente con la información del ave
        showOverlay(name);
    });
}

function showOverlay(name) {
    const overlay = $('#overlay');
    const overlayImage = $('#overlay-image');
    const overlayTitle = $('#overlay-title');
    
    const birdData = json.find(item => item.Name === name);
    const imageSrc = birdData.Poster;
    const title = birdData.Title;

    overlayImage.attr('src', imageSrc);
    overlayTitle.text(title);

    overlay.fadeIn();

    document.addEventListener('click', function(event) {
        const overlay = document.getElementById('overlay');
        if(event.target === overlay){
            $(overlay).fadeOut();
        }
    });
}

LoadJson();
