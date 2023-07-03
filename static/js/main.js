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
            setTimeout(() => {
                btnpredic.disabled = false;
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
        var xhr = new XMLHttpRequest();
        let fd = new FormData();
        fd.append("audio_data", blob, filename);
        xhr.open("POST", "/save", true);
        xhr.send(fd);
    })
    up.click()
    li.classList.add('text-center', 'py-1')
    li.appendChild(document.createTextNode(" "))
    li.appendChild(up)
    recordingsList.appendChild(li);
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
            var image = document.querySelector('.aspect-ratio-container img');
            var imageName = document.querySelector('#imageName span');
            var defaultImage = "https://cdn.pixabay.com/photo/2013/07/12/16/24/alphabet-150831_640.png";
            for (var i = 0; i < birdList.birds.length; i++) {
                var bird = birdList.birds[i];
                console.log(bird.Title)
                if (birdName === 'Desconocido') {
                    image.src = defaultImage;
                    imageName.innerHTML = birdName;
                    Break
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

