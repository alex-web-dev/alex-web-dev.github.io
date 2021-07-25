document.querySelectorAll('.photos__item').forEach(function(photosItem, i) {
  photosItem.addEventListener('click', function() {
    const img = photosItem.querySelector('.photos__item-img');
    const bigImgPath = img.src.replace(/(.jpg)/g, "-big.jpg");
    const text = photosItem.querySelector('.photos__item-text').innerHTML;
    if(window.innerWidth < 992) {
      const image = createImageBlock(img.src, text, i);
    } else {
      const image = createImageBlock(bigImgPath, text, i);
    }
  });
});

function createImageBlock(imgSrc, text, imageNumber) {
  if(document.querySelectorAll('.image').length !== 0) {
    document.querySelectorAll('.image').forEach(function(image) {
      document.body.removeChild(image);
    });
  }

  const image = document.createElement('div');
  image.className = 'image';

  image.innerHTML = `
  <div class="image image_active">
    <div class="image__content">
      <p class="image__text">${text}</p>
      <img src="${imgSrc}" class="image__img">
      <div class="image__btns">
        <button class="image__btn image__btn_left"><</button>
        <button class="image__btn image__btn_right">></button>
      </div>
    </div>
  </div>
  `;

  image.addEventListener('click', function(e) {
    if(e.target.classList[0] === 'image__btn') {
      return;
    }
    
    this.classList.remove('image_active');
    setTimeout(() => {
      document.body.removeChild(this);
    }, 400);
  });

  setTimeout(function() {
    image.classList.add('image_active');
  });

  document.body.appendChild(image);

  image.querySelectorAll('.image__btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      let newImage;

      if(btn.className.indexOf('image__btn_left') !== -1) {
        if(imageNumber <= 0) {
          imageNumber = document.querySelectorAll('.photos__item').length - 1;
        } else {
          imageNumber--;
        }

        newImage = document.querySelectorAll('.photos__item')[imageNumber];
      } else {
        if(imageNumber >= document.querySelectorAll('.photos__item').length - 1) {
          imageNumber = 0;
        } else {
          imageNumber++;
        }
        newImage = document.querySelectorAll('.photos__item')[imageNumber];
      }

      const newImageText = newImage.querySelector('.photos__item-text').innerHTML;
      const newImageImg = newImage.querySelector('.photos__item-img');
      const newImageBigPath = newImageImg.src.replace(/(.jpg)/g, "-big.jpg");;

      image.classList.add('image_hide');
      setTimeout(() => {
        if(window.innerWidth < 992) {
          image.querySelector('.image__img').setAttribute('src', newImageImg.src);
        } else {
          image.querySelector('.image__img').setAttribute('src', newImageBigPath);
        }
        
        image.querySelector('.image__text').innerHTML = newImageText;
        
        setTimeout(() => {
          image.classList.remove('image_hide');
        }, 500);
      }, 300);
      
    });
  });

  return image;

}