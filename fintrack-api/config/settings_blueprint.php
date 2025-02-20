<?php

$key = 'key';
$type = 'type';
$value = 'value';

return [
    'user_settings' => [
        // general settings
        [
            $key => 'language',
            $type => 'general',
            $value => ['value' => 'en'],
        ],
        [
            $key => 'timezone',
            $type => 'general',
            $value => ['value' => 'asia/manila'],
        ],
        [
            $key => 'date_time_format',
            $type => 'general',
            $value => ['value' => 'MM-DD-YYYY HH:mm:ss'],
        ],
        [
            $key => 'currency',
            $type => 'general',
            $value => ['value' => 'peso'],
        ],

        // notification settings
        [
            $key => 'email',
            $type => 'notification',
            $value => ['value' => true],
        ],
        [
            $key => 'sms',
            $type => 'notification',
            $value => ['value' => true],
        ],
        [
            $key => 'push',
            $type => 'notification',
            $value => ['value' => true],
        ],

        // appearance settings
        [
            $key => 'theme',
            $type => 'appearance',
            $value => ['value' => 'monokai'],
        ],
        [
            $key => 'font',
            $type => 'appearance',
            $value => ['value' => ['size' => 12, $type => 'arial']],
        ],
        [
            $key => 'table',
            $type => 'appearance',
            $value => ['value' => true],
        ],

        // security settings
        [
            $key => 'audit_logs',
            $type => 'security',
            $value => ['value' => true],
        ],
        [
            $key => 'mfa_auth',
            $type => 'security',
            $value => ['value' => true],
        ],
    ],
    'chart_settings' => [],
    'grid_settings' => [],
];

