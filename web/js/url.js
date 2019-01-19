import $ from 'jquery';

/**
 * Class to contain all of the URL parsing logic.
 */
export default function UrlManager(urlParsers, season) {
  this.urlParsers = {};
  this.season = season;

  const pathParts = location.pathname.split('/');
  const base = 1 in pathParts ? pathParts[1] : 'Table';
  // Usually Table or something similar

  if (typeof urlParsers !== 'undefined') {
    this.urlParsers = urlParsers;
  }

  /**
   * Add a new parser.
   * The relevant encoded URL will be /Table/[name]/[return of encode]
   * On decoding, the decoder will be passed the [return of encode]
   * @param  name  name of the URL type to parse
   * @param  encode  function, when passed data, that gives the URL
   * @param  decode  function, when passed data, restores the page state
   */
  this.setParser = function(name, encode, decode) {
    this.urlParsers[name] = {
      encode: encode,
      decode: decode,
    };
  };

  /**
   * Converts a data element to its encoded URL using a registered parser
   * @param  name  name of the URL parser
   * @param  data  data to encode into a URL
   * @return  encoded URL
   */
  this.encode = function(name, data) {
    return (
      '/' +
      base +
      '/' +
      this.season +
      (name.toString() === ''
        ? ''
        : '/' + name + '/' + this.urlParsers[name].encode(data)) +
      location.search
    );
  };

  /**
   * Given a location.pathname, decodes it and sends it to the appropriate
   * parser
   * @param  pathname  location.pathname to decode
   */
  this.decode = function(pathname) {
    let name, data;

    const parts = pathname.split('/');
    if (parts.length < 4) {
      this.urlParsers[''].decode(data);
      return;
    }

    if (parts[2].search(/^\d{6}$/) !== -1) {
      // /Table/201303/...
      if (parts.length < 5) {
        this.urlParsers[''].decode(data);
        return;
      } else {
        name = parts[3];
        data = parts[4];
      }
    } else {
      // /Table/...
      name = parts[2];
      data = parts[3];
    }

    if (name in this.urlParsers) {
      this.urlParsers[name].decode(data);
    }
  };

  this.checkUrl = function() {
    this.decode(window.location.pathname);
  };

  // Default parser
  this.setParser(
    '',
    function() {
      return '/Table/' + this.season;
    },
    () => {
      $('.course-modal').modal('hide');
    }
  );
}
