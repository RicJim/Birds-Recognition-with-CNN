from flask import Flask, render_template, request, redirect, flash, jsonify

import numpy as np
#from keras.models import model_from_json
import librosa as lb
import os

ruta = 'static/uploads'

#audio file
file_path = ruta + '/tmp.wav'

#Mel Spectogram parameters
RATE = 44100
NFFT = 20248 #SIZE FFT
HOPL = 320 #Step between windows
MEL = 128
out = ruta + '/tmp.npy'

#File Upload
APP_ROOT = os.path.abspath(os.path.dirname(__file__))
label = ["Acanthidops bairdi - Pinzón piquiagudo","Amazona Auropalliata - Nuca amarilla",
"Amazona Oratrix - Loro rey","Ara ambiguus - Guacamaya verde","Chlorophonia callophrys - Fruterito de cejas doradas",
"Harpia harpyja - Águila arpía","Laterallus Jamaicensis - Burrito cuyano","Pitangus sulphuratus - Bienteveo Grande",
"Pyrrhura picta eisenmanni - Perico carato","Ramphocelus dimidiatus - tangara dorsirroja","Setophaga chrysoparia - Reinita caridorada",
"Thraupis episcopus - Tangara Azuleja","Troglodytes aedon - Sotorrey comun","Turdus grayi - zorzal pardo"]

app = Flask(__name__)
app.config['SECRET_KEY'] = 'supersecretkey'
app.config['UPLOAD_FOLDER'] = ruta

model = None
#Load Model
#def load_model():
    #json_file = open('app/model/model.json','r')
    #model_json = json_file.read()
    #json_file.close()
    #global model
    #model = model_from_json(model_json)
    #model.load_weights("app/model/model.h5")

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/catalogo')
def catalogo():
    return render_template('catalogo.html')

@app.route('/ayuda')
def ayuda():
    return render_template('ayuda.html')

@app.route('/save',methods=['POST'])
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

@app.route('/spec', methods = ['GET','POST'])
def spec():
    if request.method == 'POST':
        #Audio capture and sampling
        y, sr = lb.load(file_path, sr=RATE)

        #Audio Mono
        audio_mono = lb.to_mono(y)

        #Audio to Spectogram
        Mel_Spect = lb.feature.melspectrogram(y=audio_mono, sr=sr, n_mel=MEL, n_fft=NFFT, hop_length=HOPL, win_length=NFFT)

        #Mel Spectogram
        Mel_spect_db = lb.power_to_db(Mel_Spect, ref=np.max)

        #Redimensionar Mel Spectrogram
        resized_Mel_spect_db = Image.fromarray(Mel_spect_db)
        resized_Mel_spect_db = resized_Mel_spect_db.resize((128,128),resample=Image.BILINEAR)

        #Convertir la imagen redimensionada a matriz nuevamente
        resized_Mel_spect_db = np.array(resized_Mel_spect_db)

        #Obtener nombre del archivo
        file_name = os.path.basename(audio).split('.')[0]

        #guardar archivo '.npy'
        np.save(out, resized_Mel_spect_db)

        #Preprocess
        load_npy = np.load(out)
        load_npy = np.expand_dims(load_npy, axis=-1)
        load_npy = np.expand_dims(load_npy, axis=0)
        load_npy = load_npy/255.0
        
        #Predic
        array = modelo.predict(load_npy)
        resultado = np.round(array*100)
        
        if resultado > 60:
            birdID = str(label[int(respuesta)])
        else:
            birdID = 'Desconocido'

        return birdID
    #Mel Spectrogram
    return None

if __name__ == '__main__':
    #load_model()
    app.run(debug=True, port=os.getenv("PORT", default=5000))