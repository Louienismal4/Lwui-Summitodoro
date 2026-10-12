<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_the_backend_root_returns_not_found(): void
    {
        $response = $this->get('/');

        $response->assertNotFound();
    }

    public function test_the_health_endpoint_returns_a_successful_response(): void
    {
        $response = $this->get('/up');

        $response->assertOk();
    }
}
