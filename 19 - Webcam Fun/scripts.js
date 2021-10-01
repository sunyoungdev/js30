const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

function getVideo() {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})    // return promise
        .then(localMediaStream => {
            console.log(localMediaStream);
            // srcObject => MediaStream 을 바로 할당 가능
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch((err) => {
            console.error('oh no!', err);
        })
};

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    // Timer ID 값을 return 해야 => you can have access to Interval and call clearInterval on it.
    return setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height); // 비디오 이미지를 가져와서 그림(x시작점,y시작점,가로길이,세로길이)
        
        // take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height); // getImageData 기본 픽셀 데이터 객체를 리턴
        // mess with them
        pixels = greenScreen(pixels);
        // pixels = rgbSplit(pixels);
        // ctx.globalAlpha = 0.5; // 
        // put them back
        ctx.putImageData(pixels, 0, 0);

        //console.log(pixels);
        //debugger;   // 이 위치에서 실행이 일시중지
    }, 16);
    
};

function takePhoto() {
    // played the sound
    snap.currentTime = 0;
    snap.play();

    // take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg') // canvas 이미지를 base64 문자열로 리턴('type',encoderOptions)
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src=${data} alt='handsome' />`;
    strip.insertBefore(link, strip.firstChild); // insertBefore 부모노드의 기준 점 노드 앞에 삽입 할 노드를 삽입
}

function redEffect(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i + 0] =  pixels.data[i + 0] + 100; // Red
        pixels.data[i + 1] =  pixels.data[i + 1] - 50; // Green
        pixels.data[i + 2] =  pixels.data[i + 2] * 0.5; // Blue   
    }
    return pixels;
}

function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
        pixels.data[i - 150] =  pixels.data[i + 0] // Red
        pixels.data[i + 100] =  pixels.data[i + 1] // Green
        pixels.data[i - 150] =  pixels.data[i + 2] // Blue   
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value; //
    });

    // console.log(levels);
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
  }

getVideo();

video.addEventListener('canplay', paintToCanvas); // canplay is fired when the user agent can play the media