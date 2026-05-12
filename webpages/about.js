    function toggleTheme() {
      const html = document.documentElement;
      html.dataset.theme = html.dataset.theme === 'dark' ? 'light' : 'dark';
    }

    function showProfile(id, clickedTab) {
      document.querySelectorAll('.profile').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.getElementById('profile-' + id).classList.add('active');
      clickedTab.classList.add('active');
    }