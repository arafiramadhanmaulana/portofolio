document.addEventListener('DOMContentLoaded', () => {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');

  if (lightbox && lightboxImg) {
    galleryItems.forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) {
          lightboxImg.src = img.src;
          lightbox.classList.add('active');
        }
      });
    });

    lightbox.addEventListener('click', () => {
      lightbox.classList.remove('active');
    });
  }

  const contactForm = document.getElementById('contact-form');
  const submitBtn = document.getElementById('c-submitBtn');
  const feedback = document.getElementById('c-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('c-name')?.value.trim() || '';
      const email = document.getElementById('c-email')?.value.trim() || '';
      const message = document.getElementById('c-message')?.value.trim() || '';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Mengirim...';
      }
      
      if (feedback) {
        feedback.style.display = 'none';
      }

      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: '5aee78ef-4f0a-4d63-a215-1cb29de8b51d',
            subject: 'Pesan Baru dari Portofolio - ' + name,
            from_name: name,
            email: email,
            message: message
          })
        });

        const result = await response.json();

        if (response.status === 200) {
          if (feedback) {
            feedback.style.display = 'block';
            feedback.style.color = '#10b981';
            feedback.textContent = 'Pesan berhasil dikirim! Saya akan segera membalasnya.';
          }
          contactForm.reset();
        } else {
          throw new Error(result.message || 'Gagal mengirim pesan');
        }
      } catch (error) {
        console.error(error);
        if (feedback) {
          feedback.style.display = 'block';
          feedback.style.color = '#ef4444';
          feedback.textContent = 'Terjadi kesalahan. Silakan coba lagi.';
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Kirim Pesan';
        }
      }
    });
  }
});
