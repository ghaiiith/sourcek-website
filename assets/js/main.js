/**
 * Sourcek Website - Enhanced JavaScript
 * Language switching, particles, scroll animations, form validation, security
 */

(function($) {
    'use strict';

    let currentLang = 'ar';
    const $html = $('html');
    const $body = $('body');

    // =================================================================
    // Security: Input Sanitization
    // =================================================================
    function sanitizeInput(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        if (!phone) return true; // optional
        return /^[\+]?[0-9\s\-\(\)]{7,20}$/.test(phone);
    }

    // =================================================================
    // Language Switching
    // =================================================================
    function switchLanguage(lang) {
        currentLang = lang;
        $html.attr('lang', lang);
        $html.attr('dir', lang === 'ar' ? 'rtl' : 'ltr');

        $('[data-ar][data-en]').each(function() {
            const $el = $(this);
            const text = lang === 'ar' ? $el.data('ar') : $el.data('en');
            if ($el.is('input[type="text"], input[type="email"], input[type="tel"], textarea')) {
                $el.attr('placeholder', text);
            } else if ($el.is('meta[name="description"], meta[name="keywords"]')) {
                $el.attr('content', text);
            } else if ($el.is('option')) {
                $el.text(text);
            } else {
                $el.html(text);
            }
        });

        $('#currentLang').text(lang === 'ar' ? 'EN' : 'AR');
        $body.css('text-align', lang === 'ar' ? 'right' : 'left');

        try { localStorage.setItem('sourcek_language', lang); } catch(e) {}

        const titleText = lang === 'ar'
            ? 'سورسك - شريكك في التحول الرقمي والتطوير البرمجي'
            : 'Sourcek - Your Partner in Digital Transformation and Software Development';
        document.title = titleText;
        $('meta[property="og:title"]').attr('content', titleText);
        $('meta[name="twitter:title"]').attr('content', titleText);

        const descText = lang === 'ar'
            ? 'سورسك شركة رائدة في تطوير البرمجيات المخصصة، تطبيقات الجوال، أنظمة ERP، الذكاء الاصطناعي والتحول الرقمي.'
            : 'Sourcek is a leading company in custom software development, mobile applications, ERP systems, AI and digital transformation.';
        $('meta[property="og:description"]').attr('content', descText);
        $('meta[name="twitter:description"]').attr('content', descText);
    }

    $('#langSwitcher').on('click', function() {
        switchLanguage(currentLang === 'ar' ? 'en' : 'ar');
    });

    function loadLanguagePreference() {
        try {
            const saved = localStorage.getItem('sourcek_language');
            if (saved && saved !== currentLang) switchLanguage(saved);
        } catch(e) {}
    }

    // =================================================================
    // Navbar Scroll Effect
    // =================================================================
    let lastScroll = 0;
    function handleNavbarScroll() {
        const $navbar = $('#mainNav');
        const scrollTop = $(window).scrollTop();
        if (scrollTop > 50) {
            $navbar.addClass('scrolled');
        } else {
            $navbar.removeClass('scrolled');
        }
        lastScroll = scrollTop;
    }
    $(window).on('scroll', handleNavbarScroll);

    // =================================================================
    // Smooth Scrolling
    // =================================================================
    $('a[href^="#"]').on('click', function(e) {
        const target = $(this).attr('href');
        if (target === '#' || $(this).attr('data-bs-toggle')) return;
        e.preventDefault();
        const $target = $(target);
        if ($target.length) {
            $('html, body').animate({ scrollTop: $target.offset().top - 75 }, 700, 'swing');
            $('.navbar-collapse').collapse('hide');
        }
    });

    // =================================================================
    // Active Nav Link
    // =================================================================
    function updateActiveNavLink() {
        const scrollPos = $(window).scrollTop() + 120;
        $('section[id]').each(function() {
            const $section = $(this);
            const top = $section.offset().top;
            const bottom = top + $section.outerHeight();
            const id = $section.attr('id');
            if (scrollPos >= top && scrollPos < bottom) {
                $('.navbar-nav .nav-link').removeClass('active');
                $(`.navbar-nav .nav-link[href="#${id}"]`).addClass('active');
            }
        });
    }
    $(window).on('scroll', updateActiveNavLink);

    // =================================================================
    // Hero Particles (Canvas)
    // =================================================================
    function initParticles() {
        const canvas = document.getElementById('heroParticles');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        const count = window.innerWidth < 768 ? 30 : 60;

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                size: Math.random() * 2 + 0.5,
                alpha: Math.random() * 0.4 + 0.1
            });
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p, i) => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(173, 251, 5, ${p.alpha})`;
                ctx.fill();

                // Connect nearby particles
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = p.x - particles[j].x;
                    const dy = p.y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(173, 251, 5, ${0.06 * (1 - dist / 120)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            });
            requestAnimationFrame(draw);
        }
        draw();
    }

    // =================================================================
    // Animated Counter
    // =================================================================
    function animateCounter($el, target, duration) {
        duration = duration || 2500;
        const startTime = Date.now();
        function easeOut(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
        function update() {
            const progress = Math.min((Date.now() - startTime) / duration, 1);
            $el.text(Math.floor(target * easeOut(progress)));
            if (progress < 1) requestAnimationFrame(update);
            else $el.text(target);
        }
        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const $c = $(entry.target);
                animateCounter($c, parseInt($c.data('count')));
            }
        });
    }, { threshold: 0.5 });
    $('.stat-number').each(function() { counterObserver.observe(this); });

    // =================================================================
    // Scroll Reveal Animations
    // =================================================================
    const revealObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal').forEach(function(el) {
        revealObserver.observe(el);
    });

    // =================================================================
    // Card Spotlight Effect (mouse follow)
    // =================================================================
    document.querySelectorAll('.service-card').forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--card-x', (e.clientX - rect.left) + 'px');
            card.style.setProperty('--card-y', (e.clientY - rect.top) + 'px');
        });
    });

    // =================================================================
    // Cookie Consent
    // =================================================================
    function showCookieConsent() {
        try {
            if (!localStorage.getItem('sourcek_cookie_consent')) {
                $('#cookieConsent').fadeIn();
            }
        } catch(e) { $('#cookieConsent').fadeIn(); }
    }

    $('#acceptCookies').on('click', function() {
        try { localStorage.setItem('sourcek_cookie_consent', 'accepted'); } catch(e) {}
        $('#cookieConsent').fadeOut();
    });
    $('#rejectCookies').on('click', function() {
        try { localStorage.setItem('sourcek_cookie_consent', 'rejected'); } catch(e) {}
        $('#cookieConsent').fadeOut();
    });

    // =================================================================
    // Form Validation & Submission
    // =================================================================
    function showFormMessage($form, message, isError) {
        $form.find('.form-message').remove();
        const cls = isError ? 'text-danger' : 'text-success';
        const $msg = $(`<div class="form-message ${cls} mt-3 text-center" style="font-weight:600">${sanitizeInput(message)}</div>`);
        $form.append($msg);
        setTimeout(() => $msg.fadeOut(() => $msg.remove()), 5000);
    }

    $('#contactForm').on('submit', function(e) {
        e.preventDefault();
        const $form = $(this);
        const name = sanitizeInput($('#contactName').val().trim());
        const email = sanitizeInput($('#contactEmail').val().trim());
        const phone = sanitizeInput($('#contactPhone').val().trim());
        const message = sanitizeInput($('#contactMessage').val().trim());

        // Validation
        let valid = true;
        if (!name || name.length < 2) {
            $('#contactName').addClass('is-invalid');
            valid = false;
        } else { $('#contactName').removeClass('is-invalid'); }

        if (!validateEmail(email)) {
            $('#contactEmail').addClass('is-invalid');
            valid = false;
        } else { $('#contactEmail').removeClass('is-invalid'); }

        if (!validatePhone(phone)) {
            $('#contactPhone').addClass('is-invalid');
            valid = false;
        } else { $('#contactPhone').removeClass('is-invalid'); }

        if (!message || message.length < 10) {
            $('#contactMessage').addClass('is-invalid');
            valid = false;
        } else { $('#contactMessage').removeClass('is-invalid'); }

        // File validation
        const fileInput = $('#contactAttachment')[0];
        if (fileInput && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const ext = file.name.split('.').pop().toLowerCase();
            const maxSize = 10 * 1024 * 1024; // 10MB
            if (!['pdf','docx','xlsx','png','jpg','jpeg'].includes(ext) || file.size > maxSize) {
                valid = false;
                const msg = currentLang === 'ar'
                    ? 'الرجاء اختيار ملف صالح (أقل من 10MB)'
                    : 'Please choose a valid file (under 10MB)';
                showFormMessage($form, msg, true);
                return;
            }
        }

        if (!valid) {
            const msg = currentLang === 'ar' ? 'الرجاء ملء جميع الحقول المطلوبة بشكل صحيح' : 'Please fill in all required fields correctly';
            showFormMessage($form, msg, true);
            return;
        }

        // Disable button
        const $btn = $form.find('button[type="submit"]');
        const originalText = $btn.text();
        $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin me-2"></i>' + (currentLang === 'ar' ? 'جارِ الإرسال...' : 'Sending...'));

        // Simulate submission
        setTimeout(() => {
            const successMsg = currentLang === 'ar'
                ? 'شكراً لتواصلك معنا! سنرد عليك في أقرب وقت ممكن.'
                : 'Thank you for contacting us! We will get back to you as soon as possible.';
            showFormMessage($form, successMsg, false);
            $btn.prop('disabled', false).text(originalText);
            this.reset();
            $form.find('.is-invalid').removeClass('is-invalid');
        }, 1500);
    });

    // Remove validation styling on input
    $(document).on('input change', '.form-control, .form-select', function() {
        $(this).removeClass('is-invalid');
    });

    // =================================================================
    // Dynamic Copyright Year
    // =================================================================
    function updateCopyrightYear() {
        $('#currentYear').text(new Date().getFullYear());
    }

    // =================================================================
    // Back to Top
    // =================================================================
    const $backToTop = $('#backToTop');
    $(window).on('scroll', function() {
        if ($(this).scrollTop() > 600) {
            $backToTop.addClass('visible');
        } else {
            $backToTop.removeClass('visible');
        }
    });
    $backToTop.on('click', function() {
        $('html, body').animate({ scrollTop: 0 }, 600);
    });

    // =================================================================
    // Accessibility: Skip Link
    // =================================================================
    function addSkipLink() {
        const link = $('<a>', {
            href: '#home',
            class: 'skip-link',
            text: currentLang === 'ar' ? 'تخطى إلى المحتوى الرئيسي' : 'Skip to main content',
            css: { position:'absolute', top:'-50px', left:'0', background:'#adfb05', color:'#020617', padding:'10px 16px', 'text-decoration':'none', 'z-index':'10001', 'border-radius':'0 0 8px 0', 'font-weight':'700' }
        });
        link.on('focus', function() { $(this).css('top','0'); });
        link.on('blur', function() { $(this).css('top','-50px'); });
        $body.prepend(link);
    }

    // =================================================================
    // Rate Limiting (Security)
    // =================================================================
    const formSubmitTimes = {};
    function isRateLimited(formId) {
        const now = Date.now();
        if (formSubmitTimes[formId] && now - formSubmitTimes[formId] < 5000) return true;
        formSubmitTimes[formId] = now;
        return false;
    }

    // =================================================================
    // Initialize
    // =================================================================
    $(document).ready(function() {
        loadLanguagePreference();
        showCookieConsent();
        updateCopyrightYear();
        initParticles();
        addSkipLink();
        handleNavbarScroll();
        updateActiveNavLink();
    });

})(jQuery);
