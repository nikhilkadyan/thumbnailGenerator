import React from 'react';
import images from './images';
import video_images from './video_images';
import axios from 'axios';

const ThumbGenerator = () => {
  const [title, setTitle] = React.useState('');

  const toDataURL = url => fetch(url)
    .then(response => response.blob())
    .then(blob => new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    }))

  function base64ToBlob(base64, mime) {
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
      var slice = byteChars.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mime });
  }

  const generate = (data) => {
    let section = document.getElementById('download_container');
    const html2canvas = window.html2canvas;
    html2canvas(section).then(canvas => {
      // var link = document.createElement('a');
      // link.href = canvas.toDataURL();
      // link.download = data.id;
      // document.body.appendChild(link);
      // link.click();
      let image = canvas.toDataURL()
      let base64ImageContent = image.replace(/^data:image\/(png|jpg);base64,/, "");
      let blob = base64ToBlob(base64ImageContent, 'image/png');
      let formData = new FormData(document.getElementById('form'));
      formData.set('user_id', data.user.id);
      formData.set('file', blob, `${data.id}.png`);
      formData.set('resource_id', data.id);
      axios({
        method: 'post',
        url: 'https://api.precisely.co.in/api/v1/save_resource_thumbnail',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' }
      }).then(res => console.log(res)).catch(res => console.log(res.response))
    });
  }

  const changeBg = async (type) => {
    if (type === 'portrait') {
      let src = await toDataURL(images[Math.floor(Math.random() * 9)]);
      let el = document.getElementById('download_container')
      el.style.backgroundImage = `url('${src}')`;
      el.style.width = '300px';
      el.style.height = '425px';
      return src
    }
    let src = await toDataURL(video_images[Math.floor(Math.random() * 10)]);
    let el = document.getElementById('download_container')
    el.style.backgroundImage = `url('${src}')`;
    el.style.width = '749px';
    el.style.height = '421px';
    return src
  }

  const startFactor = async () => {
    console.log('Fired')
    let res = await axios.get('https://api.precisely.co.in/api/v1/list_s3_files?user_id=1&type=0')
    console.log(res.data.data)

    let result = []
    // eslint-disable-next-line

    res.data.data.map(r => {
      if (r.thumbnail_url === null || r.thumbnail_url === '') {
        return result.push(r)
      }
    })
    result.map(async (r) => {
      let type = 'portrait';
      if (r.file_type_id === 3 || r.file_type_id === 4) {
        type = 'landscape'
      }
      let done = await changeBg(type)
      if (done) {
        setTitle(r.title)
        generate(r)
      }
    })
  }

  React.useEffect(() => {
    changeBg('landscape')
    // eslint-disable-next-line
  }, [])

  return (
    <>
      <form id="form" />
      <div id="target">
        <div id="download_container">
          <div className="centered">{title}</div>
        </div>
      </div>
      <br />
      <button onClick={startFactor}>Start Task</button>
    </>
  )
}

export default ThumbGenerator;
