import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import { CssVarsProvider, useColorScheme } from '@mui/joy/styles';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import TextField from '@mui/joy/TextField';
import Button from '@mui/joy/Button';
import Link from '@mui/joy/Link';
import axios from 'axios';

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

axios.defaults.baseURL = 'http://localhost:80/hris/';

export default function Login() {
  const navigate = useNavigate();
  const [loginFormData, setLoginFormData] = React.useState({username:'',password:''});
  localStorage.setItem('token','');

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
        if(response.data){
          localStorage.setItem('token', response.data.access_token)
          navigate('/home');
        }
      })
      .catch(error => {
        console.log(error.response.data.error)
     })
  }

  const inputEvent = (event) => {
    console.log(event.target.value);
    console.log(event.target.name);

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

  <TextField
  // html input attribute
  name="username"
  type="email"
  placeholder="yasirfayyaz@email.com"
  // pass down to FormLabel as children
  label="Email"
  onChange={inputEvent}
  value={loginFormData.username}
/>
<TextField
  name="password"
  type="password"
  placeholder="password"
  label="Password"
  onChange={inputEvent}
  value={loginFormData.password}
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
  );
}