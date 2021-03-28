<?php
require_once 'includes/ProjectCommon.php';

header('Content-Type: application/json');

$mysqli = ProjectCommon::createMysqli('yale_advanced_oci');

// TODO while this script looks like it can do multiple courses, it actually can
// only do one right now. Fix it ASAP

// Get the parameters, which can either be
// subject=BLAH&number=101... OR
// courses[0][subject]=BLAH&courses[0][number]=101...
$subject = $_GET['subject'];
$number = $_GET['number'];
$section = $_GET['section'];
$term = isset($_GET['term']) ? $_GET['term'] : ProjectCommon::fetchTextbooksTerm();

$courses = array(array(
    'subject' => $subject,
    'number' => $number,
    'section' => $section,
    'term' => $term
));

$ret = array();

// Fetch the Barnes and Nobles and internal data
$tb = new Textbook;
$tb->setColumns(
    array('title', 'isbn', 'term', 'subject', 'number', 'section',
        'type', 'price', 'product_id', 'section_id', 'required')
)
    ->addOrderBy('subject', 'ASC')
    ->addOrderBy('number', 'ASC')
    ->addOrderBy('section', 'ASC');

// Also prepare to fetch from cache
$tbc = new TextbookAmazonCache;
$tbc->setColumns(array('data', 'time'));

$courseCount = 0;
foreach ($courses as $course) {
    if (empty($subject) || empty($number) || empty($section) || empty($term)) {
        continue;
    }
    $tb->addCond('subject', $subject)
        ->addCond('number', $number)
        ->addCond('section', $section)
        ->addCond('term', $term);
    $tbc->addCond('subject', $subject)
        ->addCond('number', $number)
        ->addCond('section', $section)
        ->addCond('term', $term);
    $courseCount++;
}
$tbc->select();

// If in cache
if ($tbc->nextItem() && !$_GET['nocache']) {
    if ($tbc->info['time'] < time() - 3600 * 12) {
        // Too old, delete
        $tbc->delete();
    } else {
        // Use the cache
        echo $tbc->info['data'];
        exit;
    }
}


if ($courseCount == 0) {
    echo json_encode(array('success' => false, 'message' => 'No courses were specified'));
    exit;
}
$tb->select();

// Restructure the Barnes and Noble data
$books = array();
$isbns = array();
while ($tb->nextItem()) {
    $isbn = $tb->info['isbn'];
    $isbns[$isbn] = $isbn;

    $books[] = $tb->info;
}

if (count($isbns) == 0) {
    // If no textbooks, just quit
    echo json_encode(array('success' => true, 'textbooks' => array()));
    exit;
}

// Get the ASINs for ISBNs
// 1. Use the Amazon product API to get ASINs and New/Used prices of each book
$amazon = ProjectCommon::createAmazon();

$isbnCount = count($isbns);
$perLookup = 10;     // Limited to 10 according to
                    // http://docs.aws.amazon.com/AWSECommerceService/latest/DG/ItemLookup.html

$productData = array(); // Stores all the data, including 'asin', 'prices' => array('New' => ..., 'Used' => ...)
$asins = array(); // Maps ISBNs to ASINs: $asins[$isbn13] = $asin;
for ($i = 0; $i < $isbnCount; $i += $perLookup) {
    $someIsbns = array_slice($isbns, $i, $perLookup);

    $response = $amazon->responseGroup('ItemAttributes,Offers')
        ->optionalParameters(array('Condition' => 'All'))
        ->lookupIsbn(implode(',', $someIsbns));

    $items = $response['Items']['Item'];
    if (isset($items['ASIN'])) { // Only one result: wrap it
        $items = array($items);
    }
    if ($_GET['nocache']) {
        var_dump($items);
    }

    foreach ($items as $item) {
        $asin = $item['ASIN'];
        $itemInfo = array(
            'asin' => $asin,
            'prices' => array()
        );
        if (isset($item['OfferSummary']['LowestNewPrice'])) {
            $itemInfo['prices']['New'] = $item['OfferSummary']['LowestNewPrice']['Amount'] / 100;
        }
        if (isset($item['OfferSummary']['LowestUsedPrice'])) {
            $itemInfo['prices']['Used'] = $item['OfferSummary']['LowestUsedPrice']['Amount'] / 100;
        }

        $attributes =& $item['ItemAttributes'];
        // print_r($attributes);

        $isbn13 = isset($attributes['EAN']) ? $attributes['EAN'] : $attributes['EISBN'];

        if ($attributes['ProductGroup'] == 'eBooks' || !preg_match('@^\d*$@', $asin)) {
            // Only save eBook ASINs if we don't have any other ASINs
            if (!isset($productData[$isbn13])) {
                $productData[$isbn13] = $itemInfo;
                $asins[$isbn13] = $asin;
            }
        } else {
            // Always save book ASINs
            $productData[$isbn13] = $itemInfo;
            $asins[$isbn13] = $asin;
        }
    }
}


// Get the actual Amazon prices
$curl = new AmazonCurl;

$isbns = array_flip($asins);

$bookInfo = $curl->fetchByASINs($asins);

$infoByIsbn = array();

// Rekey these by ISBN
foreach ($bookInfo as $asin => $info) {
    if (isset($isbns[$asin])) {
        $isbn = $isbns[$asin];
        $info['prices'] = $info['prices'] + $productData[$isbn]['prices'];
        $infoByIsbn[$isbn] = $info;
    }
}

