<?php

use PHPUnit\Framework\TestCase;

class IntegrationTestCfSmartCache extends TestCase
{
    public function test_cloudflare_api_interaction()
    {
        // Mock API credentials
        $api_token = 'mock_api_token';
        $zone_id = 'mock_zone_id';

        // Mock API endpoint
        $url = "https://api.cloudflare.com/client/v4/zones/$zone_id/purge_cache";

        // Mock request body
        $body = [
            'files' => [
                'https://example.com/sample-page',
                'https://example.com/sample-image.jpg'
            ]
        ];

        // Simulate API call
        $response = wp_remote_post($url, [
            'headers' => [
                'Authorization' => "Bearer $api_token",
                'Content-Type' => 'application/json'
            ],
            'body' => json_encode($body)
        ]);

        // Assert that the response is not an error
        $this->assertFalse(is_wp_error($response));

        // Assert that the response code is 200 (success)
        $this->assertEquals(200, wp_remote_retrieve_response_code($response));
    }
}
