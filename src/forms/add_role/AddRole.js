import React, {useState,useEffect} from 'react';
import { useTheme } from '@mui/material/styles';
import {useNavigate} from 'react-router-dom';
import './AddRole.css';
import axios from 'axios';
import {Grid, TextField, Button, Card,CardContent,Box,MenuItem,OutlinedInput,InputLabel,FormControl,Select,Chip} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'





function AddRole(props) {
    const navigate = useNavigate();

    const theme = useTheme();
  const [roleName, setRoleName] = React.useState([]);
  const [selectedEmployees, setSelectedEmployees] = React.useState([]);
  const [selectedModules, setSelectedModules] = React.useState([]);
  const [selectedSites, setSelectedSites] = React.useState([]);
  const [employees,setEmployees] = useState([]);
  const [modules,setModules] = useState([]);
  const [sites,setSites] = useState([]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  useEffect(() => {
        const fetchEmployees = async () => {
            try {
                await fetchEmployeesList();
            } catch (error) {
                console.error('Error fetching roles list:', error);
            }
        };

        const fetchModules = async () => {
            try {
                await fetchModulesList();
            } catch (error) {
                console.error('Error fetching roles list:', error);
            }
        };

        const fetchSites = async () => {
            try {
                await fetchSitesList();
            } catch (error) {
                console.error('Error fetching roles list:', error);
            }
        };

        fetchModules();
        fetchEmployees();
        fetchSites();
    }, []);


    const fetchEmployeesList = () => {
        let userRecords = [];
        // api call for users list START
              axios({
                method: 'get',
                url:'employees_list_for_roles_form',
                headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),},
                data: { employees: JSON.parse(localStorage.getItem('employees'))},
              })
                .then(function (response) {
                    response.data.employee_info.forEach(element => {
                        userRecords.push({'id':element.bio_ref_id,'fullname':element.fullname , 'email':element.email,
                        'password':element.password, 'sitename':element.site_name, 'contact':element.contact, 'address':element.address,
                      'empType':element.type_of_employee, 'consultant':element.consultant, 'empSec':element.section_name,'empField':element.field_name,
                    'empRole':element.role_name,})
                    });
                    setEmployees(userRecords);
                })
                .catch(error => {});
                // api call for users list END
}

const fetchModulesList = () => {
    let moduleRecords = [];
    // api call for shifts list START
          axios({
            method: 'get',
            url:'modules_list',
            headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),
          }
          })
            .then(function (response) {
                response.data.module_info.forEach(element => {
                  moduleRecords.push({
                                        'id':element.id,
                                        'name':element.name,
                                    })
                });
                setModules(moduleRecords)
            })
            .catch(error => {});// api call for shifts list END
}

const fetchSitesList = () => {
    let siteRecords = [];
    // api call for sites list START
          axios({
            method: 'get',
            url:'sites_list_for_roles_form',
            headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),},
          })
            .then(function (response) {
                response.data.site_info.forEach(element => {
                    siteRecords.push({
                      'id':element.id,
                      'name':element.name,
                  })
                });
                setSites(siteRecords);
            })
            .catch(error => {});
            // api call for users list END
}

    function getEmployeesStyles(name, selectedEmployees, theme) {
      return {
        fontWeight:
          selectedEmployees.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
      };
    }

    function getModulesStyles(name, selectedModules, theme) {
      return {
        fontWeight:
          selectedModules.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
      };
    }

    function getSitesStyles(name, selectedSites, theme) {
      console.log(selectedSites)
      return {
        fontWeight:
          selectedSites.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightMedium,
      };
    }

    // helper function to find module name with corresponding id
const getModuleNameById = (moduleId) => {
  const selectedModule = modules.find((module) => module.id === moduleId);
  return selectedModule ? selectedModule.name : '';
};

  // helper function to find employee name with corresponding id
  const getEmployeeNameById = (employeeId) => {
    const selectedEmployee = employees.find((employee) => employee.id === employeeId);
    return selectedEmployee ? selectedEmployee.fullname : '';
};

