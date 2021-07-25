import WOW from 'wow.js';
import './modernizr-webp.js';
import './validate-form.js';
import './parallax.js';
import './photos.js';
import Swiper, {Pagination} from 'swiper';
import smoothscroll from 'smoothscroll-polyfill';


const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
const isEdge = /Edge/.test(navigator.userAgent);

if (isEdge) {
  smoothscroll.polyfill();
}

Swiper.use([Pagination]);

window.addEventListener('load', () => {
    document.querySelector('.preload').classList.add('preload_hide');
    let animationOffset = 500;
  
    if (screen.width <= 1200) {
      animationOffset = 200;
    }
    
    if (!isIE11) {
      setTimeout(() => {
        const wow = new WOW(
          {
            offset:      animationOffset,
            mobile:      true,
            live:        true,
            duration: 2000
          }
        );

        wow.init();
        
        const header = document.querySelector('.header');
        header.classList.add('header_show');
      }, 650);
    }
    
    const galleryPhotos = document.querySelectorAll('.photos__item');
    
    if (screen.width <= 640) {
      galleryPhotos.forEach(function(galleryPhoto,) {
        galleryPhoto.setAttribute('data-wow-delay', '0.3s');
      });
    } else if (screen.width <= 768) {
      galleryPhotos.forEach(function(galleryPhoto, i) {
        if (i % 2 === 0) {
          galleryPhoto.setAttribute('data-wow-delay', '0.3s');
        } else {
          galleryPhoto.setAttribute('data-wow-delay', '0.6s');
        }
      });
    }

  const anchors = document.querySelectorAll('a[href*="#"]');
  for (let anchor of anchors) {
    anchor.addEventListener('click',  (e) => {
      e.preventDefault()
      
      const blockID = anchor.getAttribute('href');
      const blockOffsetTop = document.querySelector(blockID).getBoundingClientRect().top;

      window.scrollBy({ top: (blockOffsetTop), left: 0, behavior: 'smooth' });
    })
  }
  
  const menu = document.querySelector('.main-menu');
  const menuToggle = document.querySelector('.main-menu__toggle');
  const menuClose = document.querySelector('.main-menu__close');
  
  document.querySelectorAll('.link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('main-menu_active');
    })
  });    

  menu.addEventListener('click', (e) => {
    if (e.target.className.includes('main-menu_active')) {
      menu.classList.remove('main-menu_active');
    }
  });

  menuToggle.addEventListener('click', function() {
    menu.classList.toggle('main-menu_active');
  });

  menuClose.addEventListener('click', function() {
    menu.classList.remove('main-menu_active');
  });
});

if (!isIE11) {
  const serviceSlider = new Swiper('.swiper-container', {
    direction: 'horizontal',
    loop: true,
    slidesPerView: 2,
    spaceBetween: 20,
    speed: 500,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 15
      },
      992: {
        slidesPerView: 2,
        spaceBetween: 20
      }
    }
  });
}

window.addEventListener('scroll', () => {
  if (window.pageYOffset >= 100) {
    document.querySelector('.header__top').classList.add('header__top_white');
  } else {
    document.querySelector('.header__top').classList.remove('header__top_white');
  }
});

const headerLinkMain = document.querySelector('.main-menu__link');
headerLinkMain.addEventListener('click', () => {
    document.querySelector('.parallax__bg').style.transform = `translate(-18px, -1px)`;
    document.querySelector('.parallax__content').style.transform = `translate(-36px, -2px)`;
});

window.addEventListener('load', () => {
  const upBtn = document.querySelector('.up-btn');

  if (upBtn) {
    upBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  
    checkUpBtn(upBtn);
  
    window.addEventListener('scroll', () => {
      checkUpBtn(upBtn);
    });
  }
});

function checkUpBtn(btn) {
  const showOffset = 50;
  
  if (window.pageYOffset >= showOffset && btn.classList.contains('up-btn_hide')) {
    btn.classList.remove('up-btn_hide');
  } else if (window.pageYOffset < showOffset && !btn.classList.contains('up-btn_hide')) {
    btn.classList.add('up-btn_hide');
  }
}