import React, { useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
import Cropper from 'react-easy-crop'
import Slider from '@material-ui/lab/Slider'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import getCroppedImg from './cropImage'
import { styles } from './styles';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import Paper from '@material-ui/core/Paper';

// import { Input } from '@material-ui/core';

import 'antd/dist/antd.css';
import './style.css';
import Grid from '@material-ui/core/Grid';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import axios from "axios";



// const clothesImg =
//   'https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000'


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
  control: {
    padding: theme.spacing(2),
  }

}));


const Demo = ({ classes}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const [size, setSize] = useState({width: 530, height:540})
  const [hidden, setHidden] = useState(false)
  const [imgRespone, setImgResponse]  = useState(null)
  const [angle, setAngle] = useState(0) 

  const [clothesImg, setImg] = useState('https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000')



  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  
  const onChangeImage = event => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      console.log(img)
      setImg(URL.createObjectURL(img))
      // setSize({width: event.target.offsetWidth, height:event.target.offsetHeight})


    }
  };
  const handleChangeImage = async ()=>{
    const croppedImage = await getCroppedImg(
      clothesImg,
      croppedAreaPixels,
      rotation
    )
    setCroppedImage(croppedImage)
    setHidden(true)
    console.log({croppedImage})
    console.log({hidden})
    axios.post("http://0.0.0.0:5000/api",{
      image: croppedImage,
      angle: rotation

    }
    ).then(res=>{
      setHidden(false)
      console.log(res.data.image)
      setImgResponse(res.data.image)
      setAngle(res.data.angle)
    })
  }



  // const showCroppedImage = useCallback(async () => {

    
  //   // console.log('Base64', { croppedImage })
    
  //   setCroppedImage(croppedImage)
  //   console.log({croppedImage})
  // })
  //   try {
  //     const croppedImage = await getCroppedImg(
  //       clothesImg,
  //       croppedAreaPixels,
  //       rotation
  //     )
  //     // console.log('Base64', { croppedImage })
      
  //     setCroppedImage(croppedImage)
  //     console.log({croppedImage})
  //   } catch (e) {
  //     // console.error(e)
  //   }
  // }, [croppedAreaPixels, rotation])

  const onChangeRotate = (e, rotation) => {
    console.log(rotation)
    setRotation(rotation)
  };
  const handleSubmit= (e)=>{
    e.preventDefault();
    

  }
  const onChange = (e)=>{
    setRotation(e.target.value)
  }
  const onImgLoad = ({ target: img })=>{
    console.log("aaavv",img.offsetHeight)
  }

  

  return (

    
    <div>
      <div className={classes.cropContainer}>
        <Cropper
          // cropSize = {size}
          image={clothesImg}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          // aspect={5/3}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
        />
      </div>
      <div className={classes.controls}>
        <div className={classes.sliderContainer}>
          <Typography
            variant="overline"
            classes={{ root: classes.sliderLabel }}
          >
            Zoom
          </Typography>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            classes={{ container: classes.slider }}
            onChange={(e, zoom) => setZoom(zoom)}
          />
        </div>
        <div className={classes.sliderContainer}>
          <Typography
            variant="overline"
            classes={{ root: classes.sliderLabel }}
          >
            Rotation
          </Typography>
          <Slider
            value={rotation}
            min={0}
            max={360}
            step={1}
            aria-labelledby="Rotation"
            classes={{ container: classes.slider }}
            onChange={onChangeRotate}
            
          />
        </div>
        <Grid >
        <form onSubmit={handleSubmit}>
          <label>
            Angle:
            <input type="number" pattern="[0-9]{0,3}" value={rotation} onChange={onChange}  />
          </label>
          
        </form>

        </Grid>

        
      </div>

          <div className={classes.root}>
                <Grid container spacing={3}>
                  <Grid item xs={6} 
                      container
                      spacing={0}
                      direction="column"
                      alignItems="center"
                      justify="center">
                    
                    <label htmlFor="upload-photo">
                      <input
                        style={{ display: 'none' }}
                        id="upload-photo"
                        name="upload-photo"
                        type="file"
                        onChange={onChangeImage}
                        onLoad={onImgLoad}
                      />

                      <Button color="secondary" variant="contained" component="span">
                      <CloudUploadIcon/> <span>Choose Image</span>
                      </Button>
                    </label>
                  </Grid>
                  <Grid item xs={6}
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justify="center">
                      <Button
                        // onClick={showCroppedImage}
                        onClick = {handleChangeImage}
                        variant="contained"
                        color="primary"
                        classes={{ root: classes.cropButton }}
                      >
                        Transfrom Upright Image
                      </Button>
                  </Grid>

                  
                </Grid>
                <br/>
                <br/>
                 {hidden && <LinearProgress/>}
                 <br/>
                 {/* <img  style = {{width: 400, height:50}} id={'base64image'}  src = {imgRespone}/>
                    <br/>
                    <br/>
          
                    <span>Angle Predict: {angle} degree</span> */}
                 <Grid container className={classes.root} spacing={2}>
                    
                 <Grid item xs={12}
                  container
                  spacing={0}
                  direction="column"
                  alignItems="center"
                  justify="center">
                    <img style = {{width: 500, height:500}} id={'base64image'}  src = {imgRespone}/>
                    <br/>
                    <br/>
          
                    <span>Angle Predict: {angle} degree</span> 

                  </Grid>
                  </Grid>
                 
                  <br/>
                 
      </div>
        
    </div>
  )
}

const StyledDemo = withStyles(styles)(Demo)

const rootElement = document.getElementById('root')
ReactDOM.render(<StyledDemo />, rootElement)