// helper function to find employee name with corresponding id
const getSiteNameById = (siteId) => {
  const selectedSite = sites.find((site) => site.id === siteId);
  return selectedSite ? selectedSite.name : '';
};


  const handleEmployeeChange = (event) => {
    const {target: { value },} = event;
    setSelectedEmployees(/* On autofill we get a stringified value.*/typeof value === 'string' ? value.split(',') : value,);
  };

  const handleModuleChange = (event) => {
    const {target: { value },} = event;
    setSelectedModules(/* On autofill we get a stringified value.*/typeof value === 'string' ? value.split(',') : value,);
  };

  const handleSiteChange = (event) => {
    const {target: { value },} = event;
    setSelectedSites(/* On autofill we get a stringified value.*/typeof value === 'string' ? value.split(',') : value,);
  };


  // Function to handle checkbox change



    const inputEvent = (event) => {

        const { name, value } = event.target;

        console.log(value)
        console.log(name)
        setRoleName(value);

    }









    const formSubmit = (event) => {
        event.preventDefault();

        axios({
                method: 'post',
                url: 'add_role',
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
                data: {
                  role_name:roleName,
                  employees:selectedEmployees,
                  modules:selectedModules,
                  sites:selectedSites,
                },
        })
        .then(
                function (response) {
                  console.log(response.data)
                  if(response.data.status==='200'){
                                  toast.success('Role Added', {
                                                    position:'top-right',
                                                    autoClose:1000,
                                                    onClose: () => {
                                                      props.refreshList();
                                                  }
                                                });
                  }
                  else{
                                  toast.success('Could Not Add Role', {
                                        position:'top-right',
                                        autoClose:1000,
                                        onClose: () => navigate('/home')
                                    });
                    }
                }
        )
        .catch(error => console.error(error));
      }

        return (
            <>
                <div className="App">
                <Grid>
                    <Card style={{ width: "auto", margin: "auto" }}>
                    <CardContent>
                        <form onSubmit={formSubmit}>
                        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid sx={{ mt: 1 }} xs={12} item>
                                <TextField label="Enter Role Name" name='role_name' onChange={inputEvent} value={roleName} variant="outlined" sx={{ width: "95%" }} required
                                    multiline
                                    maxRows={2}/>
                                </Grid>

                                <Grid sx={{ mt: 2 }} xs={12} item>
                                    <FormControl sx={{ width: "95%" }}>
                                        <InputLabel id="demo-multiple-chip-label">Employees</InputLabel>
                                        <Select
                                        labelId="demo-multiple-chip-label"
                                        id="demo-multiple-chip"
                                        multiple
                                        value={selectedEmployees}
                                        onChange={handleEmployeeChange}
                                        input={<OutlinedInput id="select-multiple-chip" label="Employees" />}
                                        renderValue={(selected) => (
                                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                              {selected.map((value) => (
                                                  <Chip key={value} label={getEmployeeNameById(value)} />
                                              ))}
                                          </Box>
                                      )}
                                        MenuProps={MenuProps}
                                        >

                                        {employees.map((user, index) => (
                                            <MenuItem
                                                key={index}
                                                value={user.id}
                                                style={getEmployeesStyles(user.fullname, selectedEmployees, theme)}
                                            >
                                                {user.fullname}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                </Grid>


                                <Grid sx={{ mt: 2 }} xs={12} item>
                                    <FormControl sx={{width: "95%" }}>
                                        <InputLabel id="modules-multiple-chip-label">Modules</InputLabel>
                                        <Select
                                        labelId="modules-multiple-chip-label"
                                        id="module-multiple-chip"
                                        multiple
                                        value={selectedModules}
                                        onChange={handleModuleChange}
                                        input={<OutlinedInput id="module-multiple-chip" label="Modules" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {
                                            selected.map((value) => (
                                                <Chip key={value} label={getModuleNameById(value)} />
                                            ))}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps}
                                        >
                                        {modules.map((module,index) => (
                                            <MenuItem
                                            key={index}
                                            value={module.id}
                                            style={getModulesStyles(module.name, selectedModules, theme)}
                                            >
                                            {module.name}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid sx={{ mt: 2,mb:1 }} xs={12} item>
                                    <FormControl sx={{width: "95%" }}>
                                        <InputLabel id="sites-multiple-chip-label">Sites</InputLabel>
                                        <Select
                                        labelId="sites-multiple-chip-label"
                                        id="site-multiple-chip"
                                        multiple
                                        value={selectedSites}
                                        onChange={handleSiteChange}
                                        input={<OutlinedInput id="site-multiple-chip" label="Sites" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {
                                            selected.map((value) => (
                                                <Chip key={value} label={getSiteNameById(value)} />
                                            ))}
                                            </Box>
                                        )}
                                        MenuProps={MenuProps}
                                        >
                                        {sites.map((site,index) => (
                                            <MenuItem
                                            key={index}
                                            value={site.id}
                                            style={getSitesStyles(site.name, selectedModules, theme)}
                                            >
                                            {site.name}
                                            </MenuItem>
                                        ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12} sx={{ mt: 2 }}>
                                <Button type="submit" variant="contained" color="primary" sx={{ width: "95%" }} >Add</Button>
                                </Grid>
                        </Grid>
                        </form>
                    </CardContent>
                    </Card>
                </Grid>
                </div>
                <ToastContainer/>
            </>
            );
    }
export default AddRole