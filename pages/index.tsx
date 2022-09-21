import type { NextPage } from 'next'
import Head from 'next/head'
import {User} from '@prisma/client';
import {
  Text,
  Box,
  Container,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Select,
  Input,
  RadioGroup,
  Radio,
  HStack,
  Center,
  InputGroup,
  InputLeftAddon,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import React, { useRef, useState } from 'react'
import axios from 'axios';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <Container minH={'100vh'} color={'white'} width={'container.lg'}>
      <Head>
      <title>Registration Form</title>
      <meta name="description" content="Sample Registration Form" />
      <link rel="icon" href="/favicon.ico" />
      </Head>

      <Center as='main' pt={'5rem'}>
        <RegisterFrom/>
      </Center>

      <Center m={'1rem'}>
      <footer>
        <a
          href="https://github.com/two4i6"
          target="_blank"
          rel="noopener noreferrer"
        >
          Copyright @{'Terry W.'}

        </a>
      </footer>
      </Center>
    </Container>
  )
}

const RegisterFrom = ():JSX.Element => {
  const firstNameRef= useRef<HTMLDivElement>(null);
  const lastNameRef= useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const [userdata, setUserdata] = useState<User>({} as User);
  const [errorMessage, setErrorMessage] = useState<string>('error');

  const handleSelect = (ref:React.RefObject<HTMLDivElement> ) => {
    ref.current!.style.visibility = 'visible'
  }

  const submitHandler = (e:React.FormEvent) => {
    e.preventDefault();
    successRef.current!.style.display = 'none'
    errorRef.current!.style.display = 'none'
    const submit = async () => {
      axios({
        method: 'post',
        url: '/api/hello',
        data: userdata
      }).then((res)=> {
        successRef.current!.style.display = 'flex'
      }).catch((error)=>{
        const errorMes = error.response.data as Object
        errorRef.current!.style.display = 'flex'
        switch(error.response.status){
          case 406:
            setErrorMessage(`${error.response.status} - email already exists`)
          break;
          case 418:
            setErrorMessage(`${error.response.status} - error`)
          break;
          default:
            setErrorMessage(`${error.response.status} - something wrong`)
          break;
        }
      })
    }
    submit()
  }

  const userDataHandler = ({first, last, email, phone, publications, os}:{first?:string, last?:string, email?:string, phone?:string, publications?:string, os?:string}) => {
    setUserdata((prevState)=> 
    {
      const tmp = prevState;
      tmp.firstName = first ?? tmp.firstName
      tmp.lastName = last ?? tmp.lastName
      tmp.email = email ?? tmp.email
      tmp.phone = phone ?? tmp.phone
      tmp.publications = publications ?? tmp.publications
      tmp.os = os ?? tmp.os
      return tmp
    })
    console.log(userdata)
  }

  return(
    <form onSubmit={e=> submitHandler(e)}>
      <FormControl isRequired>
        <Box mb='1rem'>
          <Text fontSize={'4xl'}>
          User Information
          </Text>
          <FormLabel>First Name</FormLabel>
          <Input onSelect={()=>handleSelect(firstNameRef)} onChange={e=>userDataHandler({first:e.currentTarget.value})} type={'text'}/>
          <FormHelperText visibility={'hidden'} ref={firstNameRef}>{'Your first name (ie.Terry)'}</FormHelperText>
          <FormLabel>Last Name</FormLabel>
          <Input onSelect={()=>handleSelect(lastNameRef)} onChange={e=>userDataHandler({last:e.currentTarget.value})} type={'text'}/>
          <FormHelperText visibility={'hidden'} ref={lastNameRef}>{'Your last name'}</FormHelperText>
          <FormLabel>Email</FormLabel>
          <Input onSelect={()=>handleSelect(emailRef)} onChange={e=>userDataHandler({email:e.currentTarget.value})} type={'email'}/>
          <FormHelperText visibility={'hidden'} ref={emailRef}>{'We will never share your email.'}</FormHelperText>
          <FormLabel>Phone</FormLabel>
          <InputGroup>
            <InputLeftAddon color={'black'}> +1 </InputLeftAddon>
            <Input onSelect={()=>handleSelect(phoneRef)} onChange={e=>userDataHandler({phone:e.currentTarget.value})} type={'tel'} pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"/>
          </InputGroup>
          <FormHelperText visibility={'hidden'} ref={phoneRef}>{'We will never share your number (ie. 902-000-0000)'}</FormHelperText>
        </Box>

        <Box mb='1rem'>
          <Text fontSize={'4xl'}>
          Publications
          </Text>
          <FormLabel>Which book would you like information about?</FormLabel>
          <Select placeholder='Select a program' onChange={e=>userDataHandler({publications:e.currentTarget.value})}>
            <option>Internet and WWW How to Program</option>
            <option>C++ How to Program</option>
            <option>Java How to Program</option>
            <option>Visual Basic How to Program</option>
          </Select>
        </Box>

        <Box mb='1rem'>
          <Text fontSize={'4xl'}>
          Operating System
          </Text>
          <RadioGroup>
            <HStack spacing='24px'>
              <Radio value='Windows' onChange={e=>userDataHandler({os:e.currentTarget.value})}>Windows</Radio>
              <Radio value='MacOs' onChange={e=>userDataHandler({os:e.currentTarget.value})}>Mac OS X</Radio>
              <Radio value='Linux' onChange={e=>userDataHandler({os:e.currentTarget.value})}>Linux</Radio>
              <Radio value='Other' onChange={e=>userDataHandler({os:e.currentTarget.value})}>Other</Radio>
            </HStack>
          </RadioGroup>
        </Box>
        </FormControl>
          {/* <SubmitBtn/> */}
          <Button
            variant="outline"
            type="submit"
            width="full"
            m={'1rem 0'}
          >
            Sign In
          </Button>

        <Box color={'black'}>
          <Alert status='error' display={'none'} ref={errorRef} mb='2'>
            <AlertIcon />
            {errorMessage}
          </Alert>
          <Alert status='success' display={'none'} ref={successRef} mb='2'>
            <AlertIcon />
            Data uploaded to the database. <u><b><Link href={'/overview'}> checkout! </Link></b></u>
          </Alert>
        </Box>
    </form>
  )
}

export default Home
