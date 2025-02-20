<?php

$_appUrl = 'http://localhost:8000';
$_apiV1 = '/api/v1';
$_usersEndpoint = '/users/{user}';

// keys
$_params = 'params';
$_settings = 'settings';
$_toolbar = 'toolbar';
$_method = 'method';
$_query = 'query';
$_queryKey = 'query_key';

$_urlEndpoint = 'url_endpoint';
$_rowId = 'row_id';
$_searchBy = 'search_by';
$_columnDefs = 'column_defs';

$_field = 'field';
$_headerName = 'headerName';
$_cellRenderer = 'cellRenderer';
$_type = 'type';
$_editable = 'editable';
$_sortable = 'sortable';
$_resizable = 'resizable';
$_flex = 'flex';
$_suppressMovable = 'suppressMovable';
$_cellRendererParams = 'cellRendererParams';

$_isDetail = 'is_detail_grid';
$_masterDetailGridOptions = 'detail_grid_options';
$_detailGridName = 'detail_grid_name';
$_detailRowHeight = 'detail_row_height';
$_noRowsToShowOverlayMessage = 'no_rows_to_show_overlay_message';
$_loadingOverlayMessage = 'loading_overlay_message';

// toolbars
$_search = 'search';
$_addRowData = 'add_row_data';
$_reloadData = 'reload_data';
$_resetData = 'reset_data';

// column types
$_id = 'id';
$_currency = 'currency';
$_optionsDropdown = 'optionsDropdown';


