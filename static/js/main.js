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
    btnrecord.disabled = true;
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
            btnrecord.disabled = false;
            birdName = birdID;
            birdIMG(birdName);
        },
    });
}

let label = [
    "Acanthidops bairdi - Pinzón piquiagudo",
    "Amazona Auropalliata - Nuca amarilla",
    "Amazona Oratrix - Loro rey",
    "Ara ambiguus - Guacamaya verde",
    "Chlorophonia callophrys - Fruterito de cejas doradas",
    "Harpia harpyja - Águila arpía",
    "Laterallus Jamaicensis - Burrito cuyano",
    "Pitangus sulphuratus - Bienteveo Grande",
    "Pyrrhura picta eisenmanni - Perico carato",
    "Ramphocelus dimidiatus - tangara dorsirroja",
    "Setophaga chrysoparia - Reinita caridorada",
    "Thraupis episcopus - Tangara Azuleja",
    "Troglodytes aedon - Sotorrey comun",
    "Turdus grayi - zorzal pardo",
];

function birdIMG(birdName) {
    if (birdName == label[0]) {
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/47233731/1200";
    } else if (birdName == label[1]) {
        image.src = "https://www.barrameda.com.ar/wp-content/uploads/2019/12/lora-nuca-amarilla.jpg";
    } else if (birdName == label[2]) {
        image.src = "https://avesexoticas.org/wp-content/uploads/2017/10/Loro-Baceza-Amarilla-Amazona-oratrix-1024x680.jpg";
    } else if (birdName == label[3]) {
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/245390831/1200";
    } else if (birdName == label[4]) {
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/243972201/1200";
    } else if (birdName == label[5]) {
        image.src = "https://cdn1.matadornetwork.com/blogs/2/2019/01/aguila-arpia.jpg";
    } else if (birdName == label[6]) {
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/480560721/";
    } else if (birdName == label[7]) {
        image.src = "https://lh4.ggpht.com/d7FLvfHHlVscO-nCsvIpLYtTZewrn-QgseBIGa5xz-qvY4xqmDRU4EwSJEB2yFxv-1bQD5xqHuOnDLBM1XUC=s600";
    } else if (birdName == label[8]) {
        image.src = "https://estaticos-cdn.elperiodico.com/clip/3424569b-4f02-4186-8bcc-ac218d277b31_alta-libre-aspect-ratio_default_0.jpg";
    } else if (birdName == label[9]) {
        image.src = "https://live.staticflickr.com/65535/48731968408_7bc08ea5b8_b.jpg";
    } else if (birdName == label[10]) {
        image.src = "https://upload.wikimedia.org/wikipedia/commons/9/98/Azuero_Parakeet.jpg";
    } else if (birdName == label[11]) {
        image.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Dendroica_chrysoparia1.jpg/1200px-Dendroica_chrysoparia1.jpg";
    } else {
        image.src = "https://cdn.download.ams.birds.cornell.edu/api/v1/asset/326175571/1200";
    }
    imageName.innerHTML = birdName;
}