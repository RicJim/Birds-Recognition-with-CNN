from flask import Flask, render_template, request, redirect

import numpy as np
import librosa as lb
import os

ruta = 'static/uploads'

#audio file
file_path = ruta + '/tmp.wav'

#Mel Spectogram parameters
RATE = 44100
NFFT = 1024 #SIZE FFT
HOPL = 320 #Step between windows
out = ruta + '/tmp.npy'


label = ["Acanthidops bairdi - Pinzón piquiagudo","Amazona Auropalliata - Nuca amarilla","Amazona Oratrix - Loro rey","Ara ambiguus - Guacamaya verde",
        "Chlorophonia callophrys - Fruterito de cejas doradas","Harpia harpyja - Águila arpía","Laterallus Jamaicensis - Burrito cuyano",
        "Myadestes melanops - Solitario carinegro","Pharopmachrus mocinno - Quetzal","Poliocrania exsul - Hormiguero dorsicastaño",
        "Pyrrhura picta eisenmanni - Perico carato","Setophaga chrysoparia - Reinita caridorada","Spizaetus ornatus - Aguilillo adornado"]

app = Flask(__name__)
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['UPLOAD_FOLDER'] = ruta

model = None

#Load Model
#def load_model():

#Predic
def predic(file):
    x = np.load(file)
    x = np.expand_dims(x, axis=-1)
    x = np.expand_dims(x, axis=0)
    x = x/255.0

    prediction = model.predict(x)
    resultado = np.round(prediction*100)

    if resultado >= 60:
        respuesta = np.argmax(resultado)
        bird = str(label[int(respuesta)])
    else:
        bird = "Desconocido"
    return bird

@app.route('/')
def index():
    return render_template('index.html')

@app.route("/catalogo")
def catalogo():
    return render_template("catalogo.html")

@app.route("/ayuda")
def ayuda():
    return render_template("ayuda.html")

@app.route("/save",methods=['GET','POST'])
def save():
    if request.method == "POST":
        file = request.files['audio_data']
        if file.filename == '' or file is None:
            flash('No selected file')
            return redirect(request.url)
        else:
            file.save(file.save(os.path.join(APP_ROOT,app.config['UPLOAD_FOLDER'],"tmp.wav")))
        return render_template('index.html', request="POST")
    else:
         return render_template("index.html")

@app.route('/spec', methods = ['GET', 'POST'])
def spec():
    if request.method == 'POST':
        #Audio capture and sampling
        y, sr = lb.load(file_path, sr=RATE)
        #Audio Mono
        audio_mono = lb.to_mono(y)

        #Audio to Spectogram
        Mel_Spect = lb.feature.melspectrogram(y=audio_mono, sr=sr, n_fft=NFFT, hop_length=HOPL, win_length=NFFT)

        #Mel Spectogram
        Mel_spect_db = lb.power_to_db(Mel_Spect, ref=np.max)

        np.save(out, Mel_spect_db)
        def pred():
            #Spectogram
            bird_name = predic(out)
            return bird_name
        birdID = pred()
        return birdID

if __name__ == '__main__':
    app.run(debug=True, port=os.getenv("PORT", default=5000))
