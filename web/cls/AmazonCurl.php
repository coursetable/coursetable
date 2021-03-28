<?php

/**
 * Class with Amazon scraping for prices
 */
class AmazonCurl extends Curl
{

    private $host;

    /**
     * Creates an Amazon fetcher session.
     * @param string $host  host of the store's server (yale.bncollege.com should work)
     * @param bool   $debug whether to print cURL debug information
     */
    public function __construct($host = null, $debug = false)
    {
        parent::__construct($debug);
        $this->host = isset($host) ? $host : 'http://www.amazon.com';
        $this->setCookieFile('');
    }

    private static function getResultInfo($result)
    {
        $info = array();

        // There are two types of product pages
        if (strpos($result, 'newp') !== false) {
            $type = 'new';
        } else {
            $type = 'old';
        }

        global $argv, $_GET;
        if (isset($argv[0]) || $_GET['nocache']) {
            echo $result;
        }

        // URL
        preg_match('@http://www\.amazon\.com/([^/]*)/dp/(\w+)@', $result, $matches);
        $info['url'] = $matches[0];
        $info['urlTitle'] = $matches[1];
        $info['asin'] = $matches[2];

        // Picture
        preg_match('@http://ecx\.images-amazon\.com/images/I/([^.]*)(?:.*?)\.jpg@', $result, $matches);
        $info['imageUrl'] = $matches[0];
        $info['imageTag'] = $matches[1];

        // Title
        $matched = preg_match('@class="[^"]*s-access-title[^"]*">([^<]*)@', $result, $matches);
        $info['title'] = html_entity_decode($matches[1]);

        // Authors
        $resultParts = explode('by </span>', $result);

        $info['authors'] = array();
        if (count($resultParts) >= 2) {
            $newResultParts = explode('</div>', $resultParts[1]);
            $foundAuthors = preg_match_all(
                '@ a-color-secondary">' .
                '(?:<a class="a-link-normal a-text-normal" href="[^"]*">)?' .
                '([^<]+)(?:</a>)?</span>@',
                $newResultParts[0],
                $matches
            );
            if ($foundAuthors) {
                foreach ($matches[1] as $match) {
                    $info['authors'][] = trim($match);
                }
            }
        }

        // Prices
        $info['prices'] = array();

        // a. Used & new
        $hasUsedAndNew = preg_match(
            '@\$([\d.]*)</span><span class="a-letter-space"></span>used &amp; new@',
            $result,
            $matches
        );
        if ($hasUsedAndNew) {
            $info['prices']['Used & new'] = $matches[1];
        }

        // b. Rental
        $kindlePosition = stripos($result, 'title="Kindle Edition"');
        $nonKindleResult = $kindlePosition ? substr($result, 0, $kindlePosition) : $result;

        $hasRent = preg_match(
            '@\$([\d.]*)</span><span class="a-letter-space"></span>' .
            '<span class="a-size-small a-color-secondary">to rent@',
            $nonKindleResult,
            $matches
        );
        if ($hasRent) {
            $info['prices']['Rent new'] = $matches[1];
        }

        // c. eBook rental and purchase
        if ($kindlePosition !== false) {
            $kindleResult = substr($result, $kindlePosition);

            // Get the eBook ASIN
            $urlPattern = '@http://www.amazon.com/([^/]*)/dp/([^/]*)/@';
            preg_match($urlPattern, $kindleResult, $matches);
            $info['eBook'] = array(
                'url' => $matches[0],
                'urlTitle' => $matches[1],
                'asin' => $matches[2]
            );

            $pattern = '@\$([\d.]*)</span><span class="a-letter-space"></span>' .
                '<span class="a-size-small a-color-secondary">to rent@';
            $hasEbookRental = preg_match($pattern, $kindleResult, $matches);

            if ($hasEbookRental) {
                // Both rental and purchase options
                $info['prices']['Rent eBook'] = $matches[1];

                $pattern = '@\$([\d.]*)</span><span class="a-letter-space"></span>'
                    . '<span class="a-size-base a-color-secondary">to buy@';
                $hasEbook = preg_match($pattern, $kindleResult, $matches);

                if ($hasEbook) {
                    $info['prices']['eBook'] = $matches[1];
                }
            } else {
                // Purchase option only
                $pattern = '@\$([\d.]*)@';
                $hasEbook = preg_match($pattern, $kindleResult, $matches);

                if ($hasEbook) {
                    $info['prices']['eBook'] = $matches[1];
                }
            }
        }

        global $argv;
        if (isset($argv[0])) {
            print_r($info);
        }

        return $info;
    }

    public function fetchSearch($searchParams)
    {
        $url = $this->host.'/gp/search';
        $getFields = array_merge(
            $searchParams,
            array(
            'search-alias' => 'stripbooks',
            'unfiltered' => 1
            )
        );
        $page = $this->fetchPage($url, null, null, $getFields);

        $parts = explode(' id="result_', $page);
        array_shift($parts); // First part doesn't contain anything

        $results = array();
        foreach ($parts as $part) {
            $result = self::getResultInfo($part);
            if (!empty($result['asin'])) {
                $results[$result['asin']] = $result;
            }
        }

        return $results;
    }

    const PER_LOOKUP = 12;

    /**
     * Fetches the prices, titles, and author for a bunch of books
     * @param   array $isbns ISBN codes for the books to look up
     * @returns associative array keyed by the ASIN with entries
     *             url, urlTitle, asin, imageUrl, imageTag, title, authors,
     *             prices, and eBook info
     */
    public function fetchByISBNs($isbns)
    {
        $ret = array();
        // Breaks it into pages of 16
        $isbns = array_values($isbns);

        for ($i = 0; $i < count($isbns); $i += self::PER_LOOKUP) {
            $someIsbns = array_slice($isbns, $i, self::PER_LOOKUP);
            $ret = $ret + $this->fetchSearch(array('field-isbn' => implode('|', $someIsbns)));
        }
        return $ret;
    }

    /**
     * Fetches the prices, titles, and author for a bunch of books
     * @param   array $isbns ISBN codes for the books to look up
     * @returns associative array keyed by the ASIN with entries
     *             url, urlTitle, asin, imageUrl, imageTag, title, authors,
     *             prices, and eBook info
     */
    public function fetchByASINs($asins)
    {
        $ret = array();
        // Breaks it into pages of 16
        $asins = array_values($asins);

        for ($i = 0; $i < count($asins); $i += self::PER_LOOKUP) {
            $someAsins = array_slice($asins, $i, self::PER_LOOKUP);
            $ret = $ret + $this->fetchSearch(array('field-asin' => implode('|', $someAsins)));
        }
        return $ret;
    }
}
