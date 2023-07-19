from flask import Flask, render_template, request, redirect, flash, jsonify

import numpy as np
from keras.models import model_from_json
import librosa as lb
import os
from PIL import Image

ruta = 'static/uploads'

#audio file
file_path = os.path.join(ruta, 'tmp.wav')

#Mel Spectogram parameters
RATE = 44100
NFFT = 2048 #SIZE FFT
HOPL = 320 #Step between windows
MEL = 128

#File Upload
APP_ROOT = os.path.abspath(os.path.dirname(__file__))
label = ["Actitis macularius - Playero coleador", "Amazona Oratrix - Loro rey", "Brotogeris jugularis - Perico barbinaranja",
    "Columba livia - Paloma domestica", "Crotophaga ani - Garrapatero piquiliso", "Harpia harpyja - Águila arpía",
    "Laterallus Jamaicensis - Burrito cuyano", "Pandion haliaetus - Águila pescadora", "Pitangus sulphuratus - Bienteveo grande",
    "Ramphocelus dimidiatus - Tangara dorsirroja", "Thraupis episcopus - Tangara azuleja", "Todirostrum cinereum - Espatulilla común",
    "Troglodytes aedon - Sotorrey común", "Turdus grayi - Zorzal pardo"]

app = Flask(__name__)
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['UPLOAD_FOLDER'] = ruta

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/catalogo')
def catalogo():
    return render_template('catalogo.html')

@app.route('/ayuda')
def ayuda():
    return render_template('ayuda.html')

@app.route('/save', methods=['POST'])
def save():
    if request.method == "POST":
        file = request.files['audio_data']
        if file.filename == '' or file is None:
            flash('No selected file')
            return redirect(request.url)
        else:
            file.save(os.path.join(APP_ROOT,app.config['UPLOAD_FOLDER'],"tmp.wav"))
        return render_template('index.html', request="POST")
    else:
         return render_template("index.html")

@app.route('/guardar-archivo', methods=['POST'])
def guardar_archivo():
    lastfile = os.path.join(os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], 'tmp.wav'))
    if os.path.exists(lastfile):
        os.remove(lastfile)

    file = request.files['archivo']
    file.save(os.path.join(app.root_path, app.config['UPLOAD_FOLDER'], 'tmp.wav'))

    # Devolver la URL del archivo cargado
    url = request.host_url + 'static/uploads/tmp.wav'
    return jsonify({'url': url})

@app.route('/spec', methods = ['GET','POST'])
def spec():
    if request.method == 'POST' and model is not None:
        #Audio capture and sampling
        y, sr = lb.load(file_path, sr=RATE)

        #Audio Mono
        audio_mono = lb.to_mono(y)

        #Audio to Spectogram
        Mel_Spect = lb.feature.melspectrogram(y=audio_mono, sr=sr, n_mels=MEL, n_fft=NFFT, hop_length=HOPL, win_length=NFFT)

        #Mel Spectogram
        Mel_spect_db = lb.power_to_db(Mel_Spect, ref=np.max)

        #Redimensionar Mel Spectrogram
        resized_Mel_spect_db = Image.fromarray(Mel_spect_db)
        resized_Mel_spect_db = resized_Mel_spect_db.resize((128,128),resample=Image.BILINEAR)

        #Convertir la imagen redimensionada a matriz nuevamente
        data_mel = np.array(resized_Mel_spect_db)

        data_mel = np.expand_dims(data_mel, axis=-1)
        data_mel = np.expand_dims(data_mel, axis=0)
        data_mel = data_mel/255.0

        #Predic
        array = model.predict(data_mel)
        resultado = np.round(array*100)
        max_resultado = np.max(resultado)
        
        if max_resultado > 50:
            birdID = np.argmax(resultado)
            print(birdID)
            birdName = label[birdID]
        else:
            birdName = 'Desconocido'

        return birdName
    #Mel Spectrogram
    return 'Desconocido'

model = None
model_path = os.path.join('models', 'model.json')
weights_path = os.path.join('models', 'modelW.h5')
#Load Model
def load_model():
    #json_file = open('models/model.json','r')
    #model_json = json_file.read()
    #json_file.close()

    with open(model_path, 'r') as json_file:
        model_json = json_file.read()

    global model
    model = model_from_json(model_json)
    model.load_weights(weights_path)

if __name__ == '__main__':
    load_model()
    app.run(host='0.0.0.0', debug=True, port=os.getenv("PORT", default=5000), threaded=True)