var MakeTheInternetGreat = (function($) {
  var quotes, options, fn, _observer, _mutationObserverConfig;

  _mutationObserverConfig = { childList: true, subtree: true };
  _observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.addedNodes.length > 0) {
        fn.spurgeonize(mutation.addedNodes[0]);
      }
    });
  });

  // Get keywords list
  chrome.storage.sync.get(
    {
      keywords: [ 'donald', 'trump', "trump's" ],
      isEnabled: true,
      reformer: 'spurgeon'
    },
    _options => {
      options = _options;

      options.keywords = _.map(options.keywords, _.trim);
    }
  );

  fn = {
    /**
       * @desc Gets a random quote from the loaded quotes
       * @return string A random quote with the first letter Capitalized
       */
    _getRandomQuote: () => {
      var quote = quotes[Math.floor(Math.random() * quotes.length)].quote.match(
        /"(.+)"/
      )[1];

      return fn._capitalize(quote.substr(0, quote.length, quote.length - 1));
    },
    /**
     * @desc capitalize the first letter of input
     * @param input string The string to capitalize
     * @return string The capitalized string
     */
    _capitalize: input => {
      return input.charAt(0).toUpperCase() + input.slice(1);
    },
    /**
     * @desc Test a string against keywords. Different variatiosn of the input string are tested
     * (Ex: all lowercase, All caps, Capitalized, etc)
     * @param input string The string to test
     * @return boolean True if input strings contains any of the keywords, false otherwise
     */
    hasTrump: input => {
      let isTrump = false;

      $.each(options.keywords, (index, keyword) => {
        if (
          input.includes(keyword.toLowerCase()) ||
            input.includes(keyword.toUpperCase()) ||
            input.includes(fn._capitalize(keyword.toLowerCase()))
        ) {
          isTrump = true;
        }
      });

      return isTrump;
    },
    /**
     * @desc Traverse element subtree recursively and replace all found elements containing any
     * keywords with a quote;
     * @param element target The root element where to start traversing
     */
    spurgeonize: element => {
      if (!options.isEnabled) return;
      // Watch for changes
      if (element === document) {
        _observer.observe($('body')[0], _mutationObserverConfig);
        fn.spurgeonize($(element).find('body')[0]);
      } else {
        if (element.nodeType === 1) {
          element = $(element);

          $.each(element.contents(), (index, child) => {
            if (fn.spurgeonize(child)) {
              child.data = fn._getRandomQuote();
            }
          });
        } else if (element.nodeType === 3) {
          if (fn.hasTrump(element.data)) {
            return true;
          }
        }
      }

      return false;
    }
  };

  return {
    init: document => {
      $.getJSON(chrome.extension.getURL('/quotes.json'), function(data) {
        quotes = data.quotes;
        fn.spurgeonize(document);
      });
    }
  };
})(jQuery);

MakeTheInternetGreat.init(document);
