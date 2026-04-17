document.addEventListener('DOMContentLoaded', function() {

  // ===== نافذة الترحيب =====
  const welcomeModal = document.getElementById('welcomeModal');
  const messageModal = document.getElementById('messageModal');
  const usernameInput = document.getElementById('usernameInput');

  setTimeout(() => {
    welcomeModal.style.display = 'block';
    usernameInput.focus();
  }, 300);

  window.submitUsername = function() {
    const username = usernameInput.value.trim();
    if (username === '') {
      usernameInput.style.borderColor = 'red';
      usernameInput.placeholder = 'الرجاء كتابة اسمك';
      return;
    }
    welcomeModal.style.display = 'none';
    showWelcomeMessage(username);
    localStorage.setItem('username', username);
  }

  function showWelcomeMessage(name) {
    const messageText = document.getElementById('messageText');
    if (name === 'رجاء' || name === 'Rajaa' || name === 'rajaa') {
      messageText.innerHTML = `
        Welcome Rajaa<br>
        أهلاً بك يا رجاء في موقعي<br>
        أرجو أن ينال إعجابك
        <span class="special-name">I❤️ you Rajaa</span>
      `;
    } else {
      messageText.innerHTML = `
        أهلاً بك في موقعي ${name}<br><br>
        أرجو أن يعجبك<br>
        لا تنسى دعمي أو إرسال ملاحظات تريدها حول الموقع
      `;
    }
    messageModal.style.display = 'block';
  }

  window.closeMessageModal = function() {
    messageModal.style.display = 'none';
  }

  usernameInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') submitUsername();
  });

  // ===== القائمة الجانبية =====
  const toggleBtn = document.querySelector('.sidebar-toggle');
  const sideNav = document.querySelector('.sidebar');

  toggleBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    sideNav.classList.toggle('show');
  });

  document.addEventListener('click', function(e) {
    if (!sideNav.contains(e.target) && !toggleBtn.contains(e.target)) {
      sideNav.classList.remove('show');
    }
  });

  // ===== المفضلة =====
  loadFavorites();
});

// تبديل التابات
function openTab(evt, tabName) {
  var tabcontent = document.getElementsByClassName("tabcontent");
  for (var i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  var tablinks = document.getElementsByClassName("tablinks");
  for (var i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabName).style.display = "block";
  evt.currentTarget.className += " active";
  if (tabName === 'Favorites') loadFavorites();
}

// فتح الصورة
function openImage(imageId) {
  const img = document.querySelector(`[data-id="${imageId}"] img`);
  if (!img) return;
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  modalImg.src = img.src;
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeImage() {
  document.getElementById('imageModal').style.display = 'none';
  document.getElementById('modalImage').src = '';
  document.body.style.overflow = '';
}

// فتح الفيديو
function openVideo(videoId) {
  const source = document.querySelector(`[data-id="${videoId}"] video source`);
  if (!source) return;
  const modal = document.getElementById('videoModal');
  const modalVideo = document.getElementById('modalVideo');
  modalVideo.src = source.src;
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  modalVideo.play();
}

function closeVideo() {
  const modalVideo = document.getElementById('modalVideo');
  modalVideo.pause();
  modalVideo.src = '';
  document.getElementById('videoModal').style.display = 'none';
  document.body.style.overflow = '';
}

// إغلاق بـ ESC
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') { closeImage(); closeVideo(); }
});

// المفضلة
function toggleFavorite(id, type, src, event) {
  event.stopPropagation();
  let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  const btn = event.target;
  const index = favorites.findIndex(fav => fav.id === id);

  if (index > -1) {
    favorites.splice(index, 1);
    btn.classList.remove('active');
    btn.innerHTML = '☆';
  } else {
    favorites.push({ id, type, src });
    btn.classList.add('active');
    btn.innerHTML = '★';
  }

  localStorage.setItem('favorites', JSON.stringify(favorites));
  loadFavorites();
}

function loadFavorites() {
  const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
  const gallery = document.getElementById('favoritesGallery');
  if (!gallery) return;
  gallery.innerHTML = '';

  if (favorites.length === 0) {
    gallery.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#aaa;padding:20px;">لا توجد مفضلات بعد</p>';
  }

  favorites.forEach(fav => {
    const div = document.createElement('div');
    div.className = fav.type === 'img' ? 'image' : 'video';
    div.setAttribute('data-id', fav.id);

    if (fav.type === 'img') {
      div.innerHTML = `
        <button class="fav-btn active" onclick="toggleFavorite('${fav.id}', 'img', '${fav.src}', event)">★</button>
        <img src="${fav.src}" alt="Favorite" onclick="openImage('${fav.id}')" loading="lazy">
      `;
    } else {
      const originalVideo = document.querySelector(`[data-id="${fav.id}"] video`);
      const posterSrc = originalVideo ? originalVideo.getAttribute('poster') : '';
      div.innerHTML = `
        <button class="fav-btn active" onclick="toggleFavorite('${fav.id}', 'video', '${fav.src}', event)">★</button>
        <video poster="${posterSrc}" onclick="openVideo('${fav.id}')" playsinline>
          <source src="${fav.src}" type="video/mp4">
        </video>
      `;
    }
    gallery.appendChild(div);
  });

  // تحديث حالة الأزرار
  favorites.forEach(fav => {
    const btn = document.querySelector(`.image[data-id="${fav.id}"] .fav-btn, .video[data-id="${fav.id}"] .fav-btn`);
    if (btn) { btn.classList.add('active'); btn.innerHTML = '★'; }
  });
}