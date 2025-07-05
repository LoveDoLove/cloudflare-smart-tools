<?php

use PHPUnit\Framework\TestCase;

class TestCfSmartCache extends TestCase
{
    public function test_async_request()
    {
        // Mock URL and arguments
        $url = 'https://example.com';
        $args = ['body' => ['key' => 'value']];

        // Simulate the function call
        $result = cf_smart_cache_async_request($url, $args);

        // Assert that the function does not return any value (non-blocking)
        $this->assertNull($result);
    }

    public function test_get_cached_response()
    {
        // Mock callback function
        $callback = function () {
            return 'mocked_response';
        };

        // Set a transient key
        $key = 'test_key';

        // Call the function to cache the response
        $response = cf_smart_cache_get_cached_response($key, $callback);

        // Assert that the response matches the mocked response
        $this->assertEquals('mocked_response', $response);

        // Call the function again to ensure the cached value is returned
        $cached_response = cf_smart_cache_get_cached_response($key, $callback);
        $this->assertEquals('mocked_response', $cached_response);
    }
}
