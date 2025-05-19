import React from "react";
import { Box, Paper } from "@mui/material";
import { DataGrid, gridClasses } from "@mui/x-data-grid";

const Table = ({ data, columns }) => {
  return (
    <Paper sx={{ bgcolor: "white" }}>
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          getRowId={(row) => row?._id}
          sx={{
            "& .MuiTablePagination-displayedRows": {
              color: "black",
            },
            color: "black",
            [`& .${gridClasses?.row}`]: {
              bgcolor: "white",
            },
            // Style for header cells
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "rgb(25, 118, 210)",
            },

            "& .MuiDataGrid-columnHeaderTitle": {
              color: "white",
              fontWeight: "bold",
              // fontSize: "13px",
            },
            // Style for checkbox in header
            "& .MuiDataGrid-columnHeaderCheckbox .MuiCheckbox-root": {
              color: "#FFF",
            },
            "& .MuiDataGrid-iconButtonContainer .MuiSvgIcon-root": {
              color: "white",
            },
            "& .MuiDataGrid-sortIcon": {
              color: "white",
            },
          }}
          style={{
            "--DataGrid-containerBackground": "rgb(25, 118, 210)",
          }}
          rows={data?.map((row, index) => ({
            ...row,
            rowNumber: index + 1,
          }))}
          columns={columns}
          pageSize={3}
          rowsPerPageOptions={[3]}
        //   checkboxSelection
        />
      </Box>
    </Paper>
  );
};

export default Table;
