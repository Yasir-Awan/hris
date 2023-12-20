import React,{useEffect,useState} from 'react';
import { DataGrid} from '@mui/x-data-grid';
import { Box } from '@mui/material';
import axios from 'axios';

const UserList = () => {
const [data, setData] = useState({
  loading: true,
  rows: [],
  totalRows: 0,
  rowsPerPageOptions: [5,10,20,50,100],
  pageSize: 5,
  page: 1
});
const [filterModel, setFilterModel] = useState({items: [{columnField: '',operatorValue: '',value: '',},],});
const updateData = (k, v) => setData((prev) => ({ ...prev, [k]: v }));

  useEffect(() => {

    let counter = 1;
    let epmloyeeRecords = [];
    axios({
      method: 'post',
      url: 'user_list',
      headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),},
      data: {
        pageSize: data.pageSize,
        page: data.page,
        filters: filterModel, // pass filterModel to the server,
        designation: localStorage.getItem('designation'),
        emp_id: localStorage.getItem('bio_id')
      },
    }
    )
      .then(function (response) {
        if(response.data.employees_rows){
          response.data.employees_rows.forEach(element => {
              epmloyeeRecords.push({'id':counter,'fullname':element.fullname , 'email':element.email,
              'password':element.password, 'site_name':element.site_name, 'contact':element.contact, 'address':element.address,
              'type_of_employee':element.type_of_employee, 'consultant':element.consultant, 'section_name':element.section_name,'field_name':element.field_name,
              'designation_name':element.designation_name,
          page:response.data.page,
          pagesize:response.data.pagesize,
        });
          counter++;
          }
            );
        }
        else{}
        setTimeout(() => {
          const rows = epmloyeeRecords;
          updateData("totalRows", response.data.total_rows);
              setTimeout(() => {
                updateData("loading", false);
              }, 100);
              updateData("rows", rows);
        }, 100);
      })
      .catch(error => {
        console.log(error);
          })

    },[data.page,data.pageSize,filterModel])


    const columns = [
      { field: 'id', headerName: 'Id', width: 20,headerAlign:'center',align:'center',
        filterable: false,
        renderCell: (value) => {
          const currentPage = value.row.page;
          const pageSize = value.row.pagesize;
          const rowNumber = (currentPage - 1) * pageSize + value.api.getRowIndex(value.row.id) + 1;
          return <div>{rowNumber}</div>;
        },
      },
      { field: 'fullname', headerName: 'Employee', width: 200,headerAlign:'center',align:'center'},
      { field: 'designation_name', headerName: 'Designation', width: 180,headerAlign:'center',align:'center'},
      { field: 'site_name', headerName: 'Site', width: 180,headerAlign:'center',align:'center'},
      { field: 'email', headerName: 'Email', width: 300,headerAlign:'center',align:'center'},
      { field: 'contact', headerName: 'Contact', width: 180,headerAlign:'center',align:'center'},
      { field: 'section_name', headerName: 'Section', width: 180,headerAlign:'center',align:'center'},
      { field: 'field_name', headerName: 'Field', width: 180,headerAlign:'center',align:'center'},
  ];

    return (
    <>
  <div style={{height:'auto', width: '100%', marginBottom:'2px' }}>
  <Box sx={{marginLeft:'97%', position: "absolute",top:'80px',right:'22px'}}>
    </Box>
    <DataGrid
        density="standard"
        autoHeight
        loading={data.loading}
        rowsPerPageOptions={data.rowsPerPageOptions}
        pagination
        page={data.page-1}
        pageSize={data.pageSize}
        paginationMode="server"
        onPageChange={(newpage) => {
          updateData("page", newpage+1);
        }}
        onPageSizeChange={(newPageSize) => {
          updateData("page", 1);
          updateData("pageSize", newPageSize);
        }}
        rowCount={data.totalRows}
        rows={data.rows}
        columns={columns}
        filterMode="server"
        // enable server-side filtering
        onFilterModelChange={
          (newFilterModel) => setFilterModel(newFilterModel)
        }
        //  handle filter changes made by the user
        filterModel={filterModel}
    />
  </div>
    </>
  )
}

export default UserList