import React from 'react';
import images from './image';

const ThumbGenerator = () => {
  const [title,setTitle] = React.useState('');
  const [imgSrc,setImgSrc] = React.useState('');


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
    html2canvas(section).then(canvas => {
      var link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
    });
  }

  const handleChange = (e) => {
    setTitle(e.target.value)
  }

  const handleOptions = async (e) => {
    let src = await toDataURL(images.filter(i => i.name == e.target.value)[0].src);
    let el = document.getElementById('download_container')
    el.style.backgroundImage = `url('${src}')`;
  }

  React.useEffect(() => {
    async function getInitImage () {
      let src = await toDataURL(images[0].src);
      let el = document.getElementById('download_container')
      el.style.backgroundImage = `url('${src}')`;
      setImgSrc(src)
    }
    getInitImage()
  },[])

  return (
    <>
      <div id="target">
        <div id="download_container">
          <div class="centered">{title}</div>
        </div>
      </div>
      <br />
      <select onChange={handleOptions}>
        {
          images.map(i => {
            return (
              <option>{i.name}</option>
            )
          })
        }
      </select>
      <input type="text" value={title} onChange={handleChange} placeholder="Enter text"/>
      <button onClick={() => generate('Happy')}>Download Image</button>
    </>
  )
}

export default ThumbGenerator;
