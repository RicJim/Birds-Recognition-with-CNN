URL = window.URL || window.webkitURL;

let gumStream;
let rec;
let input;

let AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext

let btnrecord = document.getElementById("record");
let btnpredic = document.getElementById("predic");

btnrecord.addEventListener("click", recording);
btnpredic.addEventListener("click", spectogramConvert);

function recording() {
    const constraints = { audio: true, video: false }
    //btnrecord.disabled = true;
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            audioContext = new AudioContext();

            gumStream = stream;
            input = audioContext.createMediaStreamSource(stream);
            rec = new Recorder(input, { numChannels: 1 })

            rec.record();
            const lightContainer = document.querySelector('.light');
            lightContainer.classList.add('recording')
            setTimeout(() => {
                btnpredic.disabled = false;
                lightContainer.classList.remove('recording');
                rec.stop();
                gumStream.getAudioTracks()[0].stop();
                rec.exportWAV(createDownloadLink);
            }, 10000);
        })
        .catch(function (err) {
            btnrecord.disabled = false;
            console.log(err)
        });
}

function createDownloadLink(blob) {
    let url = URL.createObjectURL(blob);
    let au = document.createElement('audio');
    let li = document.createElement('li');
    let link = document.createElement('a');

    var filename = new Date().toISOString();
    au.controls = true;
    au.src = url;

    link.href = url;
    link.download = filename + ".wav";
    link.innerHTML = "Save File";

    li.appendChild(au);
    //li.appendChild(document.createTextNode(filename+".wav"))
    li.appendChild(link);

    var up = document.createElement('a');
    up.href = "#";
    up.innerHTML = "Upload";
    up.setAttribute("id", "subir")
    //up.hidden = true;

    up.addEventListener("click", function (event) {
        event.preventDefault();
        var xhr = new XMLHttpRequest();
        let fd = new FormData();
        fd.append("audio_data", blob, filename);
        xhr.open("POST", "/save", true);
        xhr.send(fd);
        clearBirdImageAndName();
    })

    li.classList.add('text-center', 'py-1')
    li.appendChild(document.createTextNode(" "))
    li.appendChild(up)

    var recordingsList = document.getElementById('recordingsList');
    if (recordingsList.childElementCount >= 2) {
        recordingsList.removeChild(recordingsList.firstChild);
    }
    
    recordingsList.appendChild(li);
    
    up.click()
}

function spectogramConvert() {
    //btnpredic.disabled = true;
    jQuery.ajax({
        type: 'POST',
        url: '/spec',
        contentType: false,
        cache: false,
        processData: false,
        async: true,
        success: function (response) {
            //Get and display the result
            //btnrecord.disabled = false;
            birdName = response;
            birdIMG(birdName);
        },
    });
}

function birdIMG(birdName) {
    fetch('static/uploads/main.json')
        .then(response => response.json())
        .then(data => {
            var birdList;
            birdList = data;
            var image = document.getElementById('image');
            var imageName = document.getElementById('imageName');
            var defaultImage = "https://cdn.pixabay.com/photo/2013/07/12/16/24/alphabet-150831_640.png";
            for (var i = 0; i < birdList.birds.length; i++) {
                var bird = birdList.birds[i];
                if (birdName === 'Desconocido') {
                    image.src = defaultImage;
                    imageName.innerHTML = birdName;
                    break;
                } else if (birdName === bird.Title) {
                    if (bird.Poster !== "") {
                        image.src = bird.Poster;
                    } else {
                        image.src = defaultImage;
                    }
                    imageName.innerHTML = birdName;
                    break;
                }
            }
        })
        .catch(error => {
            console.log(error);
        });
}

function clearBirdImageAndName() {
    let imageElement = document.getElementById("image");
    let imageNameElement = document.getElementById("imageName");

    //Limpiar la imagen y el nombre
    imageElement.src = "";
    imageNameElement.innerText = "";
}