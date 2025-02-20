import { useRef, memo } from "react";
import { Typography } from "antd";
import FTGrid from "@/components/grid/fintrack_grid";
import AddRowModalContent from "./components/add_row_modal_content";
import Queries from "@/hooks/queries";

const { Title } = Typography;

export default memo(function FinancialTargets() {
    const ftGridRef = useRef();
    const blueprint = Queries.useRetrieveGridBlueprint("financial_targets");

    return (
        <>
        <Title level={4}>Financial Targets</Title>
        {blueprint.isSuccess ? 
		<FTGrid
            gridId="financial_targets_grid"
            reloadExternalSignal={{}}
            gridRef={ftGridRef}
            gridOptions={{}}
            gridComponentBlueprint={blueprint.data}
            toolbarParams={{
                addRowDataModal: {
                    title: "Add Financial Target",
                    okText: "Ok",
                    cancelText: "Cancel",
                    contentComponent: AddRowModalContent,
                    contentComponentProps: {
                        gridBlueprint: blueprint,
                    },
                },
            }}
            gridStyles={{ height: "76vh" }}
            eventHandlers={{
                onCellValueChanged: function (event) {
                    console.log(event);
                }
            }}
            /> : <></>}
        </>
    );
});
