# Correcting Image Orientation Using Convolutional Neural Networks

This repository has followed the blog [Correcting Image Orientation Using Convolutional Neural Networks](https://d4nst.github.io/2017/01/12/image-orientation/) and repository [Rotnet](https://github.com/d4nst/RotNet)

## Model

Model version 1:
- Download the [model](https://drive.google.com/file/d/1-xWzmqLurACR5xhTutGmnfTdCSEtFVFe/view?usp=sharing) and move to `models/` folder
Model version 2:  
pass  
Model version 3:  
- Download the [model_phase_1](https://drive.google.com/file/d/10UlLFhwh_FyT6EGU73-3qAq2UJsCYwKR/view?usp=sharing) and move to `models/` folder
- Download the [model_phase_2](https://drive.google.com/file/d/106x58v3T_ztFexJROOEbZIPuTnAtDCM3/view?usp=sharing) and move to `models/` folder
## Test

Orientation images  
`python correct_rotation.py <path_to_hdf5_model> <path_to_input_image_or_directory>`  

- `-o, --output` to specify the output image or directory.  
- `-b, --batch_size` to specify the batch size used to run the model.  
- `-c, --crop to` crop out the black borders after rotating the images.  

## Server

Run server  
`python server.py`

Use postman and POST request to `localhost:5000/` a picture for oriented this image  
