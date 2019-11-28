// Initialize the Image Classifier method with MobileNet. A callback needs to be passed.
let classifier;

// A variable to hold the image we want to classify
let img;

// this would eventually come from the camera
const imagePath = './images/mmur4.jpg';

function preload() {
  classifier = ml5.imageClassifier('MobileNet');
  img = loadImage(imagePath);
}

function setup() {
  createCanvas(800, 800);
  classifier.classify(img, gotResult);
  image(img, 0, 0);

  readCard();
}

// A function to run when we get any errors and the results
function gotResult(error, results) {
  // Display error in the console
  if (error) {
    console.error(error);
  } else {
    // The results are in an array ordered by confidence.
    console.log('ML5 data => ', results);
    createDiv('Label: ' + results[0].label);
    createDiv('Confidence: ' + nf(results[0].confidence, 0, 2));
  }
}

function readCard() {
  Tesseract.recognize(
    imagePath,
    'eng',
    { logger: m => console.log(m) }
  ).then(({ data: { text } }) => {
    console.log('Teseract data => ', text);
  })
}