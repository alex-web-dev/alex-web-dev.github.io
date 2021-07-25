window.addEventListener('load', function(event) {
  const isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
  const isEdge = /Edge/.test(navigator.userAgent);
  if(!isIE11 && !isEdge) {
      if(window.innerWidth >= 1440) {
        parallax();
      } 
  }
});

function parallax() {
  const parallaxBg = document.querySelector('.parallax__content');
  const parallaxContent = document.querySelector('.parallax__bg');

  window.addEventListener('mousemove', function(e) {
    if(window.innerWidth < 1440) {
        if(parallaxBg.style.transform || parallaxContent.style.transform) {
            parallaxBg.style.transform = '';
            parallaxContent.style.transform = '';
        }
        
        return;
    }

    let x = e.pageX / window.innerWidth;
    let y = e.pageY / window.innerHeight;

    if(y > 1) {
        y = 1;
    }

    parallaxBg.style.transform = `translate(-${x * 30}px, -${y * 30}px)`;
    parallaxContent.style.transform = `translate(-${x * 60}px, -${y * 60}px)`;
  });
}  