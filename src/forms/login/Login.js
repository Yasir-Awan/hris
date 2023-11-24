import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
// import TextField from '@mui/joy/TextField';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input } from '@mui/joy';


function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = React.useState(false);

  // necessary for server-side rendering
  // because mode is undefined on the server
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="outlined"
      onClick={() => {
        setMode(mode === 'light' ? 'dark' : 'light');
      }}
    >
      {mode === 'light' ? 'Turn dark' : 'Turn light'}
    </Button>
  );
}

axios.defaults.baseURL = 'http://58.27.166.43:80/hris/';

export default function Login() {

  const [loginFormData, setLoginFormData] = React.useState({username:'',password:''});
  const navigate = useNavigate();
  localStorage.setItem('token','');
  localStorage.setItem('fname','');
  localStorage.setItem('lname','');
  localStorage.setItem('bio_id','')
  localStorage.setItem('site','');
  localStorage.setItem('role','')

  const loginFormSubmit = (event) => {

    event.preventDefault();
    console.log(loginFormData);
    axios({
      method: 'post',
      url:'login',
      data: loginFormData
    })
      .then(function (response) {
        console.log(response);
        if(response.data)
        {
          toast.success('Login Success !', {
            position:'top-right',
            autoClose:1000,
            onClose: () => navigate('/home')
        });
      //     toast('login Failed');
      //     position:'top-center'
      //  autoClose:5000,
      //  onClose: () => history.push('/')
      //     navigate('/home')
          localStorage.setItem('token', response.data.access_token)
          localStorage.setItem('fname', response.data.fname)
          localStorage.setItem('lname', response.data.lname)
          localStorage.setItem('bio_id', response.data.user_id)
          localStorage.setItem('site', response.data.site)
          localStorage.setItem('role', response.data.role)
        }
      })
      .catch(error => {
        toast.error("Invalid Credentials", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
      });
        console.log(error.response.data.error)
    })
  }

  const inputEvent = (event) => {

    const {name,value} = event.target;
    setLoginFormData((preValue)=>{
      console.log(preValue);
      return {
        ...preValue,
        [name] : value
      };
    })
  }

  return (
    <>
    <CssVarsProvider>
      <ModeToggle/>
      <form onSubmit={loginFormSubmit}>
            <Sheet
              sx={{
                width: 300,
                mx: 'auto', // margin left & right
                my: 4, // margin top & botom
                py: 3, // padding top & bottom
                px: 2, // padding left & right
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRadius: 'sm',
                boxShadow: 'md',
              }}
            >

            <Typography level="h4" component="h1">
                Welcome!
              </Typography>
              <Typography level="body2">Sign in to continue.</Typography>

              <Input
              // html input attribute
              name="username"
              type="email"
              placeholder="email"
              // pass down to FormLabel as children
              label="Email"
              onChange={inputEvent}
              value={loginFormData.username}
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="password"
              label="Password"
              onChange={inputEvent}
              value={loginFormData.password}
              required
            />


            <Button type="submit" sx={{ mt: 1 /* margin top */ }} >
              Log in
            </Button>
            <Typography
              endDecorator={<Link href="/sign-up">Sign up</Link>}
              fontSize="sm"
              sx={{ alignSelf: 'center' }}
            >
              Don't have an account?
            </Typography>

            </Sheet>
        </form>
    </CssVarsProvider>
    <ToastContainer/>
    </>
  );
}