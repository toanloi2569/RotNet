import sys
import os

import cv2
import base64
import numpy as np 
import matplotlib.pyplot as plt
from PIL import Image
from io import BytesIO
from flask import Flask, jsonify, request, flash 
from flask_cors import CORS  
from keras.applications.imagenet_utils import preprocess_input
from keras.models import load_model, model_from_json

from utils import RotNetDataGenerator, crop_largest_rectangle, angle_error, rotate

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads/'
# app.config['CORS_HEADERS'] = 'Content-Type'

cors = CORS(app)



# model_ver_1 = load_model('models/rotnet_COCO_resnet50.hdf5', custom_objects={'angle_error': angle_error})
# model_ver_2 = load_model()

with open('models/architecture_ver3/model_ver_3_phase_1.def') as f:
    model_ver_3_phase_1 = model_from_json(f.read())

with open('models/architecture_ver3/model_ver_3_phase_2.def') as f:
    model_ver_3_phase_2 = model_from_json(f.read())

model_ver_3_phase_1.load_weights('models/weight_ver3_phase1_16_0.06.hdf5')
model_ver_3_phase_2.load_weights('models/weight_ver3_phase2_18_2.09_3.29.hdf5')

print('load model successfully')
model_ver_3_phase_1.summary()


@app.route('/', methods=['POST'])
def get_request():
    file = request.files['file']
    path_file = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(path_file)

    buffered = BytesIO()
    rotated_image, predicted_angle = predict(model, path_file)
    rotated_image = Image.fromarray(rotated_image, 'RGB')
    rotated_image.save(buffered, format="JPEG")
    return jsonify({
        'angle': int(predicted_angle), 
        'image' : base64.b64encode(buffered.getvalue()).decode("ascii")
        }), 200
		
    
def predict(model, input_path, batch_size=64, crop=True):
    predictions = model.predict_generator(
        RotNetDataGenerator(
            [input_path],
            input_shape=(224, 224, 3),
            batch_size=64,
            one_hot=True,
            preprocess_func=preprocess_input,
            rotate=False,
            crop_largest_rect=True,
            crop_center=True
        ),
        val_samples=1
    )

    predicted_angle = np.argmax(predictions, axis=1)[0]
    image = cv2.imread(input_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    rotated_image = rotate(image, -predicted_angle)
    if crop:
        size = (image.shape[0], image.shape[1])
        rotated_image = crop_largest_rectangle(rotated_image, -predicted_angle, *size)
    return rotated_image, predicted_angle

if __name__ == '__main__':
    from argparse import ArgumentParser
    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000,
                        type=int, help='port listening')
    args = parser.parse_args()
    port = args.port
    app.secret_key = 'super secret key'
    app.run(host='0.0.0.0', port=port, debug=False, threaded=False, processes=1)