function makeAmazonUrl($book, $type)
{
    $urlTitle = $book['urlTitle'];
    $asin = $book['asin'];

    $host = 'http://www.amazon.com';

    // Sample: SubscriptionId=AKIAIRQSRJXK3F3HYFJQ&tag=yale0b-20&
    // linkCode=sp1&camp=2025&creative=386001&creativeASIN=0822334208


    // For figuring out what to have creative=
    $query = array(
        'SubscriptionId' => ProjectCommon::AMAZON_API_KEY,
        'tag' => ProjectCommon::AMAZON_ASSOCIATE_TAG,
        'linkCode' => ProjectCommon::AMAZON_LINKCODE,
        'camp' => ProjectCommon::AMAZON_CAMPAIGN,
        'creative' => ProjectCommon::AMAZON_CREATIVE,
        'creativeASIN' => $asin
    );

    $creativeString = http_build_query($query);

    switch ($type) {
        case 'Rent new':
            return "{$host}/{$urlTitle}/dp/{$asin}?{$creativeString}&selectObb=rent";
        // return "{$host}/{$urlTitle}/dp/{$asin}?selectObb=rent";

        case 'New':
        case 'Used':
            return "{$host}/gp/offer-listing/{$asin}?{$creativeString}&condition=" . strtolower($type);
        // return "{$host}/gp/offer-listing/{$asin}?condition=" . strtolower($type);

        case 'eBook':
        case 'Rent eBook':
            $ebook = $book['eBook'];
            $urlTitle = $ebook['urlTitle'];
            $asin = $ebook['asin'];
            return "{$host}/{$urlTitle}/dp/{$asin}?{$creativeString}";
        // return "{$host}/{$urlTitle}/dp/{$asin}";

        default:
            return "{$host}/{$urlTitle}/dp/{$asin}?{$creativeString}";
        // return "{$host}/{$urlTitle}/dp/{$asin}";
    }
}

// Rekey to the final output
foreach ($books as $book) {
    // 1. Info
    // 1a. Barnes and Noble
    $course = $book['subject'] . ' ' . $book['number'] . ' ' .
        str_pad($book['section'], 2, '0', STR_PAD_LEFT);
    $isbn = $book['isbn'];

    if (!isset($textbooks[$course][$isbn])) {
        $infoToSave = $book;

        $infoToSave['productId'] = $infoToSave['product_id'];
        $infoToSave['sectionId'] = $infoToSave['section_id'];
        $urlTitle = preg_replace('/\s+/', '_', preg_replace('/[^\w\s]+/', '', $infoToSave['title']));
        $infoToSave['bookstoreUrl'] = sprintf(
            'http://yale.bncollege.com/webapp/wcs/stores/servlet/' .
            '%s/BNCB_TextbookDetailView?catalogId=10001&storeId=16556&productId=%d&sectionId=%d&item=Y',
            $urlTitle,
            $infoToSave['productId'],
            $infoToSave['sectionId']
        );
        unset($infoToSave['price'], $infoToSave['type']);
        $infoToSave['prices'] = array();

        // 1a. Amazon
        if (isset($infoByIsbn[$isbn])) {
            $info = $infoByIsbn[$isbn];
            unset($info['prices']);
            $info['imageUrl'] = 'http://ecx.images-amazon.com/images/I/' . $info['imageTag'] . '._SL75_.jpg';
            $infoToSave = $info + $infoToSave;
        }
    } else {
        $infoToSave = $textbooks[$course][$isbn];
    }

    // 2. Prices
    // 2a. Barnes and Noble
    $type = strtoupper($book['type']);
    switch ($type) {
        case 'BUY ETEXTBOOK':
            $type = 'eBook';
            break;
        case 'RENT ETEXTBOOK':
            $type = 'Rent eBook';
            break;
        case 'BUY NEW':
            $type = 'New';
            break;
        case 'BUY USED':
            $type = 'Used';
            break;
        case 'RENT NEW':
            $type = 'Rent new';
            break;
        case 'RENT USED':
            $type = 'Rent used';
            break;
    }
    $infoToSave['prices'][$type] = $book['price'];

    // Amazon
    if (isset($infoByIsbn[$isbn])) {
        $info = $infoByIsbn[$isbn];

        $urlTitle = $info['urlTitle'];
        $asin = $info['asin'];

        $offers = array();
        foreach ($info['prices'] as $type => $price) {
            $offers[$type] = array(
                'url' => makeAmazonUrl($info, $type),
                'price' => $price
            );
        }

        $infoToSave['url'] = makeAmazonUrl($info, '');
        $infoToSave['offers'] = $offers;
    }


    $textbooks[$course][$isbn] = $infoToSave;
}

// Fetch the actual Amazon prices, images, etc.

$json = json_encode(array('success' => true, 'textbooks' => $textbooks));

// Cache it for future use
$tbc->clearInfo();
$tbc->setInfo('subject', $subject);
$tbc->setInfo('number', $number);
$tbc->setInfo('section', $section);
$tbc->setInfo('term', $term);
$tbc->setInfo('time', time());
$tbc->setInfo('data', $json);
$tbc->commit();

echo $json;
