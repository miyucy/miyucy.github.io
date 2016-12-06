(function (window, document) {
  var id = '-badge-' + ((Math.random() * 1000) | 0);
  var textContent = window.badgeContent || 'wow';
  if (document.getElementById(id)) {
    return;
  }

  var corner = 0;
  var badge = document.createElement('div');
  badge.id = id;
  badge.style.position = 'fixed';
  badge.style.top = '0';
  badge.style.right = '0';
  badge.style.paddingRight = '1em';
  badge.style.paddingLeft = '1em';
  badge.style.textAlign = 'center';
  badge.style.zIndex = '9999';
  badge.textContent = textContent;
  badge.style.color = '#fff';
  badge.style.backgroundColor = '#000';

  badge.addEventListener('click', function (evt) {
    corner += 1;
    if (corner > 3) {
      corner = 0;
    }

    switch (corner) {
      case 0:
        badge.style.right = '0';
        badge.style.top = '0';
        badge.style.left = '';
        badge.style.bottom = '';
        break;
      case 1:
        badge.style.right = '0';
        badge.style.top = '';
        badge.style.left = '';
        badge.style.bottom = '0';
        break;
      case 2:
        badge.style.right = '';
        badge.style.top = '';
        badge.style.left = '0';
        badge.style.bottom = '0';
        break;
      case 3:
        badge.style.right = '';
        badge.style.top = '0';
        badge.style.left = '0';
        badge.style.bottom = '';
        break;
    }
  }, false);

  document.body.appendChild(badge);
})(window, document);
