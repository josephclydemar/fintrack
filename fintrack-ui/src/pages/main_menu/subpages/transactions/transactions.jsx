import { useRef } from "react";
import { Typography } from "antd";
import FTGrid from "@/components/grid/fintrack_grid";
import Queries from "@/hooks/queries";

const { Title } = Typography;

export default function Transactions() {
    const ftGridRef = useRef();
    const blueprint = Queries.useRetrieveGridBlueprint("transactions");
    
    return (
        <>
        <Title level={4}>Transactions</Title>
        {blueprint.isSuccess ? 
		<FTGrid
            gridId="transactions_grid"
            reloadExternalSignal={{}}
            gridRef={ftGridRef}
            gridOptions={{}}
            gridComponentBlueprint={blueprint.data}
            gridStyles={{ height: "76vh" }}
            eventHandlers={{
                onCellValueChanged: function (event) {
                    console.log(event);
                }
            }}
            /> : <></>}
        </>
    );
}