return [
    'financial_targets' => [
        $_params => [
            $_method => 'GET',
            $_query => [
                $_queryKey => 'financial_targets',
                $_urlEndpoint => $_apiV1.$_usersEndpoint.'/financial_targets?with_transactions=true',
            ],
        ],
        $_settings => [
            $_rowId => 'financial_target_id',
            $_searchBy => 'name',
            $_noRowsToShowOverlayMessage => 'No Financial Targets',
            $_columnDefs => [
                [
                    $_cellRenderer => 'agGroupCellRenderer',
                    $_field => 'name',
                    $_headerName => 'Name',
                    $_editable => false,
                    $_resizable => true,
                    $_sortable => false,
                    $_flex => 3,
                    $_suppressMovable => true,
                ],
                [
                    $_field => 'description',
                    $_headerName => 'Description',
                    $_editable => false,
                    $_resizable => true,
                    $_sortable => false,
                    $_flex => 3,
                    $_suppressMovable => true,
                ],
                [
                    $_field => 'category',
                    $_headerName => 'Category',
                    $_editable => false,
                    $_resizable => true,
                    $_sortable => false,
                    $_flex => 3,
                    $_suppressMovable => true,
                ],
                [
                    $_field => 'balance',
                    $_headerName => 'Balance',
                    $_editable => false,
                    $_resizable => false,
                    $_sortable => true,
                    $_flex => 2,
                    $_suppressMovable => true,
                    $_type => [$_currency],
                ],
                [
                    $_field => 'base_balance',
                    $_headerName => 'Base Balance',
                    $_editable => false,
                    $_resizable => false,
                    $_sortable => false,
                    $_flex => 2,
                    $_suppressMovable => true,
                    $_type => [$_currency],
                ],
                // [
                //     $_field => 'start_date',
                //     $_headerName => 'Start Date',
                //     $_editable => false,
                //     $_resizable => false,
                //     $_sortable => false,
                //     $_flex => 2,
                //     $_suppressMovable => true,
                // ],
                // [
                //     $_field => 'end_date',
                //     $_headerName => 'End Date',
                //     $_editable => false,
                //     $_resizable => false,
                //     $_sortable => true,
                //     $_flex => 2,
                //     $_suppressMovable => true,
                // ],
                [
                    $_field => 'options',
                    $_headerName => 'Options',
                    $_editable => false,
                    $_resizable => false,
                    $_sortable => false,
                    $_flex => 2,
                    $_suppressMovable => true,
                    $_type => [$_optionsDropdown],
                    $_cellRendererParams => [
                        'details' => [
                            'data_key' => 'financial_target_id',
                            'title_key' => 'name',
                            // 'title' => 'See Options',
                            'items' => [
                                [
                                    'key' => 'detail',
                                    'label' => 'See Full Details',
                                ],
                                [
                                    'key' => 'edit',
                                    'label' => 'Edit Finacial Target',
                                ],
                                [
                                    'key' => 'add',
                                    'label' => 'Add New Transaction',
                                ],
                            ],
                        ],
                    ],
                ],
                // [
                //     $_field => 'add_transaction',
                //     $_headerName => 'Add',
                //     $_editable => false,
                //     $_resizable => false,
                //     $_sortable => false,
                //     $_flex => 1,
                //     $_suppressMovable => true,
                //     $_type => ['addButton'],
                // ],
                // [
                //     $_field => 'edit_transaction',
                //     $_headerName => 'Edit',
                //     $_editable => false,
                //     $_resizable => false,
                //     $_sortable => false,
                //     $_flex => 1,
                //     $_suppressMovable => true,
                //     $_type => ['editButton'],
                // ],
            ],
            $_isDetail => true,
            $_masterDetailGridOptions => [
                $_detailGridName => 'transactions',
                $_rowId => 'transaction_id',
                $_searchBy => 'name',
                $_detailRowHeight => 250,
                $_loadingOverlayMessage => 'LOADING....',
                $_noRowsToShowOverlayMessage => 'No Transactions',
                $_columnDefs => [
                    [
                        $_field => 'hash',
                        $_headerName => 'Hash',
                        $_editable => false,
                        $_resizable => true,
                        $_sortable => false,
                        $_flex => 1,
                        $_suppressMovable => true,
                        $_type => [$_id],
                    ],
                    [
                        $_field => 'name',
                        $_headerName => 'Name',
                        $_editable => false,
                        $_resizable => true,
                        $_sortable => false,
                        $_flex => 1,
                        $_suppressMovable => true,
                    ],
                    [
                        $_field => 'description',
                        $_headerName => 'Description',
                        $_editable => false,
                        $_resizable => true,
                        $_sortable => false,
                        $_flex => 1,
                        $_suppressMovable => true,
                    ],
                    [
                        $_field => 'amount',
                        $_headerName => 'Amount',
                        $_editable => false,
                        $_resizable => false,
                        $_sortable => true,
                        $_flex => 1,
                        $_suppressMovable => true,
                        $_type => [$_currency],
                    ],
                    [
                        $_field => 'created_at',
                        $_headerName => 'Created At',
                        $_editable => false,
                        $_resizable => false,
                        $_sortable => true,
                        $_flex => 1,
                        $_suppressMovable => true,
                    ],
                    // [
                    //     $_field => 'options',
                    //     $_headerName => 'Options',
                    //     $_editable => false,
                    //     $_resizable => false,
                    //     $_sortable => false,
                    //     $_flex => 1,
                    //     $_suppressMovable => true,
                    //     $_type => [$_optionsDropdown],
                    //     $_cellRendererParams => [
                    //         'details' => [
                    //             'data_key' => 'transaction_id',
                    //             'title_key' => 'name',
                    //             'items' => [
                    //                 [
                    //                     'key' => 'edit',
                    //                     'label' => 'Edit Transaction',
                    //                 ],
                    //                 [
                    //                     'key' => 'detail',
                    //                     'label' => 'See Full Details',
                    //                 ],
                    //             ],
                    //         ],
                    //     ],
                    // ],
                ],
            ],
        ],
        $_toolbar => [$_search, $_reloadData, $_addRowData],
    ],
    'transactions' => [
        $_params => [
            $_method => 'GET',
            $_query => [
                $_queryKey => 'transactions',
                $_urlEndpoint => $_apiV1.$_usersEndpoint.'/transactions',
            ],
        ],
        $_settings => [
            $_rowId => 'transaction_id',
            $_searchBy => 'hash',
            $_noRowsToShowOverlayMessage => 'No Transactions',
            $_columnDefs => [
                [
                    $_field => 'hash',
                    $_headerName => 'Hash',
                    $_editable => false,
                    $_resizable => true,
                    $_sortable => false,
                    $_flex => 1,
                    $_suppressMovable => true,
                    $_type => [$_id],
                ],
                [
                    $_field => 'financial_target',
                    $_headerName => 'Financial Target',
                    $_editable => false,
                    $_resizable => true,
                    $_sortable => false,
                    $_flex => 1,
                    $_suppressMovable => true,
                ],
                [
                    $_field => 'name',
                    $_headerName => 'Name',
                    $_editable => true,
                    $_resizable => false,
                    $_sortable => false,
                    $_flex => 1,
                    $_suppressMovable => true,
                ],
                [
                    $_field => 'description',
                    $_headerName => 'Description',
                    $_editable => true,
                    $_resizable => false,
                    $_sortable => false,
                    $_flex => 2,
                    $_suppressMovable => true,
                ],
                [
                    $_field => 'amount',
                    $_headerName => 'Amount',
                    $_editable => false,
                    $_resizable => false,
                    $_sortable => false,
                    $_flex => 1,
                    $_suppressMovable => true,
                    $_type => [$_currency],
                ],
                [
                    $_field => 'created_at',
                    $_headerName => 'Created At',
                    $_editable => false,
                    $_resizable => false,
                    $_sortable => false,
                    $_flex => 1,
                    $_suppressMovable => true,
                ],
            ],
        ],
        $_toolbar => [$_search, $_reloadData, $_resetData],
    ],
    'categories' => [
        $_params => [
            $_method => 'GET',
            $_query => [
                $_queryKey => 'categories',
                $_urlEndpoint => $_apiV1.$_usersEndpoint.'/categories',
            ],
        ],
        $_settings => [
            $_rowId => 'category_id',
            $_searchBy => 'name',
            $_noRowsToShowOverlayMessage => 'No Categories',
            $_columnDefs => [
                [
                    $_field => 'name',
                    $_headerName => 'Name',
                    $_editable => true,
                    $_resizable => false,
                    $_sortable => false,
                    $_flex => 1,
                    $_suppressMovable => true,
                ],
                [
                    $_field => 'type',
                    $_headerName => 'Type',
                    $_editable => false,
                    $_resizable => false,
                    $_sortable => false,
                    $_flex => 1,
                    $_suppressMovable => true,
                ],
                [
                    $_field => 'created_at',
                    $_headerName => 'Created At',
                    $_editable => false,
                    $_resizable => false,
                    $_sortable => false,
                    $_flex => 1,
                    $_suppressMovable => true,
                ],
            ],
        ],
        $_toolbar => [$_search, $_reloadData],
    ],
];
