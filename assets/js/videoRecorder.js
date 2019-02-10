const recorderContainer = document.getElementById('jsRecordContainer');
const recordButton = document.getElementById('jsRecordButton');
const videoPreview = document.getElementById('jsVideoPreview');

let streamObject;
let videoRecorder;

const handleVideoData = event => {
  console.log('on data available');
  const { data: videoFile } = event;
  const link = document.createElement('a');
  link.href = URL.createObjectURL(videoFile);
  link.download = 'recorded.webm';
  document.body.appendChild(link);
  link.click();
};

const stopRecording = () => {
  console.log('stop recording');
  // 브라우저 탭쪽이나 노트북 카메라의 녹화중 표시 중지
  // ref: https://stackoverflow.com/a/44274928/911528
  streamObject.getTracks().forEach(track => track.stop());

  videoRecorder.stop();
  recordButton.removeEventListener('click', stopRecording);
  recordButton.addEventListener('click', startRecording);
  recordButton.innerHTML = 'Start recording';
};

const startRecording = async () => {
  try {
    streamObject = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 1280, height: 720 }
    });

    videoPreview.srcObject = streamObject;
    videoPreview.muted = true;
    videoPreview.play();

    // start recording
    videoRecorder = new MediaRecorder(streamObject);
    videoRecorder.addEventListener('dataavailable', handleVideoData);
    videoRecorder.start();

    recordButton.addEventListener('click', stopRecording);
    recordButton.innerHTML = 'Stop recording';
  } catch (error) {
    console.log(error);
    recordButton.innerHTML = "Can't record";
  } finally {
    recordButton.removeEventListener('click', startRecording);
  }
};

function initVideoRecorder() {
  recordButton.addEventListener('click', startRecording);
}

if (recorderContainer) {
  initVideoRecorder();
}
