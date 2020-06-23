import React from 'react';
import images from './image';
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

  const generate = (fileName) => {
    let section = document.getElementById('download_container');
    const html2canvas = window.html2canvas;
    html2canvas(section).then(canvas => {
      var link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
    });
  }

  const changeBg = async () => {
    let src = await toDataURL(images[Math.floor(Math.random() * 9)]);
    let el = document.getElementById('download_container')
    el.style.backgroundImage = `url('${src}')`;
    return src
  }

  const updateTitle = (val) => {
    setTitle(val)
  }

  const startFactor = async () => {
    console.log('Fired')
    let res = await axios.get('https://api.precisely.co.in/api/v1/list_s3_files?user_id=1&type=0')
    let result = res.data.data
    result.map(async (r) => {
      let done = await changeBg()
      if (done) {
        if(r.thumbnail_url === null || r.thumbnail_url === ''){
          updateTitle(r.title)
          generate(r.id)
        }
      }
    })
  }

  React.useEffect(() => { changeBg() }, [])

  return (
    <>
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
