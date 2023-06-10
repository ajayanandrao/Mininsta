import * as React from 'react';
import { storage } from './Firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button, Avatar} from '@mui/material';
import { useState } from 'react';

const Avtar = () => {


  const [image, setImages] = useState(null);
  const [link, setLink] = useState(null);
  const imgRef = ref(storage, "images")

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImages(e.target.files[0]);
    }
  };

  getDownloadURL(imgRef).then((url) => {
    setLink(url)
  }).catch((error) => {
    console.log(error.message)
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    uploadBytes(imgRef, image).then(() => {

      getDownloadURL(imgRef).then((url) => {
        setLink(url)
        document.getElementById("up-success").innerHTML = "Upload Successfully";
        document.getElementById("up-success").style.background = "green";
        document.getElementById('up-success').style.display = 'block';

      }).catch((error) => {
        console.log(error.message)
      })
    }).catch((error) => {
      console.log(error.message);
    });

    document.getElementById("file").value = null;
  };

  //--------------------------------


  const on = () => {
    document.getElementById('one').style.display = 'block';
  };
  const off = () => {
    document.getElementById('one').style.display = 'none';
    document.getElementById('up-success').style.display = 'none';
  };

  return (
    <>
      <label onClick={on}>
        <Avatar style={{ cursor: "pointer" }} alt="Remy Sharp" src={link} sx={{ width: 45, height: 45 }} />
      </label>

      <div id='one'>
        <div id="text">
          <Avatar alt="Remy Sharp" src={link} sx={{ width: 100, height: 100 }} />

          <form className='text' onSubmit={handleSubmit}>
            <label htmlFor="file" className='select-image my-3'>Select image </label>
            <input id="file" type="file" onChange={handleChange} />
            <Button variant="outlined" type='submit'>Upload</Button>

            <div className='cancel-text my-2' onClick={off}>Close</div>
          </form>
          
          <div className="up-success mt-2" id="up-success"></div>
        </div>
      </div>


    </>
  )
}

export default Avtar
