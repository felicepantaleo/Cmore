
import React from 'react';
import { View, Text } from 'react-native';
import { Camera, Permissions } from 'expo';
import useModel from './useModel'
import Canvas from 'react-native-canvas';

export default class CameraPage extends React.Component {
   //model = cocoSSD.load('lite_mobilenet_v2');
  model = useModel(process.env.PUBLIC_URL + '/model_web');
  camera = null;

    state = {
        hasCameraPermission: null,
    };
    async componentDidMount() {

        const camera = await Permissions.askAsync(Permissions.CAMERA);
        const audio = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        const hasCameraPermission = (camera.status === 'granted' && audio.status === 'granted');

        this.setState({ hasCameraPermission });
    };

    render() {
        const { hasCameraPermission } = this.state;

        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>Access to camera has been denied.</Text>;
        };

    detectFrame = (Camera, model) => {
        model.detect(Camera).then(predictions => {
            this.renderPredictions(predictions);
            requestAnimationFrame(() => {
            this.detectFrame(Camera, model);
            });
        });
        }
    

    renderPredictions = predictions => {
        const ctx = Expo2DContext(canvas);
        
        canvas.width  = 1080;
        canvas.height = 1920;
    
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        // Font options.
        const font = "16px sans-serif";
        ctx.font = font;
        ctx.textBaseline = "top";
        ctx.drawImage(Camera,0, 0,1080,1920);
    
        predictions.forEach(prediction => {
            const x = prediction.bbox[0];
            const y = prediction.bbox[1];
            const width = prediction.bbox[2];
            const height = prediction.bbox[3];
            // Draw the bounding box.
            ctx.strokeStyle = "#00FFFF";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
            // Draw the label background.
            ctx.fillStyle = "#00FFFF";
            const textWidth = ctx.measureText(prediction.class).width;
            const textHeight = parseInt(font, 10); // base 10
            ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
        });
    
        predictions.forEach(prediction => {
            const x = prediction.bbox[0];
            const y = prediction.bbox[1];
            // Draw the text last to ensure it's on top.
            ctx.fillStyle = "#000000";
            ctx.fillText(prediction.class, x, y);
        });
        };




        return (
            <View>
              <Canvas ref={this.renderPredictions}/>
            </View>
        );
    };
};