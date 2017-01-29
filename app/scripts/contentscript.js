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
    searchElement(mutations);
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

/**
 * Searches a page for keywords
 */
function searchElement(element) {
  jQuery(element).ready(function() {
    jQuery.each(keywords, function(keyword) {
      jQuery('*:contains("' + keyword + '")').each(function() {
        if (jQuery(this).children().length < 1) makeItGreat(jQuery(this));
      });
    });
  });
}

init();
searchElement(document);
