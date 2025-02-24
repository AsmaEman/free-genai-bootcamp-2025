import * as tf from '@tensorflow/tfjs';

export const recognizeArabicCharacter = async (canvasElement) => {
  const model = await loadModel();
  const imageData = tf.browser.fromPixels(canvasElement)
    .resizeNearestNeighbor([28, 28])
    .toFloat()
    .div(255.0)
    .expandDims();
  
  const prediction = await model.predict(imageData);
  const results = Array.from(prediction.dataSync());
  
  const arabicCharacters = ['ا', 'ب', 'ت', 'ث', /* etc. */];
  const topIndex = results.indexOf(Math.max(...results));
  
  return {
    character: arabicCharacters[topIndex],
    confidence: results[topIndex]
  };
};

const loadModel = async () => {
  return await tf.loadLayersModel('/path/to/arabic_ocr_model/model.json');
}; 