<?php
class TextbookAmazonCache extends SQLTableBase
{
    protected $tableName = 'textbook_amazon_cache';
    protected $keys = array('subject', 'number', 'section');
}
