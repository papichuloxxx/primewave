// Mobile menu
const menuToggle = document.getElementById('menuToggle');
const menuClose = document.getElementById('menuClose');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

menuToggle.addEventListener('click', () => mobileMenu.classList.add('open'));
menuClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
mobileLinks.forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.style.background = 'rgba(6, 22, 40, 0.92)';
    navbar.style.boxShadow = '0 10px 40px rgba(0, 0, 0, 0.3)';
  } else {
    navbar.style.background = 'rgba(6, 22, 40, 0.6)';
    navbar.style.boxShadow = 'none';
  }
});

// Reveal on scroll
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealElements.forEach(el => revealObserver.observe(el));

// Animated Counters Logic
const counters = document.querySelectorAll('.counter-value');
const counterObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counter = entry.target;
      const target = +counter.getAttribute('data-target');
      const duration = 2000;
      const increment = target / (duration / 16); // ~60fps

      let current = 0;
      const updateCounter = () => {
        current += increment;
        if (current < target) {
          counter.innerText = Math.ceil(current);
          requestAnimationFrame(updateCounter);
        } else {
          counter.innerText = target;
        }
      };
      
      updateCounter();
      observer.unobserve(counter);
    }
  });
}, { threshold: 0.5 });
counters.forEach(counter => counterObserver.observe(counter));

// Multi-step Quote Journey Logic
const quoteForm = document.getElementById('quoteForm');
if (quoteForm) {
  const steps = quoteForm.querySelectorAll('.form-step');
  const nextBtns = quoteForm.querySelectorAll('.next-step');
  const prevBtns = quoteForm.querySelectorAll('.prev-step');
  const currentStepSpan = document.getElementById('currentStep');
  const stepTitleSpan = document.getElementById('stepTitle');
  const formProgress = document.getElementById('formProgress');

  const stepTitles = ['Select Service', 'Project Details', 'Your Details'];
  let currentStep = 0;

  // Option selection logic (radio buttons)
  const quoteOptions = quoteForm.querySelectorAll('.quote-option');
  quoteOptions.forEach(option => {
    option.addEventListener('click', function() {
      const input = this.querySelector('input');
      if (!input) return;
      
      // Find all options in the same group and remove selected style
      const name = input.getAttribute('name');
      const groupOptions = quoteForm.querySelectorAll(`input[name="${name}"]`);
      groupOptions.forEach(groupInput => {
        const parent = groupInput.closest('.quote-option');
        if (parent) {
          parent.classList.remove('border-gold');
          parent.style.backgroundColor = 'transparent';
          const check = parent.querySelector('.check-indicator');
          if (check) check.classList.add('hidden');
        }
      });

      // Add selected style to clicked
      this.classList.add('border-gold');
      this.style.backgroundColor = 'rgba(244, 180, 0, 0.05)';
      const check = this.querySelector('.check-indicator');
      if (check) check.classList.remove('hidden');
    });
  });

  function updateSteps() {
    steps.forEach((step, index) => {
      if (index === currentStep) {
        step.classList.remove('hidden');
        step.style.opacity = '0';
        step.style.transition = 'opacity 0.3s ease';
        setTimeout(() => step.style.opacity = '1', 10);
      } else {
        step.classList.add('hidden');
      }
    });
    
    currentStepSpan.innerText = currentStep + 1;
    stepTitleSpan.innerText = stepTitles[currentStep];
    formProgress.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
  }

  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Validate current step
      const inputs = steps[currentStep].querySelectorAll('input[required]');
      let valid = true;
      if (inputs.length > 0) {
        if (inputs[0].type === 'radio') {
          const name = inputs[0].name;
          const checked = steps[currentStep].querySelector(`input[name="${name}"]:checked`);
          if (!checked) {
            alert('Please select an option to proceed.');
            valid = false;
          }
        } else {
          inputs.forEach(input => {
            if (!input.value.trim()) valid = false;
          });
          if (!valid) alert('Please fill in all required fields.');
        }
      }

      if (valid && currentStep < steps.length - 1) {
        currentStep++;
        updateSteps();
      }
    });
  });

  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) {
        currentStep--;
        updateSteps();
      }
    });
  });

  // WhatsApp Lead Generation Format
  quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(quoteForm);
    const service = formData.get('serviceRequired');
    const province = formData.get('projectProvince');
    const area = formData.get('projectArea');
    const location = `${area}, ${province}`;
    const details = formData.get('projectDetails') || 'No details provided';
    const name = formData.get('fullName');
    const phone = formData.get('phoneNumber');
    const email = formData.get('emailAddress') || 'No email provided';

    const message = `*New Quote Request*%0A%0A*Service:* ${service}%0A*Location:* ${location}%0A*Details:* ${details}%0A%0A*Name:* ${name}%0A*Phone:* ${phone}%0A*Email:* ${email}%0A%0A_Sent via PrimeWave Website_`;
    
    const fileInput = document.getElementById('projectFiles');
    let fileWarning = '';
    if (fileInput && fileInput.files.length > 0) {
      fileWarning = '%0A%0A*(Please attach your files/drawings directly in this WhatsApp chat)*';
    }
    
    const whatsappUrl = `https://wa.me/263789969002?text=${message}${fileWarning}`;
    window.open(whatsappUrl, '_blank');
  });
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Project Gallery Filtering
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Remove active styles from all buttons
    filterBtns.forEach(b => {
      b.classList.remove('bg-gold', 'text-white', 'border-gold', 'active');
      b.classList.add('bg-white', 'text-charcoal', 'border-gray-300');
    });

    // Add active styles to clicked button
    btn.classList.add('bg-gold', 'text-white', 'border-gold', 'active');
    btn.classList.remove('bg-white', 'text-charcoal', 'border-gray-300');

    const filterValue = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
        card.style.display = 'block';
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
        }, 50);
      } else {
        card.style.opacity = '0';
        card.style.transform = 'scale(0.9)';
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });
  });
});
