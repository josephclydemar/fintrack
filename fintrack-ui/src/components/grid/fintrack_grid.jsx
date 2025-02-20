/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, useState, memo } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import "ag-grid-enterprise";
import { GridLoadingCustomComponent, GridNoRowsToShowCustomComponent } from "@/components/grid/utilities";
import { Search, ReloadData, ResetData, AddRowData } from "@/components/grid/toolbars";
import { NumberFormatter } from "./column_formatters";
import { IdRenderer, OptionsDropdownRenderer } from "@/components/grid/column_renderers";
import Queries from "@/hooks/queries";
import { GridKeys, ToolbarKeys } from "@/utils/keys";


const colTypes = {
    id: {
        cellStyle: {
            textAlign: "left",
        },
        cellRenderer: IdRenderer,
    },
    currency: {
        cellStyle: {
            textAlign: "right",
        },
        valueFormatter: NumberFormatter,
    },
    optionsDropdown: {
        cellRenderer: OptionsDropdownRenderer,
    },
};

// eslint-disable-next-line no-unused-vars
export default memo(function FTGrid({gridId, gridRef, gridOptions, gridComponentBlueprint, toolbarParams, eventHandlers, gridStyles={}}) {
    // toolbar states
    const [reloadData, setReloadData] = useState(false);
    const [search, setSearch] = useState("");

    const [rowData, setRowData] = useState([]);
    const [rowDataRendered, setRowDataRendered] = useState([]);

    const gridParams = gridComponentBlueprint[GridKeys.params];
    const gridSettings = gridComponentBlueprint[GridKeys.settings];
    const toolbars = gridComponentBlueprint[GridKeys.toolbar];

    const colDefs = gridSettings[GridKeys.column_defs];
    const rowId = gridSettings[GridKeys.row_id];
    const searchByKey = gridSettings[GridKeys.search_by];
    
    const method = gridParams[GridKeys.method];
    const query = gridParams[GridKeys.query];
    // eslint-disable-next-line no-unused-vars
    const queryKey = query[GridKeys.query_key];
    const urlEndpoint = query[GridKeys.url_endpoint];
    
    const resource = Queries.useRetrieveResource(urlEndpoint, method);
    const invalidateGridResource = Queries.useInvalidateResource();
    useEffect(function () {
        if(resource.isSuccess) {
            setRowData(resource.data);
        }
    }, [resource.isSuccess, resource.isFetching]);

    useEffect(function () {
        if(resource.isSuccess) {
            invalidateGridResource(urlEndpoint);
        }
    }, [resource.isSuccess, reloadData]);

    useEffect(function () {
        setRowDataRendered(rowData.filter(function (item) {
            return item[searchByKey].toLowerCase().includes(search.toLowerCase());
        }));
    }, [rowData, search]);


    function getGridRowId({ data }) {
        return `parent-${data[rowId]}`;
    }

    let detailGridOptions = {};
    if(gridSettings[GridKeys.is_detail_grid] !== undefined) {
        const detailGridRowId = gridSettings[GridKeys.detail_grid_options][GridKeys.row_id];
        function getDetailGridRowId(params) {
            return `parent-${params.data.parent_id}-child-${params.data[detailGridRowId]}`;
        }
        detailGridOptions = {
            masterDetail: true,
            detailRowHeight: gridSettings[GridKeys.detail_grid_options][GridKeys.detail_row_height],
            detailCellRendererParams: {
                detailGridOptions: {
                    getRowId: getDetailGridRowId,
                    animateRows: true,
                    scrollbarWidth: 5,
                    // rowHeight: 30,
                    // headerHeight: 30,
                    noRowsOverlayComponent: GridNoRowsToShowCustomComponent,
                    noRowsOverlayComponentParams: {
                        noRowsMessageFunc: function () {
                            return gridSettings[GridKeys.detail_grid_options][GridKeys.no_rows_to_show_overlay_message];
                        },
                    },
                    columnTypes: colTypes,
                    columnDefs: gridSettings[GridKeys.detail_grid_options][GridKeys.column_defs],
                },
                getDetailRowData: function (params) {
                    const detailName = gridSettings[GridKeys.detail_grid_options][GridKeys.detail_grid_name];
                    const detailData = params.data[detailName]["data"].map(function (item) {
                        return {
                            parent_id: params.data[detailName]["parent_id"],
                            ...item,
                        };
                    });
                    params.successCallback(detailData);
                },
            },
        };
    }

    function renderToolbars() {
        return toolbars.map(function (key) {
            switch(key) {
                case ToolbarKeys.search:
                    return <Search 
                                key={ToolbarKeys.search}
                                callback={function ({ target }) {
                                    setSearch(target.value);
                                }} 
                                searchByText={searchByKey}/>
                case ToolbarKeys.add_row_data:
                    return <AddRowData 
                                key={ToolbarKeys.add_row_data}
                                utilityCallback={() => {}}
                                // updateCallback={function () {
                                //     setReloadData(!reloadData);
                                // }}
                                modalParams={toolbarParams?.addRowDataModal}/>
                case ToolbarKeys.reload_data:
                    return <ReloadData 
                                key={ToolbarKeys.reload_data}
                                callback={function () {
                                    setReloadData(!reloadData);
                                    // setRowData([]);
                                }}/>
                case ToolbarKeys.reset_data:
                    return <ResetData 
                                key={ToolbarKeys.reset_data}
                                callback={(event) => console.log(event)}/>
                default:
                    return <></>;
            }
        });
    }

    
    return (
        <div>
            {renderToolbars()}
            <div className="ag-theme-balham w-full mt-[1px]" style={{...gridStyles}}>
                <AgGridReact 
                    ref={gridRef}
                    columnTypes={colTypes}
                    getRowId={getGridRowId}
                    scrollbarWidth={5}
                    // rowHeight={30}
                    // headerHeight={30}
                    loading={false}
                    loadingOverlayComponent={GridLoadingCustomComponent}
                    loadingOverlayComponentParams={{
                        loadingMessage: gridSettings[GridKeys.loading_overlay_message],
                    }}
                    noRowsOverlayComponent={GridNoRowsToShowCustomComponent}
                    noRowsOverlayComponentParams={{
                        noRowsMessageFunc: function () {
                            return gridSettings[GridKeys.no_rows_to_show_overlay_message];
                        },
                    }}
                    animateRows={true}
                    columnDefs={colDefs}
                    rowData={rowDataRendered}
                    gridOptions={gridOptions}
                    {...eventHandlers}
                    {...detailGridOptions}/>
            </div>
        </div>
    );
});
