'use strict';
jQuery.noConflict();

var keywords, quotes, quotesLoaded = false;

keywords = [
  'Trump',
  'TRUMP',
  'trump',
  "Trump's",
  "TRUMP'S",
  'Donald',
  'DONALD',
  'donald'
];
quotes = [];

// Helpers
String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

// When new content gets loaded (like in Facebook), do another search
var observer = new MutationObserver(function(mutations) {
  if (quotesLoaded) {
    jQuery.each(mutations, function(i, mutation) {
      jQuery.each(mutation.addedNodes, function(i, node) {
        searchElement(node);
      });
    });
  }
});

observer.observe(document, {
  subtree: true,
  attributes: false,
  childList: true
});

function init() {
  // Load quotes
  jQuery.getJSON(chrome.extension.getURL('/quotes.json'), function(data) {
    quotes = data.quotes;
    quotesLoaded = true;
  });
}

/**
 * Gets a random quote
 */
function getRandomQuote() {
  var item = quotes[Math.floor(Math.random() * quotes.length)];
  var quote = item.quote.match(/"(.+)"/)[1];

  return quote
    .substr(0, quote.length, quote.length - 1)
    .capitalizeFirstLetter();
}

/**
 * Makes an element great by replacing its content with a quote
 */
function makeItGreat(element) {
  element.html(getRandomQuote());
}

function escapeSpecialChars(unsafe) {
  return unsafe
    .replace(/]/g, '\\]')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
/**
 * Searches a page for keywords
 */
function searchElement(element) {
  // if Node has no id, don't search it. Assume it has no text either.
  if (element.id === '' || typeof element.id === 'undefined') return;

  try {
    jQuery(document).ready(function() {
      jQuery.each(keywords, function(i, keyword) {
        jQuery(
          '#' +
            escapeSpecialChars(element.id) +
            ' *:contains("' +
            keyword +
            '")'
        ).each(function() {
          if (jQuery(this).children().length < 1) makeItGreat(jQuery(this));
        });
      });
    });
  } catch (err) {
  }
}

init();
searchElement(document);
