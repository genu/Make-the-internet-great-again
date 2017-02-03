let options, elements;

elements = {
  keywords: "input[name*='keywords']",
  reformer: "select[name*='reformer']",
  isEnabled: "input[name*='isEnabled']"
};

document.addEventListener('DOMContentLoaded', () => {
  $(elements.reformer).on('change', () => {
    options.reformer = $(elements.reformer).val();
  });
  $(elements.keywords).on('change', () => {
    options.keywords = $(elements.keywords).val().split(',');
  });

  $(elements.isEnabled).on('click', () => {
    options.isEnabled = $(elements.isEnabled)[0].checked;
  });

  chrome.storage.sync.get(
    {
      keywords: [ 'donald', 'trump', "trump's" ],
      isEnabled: true,
      reformer: 'spurgeon'
    },
    _options => {
      options = _options;

      $(elements.keywords).val(options.keywords.join());
      $(elements.reformer).val(options.reformer);
      $(elements.isEnabled).prop('checked', options.isEnabled);
    }
  );
});
document.querySelector('#saveOptions').addEventListener('click', e => {
  chrome.storage.sync.set(options, () => {
    $('.alert').fadeIn();
    setTimeout(
      () => {
        $('.alert').fadeOut();
      },
      2000
    );
  });
  e.preventDefault();
});
